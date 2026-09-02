"use client";

import Link from "next/link";
import Image from "next/image";
import { CircleArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CenterSmallBanners({ banners }: { banners: any[] }) {
  const safeBanners = banners || [];
  if (safeBanners.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex gap-2.5 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-2">
        {safeBanners.map((banner, index) => {
          const hasImage = !!banner.image?.asset?.url;
          const bg = banner.bgGradient || (index === 0 ? "linear-gradient(135deg, #1e3a1e, #0d1f0d)" : "linear-gradient(135deg, #c61010, #7a0000)");

          return (
            <Link
              key={banner._id || index}
              href={banner.link || "#"}
              className="block shrink-0 w-[280px] sm:w-auto rounded-2xl overflow-hidden shadow-md group relative transition-transform duration-300 hover:scale-[1.01]"
              style={{ background: bg }}
            >
              {/* If banner has image from Sanity CMS */}
              {hasImage ? (
                <div className="relative w-full h-[180px] sm:h-[200px] lg:h-[220px]">
                  <Image
                    src={banner.image.asset.url}
                    alt={banner.title || "Banner promocional"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                    {banner.title && (
                      <span className="font-impact text-xl sm:text-2xl text-white tracking-wide drop-shadow">
                        {banner.title}
                      </span>
                    )}
                    {banner.headline && (
                      <p className="text-xs sm:text-sm text-white/90 font-medium line-clamp-2 mt-0.5 drop-shadow">
                        {banner.headline}
                      </p>
                    )}
                    {banner.ctaText && (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full group-hover:bg-[#D1001C] transition-colors">
                          {banner.ctaText} <CircleArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Text & Gradient Banner */
                <div className="relative flex flex-col justify-between p-5 h-[180px] sm:h-[200px] lg:h-[220px] text-white overflow-hidden">
                  <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
                  {index === 1 && (
                    <div className="absolute top-0 right-0 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                  )}

                  <div className="relative z-10 space-y-1">
                    <span className="font-impact text-xl sm:text-2xl lg:text-3xl tracking-wider text-white flex items-center gap-1.5">
                      {index === 1 && <Star className="h-5 w-5 text-amber-300 fill-amber-300 shrink-0" />}
                      {banner.title}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-white/95 leading-tight">
                      {banner.headline}
                    </p>
                    {banner.description && (
                      <p className="text-[11px] sm:text-xs text-white/80 line-clamp-2 leading-relaxed mt-1">
                        {banner.description}
                      </p>
                    )}
                  </div>

                  <div className="relative z-10 pt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-full text-xs font-semibold bg-white/20 hover:bg-[#D1001C] text-white border border-white/20 shadow-sm transition-all group-hover:bg-[#D1001C]"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {banner.ctaText || "Ver Oferta"}
                        <CircleArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </Button>
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
