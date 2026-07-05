"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

const brands = [
  { name: "Milwaukee", color: "#D1001C", textColor: "#FFF", slug: "milwaukee", fontStyle: "italic" },
  { name: "BOSCH", color: "#005691", textColor: "#FFF", slug: "bosch" },
  { name: "HONDA", color: "#CC0000", textColor: "#FFF", slug: "honda" },
  { name: "KLEIN TOOLS", color: "#FFC220", textColor: "#1A1A1A", slug: "klein-tools" },
  { name: "TORO", color: "#1A1A1A", textColor: "#CC0000", slug: "toro" },
  { name: "DEWALT", color: "#FFD700", textColor: "#1A1A1A", slug: "dewalt" },
  { name: "EGO", color: "#0d5c4a", textColor: "#FFF", slug: "ego" },
  { name: "MAKITA", color: "#0077C8", textColor: "#FFF", slug: "makita" },
  { name: "metabo HPT", color: "#1b7a3a", textColor: "#FFF", slug: "metabo-hpt" },
  { name: "FLEX", color: "#1A1A1A", textColor: "#FFF", slug: "flex" },
  { name: "STIHL", color: "#E35205", textColor: "#FFF", slug: "stihl" },
  { name: "FEIN", color: "#666666", textColor: "#FFF", slug: "fein" },
  { name: "STANLEY", color: "#E35205", textColor: "#FFF", slug: "stanley" },
  { name: "3M", color: "#CC3300", textColor: "#FFF", slug: "3m" },
  { name: "SKIL", color: "#CC0000", textColor: "#FFF", slug: "skil" },
  { name: "FESTOOL", color: "#1A1A1A", textColor: "#00A651", slug: "festool" },
  { name: "JET", color: "#CC0000", textColor: "#FFF", slug: "jet" },
  { name: "KNAACK", color: "#8B6914", textColor: "#FFF", slug: "knaack" },
];

export function BrandsGridMobile() {
  return (
    <section className="bg-[#F5F6F8] py-2.5 lg:hidden" data-section="Comprar por Marca">
      <div className="mx-auto max-w-7xl px-2.5 sm:px-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag className="h-4 w-4 text-[#E35205]" />
          <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">
            Comprar por Marca
          </h2>
        </div>

        {/* Colored brand buttons grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marca/${brand.slug}`}
              className="acme-brand-btn text-center h-12 rounded-lg text-xs font-bold uppercase tracking-wide transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
              style={{
                backgroundColor: brand.color,
                color: brand.textColor,
                fontStyle: brand.fontStyle || "normal",
              }}
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}