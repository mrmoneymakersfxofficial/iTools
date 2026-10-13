import os

os.makedirs('public/brands', exist_ok=True)
os.makedirs('public/brands/transparent', exist_ok=True)

brands_data = {
    "3m": {
        "bg": "#E60000",
        "textColor": "#FFFFFF",
        "svg_content": """<text x="65" y="32" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle" letter-spacing="-1">3M</text>"""
    },
    "honda": {
        "bg": "#E4002B",
        "textColor": "#FFFFFF",
        "svg_content": """<text x="65" y="32" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">HONDA</text>"""
    },
    "klein-tools": {
        "bg": "#F58220",
        "textColor": "#000000",
        "svg_content": """<text x="65" y="27" font-family="Impact, Arial Black, sans-serif" font-weight="bold" font-size="16" fill="#000000" text-anchor="middle" letter-spacing="1">KLEIN TOOLS</text><text x="65" y="38" font-family="Arial, sans-serif" font-weight="bold" font-size="7" fill="#000000" text-anchor="middle" letter-spacing="2">EST. 1857</text>"""
    },
    "toro": {
        "bg": "#C8102E",
        "textColor": "#FFFFFF",
        "svg_content": """<text x="65" y="33" font-family="'Impact', Arial Black, sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">TORO</text>"""
    },
    "ego": {
        "bg": "#00843D",
        "textColor": "#FFFFFF",
        "svg_content": """<text x="65" y="29" font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle" font-style="italic" letter-spacing="2">EGO</text><text x="65" y="40" font-family="Arial, sans-serif" font-weight="800" font-size="8" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">POWER+</text>"""
    },
    "metabo-hpt": {
        "bg": "#007A3D",
        "textColor": "#FFFFFF",
        "svg_content": """<text x="65" y="28" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="0">metabo</text><text x="65" y="39" font-family="'Impact', Arial Black, sans-serif" font-weight="bold" font-size="10" fill="#FFE500" text-anchor="middle" letter-spacing="3">HPT</text>"""
    },
    "flex": {
        "bg": "#D32F2F",
        "textColor": "#FFFFFF",
        "svg_content": """<text x="65" y="33" font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-size="23" fill="#FFFFFF" text-anchor="middle" font-style="italic" letter-spacing="2">FLEX</text>"""
    },
    "stihl": {
        "bg": "#F37021",
        "textColor": "#FFFFFF",
        "svg_content": """<text x="65" y="33" font-family="'Impact', Arial Black, sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">STIHL</text>"""
    },
    "fein": {
        "bg": "#C8102E",
        "textColor": "#FFFFFF",
        "svg_content": """<text x="65" y="33" font-family="'Impact', Arial Black, sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">FEIN</text>"""
    },
    "skil": {
        "bg": "#D71920",
        "textColor": "#FFFFFF",
        "svg_content": """<text x="65" y="33" font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle" font-style="italic" letter-spacing="1">SKIL</text>"""
    },
    "festool": {
        "bg": "#004F34",
        "textColor": "#FFFFFF",
        "svg_content": """<text x="65" y="32" font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-size="17" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">FESTOOL</text>"""
    },
    "jet": {
        "bg": "#C8102E",
        "textColor": "#FFFFFF",
        "svg_content": """<text x="65" y="33" font-family="'Impact', Arial Black, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">JET</text>"""
    },
    "knaack": {
        "bg": "#8B5A2B",
        "textColor": "#FFFFFF",
        "svg_content": """<text x="65" y="33" font-family="'Impact', Arial Black, sans-serif" font-weight="900" font-size="18" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">KNAACK</text>"""
    }
}

for slug, data in brands_data.items():
    bg = data["bg"]
    content = data["svg_content"]
    
    # 1. Card SVG with rect
    card_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 50">
  <rect width="130" height="50" fill="{bg}" rx="6"/>
  <g>{content}</g>
</svg>"""
    with open(f"public/brands/{slug}.svg", "w", encoding="utf-8") as f:
        f.write(card_svg)
        
    # 2. Transparent SVG
    trans_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 50">
  <g>{content}</g>
</svg>"""
    with open(f"public/brands/transparent/{slug}.svg", "w", encoding="utf-8") as f:
        f.write(trans_svg)

print("Generated all 13 missing brand SVGs!")
