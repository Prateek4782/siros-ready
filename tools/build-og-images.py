"""Builds the 1200x630 link-preview images (WhatsApp, Facebook, X) for each
model page from products-data.js.  python tools/build-og-images.py
Re-run after changing a model's name, photo or price. Uses Windows' Segoe UI
font for the text (it has the rupee sign)."""
import os, re
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
src = open('products-data.js', encoding='utf-8').read()
FONT_DIR = r'C:\Windows\Fonts'
bold = lambda s: ImageFont.truetype(os.path.join(FONT_DIR, 'segoeuib.ttf'), s)
semi = lambda s: ImageFont.truetype(os.path.join(FONT_DIR, 'seguisb.ttf'), s)

entries = re.findall(r"\{ slug: '([a-z0-9-]+)', name: '([^']+)', tag: '([^']+)', photo: '([a-z0-9-]+)'(.*?)\},?\n", src, re.S)
for slug, name, tag, photo, rest in entries:
    prices = re.search(r'prices: \[([0-9, ]+)\]', rest)
    low = min(int(p) for p in prices.group(1).split(',')) if prices else None
    cutout = 'cutout: true' in rest
    im = Image.open(f'assets/products/{photo}.webp').convert('RGB')
    canvas = Image.new('RGB', (1200, 630), (24, 30, 34))
    fill = im.resize((1200, round(im.height * 1200 / im.width)), Image.LANCZOS)
    top = max(0, (fill.height - 630) // 2)
    canvas.paste(fill.crop((0, top, 1200, top + 630)).filter(ImageFilter.GaussianBlur(30)).point(lambda v: int(v * 0.32)), (0, 0))
    fg = im.copy()
    if cutout:
        fg.thumbnail((620, 470), Image.LANCZOS)
        card = Image.new('RGB', (fg.width + 60, fg.height + 60), (243, 247, 249)); card.paste(fg, (30, 30)); fg = card
    else:
        fg.thumbnail((560, 630), Image.LANCZOS)
    canvas.paste(fg, (1200 - fg.width - (40 if cutout else 50), (630 - fg.height) // 2))
    d = ImageDraw.Draw(canvas)
    d.text((64, 150), 'SIROS', font=semi(40), fill=(22, 170, 81))
    d.text((60, 196), name, font=bold(108 if len(name) < 7 else 88), fill=(255, 252, 248))
    d.text((64, 330), tag, font=semi(34), fill=(200, 205, 208))
    if low:
        d.text((64, 392), 'Starting at', font=semi(28), fill=(200, 205, 208))
        # all SIROS prices are under ₹1 lakh, so Western and Indian grouping agree
        d.text((62, 426), '₹' + format(low, ',d'), font=bold(64), fill=(255, 252, 248))
    canvas.save(f'assets/og/{slug}.jpg', 'JPEG', quality=84, optimize=True, progressive=True)
print('built', len(entries), 'preview images')
