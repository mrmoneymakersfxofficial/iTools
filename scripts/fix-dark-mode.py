#!/usr/bin/env python3
"""Bulk dark mode fix for iTools Peru — adds dark: variants to all home/subpage components."""

import re
import os

BASE = "/home/z/my-project/src"

FILES = [
    "components/home/CategoriesGridMobile.tsx",
    "components/home/BrandShowcase.tsx",
    "components/home/ProductSections.tsx",
    "components/home/BestDealsSection.tsx",
    "components/home/TrendingProductsMobile.tsx",
    "components/home/HorizontalCategoryMenu.tsx",
    "components/home/TrendingSidebar.tsx",
    "components/home/TrendingCategoriesMobile.tsx",
    "components/home/ToolCribMobileBar.tsx",
    "components/home/ToolCribSidebar.tsx",
    "components/home/ExploreProductsMobile.tsx",
    "components/home/CategoriesSection.tsx",
    "components/home/TopDealsSection.tsx",
    "components/home/BrandsGridMobile.tsx",
    "components/home/HorizontalScroll.tsx",
    "components/product/ProductCard.tsx",
    "components/layout/AccountMenu.tsx",
    "components/layout/CartDrawer.tsx",
    "app/producto/[slug]/product-detail-client.tsx",
    "app/categoria/[slug]/category-page-client.tsx",
    "app/page.tsx",
]

REPLACEMENTS = [
    (r'className="([^"]*?)bg-white(?!/)"', r'className="\1bg-white dark:bg-[#111111]"'),
    (r'bg-\[#F5F6F8\]', r'bg-[#F5F6F8] dark:bg-[#1a1a1a]'),
    (r'bg-\[#F5F5F5\]', r'bg-[#F5F5F5] dark:bg-[#1a1a1a]'),
    (r'border-\[#E0E0E0\]', r'border-[#E0E0E0] dark:border-[#333]'),
    (r'border-\[#E8E8E8\]', r'border-[#E8E8E8] dark:border-[#333]'),
    (r'text-\[#1A1A1A\]', r'text-[#1A1A1A] dark:text-white'),
    (r'text-\[#333\](?![^"]*dark:text)', r'text-[#333] dark:text-gray-200'),
    (r'text-\[#666\]', r'text-[#666] dark:text-gray-300'),
    (r'text-\[#999\]', r'text-[#999] dark:text-gray-400'),
    (r'text-\[#ccc\]', r'text-[#ccc] dark:text-gray-500'),
    (r'text-gray-300(?![^"]*dark:)', r'text-gray-300 dark:text-gray-500'),
    (r'bg-gray-100(?![^"]*dark:)', r'bg-gray-100 dark:bg-[#222]'),
    (r'bg-gray-200(?![^"]*dark:)', r'bg-gray-200 dark:bg-[#333]'),
    (r'hover:bg-gray-50(?![^"]*dark:)', r'hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'),
    (r'hover:bg-gray-100(?![^"]*dark:)', r'hover:bg-gray-100 dark:hover:bg-[#222]'),
    (r'focus:bg-red-50(?![^"]*dark:)', r'focus:bg-red-50 dark:focus:bg-red-950'),
    (r'text-green-700(?![^"]*dark:)', r'text-green-700 dark:text-green-400'),
    (r'bg-white/90(?![^"]*dark:)', r'bg-white/90 dark:bg-[#1a1a1a]/90'),
    (r'fill-gray-200 text-gray-200(?![^"]*dark:)', r'fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600'),
    (r'border-gray-200(?![^"]*dark:)', r'border-gray-200 dark:border-[#333]'),
    (r'text-\[#0071C5\](?![^"]*dark:)', r'text-[#0071C5] dark:text-[#3399FF]'),
]

def fix_file(filepath):
    full_path = os.path.join(BASE, filepath)
    if not os.path.exists(full_path):
        print(f"  SKIP: {filepath}")
        return 0
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    changes = 0
    for pattern, replacement in REPLACEMENTS:
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            count = len(re.findall(pattern, content))
            changes += count
            content = new_content
    if content != original:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  OK ({changes} changes): {filepath}")
    else:
        print(f"  NO CHANGE: {filepath}")
    return changes

def main():
    total = 0
    print("=== BULK DARK MODE FIX ===")
    for f in FILES:
        total += fix_file(f)
    print(f"\nTOTAL: {total} dark mode additions")

if __name__ == "__main__":
    main()