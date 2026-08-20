"use client";

import Link from "next/link";
import Image from "next/image";
import { BRAND_SHOWCASE_ORDER, BRAND_CONFIGS } from "@/lib/constants/brands";

const BRANDS = BRAND_SHOWCASE_ORDER.filter((slug) => BRAND_CONFIGS[slug]);

export function BrandMarquee() {
  return (
    <div className="w-full bg-[#111] overflow-hidden" style={{ height: "52px" }}>
      <div className="flex h-full animate-[marquee_50s_linear_infinite] hover:[animation-play-state:paused]">
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
              className="group/brand flex items-center justify-center shrink-0 px-3 h-full transition-all duration-200 hover:scale-105"
            >
              <div
                className="flex items-center justify-center rounded-md overflow-hidden transition-all duration-200 group-hover/brand:shadow-lg"
                style={{
                  backgroundColor: config.bg,
                  width: "88px",
                  height: "36px",
                  padding: "4px 8px",
                }}
              >
                <Image
                  src={`/brands/${slug}.svg`}
                  alt={displayName}
                  width={72}
                  height={28}
                  className="object-contain w-full h-full"
                  style={{ filter: "brightness(0) invert(1)" }}
                  onError={() => {}}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

