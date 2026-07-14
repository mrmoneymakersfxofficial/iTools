import cairosvg
from PIL import Image
import os

SRC = "/home/z/my-project/upload/logos_raw"
DST = "/home/z/my-project/public/brands"
os.makedirs(DST, exist_ok=True)

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

SCALE = 4  # 520x200

for fname, slug in FILE_MAP.items():
    src_path = os.path.join(SRC, fname)
    dst_png = os.path.join(DST, f"{slug}_tmp.png")
    dst_webp = os.path.join(DST, f"{slug}.webp")
    if not os.path.exists(src_path):
        print(f"MISSING: {fname}")
        continue

    # SVG -> PNG with transparent background
    cairosvg.svg2png(
        url=src_path,
        output_width=130 * SCALE,
        output_height=50 * SCALE,
        write_to=dst_png,
    )

    # PNG -> WebP with ALPHA (transparent background)
    img = Image.open(dst_png)
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    
    img.save(dst_webp, "WEBP", quality=92, lossless=False)
    os.remove(dst_png)
    
    # Verify transparency
    has_alpha = img.mode == "RGBA"
    is_transparent = False
    if has_alpha:
        # Check corners for transparency
        for px in [img.getpixel((0, 0)), img.getpixel((0, img.height-1)), 
                    img.getpixel((img.width-1, 0)), img.getpixel((img.width-1, img.height-1))]:
            if px[3] < 128:
                is_transparent = True
                break
    
    status = "TRANSPARENT" if is_transparent else "opaque (has alpha channel)"
    print(f"OK: {slug}.webp ({img.size[0]}x{img.size[1]}) [{status}]")

print("\nDone!")