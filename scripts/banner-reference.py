import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch
import os

import matplotlib.font_manager as fm
fm.fontManager.addfont("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
plt.rcParams["font.sans-serif"] = ["DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False

OUTPUT = "/home/z/my-project/download/referencia-banners-iTools.png"

BANNERS = [
    {
        "num": 1,
        "filename": "oferta-julio-4july.jpg",
        "resolucion": "1920 x 500 px",
        "formato": "JPG / PNG",
        "bg_colors": ["#0A2A44", "#0d3355", "#143d5e", "#1a4a6e"],
        "gradient": "135deg — Azul navy oscuro a medio",
        "title": "4 DIAS PARA AHORRAR",
        "subtitle": "Obten un 10% de descuento\ncon el codigo: 4JULY",
        "cta": "Compra ahora",
        "countdown": True,
        "tag": "Oferta Limitada",
        "icon": "Sparkles (amarillo)",
        "zone_text": "IZQUIERDA — 40% del ancho",
        "zone_image": "DERECHA — 60% del ancho\n(imagen de herramientas/promo)",
        "logo_zone": "Logo iTools arriba-izquierda\n(opcional — el header lo cubre)",
        "text_color": "#FFFFFF",
        "accent": "#E35205 (boton CTA)\n#F59E0B (codigo 4JULY)",
        "overlay": "Gradiente izq→der:\nnegro 55% → 25% → transparente",
    },
    {
        "num": 2,
        "filename": "ego-descuento.jpg",
        "resolucion": "1920 x 500 px",
        "formato": "JPG / PNG",
        "bg_colors": ["#1a1a2e", "#16213e", "#0f3460"],
        "gradient": "135deg — Azul oscuro profundo",
        "title": "EGO — Compra mas, por menos",
        "subtitle": "Hasta S/ 400 de descuento en\npedidos mayores a S/ 1,200",
        "cta": "Ver productos EGO",
        "countdown": False,
        "tag": "Promocion",
        "icon": "Percent (verde esmeralda)",
        "zone_text": "IZQUIERDA — 40% del ancho",
        "zone_image": "DERECHA — 60% del ancho\n(imagen de productos EGO)",
        "logo_zone": "Logo EGO grande en zona\nderecha (el diseño lo coloca)",
        "text_color": "#FFFFFF",
        "accent": "#E35205 (boton CTA)\n#34D399 (icono percent)",
        "overlay": "Gradiente izq→der:\nnegro 55% → 25% → transparente",
    },
    {
        "num": 3,
        "filename": "liquidacion-extra20.jpg",
        "resolucion": "1920 x 500 px",
        "formato": "JPG / PNG",
        "bg_colors": ["#D1001C", "#a80016", "#7a0010"],
        "gradient": "135deg — Rojo Milwaukee (#D1001C)",
        "title": "LIQUIDACION",
        "subtitle": "20% de descuento adicional\ncon codigo: EXTRA20",
        "cta": "Aprovechar ahora",
        "countdown": False,
        "tag": "Promocion",
        "icon": "Tag (blanco)",
        "zone_text": "IZQUIERDA — 40% del ancho",
        "zone_image": "DERECHA — 60% del ancho\n(imagen de herramientas en liquidacion)",
        "logo_zone": "Sin logo de marca especifico\n(uso general — fondo rojo intenso)",
        "text_color": "#FFFFFF",
        "accent": "#E35205 (boton CTA)\n#D1001C (fondo principal)",
        "overlay": "Gradiente izq→der:\nnegro 55% → 25% → transparente",
    },
]


def draw_banner_wireframe(ax, b, row_idx):
    ax.set_xlim(0, 192)
    ax.set_ylim(0, 50)
    ax.set_aspect("equal")
    ax.axis("off")

    # Background gradient simulation (3 color blocks)
    n = len(b["bg_colors"])
    for i, color in enumerate(b["bg_colors"]):
        x0 = 192 * i / n
        x1 = 192 * (i + 1) / n
        ax.add_patch(patches.Rectangle((x0, 0), x1 - x0, 50, facecolor=color, edgecolor="none"))

    # Overlay gradient (dark left to transparent right)
    for i in range(20):
        alpha = 0.55 - (i / 20) * 0.55
        x0 = 192 * i / 20
        x1 = 192 * (i + 1) / 20
        ax.add_patch(patches.Rectangle((x0, 0), x1 - x0, 50, facecolor="#000000", alpha=alpha, edgecolor="none"))

    # Dashed border
    ax.add_patch(patches.FancyBboxPatch((0.5, 0.5), 191, 49, boxstyle="round,pad=0", linewidth=1.5, edgecolor="#888888", facecolor="none", linestyle="--"))

    # Vertical divider at 40% (text | image zones)
    ax.plot([76.8, 76.8], [0, 50], color="#FFD700", linewidth=1.2, linestyle=":", alpha=0.8)

    # Zone labels at top
    ax.text(38, 48, "ZONA TEXTO (40%)", ha="center", va="top", fontsize=7, color="#FFD700", fontweight="bold", fontstyle="italic")
    ax.text(134, 48, "ZONA IMAGEN (60%)", ha="center", va="top", fontsize=7, color="#FFD700", fontweight="bold", fontstyle="italic")

    # Text content placement (left side)
    text_y_start = 37
    # Tag pill
    ax.add_patch(FancyBboxPatch((8, text_y_start + 1), 32, 4.5, boxstyle="round,pad=0.8", facecolor="#FFFFFF", alpha=0.12, edgecolor="#FFFFFF", linewidth=0.5, linestyle="--"))
    ax.text(24, text_y_start + 3.2, f"[{b['tag']}]", ha="center", va="center", fontsize=5.5, color="#FFFFFF", alpha=0.9, fontweight="bold")

    # Title
    ax.text(10, text_y_start - 3, b["title"], ha="left", va="top", fontsize=10, color="#FFFFFF", fontweight="bold")
    # Subtitle
    ax.text(10, text_y_start - 10, b["subtitle"].replace("\n", " "), ha="left", va="top", fontsize=6, color="#FFFFFF", alpha=0.85)

    # CTA button
    cta_y = 7
    ax.add_patch(FancyBboxPatch((10, cta_y), 28, 5, boxstyle="round,pad=1.2", facecolor="#E35205", edgecolor="none"))
    ax.text(24, cta_y + 2.5, f"{b['cta']} →", ha="center", va="center", fontsize=6, color="#FFFFFF", fontweight="bold")

    # Countdown placeholder (only banner 1)
    if b["countdown"]:
        ax.add_patch(FancyBboxPatch((10, 14), 52, 7, boxstyle="round,pad=0.5", facecolor="#FFFFFF", alpha=0.08, edgecolor="#FFFFFF", linewidth=0.5, linestyle="--"))
        ax.text(36, 20.5, "[CONTADOR REGRESIVO: 04 : 12 : 34 : 56]", ha="center", va="center", fontsize=5.5, color="#FFFFFF", alpha=0.7, fontweight="bold")
        ax.text(36, 16.5, "dias : horas : min : seg", ha="center", va="center", fontsize=4, color="#FFFFFF", alpha=0.5)

    # Image zone placeholder (right side)
    ax.add_patch(patches.FancyBboxPatch((82, 5), 102, 38, boxstyle="round,pad=1", facecolor="#FFFFFF", alpha=0.06, edgecolor="#FFFFFF", linewidth=0.8, linestyle="--"))
    ax.text(133, 28, "IMAGEN / FOTO DEL PRODUCTO", ha="center", va="center", fontsize=7, color="#FFFFFF", alpha=0.5, fontweight="bold")
    ax.text(133, 23, f"Logo de marca aqui si aplica", ha="center", va="center", fontsize=5.5, color="#FFFFFF", alpha=0.4)
    ax.text(133, 12, f"Resolucion recomendada:", ha="center", va="center", fontsize=5, color="#FFFFFF", alpha=0.35)
    ax.text(133, 8.5, f"{b['resolucion']}", ha="center", va="center", fontsize=5.5, color="#FFD700", alpha=0.6, fontweight="bold")


# ─── Create figure ───
fig = plt.figure(figsize=(19.2, 28), facecolor="#0F0F0F")

# Title
fig.text(0.5, 0.975, "iTools Peru — Referencia Visual de Banners para Disenador",
         ha="center", va="top", fontsize=20, color="#FFFFFF", fontweight="bold")
fig.text(0.5, 0.96, "Carrusel Hero — 3 Banners — Homepage",
         ha="center", va="top", fontsize=13, color="#FFFFFF", alpha=0.6)

# Subtitle / instructions
fig.text(0.5, 0.945, "En cada banner: la IZQUIERDA (40%) es zona de texto con overlay oscuro. La DERECHA (60%) es zona de imagen/foto del producto.",
         ha="center", va="top", fontsize=9, color="#FFD700", alpha=0.8, fontstyle="italic")

# Draw 3 banner wireframes
for i, b in enumerate(BANNERS):
    y_top = 0.92 - i * 0.29
    ax = fig.add_axes([0.04, y_top - 0.20, 0.92, 0.20])
    draw_banner_wireframe(ax, b, i)

    # Banner number + filename below
    fig.text(0.06, y_top - 0.225, f"BANNER {b['num']}", ha="left", va="top",
             fontsize=14, color="#E35205", fontweight="bold")
    fig.text(0.22, y_top - 0.225, f"Archivo: {b['filename']}", ha="left", va="top",
             fontsize=11, color="#FFFFFF", fontweight="bold")
    fig.text(0.22, y_top - 0.245, f"{b['resolucion']}  |  Formato: {b['formato']}  |  {b['gradient']}",
             ha="left", va="top", fontsize=9, color="#FFFFFF", alpha=0.5)

    # Specs on right
    specs_x = 0.72
    fig.text(specs_x, y_top - 0.222, f"Texto: {b['text_color']}  |  CTA: {b['accent'].split(chr(10))[0]}",
             ha="left", va="top", fontsize=8.5, color="#FFFFFF", alpha=0.55)
    fig.text(specs_x, y_top - 0.24, f"Overlay: {b['overlay'].split(chr(10))[0]}",
             ha="left", va="top", fontsize=8.5, color="#FFFFFF", alpha=0.55)
    fig.text(specs_x, y_top - 0.258, f"Logo: {b['logo_zone'].split(chr(10))[0]}",
             ha="left", va="top", fontsize=8.5, color="#FFFFFF", alpha=0.55)

# ─── Bottom summary section ───
summary_y = 0.065
fig.text(0.5, summary_y + 0.025, "RESUMEN DE ENTREGABLES", ha="center", va="top",
         fontsize=14, color="#E35205", fontweight="bold")

deliverables = [
    "1. oferta-julio-4july.jpg — 1920x500px — Fondo azul navy + herramientas + overlay oscuro izq",
    "2. ego-descuento.jpg — 1920x500px — Fondo azul oscuro + productos EGO + overlay oscuro izq",
    "3. liquidacion-extra20.jpg — 1920x500px — Fondo rojo #D1001C + herramientas liquidacion + overlay oscuro izq",
]
for j, d in enumerate(deliverables):
    fig.text(0.5, summary_y - 0.005 - j * 0.014, d, ha="center", va="top",
             fontsize=9, color="#FFFFFF", alpha=0.7, family="monospace")

# Nota importante
fig.text(0.5, summary_y - 0.055, "IMPORTANTE: El texto (titulo, subtitle, CTA, countdown) se renderiza con HTML/CSS encima de la imagen.",
         ha="center", va="top", fontsize=9, color="#FFD700", alpha=0.7, fontstyle="italic")
fig.text(0.5, summary_y - 0.07, "La imagen de fondo debe tener contenido visual en la zona derecha (60%). La zona izquierda sera cubierta por un overlay oscuro.",
         ha="center", va="top", fontsize=9, color="#FFD700", alpha=0.7, fontstyle="italic")

plt.savefig(OUTPUT, dpi=150, facecolor="#0F0F0F", bbox_inches="tight", pad_inches=0.5)
plt.close()
print(f"Saved to {OUTPUT}")