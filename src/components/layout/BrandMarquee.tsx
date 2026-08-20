"use client";

import Link from "next/link";
import { BRAND_SHOWCASE_ORDER, BRAND_CONFIGS } from "@/lib/constants/brands";

const BRANDS = BRAND_SHOWCASE_ORDER.filter((slug) => BRAND_CONFIGS[slug]);

export function BrandMarquee() {
  return (
    <div className="w-full bg-[#0d0d0d] overflow-hidden border-b border-white/5" style={{ height: "56px" }}>
      <div className="flex h-full items-center animate-[marquee_50s_linear_infinite] hover:[animation-play-state:paused]">
        {[...BRANDS, ...BRANDS, ...BRANDS].map((slug, i) => {
          const config = BRAND_CONFIGS[slug];
          if (!config) return null;
          const displayName = slug
            .split("-")
            .map((w) => w[0].toUpperCase() + w.slice(1))
            .join(" ");

          return (
            <Link
              key={`${slug}-${i}`}
              href={`/marca/${slug}`}
              title={displayName}
              className="group/brand shrink-0 px-2 h-full flex items-center"
            >
              <div
                className="relative rounded-lg overflow-hidden transition-all duration-200 group-hover/brand:scale-105 group-hover/brand:shadow-lg group-hover/brand:shadow-black/40"
                style={{ width: "96px", height: "40px" }}
              >
                <img
                  src={`/brands/${slug}.webp`}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // fallback to SVG if webp missing
                    e.currentTarget.src = `/brands/${slug}.svg`;
                  }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

