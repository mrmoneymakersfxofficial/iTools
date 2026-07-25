"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function BrandShowcase({ brands }: { brands: any[] }) {
  const safeBrands = brands || [];

  if (safeBrands.length === 0) return null;

  return (
    <section className="py-3 bg-[#F5F5F5] dark:bg-[#111111]" data-section="Comprar por Marca">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag className="h-5 w-5 text-[#1A1A1A] dark:text-white" />
          <h2 className="text-base font-bold text-[#1A1A1A] dark:text-white uppercase tracking-wide">
            Comprar por Marca
          </h2>
        </div>

        {/* No cards — just logos with rounded corners, tight grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-px">
          {safeBrands.map((brand) => (
            <Link
              key={brand._id || brand.slug}
              href={`/marca/${brand.slug || "#"}`}
              className="group flex items-center justify-center h-[88px] transition-opacity hover:opacity-80 bg-white dark:bg-[#1a1a1a] rounded-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {brand.logo?.asset?.url ? (
                <img
                  src={brand.logo.asset.url}
                  alt={brand.name}
                  className="max-h-[84px] w-auto max-w-full object-contain rounded-lg p-2"
                  loading="lazy"
                />
              ) : (
                <span className="text-sm font-bold text-gray-500">{brand.name}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}