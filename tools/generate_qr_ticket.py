from __future__ import annotations

import argparse
import datetime as dt
import os
import random
import secrets
import string
from pathlib import Path

from PIL import Image, ImageDraw


VERSION = 5
SIZE = 17 + 4 * VERSION
DATA_CODEWORDS = 108
EC_CODEWORDS = 26
ALIGNMENT = [6, 30]
G0 = 0x11D


def gf_tables():
    exp = [0] * 512
    log = [0] * 256
    x = 1
    for i in range(255):
        exp[i] = x
        log[x] = i
        x <<= 1
        if x & 0x100:
            x ^= G0
    for i in range(255, 512):
        exp[i] = exp[i - 255]
    return exp, log


GF_EXP, GF_LOG = gf_tables()


def gf_mul(a, b):
    if a == 0 or b == 0:
        return 0
    return GF_EXP[GF_LOG[a] + GF_LOG[b]]


def poly_mul(p, q):
    out = [0] * (len(p) + len(q) - 1)
    for i, a in enumerate(p):
        for j, b in enumerate(q):
            out[i + j] ^= gf_mul(a, b)
    return out


def rs_generator(degree):
    poly = [1]
    for i in range(degree):
        poly = poly_mul(poly, [1, GF_EXP[i]])
    return poly


def rs_remainder(data, degree):
    gen = rs_generator(degree)
    msg = data[:] + [0] * degree
    for i, coef in enumerate(data):
        if coef == 0:
            continue
        for j, gen_coef in enumerate(gen):
            msg[i + j] ^= gf_mul(gen_coef, coef)
    return msg[-degree:]


def bits_to_codewords(bits):
    return [int("".join(map(str, bits[i:i + 8])), 2) for i in range(0, len(bits), 8)]


def encode_payload(payload):
    data = payload.encode("utf-8")
    if len(data) > 90:
        raise ValueError("Payload terlalu panjang untuk QR generator ini. Pakai teks/URL maksimal 90 byte.")

    bits = [0, 1, 0, 0]
    bits += [(len(data) >> i) & 1 for i in range(7, -1, -1)]
    for byte in data:
        bits += [(byte >> i) & 1 for i in range(7, -1, -1)]

    capacity = DATA_CODEWORDS * 8
    bits += [0] * min(4, capacity - len(bits))
    while len(bits) % 8:
        bits.append(0)
    pads = [0xEC, 0x11]
    pad_index = 0
    while len(bits) < capacity:
        bits += [(pads[pad_index % 2] >> i) & 1 for i in range(7, -1, -1)]
        pad_index += 1

    data_words = bits_to_codewords(bits)
    return data_words + rs_remainder(data_words, EC_CODEWORDS)


def blank_matrix():
    return [[None for _ in range(SIZE)] for _ in range(SIZE)], [[False for _ in range(SIZE)] for _ in range(SIZE)]


def set_module(matrix, reserved, x, y, dark):
    if 0 <= x < SIZE and 0 <= y < SIZE:
        matrix[y][x] = bool(dark)
        reserved[y][x] = True


def draw_finder(matrix, reserved, x, y):
    for dy in range(-1, 8):
        for dx in range(-1, 8):
            xx, yy = x + dx, y + dy
            if not (0 <= xx < SIZE and 0 <= yy < SIZE):
                continue
            dark = 0 <= dx <= 6 and 0 <= dy <= 6 and (
                dx in (0, 6) or dy in (0, 6) or (2 <= dx <= 4 and 2 <= dy <= 4)
            )
            set_module(matrix, reserved, xx, yy, dark)


def draw_alignment(matrix, reserved, cx, cy):
    for dy in range(-2, 3):
        for dx in range(-2, 3):
            dark = max(abs(dx), abs(dy)) in (0, 2)
            set_module(matrix, reserved, cx + dx, cy + dy, dark)


def draw_function_patterns(matrix, reserved):
    draw_finder(matrix, reserved, 0, 0)
    draw_finder(matrix, reserved, SIZE - 7, 0)
    draw_finder(matrix, reserved, 0, SIZE - 7)

    for i in range(8, SIZE - 8):
        dark = i % 2 == 0
        set_module(matrix, reserved, i, 6, dark)
        set_module(matrix, reserved, 6, i, dark)

    for cx in ALIGNMENT:
        for cy in ALIGNMENT:
            if reserved[cy][cx]:
                continue
            draw_alignment(matrix, reserved, cx, cy)

    set_module(matrix, reserved, 8, SIZE - 8, True)
    for i in range(9):
        if i != 6:
            reserved[8][i] = True
            reserved[i][8] = True
    for i in range(8):
        reserved[SIZE - 1 - i][8] = True
        reserved[8][SIZE - 1 - i] = True


