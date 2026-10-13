import os
import glob
import re

os.makedirs('public/brands/transparent', exist_ok=True)
for p in sorted(glob.glob('public/brands/*.svg')):
    fname = os.path.basename(p)
    if 'transparent' in fname:
        continue
    with open(p, 'r', encoding='utf-8') as f:
        txt = f.read()
    # Remove the first full-canvas rect (<rect ... width="130" height="50".../> or similar)
    cleaned = re.sub(r'<rect[^>]*width=["\']130["\'][^>]*height=["\']50["\'][^>]*/?>', '', txt)
    with open(os.path.join('public/brands/transparent', fname), 'w', encoding='utf-8') as f:
        f.write(cleaned)

print('Transparent SVGs created in public/brands/transparent!')
