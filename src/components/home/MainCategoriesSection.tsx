import Link from "next/link";
import Image from "next/image";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

interface MainCategoriesSectionProps {
  categories?: any[];
  dealTiles?: any[];
}

const fallbackCombos = [
  { title: "Herramientas Eléctricas", price: "S/ 1039.90", href: "/categoria/herramientas-electricas" },
  { title: "Herramientas Inalámbricas", price: "S/ 500.00", href: "/categoria/herramientas-inalambricas" },
  { title: "Herramientas Manuales", price: "S/ 899.00", href: "/categoria/herramientas-manuales" },
  { title: "Herramientas Manuales", price: "S/ 1909.90", href: "/categoria/herramientas-manuales" },
  { title: "Accesorios de Herramientas", price: "S/ 899.00", href: "/categoria/accesorios" },
];

export function MainCategoriesSection({ categories, dealTiles }: MainCategoriesSectionProps) {
  // STRICTLY filter out deal-tile-duo-countdown so it NEVER appears in the 5 combo cards
  const nonCountdownTiles = (dealTiles || []).filter(
    (t: any) => t._id !== "deal-tile-duo-countdown" && t._id !== "drafts.deal-tile-duo-countdown"
  );

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
            const tileId = `deal-tile-duo-${idx}`;
            const tile = dealTiles?.find((t: any) => t._id === tileId) || nonCountdownTiles[idx - 1];
            const fb = fallbackCombos[idx - 1];
            const tileSanityAttr = getSanityAttr(tile?._id || tileId, "dealTile", "image");
            const imgUrl = tile?.image?.asset?.url || "/banners/sections/dongcheng-combo.webp";
            const price = tile?.promoPrice ? `S/ ${Number(tile.promoPrice).toFixed(2)}` : fb.price;
            const linkHref = tile?.href || fb.href;

            return (
              <Link
                key={tile?._id || tileId}
                href={linkHref}
                {...tileSanityAttr}
                className="group relative rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.01] bg-[#0047AB]"
              >
                <div className="relative w-full h-[220px] sm:h-[240px] lg:h-[260px]">
                  <img
                    src={imgUrl}
                    alt={tile?.title || fb.title}
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
