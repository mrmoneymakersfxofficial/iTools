"use client";

import Link from "next/link";
import Image from "next/image";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

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
  const topBanner = heroBanners?.find((b: any) => b._id === "hero-1") || heroBanners?.[0];
  const midBanner = brandPromoBanners?.find((b: any) => b._id === "brand-promo-milwaukee") || brandPromoBanners?.[0];
  const bottomBannerLeft = promoBanners?.find((b: any) => b._id === "promo-banner-hero-rotomartillo");
  const bottomBannerRight = promoBanners?.find((b: any) => b._id === "promo-banner-hero-electricista");

  const topSanityAttr = getSanityAttr(topBanner?._id || "hero-1", topBanner?._type || "heroSlide", "image");
  const midSanityAttr = getSanityAttr(midBanner?._id || "brand-promo-milwaukee", midBanner?._type || "brandPromoSlide", "image");
  const leftSanityAttr = getSanityAttr(bottomBannerLeft?._id || "promo-banner-hero-rotomartillo", bottomBannerLeft?._type || "promoBanner", "image");
  const rightSanityAttr = getSanityAttr(bottomBannerRight?._id || "promo-banner-hero-electricista", bottomBannerRight?._type || "promoBanner", "image");

  return (
    <div className="flex flex-col gap-2.5 w-full h-full justify-between" id="hero" data-section="Hero Principal">
      {/* ── 1. Top Large Banner: DeWalt Toughcase / Hero ── */}
      <Link
        href={topBanner?.link || "/marca/dewalt"}
        {...topSanityAttr}
        className="group relative block w-full h-[220px] sm:h-[260px] md:h-[280px] shrink-0 rounded-lg overflow-hidden border border-[#E0E0E0] dark:border-[#333] shadow-sm transition-transform duration-300 hover:scale-[1.005]"
      >
        {topBanner?.image?.asset?.url ? (
          <Image
            src={topBanner.image.asset.url}
            alt={topBanner.title || "DeWalt ToughCase"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
          />
        ) : (
          <img
            src="/banners/hero/dewalt-toughcase.webp"
            alt="DeWalt ToughCase S/ 349.90"
            className="w-full h-full object-cover"
          />
        )}
      </Link>

      {/* ── 2. Mid Slim Banner: Milwaukee Combo Kit ── */}
      <Link
        href={midBanner?.link || "/marca/milwaukee"}
        {...midSanityAttr}
        className="group relative block w-full h-[75px] sm:h-[88px] shrink-0 rounded-lg overflow-hidden border border-[#E0E0E0] dark:border-[#333] shadow-sm transition-transform duration-300 hover:scale-[1.005]"
      >
        {midBanner?.image?.asset?.url ? (
          <Image
            src={midBanner.image.asset.url}
            alt={midBanner.brandName || "Milwaukee Combo Kit"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        ) : (
          <img
            src="/banners/hero/milwaukee-combo-mid.webp"
            alt="Milwaukee Combo Kit S/ 2,799.90"
            className="w-full h-full object-cover"
          />
        )}
      </Link>

      {/* ── 3. Bottom 2 Banners: TALL CARDS (Image 2 style) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1 min-h-[260px] sm:min-h-[300px]">
        {/* Left: Milwaukee Rotomartillo 2.7J */}
        <Link
          href={bottomBannerLeft?.link || "/categoria/rotomartillos"}
          {...leftSanityAttr}
          className="group relative block w-full h-full min-h-[260px] sm:min-h-[300px] md:min-h-[340px] rounded-lg overflow-hidden border border-[#E0E0E0] dark:border-[#333] shadow-sm transition-transform duration-300 hover:scale-[1.01]"
        >
          {bottomBannerLeft?.image?.asset?.url ? (
            <Image
              src={bottomBannerLeft.image.asset.url}
              alt={bottomBannerLeft.title || "Milwaukee Rotomartillo 2.7J"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 600px"
            />
          ) : (
            <img
              src="/banners/hero/milwaukee-rotomartillo-tall.webp"
              alt="Milwaukee Rotomartillo 2.7J ¡Pídelo ya!"
              className="w-full h-full object-cover"
            />
          )}
        </Link>

        {/* Right: Preventa Electricista Tools */}
        <Link
          href={bottomBannerRight?.link || "/categoria/equipos-especializados"}
          {...rightSanityAttr}
          className="group relative block w-full h-full min-h-[260px] sm:min-h-[300px] md:min-h-[340px] rounded-lg overflow-hidden border border-[#E0E0E0] dark:border-[#333] shadow-sm transition-transform duration-300 hover:scale-[1.01]"
        >
          {bottomBannerRight?.image?.asset?.url ? (
            <Image
              src={bottomBannerRight.image.asset.url}
              alt={bottomBannerRight.title || "Preventa Herramientas 1000V"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 600px"
            />
          ) : (
            <img
              src="/banners/hero/preventa-electricista-tall.webp"
              alt="Preventa Herramientas Electricista 1000V S/ 199.90"
              className="w-full h-full object-cover"
            />
          )}
        </Link>
      </div>
    </div>
  );
}
