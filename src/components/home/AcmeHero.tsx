"use client";

import Link from "next/link";
import { CircleArrowRight, Sparkles } from "lucide-react";

/**
 * Acme-style large center hero banner.
 * Dark navy background with gradient overlay, promo logo, title, subtitle, CTA.
 */
export function AcmeHero() {
  return (
    <section
      className="w-full relative overflow-hidden"
      data-section="Oferta Especial"
      aria-label="Banner promocional"
    >
      {/* Banner container — matches Acme's enhanced-banner-large */}
      <div className="enhanced-banner-large relative w-full" style={{ minHeight: "320px" }}>
        {/* Background: dark navy gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0A2A44 0%, #0d3355 30%, #143d5e 60%, #1a4a6e 100%)",
          }}
        />

        {/* Decorative subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 11px)",
          }}
        />

        {/* Accent glow bottom-left */}
        <div
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #E35205 0%, transparent 70%)" }}
        />

        {/* Accent glow top-right */}
        <div
          className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #E35205 0%, transparent 70%)" }}
        />

        {/* Content overlay */}
        <div className="enhanced-banner-large-overlay relative z-10 flex flex-col items-center justify-center text-center px-6 py-12 sm:py-16 md:py-20 lg:py-24">
          {/* Promo logo/icon area */}
          <div className="mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-white/80 text-xs sm:text-sm font-semibold uppercase tracking-[0.15em]">
                Ofertas de Julio
              </span>
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>
          </div>

          {/* Title */}
          <p className="enhanced-banner-large-title text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-impact leading-tight mb-3 sm:mb-4">
            4 d&iacute;as para ahorrar
          </p>

          {/* Subtitle */}
          <p className="enhanced-banner-subtitle text-white/80 text-sm sm:text-base md:text-lg max-w-xl mb-6 sm:mb-8 leading-relaxed">
            Obt&eacute;n{" "}
            <strong className="text-white font-semibold">un 10% de descuento</strong>{" "}
            en herramientas seleccionadas
            <br className="hidden sm:block" /> con el c&oacute;digo:{" "}
            <strong className="text-amber-300 font-bold text-base sm:text-lg tracking-wider">
              4JULY
            </strong>
          </p>

          {/* CTA Button */}
          <Link
            href="/categoria/herramientas-electricas"
            className="enhanced-banner-button group inline-flex items-center gap-2.5 bg-[#E35205] hover:bg-[#CC4400] text-white px-7 sm:px-9 py-3 sm:py-3.5 rounded text-sm sm:text-base font-semibold transition-all duration-200 shadow-lg shadow-[#E35205]/25 hover:shadow-xl hover:shadow-[#E35205]/30 hover:-translate-y-0.5"
          >
            Compra ahora
            <CircleArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}