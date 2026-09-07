"use client";

import Link from "next/link";
import Image from "next/image";

export function SataFavoritesBanner() {
  return (
    <section className="py-4 md:py-6 w-full" data-section="Favoritos de los Profesionales">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#E60000] font-black text-lg tracking-tighter">▶▶</span>
          <h2 className="text-base sm:text-lg font-black text-[#1A1A1A] dark:text-white uppercase tracking-wider">
            FAVORITOS DE LOS PROFESIONALES
          </h2>
        </div>

        {/* SATA 380 piezas Panoramic Banner */}
        <Link
          href="/marca/sata"
          className="group relative block w-full h-[120px] sm:h-[150px] md:h-[180px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.005]"
        >
          <img
            src="/banners/sections/sata-380-piezas.webp"
            alt="SATA 380 piezas Listo para la chamba Carro de herramientas"
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
    </section>
  );
}
