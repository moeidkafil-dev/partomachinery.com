#!/usr/bin/env python3
"""
Parto Plastic logo processing.
Creates web derivatives of the official supplied logo without redrawing it:
  - public/media/brand/parto_logo_transparent.png  (512px, background removed)
  - public/media/brand/parto_logo_transparent_sm.png (160px, header/footer use)
  - public/media/brand/favicon.png (48px) + public/favicon.ico-less PNG source
Background removal = flood fill from borders over near-white pixels only,
so interior whites and the silver artwork are preserved. 1px edge feather.
"""
import sys
from collections import deque
from PIL import Image, ImageFilter

SRC = "/home/z/my-project/media/brand/parto_plastic_logo.jpg"
OUT_DIR = "/home/z/my-project/public/media/brand"

def remove_white_bg(img: Image.Image, tol: int = 14) -> Image.Image:
    img = img.convert("RGB")
    w, h = img.size
    px = img.load()

    def near_white(p):
        return p[0] >= 255 - tol and p[1] >= 255 - tol and p[2] >= 255 - tol

    mask = [[False] * w for _ in range(h)]  # True = background
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if near_white(px[x, y]) and not mask[y][x]:
                mask[y][x] = True
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if near_white(px[x, y]) and not mask[y][x]:
                mask[y][x] = True
                q.append((x, y))
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not mask[ny][nx] and near_white(px[nx, ny]):
                mask[ny][nx] = True
                q.append((nx, ny))

    alpha = Image.new("L", (w, h), 255)
    ap = alpha.load()
    for y in range(h):
        row = mask[y]
        for x in range(w):
            if row[x]:
                ap[x, y] = 0
    # feather the cutout edge slightly to avoid jaggies
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.8))
    rgba = img.convert("RGBA")
    rgba.putalpha(alpha)
    return rgba

def main():
    img = Image.open(SRC)
    cut = remove_white_bg(img)
    cut512 = cut.copy()
    cut512.thumbnail((512, 512), Image.LANCZOS)
    cut512.save(f"{OUT_DIR}/parto_logo_transparent.png", optimize=True)
    cut160 = cut.copy()
    cut160.thumbnail((160, 160), Image.LANCZOS)
    cut160.save(f"{OUT_DIR}/parto_logo_transparent_sm.png", optimize=True)
    fav = cut.copy()
    fav.thumbnail((48, 48), Image.LANCZOS)
    fav.save("/home/z/my-project/public/favicon.png", optimize=True)
    print("logo derivatives written")

if __name__ == "__main__":
    main()
