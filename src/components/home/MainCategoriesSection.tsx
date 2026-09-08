import Link from "next/link";
import Image from "next/image";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

interface MainCategoriesSectionProps {
  categories?: any[];
  dealTiles?: any[];
}

export function MainCategoriesSection({ categories, dealTiles }: MainCategoriesSectionProps) {
  return (
    <section className="py-4 md:py-6" id="categorias-principales" data-section="Categorías Principales" data-sanity-doc="dealTile">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
        {/* Section Title */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#E60000] font-black text-lg tracking-tighter">▶▶</span>
          <h2 className="text-base sm:text-lg font-black text-[#1A1A1A] dark:text-white uppercase tracking-wider">
            CATEGORIAS PRINCIPALES
          </h2>
        </div>

        {/* 5 Cards Grid Matching Image 1 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((idx) => {
            const tile = dealTiles?.[idx - 1];
            const tileSanityAttr = getSanityAttr(tile?._id || `deal-tile-duo-${idx}`, "dealTile", "image");
            const imgUrl = tile?.image?.asset?.url || "/banners/sections/dongcheng-combo.webp";
            const price = tile?.promoPrice ? `S/ ${Number(tile.promoPrice).toFixed(2)}` : "S/ 899.00";
            const linkHref = tile?.href || "/marca/dongcheng";

            return (
              <Link
                key={tile?._id || idx}
                href={linkHref}
                {...tileSanityAttr}
                className="group relative rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.01] bg-[#0047AB]"
              >
                <div className="relative w-full h-[220px] sm:h-[240px] lg:h-[260px]">
                  <img
                    src={imgUrl}
                    alt={tile?.title || `Combo DongCheng ${idx}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#E60000] text-white font-black text-[10px] sm:text-[11px] px-2 py-0.5 rounded shadow">
                    {price}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
