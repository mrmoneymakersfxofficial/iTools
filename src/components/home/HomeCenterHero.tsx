"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

interface BannerSlide {
  _id?: string;
  _type?: string;
  title?: string;
  brandName?: string;
  brandSlug?: string;
  link?: string;
  image?: { asset?: { url?: string } };
  imageMobile?: { asset?: { url?: string } };
}

interface HomeCenterHeroProps {
  heroBanners?: BannerSlide[];
  brandPromoBanners?: BannerSlide[];
  promoBanners?: BannerSlide[];
}

function ResponsiveBannerMedia({
  desktopUrl,
  mobileUrl,
  alt,
}: {
  desktopUrl: string;
  mobileUrl?: string;
  alt: string;
}) {
  return (
    <picture className="w-full h-full block">
      {mobileUrl && <source media="(max-width: 640px)" srcSet={mobileUrl} />}
      <img src={desktopUrl} alt={alt} className="w-full h-full object-cover" />
    </picture>
  );
}

export function HomeCenterHero({
  heroBanners,
  brandPromoBanners,
  promoBanners,
}: HomeCenterHeroProps) {
  const validHeroSlides = (heroBanners || []).filter(
    (b) => b?.image?.asset?.url || b?.imageMobile?.asset?.url
  );
  const topSlides: BannerSlide[] =
    validHeroSlides.length > 0
      ? validHeroSlides
      : [
          {
            _id: "hero-1",
            _type: "heroSlide",
            title: "DeWalt ToughCase",
            link: "/marca/dewalt",
            image: { asset: { url: "/banners/hero/dewalt-toughcase.webp" } },
          },
        ];

  const validMidSlides = (brandPromoBanners || []).filter(
    (b) => b?.image?.asset?.url || b?.imageMobile?.asset?.url
  );
  const midSlides: BannerSlide[] =
    validMidSlides.length > 0
      ? validMidSlides
      : [
          {
            _id: "brand-promo-milwaukee",
            _type: "brandPromoSlide",
            brandName: "Milwaukee Combo Kit",
            brandSlug: "milwaukee",
            link: "/marca/milwaukee",
            image: { asset: { url: "/banners/hero/milwaukee-combo-mid.webp" } },
          },
        ];

  const [topIndex, setTopIndex] = useState(0);
  const [midIndex, setMidIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (topSlides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setTopIndex((prev) => (prev + 1) % topSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [topSlides.length, isPaused]);

  useEffect(() => {
    if (midSlides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setMidIndex((prev) => (prev + 1) % midSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [midSlides.length, isPaused]);

  const currentTop = topSlides[topIndex % topSlides.length];
  const currentMid = midSlides[midIndex % midSlides.length];

  const bottomBannerLeft = promoBanners?.find((b) => b._id === "promo-banner-hero-rotomartillo");
  const bottomBannerRight = promoBanners?.find((b) => b._id === "promo-banner-hero-electricista");

  const topSanityAttr = getSanityAttr(currentTop?._id || "hero-1", currentTop?._type || "heroSlide", "image");
  const midSanityAttr = getSanityAttr(
    currentMid?._id || "brand-promo-milwaukee",
    currentMid?._type || "brandPromoSlide",
    "image"
  );
  const leftSanityAttr = getSanityAttr(
    bottomBannerLeft?._id || "promo-banner-hero-rotomartillo",
    bottomBannerLeft?._type || "promoBanner",
    "image"
  );
  const rightSanityAttr = getSanityAttr(
    bottomBannerRight?._id || "promo-banner-hero-electricista",
    bottomBannerRight?._type || "promoBanner",
    "image"
  );

  return (
    <div
      className="flex flex-col gap-2.5 w-full h-full justify-between"
      id="hero"
      data-section="Hero Principal"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── 1. Top Large Slider: Hero Banners ── */}
      <div
        className={`group relative w-full ${
          currentTop?.imageMobile?.asset?.url
            ? "aspect-[4/3] sm:aspect-auto sm:h-[240px] md:h-[280px]"
            : "h-[180px] sm:h-[240px] md:h-[280px]"
        } shrink-0 rounded-lg overflow-hidden border border-[#E0E0E0] dark:border-[#333] shadow-sm`}
      >
        <Link
          href={currentTop?.link || "/marca/dewalt"}
          {...topSanityAttr}
          className="block w-full h-full transition-transform duration-300 hover:scale-[1.005]"
        >
          <ResponsiveBannerMedia
            desktopUrl={currentTop?.image?.asset?.url || "/banners/hero/dewalt-toughcase.webp"}
            mobileUrl={currentTop?.imageMobile?.asset?.url}
            alt={currentTop?.title || "Hero Slider iTools"}
          />
        </Link>

        {topSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setTopIndex((prev) => (prev - 1 + topSlides.length) % topSlides.length)}
              aria-label="Slide anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setTopIndex((prev) => (prev + 1) % topSlides.length)}
              aria-label="Siguiente slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
              {topSlides.map((s, idx) => (
                <button
                  key={s._id || idx}
                  type="button"
                  onClick={() => setTopIndex(idx)}
                  aria-label={`Ir al slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === topIndex % topSlides.length ? "w-5 bg-[#E60000]" : "w-1.5 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── 2. Mid Slim Banner Slider ── */}
      <div
        className={`group relative w-full ${
          currentMid?.imageMobile?.asset?.url
            ? "aspect-[3/1] sm:aspect-auto sm:h-[88px]"
            : "h-[75px] sm:h-[88px]"
        } shrink-0 rounded-lg overflow-hidden border border-[#E0E0E0] dark:border-[#333] shadow-sm`}
      >
        <Link
          href={
            currentMid?.link ||
            (currentMid?.brandSlug ? `/marca/${currentMid.brandSlug}` : "/marca/milwaukee")
          }
          {...midSanityAttr}
          className="block w-full h-full transition-transform duration-300 hover:scale-[1.005]"
        >
          <ResponsiveBannerMedia
            desktopUrl={currentMid?.image?.asset?.url || "/banners/hero/milwaukee-combo-mid.webp"}
            mobileUrl={currentMid?.imageMobile?.asset?.url}
            alt={currentMid?.brandName || "Milwaukee Combo Kit"}
          />
        </Link>
        {midSlides.length > 1 && (
          <div className="absolute bottom-1.5 right-2.5 z-10 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full">
            {midSlides.map((s, idx) => (
              <button
                key={s._id || idx}
                type="button"
                onClick={() => setMidIndex(idx)}
                aria-label={`Banner medio ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === midIndex % midSlides.length ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── 3. Bottom 2 Banners: TALL CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1 min-h-[260px] sm:min-h-[300px]">
        <Link
          href={bottomBannerLeft?.link || "/categoria/rotomartillos"}
          {...leftSanityAttr}
          className={`group relative block w-full h-full ${
            bottomBannerLeft?.imageMobile?.asset?.url ? "aspect-square sm:aspect-auto" : "min-h-[260px]"
          } sm:min-h-[300px] md:min-h-[340px] rounded-lg overflow-hidden border border-[#E0E0E0] dark:border-[#333] shadow-sm transition-transform duration-300 hover:scale-[1.01]`}
        >
          <ResponsiveBannerMedia
            desktopUrl={bottomBannerLeft?.image?.asset?.url || "/banners/hero/milwaukee-rotomartillo-tall.webp"}
            mobileUrl={bottomBannerLeft?.imageMobile?.asset?.url}
            alt={bottomBannerLeft?.title || "Milwaukee Rotomartillo 2.7J"}
          />
        </Link>

        <Link
          href={bottomBannerRight?.link || "/categoria/equipos-especializados"}
          {...rightSanityAttr}
          className={`group relative block w-full h-full ${
            bottomBannerRight?.imageMobile?.asset?.url ? "aspect-square sm:aspect-auto" : "min-h-[260px]"
          } sm:min-h-[300px] md:min-h-[340px] rounded-lg overflow-hidden border border-[#E0E0E0] dark:border-[#333] shadow-sm transition-transform duration-300 hover:scale-[1.01]`}
        >
          <ResponsiveBannerMedia
            desktopUrl={bottomBannerRight?.image?.asset?.url || "/banners/hero/preventa-electricista-tall.webp"}
            mobileUrl={bottomBannerRight?.imageMobile?.asset?.url}
            alt={bottomBannerRight?.title || "Preventa Herramientas 1000V"}
          />
        </Link>
      </div>
    </div>
  );
}
