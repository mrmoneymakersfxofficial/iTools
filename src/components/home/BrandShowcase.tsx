"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { urlFor } from "@/sanity/image";
import Image from "next/image";

import { BRAND_SHOWCASE_ORDER, BRAND_CONFIGS } from "@/lib/constants/brands";

export function BrandShowcase({ brands }: { brands: any[] }) {
  // Use Sanity data when available, fallback to hardcoded brands
  const safeBrands = (brands && brands.length > 0)
    ? brands
    : BRAND_SHOWCASE_ORDER.map(slug => ({
        _id: slug,
        slug,
        name: slug.charAt(0).toUpperCase() + slug.slice(1)
      }));

  if (safeBrands.length === 0) return null;

  return (
    <section className="py-4 bg-[#F5F5F5] dark:bg-[#111111]" data-section="Comprar por Marca">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="h-5 w-5 text-[#1A1A1A] dark:text-white" />
          <h2 className="text-base font-bold text-[#1A1A1A] dark:text-white uppercase tracking-wide">
            Comprar por Marca
          </h2>
        </div>

        {/* 6-col grid with exact brand colors */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 md:gap-2">
          {safeBrands.map((brand: any) => {
            const slug = brand.slug || brand.name?.toLowerCase() || "";
            const config = BRAND_CONFIGS[slug];
            const hasLocalImg = !!config;
            const bgColor = config ? config.bg : "#ffffff";
            
            // Prefer local SVGs for known brands, use Sanity logo for others
            const fallbackExt = config ? config.logoExt : "webp";
            const localImgSrc = hasLocalImg ? `/brands/${slug}.${fallbackExt}` : null;
            const sanityImgSrc = brand.logo?.asset?.url
              ? urlFor(brand.logo).width(200).height(100).format("webp").url()
              : null;
            const imgSrc = localImgSrc || sanityImgSrc;
            const showImg = !!imgSrc;

            return (
              <Link
                key={brand._id || brand.slug}
                href={`/marca/${brand.slug || "#"}`}
                className="group flex items-center justify-center h-[88px] transition-opacity hover:opacity-80 rounded-md overflow-hidden"
              >
                {showImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
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
                <span className={`text-sm font-bold ${config ? 'text-white' : 'text-gray-800'} ${showImg ? 'hidden' : 'block'}`}>
                  {brand.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}