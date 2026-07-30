"use client";
import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";

import { VALID_LOCAL_BRANDS } from "@/lib/constants/brands";

const fallbackBrands = VALID_LOCAL_BRANDS.map(slug => ({
  _id: slug,
  slug,
  name: slug.charAt(0).toUpperCase() + slug.slice(1)
}));

export function BrandsGridMobile({ brands }: { brands: any[] }) {
  const safeBrands = (brands && brands.length > 0) ? brands : fallbackBrands;

  if (safeBrands.length === 0) return null;

  return (
    <section className="bg-[#F5F5F5] dark:bg-[#111111] py-2 lg:hidden" data-section="Comprar por Marca">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#1A1A1A] dark:text-white" />
            <h2 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase tracking-wide">
              Comprar por Marca
            </h2>
          </div>
          <Link
            href="/marcas"
            className="flex items-center gap-0.5 text-[11px] text-[#E35205] font-semibold"
          >
            Ver todas
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Horizontal scroll — no cards, just logos */}
        <nav
          className="flex gap-px overflow-x-auto pb-0.5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {safeBrands.map((brand) => {
            const slug = brand.slug || brand.name.toLowerCase();
            const hasLocalImg = VALID_LOCAL_BRANDS.includes(slug);
            const showImg = brand.logo?.asset?.url || hasLocalImg;

            return (
              <Link
                key={brand._id || brand.slug}
                href={`/marca/${brand.slug || "#"}`}
                className="shrink-0 w-[110px] sm:w-[120px] flex items-center justify-center h-[72px] transition-opacity active:opacity-70"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {showImg ? (
                  <img
                    src={brand.logo?.asset?.url || `/brands/${slug}.webp`}
                    alt={brand.name}
                    className="max-h-[68px] w-auto max-w-full object-contain rounded-lg"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const next = e.currentTarget.nextElementSibling as HTMLElement;
                      if (next) next.style.display = 'block';
                    }}
                  />
                ) : null}
                <span className={`text-xs font-bold text-gray-500 ${showImg ? 'hidden' : 'block'}`}>{brand.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}