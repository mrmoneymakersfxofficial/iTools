import Link from "next/link";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

interface MainCategoriesSectionProps {
  categories?: any[];
  dealTiles?: any[];
  homeSettings?: any;
  title?: string;
}

const fallbackCombos = [
  { title: "Herramientas Eléctricas", price: "S/ 399.90", href: "/categoria/herramientas-electricas" },
  { title: "Herramientas Inalámbricas", price: "S/ 699.90", href: "/categoria/herramientas-inalambricas" },
  { title: "Herramientas Manuales", price: "S/ 999.90", href: "/categoria/herramientas-manuales" },
  { title: "Equipos Especializados", price: "S/ 999.90", href: "/categoria/equipos-especializados" },
];

export function MainCategoriesSection({ dealTiles, homeSettings, title }: MainCategoriesSectionProps) {
  // Excluir estrictamente deal-tile-duo-countdown para que nunca aparezca en las 4 tarjetas principales
  const nonCountdownTiles = (dealTiles || []).filter(
    (t: any) => t._id !== "deal-tile-duo-countdown" && t._id !== "drafts.deal-tile-duo-countdown"
  );

  const sectionTitle = title || homeSettings?.mainCategoriesTitle || "PROMOS EXPRESS";

  return (
    <section
      className="py-4 md:py-6"
      id="categorias-principales"
      data-section="Categorías Principales"
      data-sanity-doc="dealTile"
    >
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
        {/* Section Title — 100% editable desde Sanity CMS */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#E60000] font-black text-lg tracking-tighter">▶▶</span>
          <h2
            {...getSanityAttr("homeSettings", "homeSettings", "mainCategoriesTitle")}
            className="text-base sm:text-lg font-black text-[#1A1A1A] dark:text-white uppercase tracking-wider cursor-pointer hover:text-[#E60000] transition-colors"
          >
            {sectionTitle}
          </h2>
        </div>

        {/* 4 Cards Grid — Exactamente 4 tarjetas en Web y 4 en Móvil (2x2 sin espacios vacíos) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((idx) => {
            const tileId = `deal-tile-duo-${idx}`;
            const tile = dealTiles?.find((t: any) => t._id === tileId) || nonCountdownTiles[idx - 1];
            const fb = fallbackCombos[idx - 1];
            const tileSanityAttr = getSanityAttr(tile?._id || tileId, "dealTile", "image");
            const imgUrl = tile?.image?.asset?.url || "/banners/sections/dongcheng-combo.webp";
            const mobImgUrl = tile?.imageMobile?.asset?.url;
            const linkHref = tile?.href || fb.href;

            return (
              <Link
                key={tile?._id || tileId}
                href={linkHref}
                {...tileSanityAttr}
                className="group relative rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.01] bg-[#0047AB]"
              >
                <div className="relative w-full aspect-square sm:aspect-[600/520]">
                  <picture className="w-full h-full block">
                    {mobImgUrl && <source media="(max-width: 640px)" srcSet={mobImgUrl} />}
                    <img
                      src={imgUrl}
                      alt={tile?.title || fb.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </picture>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
