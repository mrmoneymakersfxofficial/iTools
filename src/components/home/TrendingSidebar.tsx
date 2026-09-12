"use client";

import Link from "next/link";
import { TrendingUp, Eye } from "lucide-react";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

const fallbackCategories = [
  { _id: "tc-taladros", name: "Taladros", slug: "taladros", viewCount: "18.5K", imageUrl: "/products/dewalt-drill.webp" },
  { _id: "tc-atornilladores", name: "Impactos y Atornilladores", slug: "atornilladores", viewCount: "17.2K", imageUrl: "/products/bosch-flexiclick.webp" },
  { _id: "tc-manuales", name: "Herramientas Manuales", slug: "herramientas-manuales", viewCount: "15.0K", imageUrl: "/products/electrical-kit.webp" },
  { _id: "tc-sierras", name: "Sierras", slug: "sierras", viewCount: "12.0K", imageUrl: "/products/makita-grinder.webp" },
  { _id: "tc-combos", name: "Kits Combinados", slug: "combos", viewCount: "10.5K", imageUrl: "/products/dongcheng-combo.webp" },
  { _id: "tc-milwaukee-m18", name: "Milwaukee M18", slug: "milwaukee-m18", viewCount: "9.8K", imageUrl: "/products/milwaukee-m18.webp" },
  { _id: "tc-milwaukee-m12", name: "Milwaukee M12", slug: "milwaukee-m12", viewCount: "8.2K", imageUrl: "/products/milwaukee-m18.webp" },
  { _id: "tc-baterias", name: "Baterías y Cargadores", slug: "baterias-cargadores", viewCount: "7.9K", imageUrl: "/products/paint-sprayer.webp" },
  { _id: "tc-rotomartillos", name: "Rotomartillos", slug: "rotomartillos", viewCount: "6.7K", imageUrl: "/products/dewalt-drill.webp" },
  { _id: "tc-esmeriladoras", name: "Esmeriladoras", slug: "esmeriladoras", viewCount: "6.5K", imageUrl: "/products/makita-grinder.webp" },
  { _id: "tc-proteccion", name: "Equipos de Protección", slug: "equipos-proteccion", viewCount: "6.2K", imageUrl: "/products/electrical-kit.webp" },
  { _id: "tc-almacenamiento", name: "Almacenamiento", slug: "almacenamiento", viewCount: "6.0K", imageUrl: "/products/ingco-combo.webp" },
];

function getCategoryThumbnail(cat: any): string {
  if (cat.image?.asset?.url) return cat.image.asset.url;
  if (cat.imageUrl) return cat.imageUrl;
  const slug = (cat.slug || cat.name || "").toLowerCase();
  if (slug.includes("taladro") || slug.includes("rotomartillo")) return "/products/dewalt-drill.webp";
  if (slug.includes("impact") || slug.includes("atornilla")) return "/products/bosch-flexiclick.webp";
  if (slug.includes("sierra") || slug.includes("esmeril")) return "/products/makita-grinder.webp";
  if (slug.includes("combo") || slug.includes("kit")) return "/products/dongcheng-combo.webp";
  if (slug.includes("milwaukee") || slug.includes("m18") || slug.includes("m12")) return "/products/milwaukee-m18.webp";
  if (slug.includes("bater")) return "/products/paint-sprayer.webp";
  if (slug.includes("manual") || slug.includes("protec")) return "/products/electrical-kit.webp";
  return "/products/ingco-combo.webp";
}

export function TrendingSidebar({ categories }: { categories: any[] }) {
  const safeCategories = (categories && categories.length > 0) ? categories : fallbackCategories;

  return (
    <aside
      className="bg-white dark:bg-[#151515] border border-[#E0E0E0] dark:border-[#262626] rounded-xl overflow-hidden shadow-sm"
      data-section="Categorías de Tendencia"
      data-sanity-doc="trendingCategory"
    >
      {/* Header matching Image 3 */}
      <div className="bg-[#F5F6F8] dark:bg-[#1C1C1C] px-4 py-3 border-b border-[#E0E0E0] dark:border-[#262626]">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#00A651] shrink-0" />
          <h2 className="text-xs sm:text-sm font-black text-[#1A1A1A] dark:text-white uppercase tracking-wider">
            TRENDING CATEGORIES
          </h2>
        </div>
      </div>

      {/* Categories List matching Image 3 */}
      <ul className="divide-y divide-[#F0F0F0] dark:divide-[#222]">
        {safeCategories.map((cat) => {
          const sanityAttr = getSanityAttr(cat._id, "trendingCategory", "name");
          const thumbUrl = getCategoryThumbnail(cat);

          return (
            <li key={cat._id}>
              <Link
                href={`/categoria/${cat.slug}`}
                {...sanityAttr}
                className="flex items-center justify-between px-3.5 py-2.5 hover:bg-[#F8F9FA] dark:hover:bg-[#1F1F1F] transition-colors group"
              >
                {/* Left: Thumbnail Image (Sin fondo plomo) */}
                <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md bg-transparent p-0.5 overflow-hidden">
                  <img
                    src={thumbUrl}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/products/dewalt-drill.webp";
                    }}
                  />
                </div>

                {/* Center: Category Name */}
                <span className="text-xs sm:text-[13px] font-semibold text-[#222] dark:text-gray-200 group-hover:text-[#E35205] transition-colors truncate flex-1 min-w-0 mx-3">
                  {cat.name}
                </span>

                {/* Right: Blue Eye Icon + Blue View Count (matching Image 3) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Eye className="h-3.5 w-3.5 text-[#0080FF]" />
                  <span className="text-xs font-bold text-[#0080FF] tabular-nums">
                    {cat.viewCount || "10.5K"}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}