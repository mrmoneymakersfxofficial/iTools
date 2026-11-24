"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CircleArrowRight } from "lucide-react";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

export interface BrandSliderItem {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  link?: string;
  image?: { asset?: { url?: string } };
  imageMobile?: { asset?: { url?: string } };
}

export interface BrandPromoCardData {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  link?: string;
  image?: { asset?: { url?: string } };
  imageMobile?: { asset?: { url?: string } };
}

interface BrandHeroSliderProps {
  brandId?: string;
  brandName: string;
  brandSlug: string;
  brandColor: string;
  textCol: string;
  buttonBg: string;
  buttonTextColor: string;
  fallbackTopImg: string;
  sliders?: BrandSliderItem[];
}

export function BrandHeroSlider({
  brandId,
  brandName,
  brandSlug,
  brandColor,
  textCol,
  buttonBg,
  buttonTextColor,
  fallbackTopImg,
  sliders,
}: BrandHeroSliderProps) {
  const validSliders = (sliders || []).filter(
    (s) => s?.image?.asset?.url || s?.imageMobile?.asset?.url
  );
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (validSliders.length <= 1 || paused) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % validSliders.length), 5000);
    return () => clearInterval(t);
  }, [validSliders.length, paused]);

  const sanityAttr = getSanityAttr(brandId || brandSlug, "brandShowcaseItem", "brandSliders");

  if (validSliders.length > 0) {
    const active = validSliders[idx % validSliders.length];
    const hasCustomText = Boolean(active.headline || active.subheadline);

    return (
      <div
        {...sanityAttr}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="group relative rounded-2xl overflow-hidden shadow-lg border border-white/10 flex-1 min-h-[220px] md:min-h-[260px]"
        style={{ backgroundColor: brandColor }}
      >
        <Link href={active.link || `/marca/${brandSlug}`} className="block w-full h-full relative">
          <picture className="w-full h-full block">
            {active.imageMobile?.asset?.url && (
              <source media="(max-width: 640px)" srcSet={active.imageMobile.asset.url} />
            )}
            <img
              src={active.image?.asset?.url || active.imageMobile?.asset?.url || fallbackTopImg}
              alt={active.headline || `Promoción ${brandName}`}
              className="w-full h-full object-cover object-center"
            />
          </picture>

          {hasCustomText && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent flex flex-col justify-center p-6 md:p-8 space-y-2.5">
              {active.headline && (
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-none text-white max-w-md">
                  {active.headline}
                </h2>
              )}
              {active.subheadline && (
                <p className="text-xs sm:text-sm leading-relaxed max-w-sm text-white/90">
                  {active.subheadline}
                </p>
              )}
              {active.ctaText && (
                <div className="pt-1">
                  <span
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-md"
                    style={{ backgroundColor: buttonBg, color: buttonTextColor }}
                  >
                    {active.ctaText}
                    <CircleArrowRight className="h-4 w-4" style={{ color: buttonTextColor }} />
                  </span>
                </div>
              )}
            </div>
          )}
        </Link>

        {validSliders.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIdx((p) => (p - 1 + validSliders.length) % validSliders.length)}
              aria-label="Anterior slider de marca"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setIdx((p) => (p + 1) % validSliders.length)}
              aria-label="Siguiente slider de marca"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/45 px-2.5 py-1 rounded-full">
              {validSliders.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    i === idx % validSliders.length ? "w-5 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      {...sanityAttr}
      className="relative rounded-2xl overflow-hidden shadow-lg border border-white/10 flex flex-col md:flex-row items-stretch flex-1 min-h-[220px] md:min-h-[250px]"
      style={{ backgroundColor: brandColor }}
    >
      <div className="relative z-10 flex-1 p-6 md:p-8 flex flex-col justify-center space-y-3 min-w-[260px]">
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-none drop-shadow-sm"
          style={{ color: textCol }}
        >
          MÁS {brandName.toUpperCase()},<br className="hidden sm:inline" /> MÁS AHORROS
        </h2>
        <p
          className="text-xs sm:text-sm leading-relaxed max-w-sm drop-shadow-sm"
          style={{ color: textCol, opacity: 0.9 }}
        >
          Ofertas exclusivas en herramientas {brandName}. Envío a todo Perú.
        </p>
        <div>
          <Link
            href={`/marca/${brandSlug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all hover:scale-105 shadow-md active:scale-95"
            style={{ backgroundColor: buttonBg, color: buttonTextColor }}
          >
            COMPRAR AHORA
            <CircleArrowRight className="h-4 w-4" style={{ color: buttonTextColor }} />
          </Link>
        </div>
      </div>

      <div className="relative w-full md:w-[50%] h-[180px] md:h-full overflow-hidden shrink-0">
        <img
          src={fallbackTopImg}
          alt={`Promoción ${brandName}`}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div
          className="hidden md:block absolute inset-y-0 left-0 w-24 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${brandColor}, transparent)` }}
        />
        <div
          className="md:hidden absolute inset-x-0 top-0 h-14 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, ${brandColor}, transparent)` }}
        />
      </div>
    </div>
  );
}
