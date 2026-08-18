"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { BRAND_SHOWCASE_ORDER, BRAND_CONFIGS } from "@/lib/constants/brands";

const BRANDS = BRAND_SHOWCASE_ORDER.filter((slug) => BRAND_CONFIGS[slug]);

export function BrandMarquee() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative bg-itools-dark/95 border-b border-white/5">
      {/* Mobile toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="md:hidden flex items-center justify-center gap-2 w-full py-2 text-xs text-white/60 hover:text-white/90 transition-colors"
      >
        <span className="font-semibold uppercase tracking-widest">Marcas Oficiales</span>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Marquee bar — always visible on md+, conditionally visible on mobile */}
      <div
        className={`${
          expanded ? "max-h-20 opacity-100" : "max-h-0 opacity-0 md:max-h-20 md:opacity-100"
        } overflow-hidden transition-all duration-300 ease-in-out`}
      >
        {/* Gradient fades */}
        <div className="relative overflow-hidden">
          <div
            className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, #0d0d1a, transparent)" }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, #0d0d1a, transparent)" }}
          />

          {/* Scrolling track */}
          <div className="flex animate-[marquee_40s_linear_infinite]">
            {[...BRANDS, ...BRANDS].map((slug, i) => {
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
                  className="group/marquee flex items-center justify-center shrink-0 px-5 py-2.5 transition-colors hover:bg-white/5"
                >
                  <img
                    src={`/brands/${slug}.svg`}
                    alt={displayName}
                    className="h-5 w-auto object-contain opacity-60 group-hover/marquee:opacity-100 transition-opacity"
                    style={{ filter: "brightness(0) invert(1)" }}
                    onError={(e) => {
                      // Fallback: show brand name text
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".brand-fallback")) {
                        const span = document.createElement("span");
                        span.className = "brand-fallback text-[10px] font-bold uppercase tracking-wider text-white/70 group-hover/marquee:text-white transition-colors";
                        span.textContent = displayName;
                        parent.appendChild(span);
                      }
                    }}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
