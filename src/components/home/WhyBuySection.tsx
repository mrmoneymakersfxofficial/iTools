"use client";

import Link from "next/link";
import Image from "next/image";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

interface WhyBuySectionProps {
  banners?: any[];
}

export function WhyBuySection({ banners }: WhyBuySectionProps) {
  const bEquipos = banners?.find((b: any) => b._id === "promo-banner-why-equipos");
  const bDewalt = banners?.find((b: any) => b._id === "promo-banner-why-dewalt");
  const bMakita = banners?.find((b: any) => b._id === "promo-banner-why-makita");
  const bMetabo = banners?.find((b: any) => b._id === "promo-banner-why-metabo");

  const attrEquipos = getSanityAttr(bEquipos?._id || "promo-banner-why-equipos", "promoBanner", "image");
  const attrDewalt = getSanityAttr(bDewalt?._id || "promo-banner-why-dewalt", "promoBanner", "image");
  const attrMakita = getSanityAttr(bMakita?._id || "promo-banner-why-makita", "promoBanner", "image");
  const attrMetabo = getSanityAttr(bMetabo?._id || "promo-banner-why-metabo", "promoBanner", "image");

  return (
    <section
      id="por-que-comprar"
      className="py-6 w-full scroll-mt-20"
      data-section="¿Por Qué Comprar en iTools.pe?"
      data-sanity-doc="promoBanner"
    >
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
        {/* Title with left and right red arrows */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#E60000] font-black text-lg tracking-tighter">▶▶</span>
          <h2 className="text-base sm:text-lg font-black text-[#1A1A1A] dark:text-white uppercase tracking-wider">
            ¿POR QUÉ COMPRAR EN iTOOLS.PE?
          </h2>
          <span className="text-[#E60000] font-black text-lg tracking-tighter">◀◀</span>
        </div>

        {/* Top Landscape Machinery Banner */}
        <Link
          href={bEquipos?.link || "/categoria/equipos-especializados"}
          {...attrEquipos}
          className="group relative block w-full h-[120px] sm:h-[150px] md:h-[175px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.005] mb-3 sm:mb-4"
        >
          <img
            src={bEquipos?.image?.asset?.url || "/banners/sections/equipos-alta-calidad.webp"}
            alt={bEquipos?.title || "Descubra Equipos de Alta Calidad Compra Ahora"}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* 3 Banners Row (33% / 33% / 33%) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* DeWalt */}
          <Link
            href={bDewalt?.link || "/marca/dewalt"}
            {...attrDewalt}
            className="group relative block w-full h-[170px] sm:h-[200px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.01]"
          >
            <img
              src={bDewalt?.image?.asset?.url || "/banners/sections/dewalt-promo-33.webp"}
              alt={bDewalt?.title || "DeWalt Amplíe su tiempo de ejecución Dos baterías Gratis"}
              className="w-full h-full object-cover"
            />
          </Link>

          {/* Makita */}
          <Link
            href={bMakita?.link || "/marca/makita"}
            {...attrMakita}
            className="group relative block w-full h-[170px] sm:h-[200px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.01]"
          >
            <img
              src={bMakita?.image?.asset?.url || "/banners/sections/makita-promo-33.webp"}
              alt={bMakita?.title || "Makita Obtén una batería Gratis"}
              className="w-full h-full object-cover"
            />
          </Link>

          {/* Metabo HPT */}
          <Link
            href={bMetabo?.link || "/categoria/herramientas-inalambricas"}
            {...attrMetabo}
            className="group relative block w-full h-[170px] sm:h-[200px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.01]"
          >
            <img
              src={bMetabo?.image?.asset?.url || "/banners/sections/metabo-promo-33.webp"}
              alt={bMetabo?.title || "Metabo HPT Potencia tu sistema Batería Gratis"}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
