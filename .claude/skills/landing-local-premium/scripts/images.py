#!/usr/bin/env python3
"""Image toolkit for product/brand images on local-business landing pages.

Usage (run with python3 -I when the input comes from the internet):
  images.py product IN OUT [--ratio 1.56] [--max 640] [--thresh 10]
      remove white background (keeps existing alpha), tight-crop to the largest
      continuous block, pad to a common aspect ratio, resize, save WebP.
  images.py logo IN OUT_DARK OUT_LIGHT [--max 300]
      crop a transparent logo; OUT_DARK turns white parts near-black (for white
      backgrounds), OUT_LIGHT keeps the original (for dark backgrounds).
  images.py color IN
      print the dominant saturated colour (the brand accent) as hex.
  images.py check DIR
      list size, aspect ratio and real content box of every image, so outliers
      (empty bands, odd ratios) are visible before they break alignment.

Lessons baked in:
  * Flood-fill from the borders with a LOW tolerance (~10). High tolerance leaks
    into white labels on the product.
  * If the file already has alpha, keep it: converting to RGB turns the
    transparent background black and nothing gets removed.
  * Crop by the largest continuous run of opaque rows/cols (>5% opaque). Stray
    lines at the photo edge otherwise make the bbox the whole image and the
    product sits off-centre in the row.
  * Pad every product to the same ratio so square photos don't look bigger.
"""
import sys
import argparse
from collections import Counter

import numpy as np
from PIL import Image, ImageDraw

KEY = (255, 0, 255)


def remove_white_bg(im: Image.Image, thresh: int) -> Image.Image:
    if im.mode == "RGBA" and im.getchannel("A").getextrema()[0] < 250:
        return im  # already transparent
    rgb = im.convert("RGB")
    w, h = rgb.size
    work = rgb.copy()
    seeds = [(x, 0) for x in range(0, w, 5)] + [(x, h - 1) for x in range(0, w, 5)] + \
            [(0, y) for y in range(0, h, 5)] + [(w - 1, y) for y in range(0, h, 5)]
    for s in seeds:
        px = work.getpixel(s)
        if min(px) > 240 and px != KEY:
            ImageDraw.floodfill(work, s, KEY, thresh=thresh)
    mask = (np.array(work) == np.array(KEY)).all(axis=2)
    return Image.fromarray(np.dstack([np.array(rgb), np.where(mask, 0, 255).astype(np.uint8)]), "RGBA")


def longest_run(idx):
    runs, start, prev = [], idx[0], idx[0]
    for v in idx[1:]:
        if v != prev + 1:
            runs.append((start, prev)); start = v
        prev = v
    runs.append((start, prev))
    return max(runs, key=lambda r: r[1] - r[0])


def tight_crop(im: Image.Image) -> Image.Image:
    a = np.array(im)[..., 3] > 200
    rows = np.where(a.sum(axis=1) > a.shape[1] * 0.05)[0]
    if not len(rows):
        return im
    r0, r1 = longest_run(rows)
    sub = a[r0:r1 + 1]
    c0, c1 = longest_run(np.where(sub.sum(axis=0) > sub.shape[0] * 0.05)[0])
    return im.crop((c0, r0, c1 + 1, r1 + 1))


def pad_ratio(im: Image.Image, ratio: float) -> Image.Image:
    w, h = im.size
    if w / h < ratio:
        W = round(h * ratio); c = Image.new("RGBA", (W, h), (0, 0, 0, 0)); c.alpha_composite(im, ((W - w) // 2, 0))
    else:
        H = round(w / ratio); c = Image.new("RGBA", (w, H), (0, 0, 0, 0)); c.alpha_composite(im, (0, (H - h) // 2))
    return c


def cmd_product(a):
    im = Image.open(a.inp)
    im = remove_white_bg(im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im, a.thresh)
    im = pad_ratio(tight_crop(im.convert("RGBA")), a.ratio)
    im.thumbnail((a.max, a.max), Image.LANCZOS)
    im.save(a.out, "WEBP", quality=76, method=6)
    print(a.out, im.size)


def cmd_logo(a):
    im = Image.open(a.inp).convert("RGBA")
    im = im.crop(im.getchannel("A").getbbox())
    im.thumbnail((a.max, a.max), Image.LANCZOS)
    im.save(a.out_light, "WEBP", quality=85)
    arr = np.array(im)
    light = (arr[..., 3] > 0) & (arr[..., 2] > 120)  # white/grey parts; gold/yellow has little blue
    arr[light, :3] = (10, 10, 12)
    Image.fromarray(arr, "RGBA").save(a.out_dark, "WEBP", quality=85)
    print(a.out_dark, a.out_light, im.size)


def cmd_color(a):
    arr = np.array(Image.open(a.inp).convert("RGBA")).reshape(-1, 4)
    arr = arr[arr[:, 3] > 200][:, :3].astype(int)
    sat = arr.max(axis=1) - arr.min(axis=1)
    pick = [tuple(p) for p in arr[sat > 80]]
    if not pick:
        print("no saturated colour found"); return
    r, g, b = Counter(pick).most_common(1)[0][0]
    print("#%02x%02x%02x" % (r, g, b))


def cmd_check(a):
    import glob, os
    for f in sorted(glob.glob(os.path.join(a.dir, "**", "*.*"), recursive=True)):
        try:
            im = Image.open(f).convert("RGBA")
        except Exception:
            continue
        al = np.array(im)[..., 3] > 20
        ys, xs = np.where(al)
        box = (xs.min(), ys.min(), xs.max(), ys.max()) if len(xs) else None
        print(f"{os.path.relpath(f, a.dir):40s} {im.size!s:12s} ratio {im.width / im.height:.2f} content {box} {os.path.getsize(f) // 1024} KB")


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("product"); s.add_argument("inp"); s.add_argument("out")
    s.add_argument("--ratio", type=float, default=1.56); s.add_argument("--max", type=int, default=640); s.add_argument("--thresh", type=int, default=10)
    s = sub.add_parser("logo"); s.add_argument("inp"); s.add_argument("out_dark"); s.add_argument("out_light"); s.add_argument("--max", type=int, default=300)
    s = sub.add_parser("color"); s.add_argument("inp")
    s = sub.add_parser("check"); s.add_argument("dir")
    a = p.parse_args()
    {"product": cmd_product, "logo": cmd_logo, "color": cmd_color, "check": cmd_check}[a.cmd](a)


if __name__ == "__main__":
    sys.exit(main())
