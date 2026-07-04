"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

const brands = [
  { name: "Milwaukee", color: "#D1001C", textColor: "#FFF", slug: "milwaukee" },
  { name: "DeWalt", color: "#FFD700", textColor: "#1A1A1A", slug: "dewalt" },
  { name: "Bosch", color: "#005691", textColor: "#FFF", slug: "bosch" },
  { name: "Makita", color: "#0077C8", textColor: "#FFF", slug: "makita" },
  { name: "EGO", color: "#0d5c4a", textColor: "#FFF", slug: "herramientas-electricas" },
  { name: "Stanley", color: "#E35205", textColor: "#FFF", slug: "stanley" },
  { name: "3M", color: "#CC3300", textColor: "#FFF", slug: "3m" },
  { name: "Husky", color: "#333333", textColor: "#FFF", slug: "husky" },
];

export function BrandsGridMobile() {
  return (
    <section className="bg-[#F5F6F8] py-2.5 lg:hidden" data-section="Comprar por Marca">
      <div className="mx-auto max-w-7xl px-2.5 sm:px-4">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag className="h-4 w-4 text-[#E35205]" />
          <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">Comprar por Marca</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
          {brands.map((brand) => (
            <Link key={brand.name} href={`/categoria/herramientas-electricas`} className="acme-brand-btn text-center h-12 rounded text-xs font-bold uppercase tracking-wide transition-all hover:opacity-90 hover:-translate-y-0.5" style={{ backgroundColor: brand.color, color: brand.textColor }}>{brand.name}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}