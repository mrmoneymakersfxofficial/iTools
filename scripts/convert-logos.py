import cairosvg
import os

SRC = "/home/z/my-project/upload/logos_raw"
DST = "/home/z/my-project/public/brands"
os.makedirs(DST, exist_ok=True)

# Map filenames to slug
FILE_MAP = {
    "LOGO - MILWAUKEE.svg": "milwaukee",
    "LOGO - BOSCH.svg": "bosch",
    "LOGO - DEWALT.svg": "dewalt",
    "LOGO - MAKITA.svg": "makita",
    "LOGO - STANLEY.svg": "stanley",
    "LOGO - BAHCO.svg": "bahco",
    "LOGO - DCA.svg": "dca",
    "LOGO - DONG CHENG.svg": "dong-cheng",
    "LOGO - EMTOP.svg": "emtop",
    "LOGO - INGCO.svg": "ingco",
    "LOGO - KAILI.svg": "kaili",
    "LOGO - KAMASA.svg": "kamasa",
    "LOGO - SATA.svg": "sata",
    "LOGO - TOPTUL.svg": "toptul",
    "LOGO - TOTAL.svg": "total",
    "LOGO - TRAMONTINA.svg": "tramontina",
    "LOGO - TRUPER.svg": "truper",
    "LOGO - WAGNER.svg": "wagner",
}

# Render at 4x for crisp display (520x200)
SCALE = 4

for fname, slug in FILE_MAP.items():
    src_path = os.path.join(SRC, fname)
    dst_path = os.path.join(DST, f"{slug}.webp")
    if not os.path.exists(src_path):
        print(f"MISSING: {fname}")
        continue
    cairosvg.svg2png(
        url=src_path,
        output_width=130 * SCALE,
        output_height=50 * SCALE,
        write_to=dst_path.replace(".webp", "_tmp.png"),
    )
    # Convert PNG to WebP via pillow
    from PIL import Image
    img = Image.open(dst_path.replace(".webp", "_tmp.png"))
    # Ensure white bg for transparency
    if img.mode in ("RGBA", "LA", "P"):
        bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
        bg.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
        img = bg.convert("RGB")
    img.save(dst_path, "WEBP", quality=90)
    os.remove(dst_path.replace(".webp", "_tmp.png"))
    print(f"OK: {slug}.webp ({img.size[0]}x{img.size[1]})")

print("\nDone!")