def mask_bit(mask, x, y):
    if mask == 0:
        return (x + y) % 2 == 0
    if mask == 1:
        return y % 2 == 0
    if mask == 2:
        return x % 3 == 0
    if mask == 3:
        return (x + y) % 3 == 0
    if mask == 4:
        return (y // 2 + x // 3) % 2 == 0
    if mask == 5:
        return ((x * y) % 2 + (x * y) % 3) == 0
    if mask == 6:
        return (((x * y) % 2 + (x * y) % 3) % 2) == 0
    return (((x + y) % 2 + (x * y) % 3) % 2) == 0


def place_data(matrix, reserved, codewords, mask):
    bits = []
    for word in codewords:
        bits += [(word >> i) & 1 for i in range(7, -1, -1)]

    bit_index = 0
    direction = -1
    x = SIZE - 1
    while x > 0:
        if x == 6:
            x -= 1
        y_range = range(SIZE - 1, -1, -1) if direction == -1 else range(SIZE)
        for y in y_range:
            for xx in (x, x - 1):
                if reserved[y][xx]:
                    continue
                dark = bit_index < len(bits) and bits[bit_index] == 1
                if mask_bit(mask, xx, y):
                    dark = not dark
                matrix[y][xx] = dark
                bit_index += 1
        direction *= -1
        x -= 2


def format_bits(mask):
    data = (1 << 3) | mask  # EC level L = 01
    bits = data << 10
    generator = 0x537
    for i in range(14, 9, -1):
        if (bits >> i) & 1:
            bits ^= generator << (i - 10)
    return ((data << 10) | bits) ^ 0x5412


def draw_format(matrix, mask):
    bits = format_bits(mask)
    coords1 = [(8, 0), (8, 1), (8, 2), (8, 3), (8, 4), (8, 5), (8, 7), (8, 8),
               (7, 8), (5, 8), (4, 8), (3, 8), (2, 8), (1, 8), (0, 8)]
    coords2 = [(SIZE - 1, 8), (SIZE - 2, 8), (SIZE - 3, 8), (SIZE - 4, 8), (SIZE - 5, 8),
               (SIZE - 6, 8), (SIZE - 7, 8), (8, SIZE - 8), (8, SIZE - 7), (8, SIZE - 6),
               (8, SIZE - 5), (8, SIZE - 4), (8, SIZE - 3), (8, SIZE - 2), (8, SIZE - 1)]
    for i in range(15):
        dark = ((bits >> i) & 1) == 1
        x, y = coords1[i]
        matrix[y][x] = dark
        x, y = coords2[i]
        matrix[y][x] = dark


def penalty(matrix):
    matrix = [[bool(item) for item in row] for row in matrix]
    score = 0
    for row in matrix:
        run_color = row[0]
        run = 1
        for item in row[1:]:
            if item == run_color:
                run += 1
            else:
                if run >= 5:
                    score += 3 + run - 5
                run_color = item
                run = 1
        if run >= 5:
            score += 3 + run - 5
    for x in range(SIZE):
        run_color = matrix[0][x]
        run = 1
        for y in range(1, SIZE):
            if matrix[y][x] == run_color:
                run += 1
            else:
                if run >= 5:
                    score += 3 + run - 5
                run_color = matrix[y][x]
                run = 1
        if run >= 5:
            score += 3 + run - 5
    for y in range(SIZE - 1):
        for x in range(SIZE - 1):
            block = matrix[y][x] + matrix[y][x + 1] + matrix[y + 1][x] + matrix[y + 1][x + 1]
            if block in (0, 4):
                score += 3
    dark = sum(1 for row in matrix for item in row if item)
    percent = dark * 100 / (SIZE * SIZE)
    score += int(abs(percent - 50) // 5) * 10
    return score


def make_qr(payload):
    codewords = encode_payload(payload)
    best = None
    best_score = None
    for mask in range(8):
        matrix, reserved = blank_matrix()
        draw_function_patterns(matrix, reserved)
        place_data(matrix, reserved, codewords, mask)
        draw_format(matrix, mask)
        score = penalty(matrix)
        if best_score is None or score < best_score:
            best = matrix
            best_score = score
    return best


def save_png(matrix, path, scale=14, border=4):
    pixels = (SIZE + border * 2) * scale
    image = Image.new("RGB", (pixels, pixels), "white")
    draw = ImageDraw.Draw(image)
    for y, row in enumerate(matrix):
        for x, dark in enumerate(row):
            if dark:
                x0 = (x + border) * scale
                y0 = (y + border) * scale
                draw.rectangle([x0, y0, x0 + scale - 1, y0 + scale - 1], fill="black")
    image.save(path)


def ticket_code():
    stamp = dt.datetime.now().strftime("%Y%m%d%H%M%S")
    suffix = "".join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))
    return f"SCOOPIFY-{stamp}-{suffix}"


def ticket_code_batch(index):
    suffix = secrets.token_hex(6).upper()
    return f"SCOOPIFY-{index:03d}-{suffix}"


def ticket_payload(url, token):
    separator = "&" if "?" in url else "?"
    return f"{url}{separator}ticket={token}"


def save_ticket(url, token, out_dir):
    payload = ticket_payload(url, token)
    out_file = out_dir / f"{token}.png"
    save_png(make_qr(payload), out_file)
    return out_file, payload


def main():
    parser = argparse.ArgumentParser(description="Generate QR tiket mini game Scoopify.")
    parser.add_argument("--url", default="https://scoopify.local/photobooth.html", help="URL photobooth yang akan dibuka saat QR discan.")
    parser.add_argument("--token", default=None, help="Token tiket. Jika kosong, token otomatis dibuat.")
    parser.add_argument("--out", default="qr-tickets", help="Folder output PNG.")
    parser.add_argument("--count", type=int, default=1, help="Jumlah tiket unik yang dibuat.")
    args = parser.parse_args()

    if args.count < 1:
        raise ValueError("--count minimal 1.")
    if args.token and args.count > 1:
        raise ValueError("--token hanya bisa dipakai untuk membuat 1 tiket.")

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    manifest = out_dir / "manifest.csv"
    generated = []
    for index in range(1, args.count + 1):
        token = args.token or (ticket_code() if args.count == 1 else ticket_code_batch(index))
        out_file, payload = save_ticket(args.url, token, out_dir)
        generated.append((token, out_file, payload))

    with manifest.open("w", encoding="utf-8") as file:
        file.write("token,file,payload\n")
        for token, out_file, payload in generated:
            file.write(f"{token},{out_file.name},{payload}\n")

    print(f"{len(generated)} QR dibuat di: {out_dir}")
    print(f"Manifest: {manifest}")
    if len(generated) == 1:
        print(f"Payload: {generated[0][2]}")


if __name__ == "__main__":
    main()
