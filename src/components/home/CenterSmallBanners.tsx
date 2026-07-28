"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleArrowRight, Star } from "lucide-react";

export function CenterSmallBanners({ banners }: { banners: any[] }) {
  const safeBanners = banners || [];
  
  if (safeBanners.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2.5 md:gap-6">
      {safeBanners.map((banner, index) => (
        <Link key={banner._id || index} href={banner.link || "#"} className="block">
          <Card className="relative overflow-hidden border-0 shadow-sm gap-0 py-0 rounded-xl h-full">
            {/* Gradient background */}
            <div
              className="absolute inset-0"
              style={{ background: banner.bgGradient || "#000" }}
            />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
            
            {/* Optional glow for second style */}
            {index === 1 && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl" />
            )}

            <CardContent
              className="relative z-10 flex h-[280px] flex-col justify-end items-start p-4 text-white md:h-[200px] lg:h-[240px]"
            >
              <div className="space-y-2 md:space-y-2 w-full">
                <span className="font-impact text-2xl md:text-2xl lg:text-3xl tracking-wider opacity-90 flex items-center gap-1.5 block">
                  {index === 1 && <Star className="h-5 w-5 text-amber-300" />}
                  {banner.title}
                </span>
                <p className="text-sm md:text-sm font-semibold leading-tight">
                  {banner.headline}
                </p>
                <p className="text-xs md:text-xs leading-relaxed text-white/70">
                  {banner.description}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2 md:mt-2 rounded-full text-[11px] md:text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 shadow-sm transition-all hover:scale-105"
                  asChild
                >
                  <span className="inline-flex items-center gap-1.5">
                    {banner.ctaText || "Compra ahora"}
                    <CircleArrowRight className="h-3 w-3" />
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}