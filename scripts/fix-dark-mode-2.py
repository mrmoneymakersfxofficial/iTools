#!/usr/bin/env python3
"""Second pass: fix remaining bg-white without dark: in home components."""

import re

FILES = {
    "/home/z/my-project/src/components/home/CategoriesGridMobile.tsx": [
        ('className="bg-white py-2.5 lg:hidden"', 'className="bg-white dark:bg-[#111111] py-2.5 lg:hidden"'),
    ],
    "/home/z/my-project/src/components/home/TrendingProductsMobile.tsx": [
        ('className="group flex-shrink-0 w-[48%] sm:w-[45%] bg-white border', 'className="group flex-shrink-0 w-[48%] sm:w-[45%] bg-white dark:bg-[#111111] border'),
        ('className="bg-white py-2.5 lg:hidden"', 'className="bg-white dark:bg-[#111111] py-2.5 lg:hidden"'),
    ],
    "/home/z/my-project/src/components/home/HorizontalCategoryMenu.tsx": [
        ('className="overflow-x-auto bg-white border-b', 'className="overflow-x-auto bg-white dark:bg-[#111111] border-b'),
    ],
    "/home/z/my-project/src/components/home/HorizontalScroll.tsx": [
        ('bg-white shadow-lg border border-gray-200 dark:border-[#333]', 'bg-white dark:bg-[#222] shadow-lg border border-gray-200 dark:border-[#333]'),
    ],
    "/home/z/my-project/src/components/home/TrendingSidebar.tsx": [
        ('className="bg-white border border-[#E0E0E0] dark:border-[#333] rounded-lg', 'className="bg-white dark:bg-[#111111] border border-[#E0E0E0] dark:border-[#333] rounded-lg'),
    ],
    "/home/z/my-project/src/components/home/ExploreProductsMobile.tsx": [
        ('className="group flex-shrink-0 w-[48%] sm:w-[45%] bg-white border', 'className="group flex-shrink-0 w-[48%] sm:w-[45%] bg-white dark:bg-[#111111] border'),
        ('className="bg-white py-2.5 lg:hidden"', 'className="bg-white dark:bg-[#111111] py-2.5 lg:hidden"'),
    ],
    "/home/z/my-project/src/components/home/ToolCribSidebar.tsx": [
        ('className="bg-white border border-[#E0E0E0] dark:border-[#333] rounded-lg', 'className="bg-white dark:bg-[#111111] border border-[#E0E0E0] dark:border-[#333] rounded-lg'),
    ],
    "/home/z/my-project/src/components/home/BestDealsSection.tsx": [
        ('className="bg-white py-2.5 md:py-3"', 'className="bg-white dark:bg-[#111111] py-2.5 md:py-3"'),
    ],
    "/home/z/my-project/src/components/home/BrandsGridMobile.tsx": [
        ('className="bg-white px-3 py-2.5', 'className="bg-white dark:bg-[#111111] px-3 py-2.5'),
    ],
    "/home/z/my-project/src/components/home/TrendingCategoriesMobile.tsx": [
        ('className="bg-white py-2.5 lg:hidden"', 'className="bg-white dark:bg-[#111111] py-2.5 lg:hidden"'),
    ],
    "/home/z/my-project/src/components/home/ToolCribMobileBar.tsx": [
        ('className="block mx-2.5 my-2.5 bg-white border', 'className="block mx-2.5 my-2.5 bg-white dark:bg-[#111111] border'),
    ],
    "/home/z/my-project/src/components/home/CategoriesSection.tsx": [
        ('bg-white cursor-pointer"', 'bg-white dark:bg-[#111111] cursor-pointer"'),
    ],
}

for filepath, replacements in FILES.items():
    with open(filepath, 'r') as f:
        content = f.read()
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new, 1)
            print(f"  Fixed: {filepath.split('/')[-1]}")
    with open(filepath, 'w') as f:
        f.write(content)

print("\nDone!")