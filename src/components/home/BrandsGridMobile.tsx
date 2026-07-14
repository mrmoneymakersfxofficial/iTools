"use client";
import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";

const brands = [
  { name: "Milwaukee",  slug: "milwaukee",  logo: "/brands/milwaukee.webp" },
  { name: "BOSCH",      slug: "bosch",      logo: "/brands/bosch.webp" },
  { name: "DEWALT",     slug: "dewalt",     logo: "/brands/dewalt.webp" },
  { name: "MAKITA",     slug: "makita",     logo: "/brands/makita.webp" },
  { name: "STANLEY",    slug: "stanley",    logo: "/brands/stanley.webp" },
  { name: "INGCO",      slug: "ingco",      logo: "/brands/ingco.webp" },
  { name: "TRUPER",     slug: "truper",     logo: "/brands/truper.webp" },
  { name: "TOTAL",      slug: "total",      logo: "/brands/total.webp" },
  { name: "TOPTUL",     slug: "toptul",     logo: "/brands/toptul.webp" },
  { name: "DONG CHENG", slug: "dong-cheng", logo: "/brands/dong-cheng.webp" },
  { name: "KAMASA",     slug: "kamasa",     logo: "/brands/kamasa.webp" },
  { name: "BAHCO",      slug: "bahco",      logo: "/brands/bahco.webp" },
  { name: "TRAMONTINA", slug: "tramontina", logo: "/brands/tramontina.webp" },
  { name: "WAGNER",     slug: "wagner",     logo: "/brands/wagner.webp" },
  { name: "SATA",       slug: "sata",       logo: "/brands/sata.webp" },
  { name: "EMTOP",      slug: "emtop",      logo: "/brands/emtop.webp" },
  { name: "DCA",        slug: "dca",        logo: "/brands/dca.webp" },
  { name: "KAILI",      slug: "kaili",      logo: "/brands/kaili.webp" },
];

export function BrandsGridMobile() {
  return (
    <section className="bg-[#F5F5F5] py-4 lg:hidden" data-section="Comprar por Marca">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#1A1A1A]" />
            <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">
              Comprar por Marca
            </h2>
          </div>
          <Link
            href="/marcas"
            className="flex items-center gap-0.5 text-[11px] text-[#E35205] font-semibold"
          >
            Ver todas
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Horizontal scroll — no cards, just logos */}
        <nav
          className="flex gap-1 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marca/${brand.slug}`}
              className="shrink-0 w-[120px] sm:w-[130px] flex items-center justify-center h-[60px] transition-opacity active:opacity-70"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-h-[56px] w-auto max-w-full object-contain rounded-lg"
                loading="lazy"
              />
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}