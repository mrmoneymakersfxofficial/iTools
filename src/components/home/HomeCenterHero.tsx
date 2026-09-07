"use client";

import Link from "next/link";
import Image from "next/image";

interface HomeCenterHeroProps {
  heroBanners?: any[];
  brandPromoBanners?: any[];
  promoBanners?: any[];
}

export function HomeCenterHero({
  heroBanners,
  brandPromoBanners,
  promoBanners,
}: HomeCenterHeroProps) {
  const topBanner = heroBanners?.[0];
  const midBanner = brandPromoBanners?.[0];
  const bottomBannerLeft = promoBanners?.[0];
  const bottomBannerRight = promoBanners?.[1];

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {/* ── 1. Top Large Banner: DeWalt Toughcase / Hero ── */}
      <Link
        href={topBanner?.link || "/marca/dewalt"}
        className="group relative block w-full h-[220px] sm:h-[260px] md:h-[280px] rounded-lg overflow-hidden border border-[#E0E0E0] dark:border-[#333] shadow-sm transition-transform duration-300 hover:scale-[1.005]"
      >
        {topBanner?.image?.asset?.url ? (
          <Image
            src={topBanner.image.asset.url}
            alt={topBanner.title || "DeWalt ToughCase"}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <img
            src="/banners/hero/dewalt-hero.webp"
            alt="DeWalt ToughCase S/ 349.90"
            className="w-full h-full object-cover"
          />
        )}
      </Link>

      {/* ── 2. Mid Slim Banner: Milwaukee Combo Kit ── */}
      <Link
        href={midBanner?.link || "/marca/milwaukee"}
        className="group relative block w-full h-[80px] sm:h-[95px] rounded-lg overflow-hidden border border-[#E0E0E0] dark:border-[#333] shadow-sm transition-transform duration-300 hover:scale-[1.005]"
      >
        {midBanner?.image?.asset?.url ? (
          <Image
            src={midBanner.image.asset.url}
            alt={midBanner.brandName || "Milwaukee Combo Kit"}
            fill
            className="object-cover"
          />
        ) : (
          <img
            src="/banners/hero/milwaukee-hero.webp"
            alt="Milwaukee Combo Kit S/ 2,799.90"
            className="w-full h-full object-cover"
          />
        )}
      </Link>

      {/* ── 3. Bottom 2 Banners (50% / 50%) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Left: Milwaukee Rotomartillo 2.7J */}
        <Link
          href={bottomBannerLeft?.link || "/categoria/rotomartillos"}
          className="group relative block w-full h-[150px] sm:h-[165px] rounded-lg overflow-hidden border border-[#E0E0E0] dark:border-[#333] shadow-sm transition-transform duration-300 hover:scale-[1.01]"
        >
          {bottomBannerLeft?.image?.asset?.url ? (
            <Image
              src={bottomBannerLeft.image.asset.url}
              alt={bottomBannerLeft.title || "Milwaukee Rotomartillo 2.7J"}
              fill
              className="object-cover"
            />
          ) : (
            <img
              src="/banners/hero/milwaukee-hero-2.webp"
              alt="Milwaukee Rotomartillo 2.7J ¡Pídelo ya!"
              className="w-full h-full object-cover"
            />
          )}
        </Link>

        {/* Right: Preventa Electricista Tools */}
        <Link
          href={bottomBannerRight?.link || "/categoria/equipos-especializados"}
          className="group relative block w-full h-[150px] sm:h-[165px] rounded-lg overflow-hidden border border-[#E0E0E0] dark:border-[#333] shadow-sm transition-transform duration-300 hover:scale-[1.01]"
        >
          {bottomBannerRight?.image?.asset?.url ? (
            <Image
              src={bottomBannerRight.image.asset.url}
              alt={bottomBannerRight.title || "Preventa Herramientas 1000V"}
              fill
              className="object-cover"
            />
          ) : (
            <img
              src="/banners/brands/bosch.webp"
              alt="Preventa Herramientas Electricista 1000V S/ 199.90"
              className="w-full h-full object-cover"
            />
          )}
        </Link>
      </div>
    </div>
  );
}
