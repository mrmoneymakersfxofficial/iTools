"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VALID_LOCAL_BRANDS = ['bahco', 'bosch', 'dca', 'dewalt', 'dong-cheng', 'emtop', 'ingco', 'kaili', 'kamasa', 'makita', 'milwaukee', 'sata', 'stanley', 'toptul', 'total', 'tramontina', 'truper', 'wagner'];

const fallbackBanners = [
  { _id: "bb1", brandSlug: "milwaukee", brandName: "Milwaukee", image: { asset: { url: "/banners/brands/milwaukee.webp" } } },
  { _id: "bb2", brandSlug: "dewalt", brandName: "DeWalt", image: { asset: { url: "/banners/brands/dewalt.webp" } } },
  { _id: "bb3", brandSlug: "bosch", brandName: "Bosch", image: { asset: { url: "/banners/brands/bosch.webp" } } },
  { _id: "bb4", brandSlug: "makita", brandName: "Makita", image: { asset: { url: "/banners/brands/makita.webp" } } },
  { _id: "bb5", brandSlug: "stanley", brandName: "Stanley", image: { asset: { url: "/banners/brands/stanley.webp" } } }
];

export function BrandBannersCarousel({ banners }: { banners: any[] }) {
  const safeBanners = (banners && banners.length > 0) ? banners : fallbackBanners;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = safeBanners.length;

  const next = useCallback(() => setCurrent((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    if (isPaused || total === 0) return;
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [next, isPaused, total]);

  if (total === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <div className="relative w-full" style={{ aspectRatio: "1920 / 320" }}>
        {safeBanners.map((banner, idx) => (
          <a
            key={banner._id}
            href={`/marca/${banner.brandSlug}`}
            className="absolute inset-0 transition-opacity duration-500 ease-in-out"
            style={{ opacity: idx === current ? 1 : 0, pointerEvents: idx === current ? "auto" : "none" }}
          >
            {(banner.image?.asset?.url || VALID_LOCAL_BRANDS.includes(banner.brandSlug || banner.brandName.toLowerCase())) && (
              <img
                src={banner.image?.asset?.url || `/banners/brands/${banner.brandSlug || banner.brandName.toLowerCase()}.webp`}
                alt={`Promoción ${banner.brandName}`}
                className="w-full h-full object-cover"
                loading={idx === 0 ? "eager" : "lazy"}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
          </a>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {safeBanners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`rounded-full transition-all ${
              idx === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Ir a banner ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}