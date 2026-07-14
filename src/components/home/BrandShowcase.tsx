"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

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

export function BrandShowcase() {
  return (
    <section className="py-8 bg-[#F5F5F5]" data-section="Comprar por Marca">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <ShoppingBag className="h-5 w-5 text-[#1A1A1A]" />
          <h2 className="text-base font-bold text-[#1A1A1A] uppercase tracking-wide">
            Comprar por Marca
          </h2>
        </div>

        {/* No cards — just logos with rounded corners, tight grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marca/${brand.slug}`}
              className="group flex items-center justify-center h-[56px] transition-opacity hover:opacity-80"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-h-[52px] w-auto max-w-full object-contain rounded-lg"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}