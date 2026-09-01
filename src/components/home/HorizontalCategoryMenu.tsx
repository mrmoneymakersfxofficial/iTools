"use client";

import Link from "next/link";

const fallbackCategories = [
  { _id: "cat-1", name: "Taladros", slug: "taladros" },
  { _id: "cat-2", name: "Rotomartillos", slug: "rotomartillos" },
  { _id: "cat-3", name: "Atornilladores & Impacto", slug: "atornilladores" },
  { _id: "cat-4", name: "Sierras & Corte", slug: "sierras" },
  { _id: "cat-5", name: "Herramientas Eléctricas", slug: "herramientas-electricas" },
  { _id: "cat-6", name: "Herramientas Manuales", slug: "herramientas-manuales" },
  { _id: "cat-7", name: "Baterías & Cargadores", slug: "baterias-cargadores" },
  { _id: "cat-8", name: "Almacenamiento (Packout)", slug: "almacenamiento" },
  { _id: "cat-9", name: "Accesorios & Brocas", slug: "accesorios" },
  { _id: "cat-10", name: "Seguridad & EPP", slug: "seguridad-industrial" },
  { _id: "cat-11", name: "Medición", slug: "medicion" },
];

export function HorizontalCategoryMenu({ categories }: { categories: any[] }) {
  const filtered = (categories || []).filter(c => c && c.name && c.slug);
  const safeCategories = filtered.length > 0 ? filtered : fallbackCategories;

  return (
    <nav
      className="overflow-x-auto bg-white dark:bg-[#111111] border-b border-[#E0E0E0] dark:border-[#333]"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="flex items-center whitespace-nowrap px-3 py-2.5 gap-0">
        {safeCategories.map((item, i) => (
          <span key={item._id} className="flex items-center shrink-0">
            {i > 0 && (
              <span className="text-[#D0D0D0] mx-2 select-none" aria-hidden="true">|</span>
            )}
            <Link
              href={`/categoria/${item.slug}`}
              className="text-[11px] font-semibold text-[#333] dark:text-gray-200 hover:text-[#E35205] uppercase tracking-[0.04em] transition-colors"
            >
              {item.name}
            </Link>
          </span>
        ))}
      </div>
    </nav>
  );
}