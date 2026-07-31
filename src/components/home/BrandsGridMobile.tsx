"use client";
import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";

import { BRAND_SHOWCASE_ORDER, BRAND_CONFIGS } from "@/lib/constants/brands";

const hardcodedBrands = BRAND_SHOWCASE_ORDER.map(slug => ({
  _id: slug,
  slug,
  name: slug.charAt(0).toUpperCase() + slug.slice(1)
}));

export function BrandsGridMobile({ brands }: { brands: any[] }) {
  const safeBrands = hardcodedBrands;

  if (safeBrands.length === 0) return null;

  return (
    <section className="bg-[#F5F5F5] dark:bg-[#111111] py-3 lg:hidden" data-section="Comprar por Marca">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
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

        {/* Horizontal scroll with cards */}
        <nav
          className="flex gap-1.5 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {safeBrands.map((brand) => {
            const slug = brand.slug || brand.name.toLowerCase();
            const config = BRAND_CONFIGS[slug];
            const hasLocalImg = !!config;
            const bgColor = config ? config.bg : "#ffffff";
            
            const fallbackExt = config ? config.logoExt : "webp";
            const imgSrc = hasLocalImg ? `/brands/${slug}.${fallbackExt}` : (brand.logo?.asset?.url || null);
            const showImg = !!imgSrc;

            return (
              <Link
                key={brand._id || brand.slug}
                href={`/marca/${brand.slug || "#"}`}
                className="shrink-0 w-[110px] sm:w-[120px] flex items-center justify-center h-[72px] transition-opacity active:opacity-70 rounded-md overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {showImg ? (
                  <img
                    src={imgSrc}
                    alt={brand.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const next = e.currentTarget.nextElementSibling as HTMLElement;
                      if (next) next.style.display = 'block';
                    }}
                  />
                ) : null}
                <span className={`text-xs font-bold ${config ? 'text-white' : 'text-gray-800'} ${showImg ? 'hidden' : 'block'}`}>
                  {brand.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}