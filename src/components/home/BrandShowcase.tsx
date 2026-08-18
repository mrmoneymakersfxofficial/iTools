"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

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

export function BrandShowcase({ brands }: { brands: any[] }) {
  const safeBrands = mergeBrands(brands || []);

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
    <section className="py-4 bg-[#F5F5F5] dark:bg-[#111111]" data-section="Comprar por Marca">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="h-5 w-5 text-[#1A1A1A] dark:text-white" />
          <h2 className="text-base font-bold text-[#1A1A1A] dark:text-white uppercase tracking-wide">
            Comprar por Marca
          </h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 md:gap-2">
          {brands.map((brand) => {
            const slug = brand.slug || brand.name.toLowerCase();
            const config = brand.localConfig || BRAND_CONFIGS[slug];
            const hasLocalImg = !!config;
            const fallbackExt = config ? config.logoExt : "webp";
            const imgSrc = hasLocalImg
              ? `/brands/${slug}.${fallbackExt}`
              : brand.logo?.asset?.url || null;
            const showImg = !!imgSrc;

            return (
              <Link
                key={brand._id || brand.slug}
                href={`/marca/${brand.slug || "#"}`}
                className="group flex items-center justify-center h-[88px] transition-opacity hover:opacity-80 rounded-md overflow-hidden"
                style={config ? { backgroundColor: config.bg } : undefined}
              >
                {showImg ? (
                  <img
                    src={imgSrc}
                    alt={brand.name}
                    className="w-full h-full object-contain p-2"
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
                    config ? "text-white" : "text-gray-800 dark:text-white"
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
