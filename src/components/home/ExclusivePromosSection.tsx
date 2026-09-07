"use client";

import Link from "next/link";
import Image from "next/image";

export function ExclusivePromosSection() {
  return (
    <section className="py-6 w-full" data-section="Promociones Exclusivas">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#E60000] font-black text-lg tracking-tighter">▶▶</span>
          <h2 className="text-base sm:text-lg font-black text-[#1A1A1A] dark:text-white uppercase tracking-wider">
            PROMOCIONES EXCLUSIVAS
          </h2>
        </div>

        {/* 2 Large 50/50 Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
          {/* Milwaukee Batería Gratis */}
          <Link
            href="/marca/milwaukee"
            className="group relative block w-full h-[180px] sm:h-[220px] md:h-[250px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.01]"
          >
            <img
              src="/banners/sections/milwaukee-bateria-gratis.webp"
              alt="Milwaukee Batería Gratis M12"
              className="w-full h-full object-cover"
            />
          </Link>

          {/* Makita Potencia tu Sistema */}
          <Link
            href="/marca/makita"
            className="group relative block w-full h-[180px] sm:h-[220px] md:h-[250px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.01]"
          >
            <img
              src="/banners/sections/makita-potencia-sistema.webp"
              alt="Makita Potencia tu Sistema Gratis"
              className="w-full h-full object-cover"
            />
          </Link>
        </div>

        {/* Full-width Hot Sale Empotrables Cocina Banner */}
        <Link
          href="/categoria/ferreteria-general"
          className="group relative block w-full h-[120px] sm:h-[150px] md:h-[175px] rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.005]"
        >
          <img
            src="/banners/sections/hotsale-cocina.webp"
            alt="Hot Sale Hasta 40% Empotrables de Cocina"
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
    </section>
  );
}
