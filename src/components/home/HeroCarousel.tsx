"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CircleArrowRight, Wrench } from "lucide-react";

/* ─── Types ─── */
const INTERVAL_MS = 5000;
interface BannerData {
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  bg: string;
  icon?: React.ReactNode;
}

export function HeroCarousel({ banners }: { banners: any[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const safeBanners = banners || [];
  const total = safeBanners.length;

  if (total === 0) return null;

  const go = useCallback(
    (dir: "prev" | "next") =>
      setCurrent((c) => (c + (dir === "next" ? 1 : -1) + total) % total),
    [total],
  );

  /* auto-rotation */
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => go("next"), INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, go]);

  const handleImgError = (idx: number) =>
    setImgErrors((prev) => new Set(prev).add(idx));

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden group select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slides ── */}
      <div className="relative h-[200px] md:h-[320px] lg:h-[400px]">
        {safeBanners.map((b, i) => {
          const active = i === current;
          return (
            <Link
              key={i}
              href={b.link}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!active}
            >
              {/* Background image or gradient fallback */}
              <div className="absolute inset-0" style={{ background: b.bgGradient || "#000" }} />

              {!imgErrors.has(i) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={b.image?.asset?.url || (i === 0 ? "/banners/hero/milwaukee-hero.webp" : i === 1 ? "/banners/hero/dewalt-hero.webp" : "/banners/hero/bosch-hero.webp")}
                  alt={b.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                  onError={() => handleImgError(i)}
                />
              )}

              {/* Gradient overlay for text readability */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)",
                }}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-10 lg:px-14 max-w-2xl">
                {/* Tag pill */}
                {b.icon && (
                  <div className="mb-2 md:mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
                      {b.icon}
                      <span className="text-white/80 text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em]">
                        Promoción
                      </span>
                    </span>
                  </div>
                )}

                <h2 className="font-impact text-white text-2xl md:text-4xl lg:text-5xl leading-tight tracking-tight drop-shadow-lg">
                  {b.title}
                </h2>

                <p className="text-white/85 text-sm md:text-base lg:text-lg leading-relaxed mt-1.5 md:mt-2 max-w-lg">
                  {b.subtitle}
                </p>

                {/* CTA */}
                <div className="mt-3 md:mt-4">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-[#E35205] hover:bg-[#CC4400] text-white text-sm font-semibold shadow-lg shadow-[#E35205]/25 transition-all hover:scale-105">
                    {b.cta}
                    <CircleArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Arrows ── */}
      <button
        onClick={() => go("prev")}
        className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => go("next")}
        className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {safeBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Ir al banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}