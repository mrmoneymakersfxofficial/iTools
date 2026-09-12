"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

import { BRAND_SHOWCASE_ORDER, BRAND_CONFIGS, VALID_LOCAL_BRANDS } from "@/lib/constants/brands";

interface SanityBrand {
  _id: string;
  name: string;
  slug: string;
  showInGrid?: boolean;
  logo?: { asset?: { url?: string } };
  order?: number;
  isActive?: boolean;
}

function getDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Merge Sanity CMS data with local brand configs.
 * - Local images are PRIMARY (they have exact brand colors)
 * - Sanity data provides ordering, names, and logos for brands NOT in local set
 */
function mergeBrands(sanityBrands: SanityBrand[]): Array<SanityBrand & { localConfig?: typeof BRAND_CONFIGS[string] }> {
  const sanityBySlug = new Map<string, SanityBrand>();
  for (const b of sanityBrands) {
    if (b.slug) sanityBySlug.set(b.slug, b);
  }

  const merged: Array<SanityBrand & { localConfig?: typeof BRAND_CONFIGS[string] }> = [];

  for (const slug of BRAND_SHOWCASE_ORDER) {
    const config = BRAND_CONFIGS[slug];
    const sanityData = sanityBySlug.get(slug);

    merged.push({
      _id: sanityData?._id || `brand-${slug}`,
      name: sanityData?.name || getDisplayName(slug),
      slug,
      showInGrid: sanityData?.showInGrid ?? true,
      logo: sanityData?.logo,
      order: sanityData?.order ?? merged.length,
      isActive: sanityData?.isActive ?? true,
      localConfig: config,
    });
  }

  for (const b of sanityBrands) {
    if (b.slug && !VALID_LOCAL_BRANDS.includes(b.slug) && b.isActive !== false) {
      merged.push({
        ...b,
        localConfig: undefined,
      });
    }
  }

  const hasSanityOrder = sanityBrands.some((b) => typeof b.order === "number");
  if (hasSanityOrder) {
    merged.sort((a, b) => {
      const aLocal = a.localConfig ? 0 : 1;
      const bLocal = b.localConfig ? 0 : 1;
      if (aLocal !== bLocal) return aLocal - bLocal;
      return (a.order ?? 999) - (b.order ?? 999);
    });
  }

  return merged.filter((b) => b.isActive !== false);
}

export function BrandShowcase({ brands }: { brands: any }) {
  const rawList = Array.isArray(brands) ? brands : (brands?.brands && Array.isArray(brands.brands) ? brands.brands : []);
  const safeBrands = mergeBrands(rawList);

  if (safeBrands.length === 0) {
    const fallback = BRAND_SHOWCASE_ORDER.map((slug) => ({
      _id: `brand-${slug}`,
      name: getDisplayName(slug),
      slug,
      localConfig: BRAND_CONFIGS[slug],
    }));
    if (fallback.length === 0) return null;
    return renderGrid(fallback);
  }

  return renderGrid(safeBrands);
}

function renderGrid(brands: Array<{ _id: string; name: string; slug: string; localConfig?: typeof BRAND_CONFIGS[string]; logo?: { asset?: { url?: string } } }>) {
  return (
    <section className="py-6 bg-[#F8F9FA] dark:bg-[#111111]" id="las-mejores-marcas" data-section="Las Mejores Marcas" data-sanity-doc="brandShowcaseSettings">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
        {/* Section Header matching Image 2 */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[#E60000] font-black text-lg tracking-tighter">▶▶</span>
            <h2 className="text-base sm:text-lg font-black text-[#1A1A1A] dark:text-white uppercase tracking-wider">
              LAS MEJORES MARCAS PARA TU TRABAJO
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Todo lo que necesitas para equipar tu taller con confianza.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 md:gap-2">
          {brands.map((brand) => {
            const rawSlug = brand.slug || brand.name?.toLowerCase() || "";
            const slug = typeof rawSlug === "string" ? rawSlug : (rawSlug.current || "");
            const config = brand.localConfig || BRAND_CONFIGS[slug];
            const hasCustomLogo = !!brand.logo?.asset?.url;
            const hasLocalImg = !hasCustomLogo && !!config;
            const fallbackExt = config ? config.logoExt : "webp";
            const imgSrc = hasCustomLogo
              ? brand.logo!.asset!.url
              : (hasLocalImg ? `/brands/${slug}.${fallbackExt}` : null);
            const showImg = !!imgSrc;

            const brandSanityAttr = getSanityAttr(brand._id || "brandShowcaseSettings", "brandShowcaseItem", "logo");

            return (
              <Link
                key={brand._id || slug}
                href={`/marca/${slug || "#"}`}
                {...brandSanityAttr}
                className="group flex items-center justify-center h-[76px] sm:h-[84px] transition-all duration-200 hover:scale-[1.02] hover:shadow-md rounded-lg overflow-hidden"
                style={config ? { backgroundColor: config.bg } : undefined}
              >
                {showImg ? (
                  <img
                    src={imgSrc}
                    alt={brand.name}
                    className="w-full h-full object-cover p-0"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const next = e.currentTarget.nextElementSibling as HTMLElement;
                      if (next) next.style.display = "block";
                    }}
                  />
                ) : null}
                <span
                  className={`text-sm font-bold ${
                    config && !hasCustomLogo ? "text-white" : "text-gray-800 dark:text-white"
                  } ${showImg ? "hidden" : "block"}`}
                >
                  {brand.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
