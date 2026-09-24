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
        className="group relative block w-full h-[180px] sm:h-[240px] md:h-[280px] shrink-0 rounded-lg overflow-hidden border border-[#E0E0E0] dark:border-[#333] shadow-sm transition-transform duration-300 hover:scale-[1.005]"
      >
        <picture className="w-full h-full block">
          {topBanner?.imageMobile?.asset?.url && (
            <source
              media="(max-width: 640px)"
              srcSet={topBanner.imageMobile.asset.url}
            />
          )}
          <img
            src={topBanner?.image?.asset?.url || "/banners/hero/dewalt-toughcase.webp"}
            alt={topBanner?.title || "DeWalt ToughCase"}
            className="w-full h-full object-cover"
          />
        </picture>
      </Link>

      {/* ── 2. Mid Slim Banner: Milwaukee Combo Kit ── */}
      <Link
        href={midBanner?.link || "/marca/milwaukee"}
        {...midSanityAttr}
        className="group relative block w-full h-[75px] sm:h-[88px] shrink-0 rounded-lg overflow-hidden border border-[#E0E0E0] dark:border-[#333] shadow-sm transition-transform duration-300 hover:scale-[1.005]"
      >
        <picture className="w-full h-full block">
          {midBanner?.imageMobile?.asset?.url && (
            <source
              media="(max-width: 640px)"
              srcSet={midBanner.imageMobile.asset.url}
            />
          )}
          <img
            src={midBanner?.image?.asset?.url || "/banners/hero/milwaukee-combo-mid.webp"}
            alt={midBanner?.brandName || "Milwaukee Combo Kit"}
            className="w-full h-full object-cover"
          />
        </picture>
      </Link>

      {/* ── 3. Bottom 2 Banners: TALL CARDS (Image 2 style) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1 min-h-[260px] sm:min-h-[300px]">
        {/* Left: Milwaukee Rotomartillo 2.7J */}
        <Link
          href={bottomBannerLeft?.link || "/categoria/rotomartillos"}
          {...leftSanityAttr}
          className="group relative block w-full h-full min-h-[260px] sm:min-h-[300px] md:min-h-[340px] rounded-lg overflow-hidden border border-[#E0E0E0] dark:border-[#333] shadow-sm transition-transform duration-300 hover:scale-[1.01]"
        >
          <picture className="w-full h-full block">
            {bottomBannerLeft?.imageMobile?.asset?.url && (
              <source
                media="(max-width: 640px)"
                srcSet={bottomBannerLeft.imageMobile.asset.url}
              />
            )}
            <img
              src={bottomBannerLeft?.image?.asset?.url || "/banners/hero/milwaukee-rotomartillo-tall.webp"}
              alt={bottomBannerLeft?.title || "Milwaukee Rotomartillo 2.7J"}
              className="w-full h-full object-cover"
            />
          </picture>
        </Link>

        {/* Right: Preventa Electricista Tools */}
        <Link
          href={bottomBannerRight?.link || "/categoria/equipos-especializados"}
          {...rightSanityAttr}
          className="group relative block w-full h-full min-h-[260px] sm:min-h-[300px] md:min-h-[340px] rounded-lg overflow-hidden border border-[#E0E0E0] dark:border-[#333] shadow-sm transition-transform duration-300 hover:scale-[1.01]"
        >
          <picture className="w-full h-full block">
            {bottomBannerRight?.imageMobile?.asset?.url && (
              <source
                media="(max-width: 640px)"
                srcSet={bottomBannerRight.imageMobile.asset.url}
              />
            )}
            <img
              src={bottomBannerRight?.image?.asset?.url || "/banners/hero/preventa-electricista-tall.webp"}
              alt={bottomBannerRight?.title || "Preventa Herramientas 1000V"}
              className="w-full h-full object-cover"
            />
          </picture>
        </Link>
      </div>
    </div>
  );
}
