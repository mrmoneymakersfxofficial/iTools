"use client";

import Link from "next/link";
import { CircleArrowRight, MessageSquare, Trophy } from "lucide-react";

/**
 * Full-width Acme-style giveaway/sweepstakes banner.
 * Dark background with brand logo, text, image placeholder, and CTA.
 * Matches Crescent/Railworks full-width banner pattern.
 */
export function FullWidthBanner() {
  return (
    <section
      className="w-full relative overflow-hidden"
      data-section="Sorteo Especial"
      aria-label="Banner de sorteo"
    >
      <div className="crescent-full-width relative w-full">
        {/* Dark background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0A2A44 0%, #0d3355 40%, #143d5e 100%)",
          }}
        />

        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(255,255,255,.1) 20px, rgba(255,255,255,.1) 21px)",
          }}
        />

        {/* Ambient glow */}
        <div
          className="absolute bottom-0 left-1/4 w-[500px] h-[300px] rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #E35205 0%, transparent 70%)" }}
        />

        {/* Content */}
        <div className="crescent-full-width-railworks-overlay relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Logo + Text */}
            <div className="lg:col-span-5">
              {/* Logo container */}
              <div className="crescent-full-width-railworks-logo-container mb-5 sm:mb-6">
                <div className="inline-flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-amber-400" />
                  <span
                    className="text-white font-impact text-2xl sm:text-3xl tracking-wider"
                    style={{ fontFamily: "'Impact', 'Arial Narrow Bold', sans-serif" }}
                  >
                    iTools PER&Uacute;
                  </span>
                </div>
              </div>

              {/* Text box 1 */}
              <div className="crescent-full-width-railworks-text-box-one mb-6 sm:mb-8">
                <p className="text-white/70 text-sm sm:text-base mb-1">
                  Participa para ganar un
                </p>
                <p className="text-white font-impact text-xl sm:text-2xl md:text-3xl leading-tight mb-5 sm:mb-6">
                  Kit de Herramientas Milwaukee GRATIS
                </p>
                <Link
                  href="#"
                  className="enhanced-banner-button crescent-full-width-railworks-banner-button group inline-flex items-center gap-2.5 bg-[#E35205] hover:bg-[#CC4400] text-white px-7 py-3 rounded text-sm sm:text-base font-semibold transition-all duration-200 shadow-lg shadow-[#E35205]/25 hover:shadow-xl hover:shadow-[#E35205]/30 hover:-translate-y-0.5"
                >
                  Ver detalles
                  <CircleArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Center: Cart/product image placeholder */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="crescent-full-width-railworks-cart-container relative">
                <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl sm:text-6xl mb-2">&#128736;</div>
                    <p className="text-white/50 text-xs">Kit M18 FUEL&#8482;</p>
                  </div>
                </div>
                {/* Glow behind image */}
                <div className="absolute inset-0 -z-10 bg-amber-500/10 rounded-full blur-3xl scale-110" />
              </div>
            </div>

            {/* Right: SMS CTA */}
            <div className="lg:col-span-3">
              <div className="crescent-full-width-railworks-text-box-two bg-white/10 backdrop-blur-sm rounded-xl border border-white/15 p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-3">
                  <MessageSquare className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-white/70 text-sm leading-relaxed">
                    Env&iacute;a un mensaje de texto con la palabra{" "}
                    <span className="text-white font-bold">&quot;GANA&quot;</span>
                    <br />
                    al <span className="text-white font-bold">86657</span>.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-white/40 text-[11px] leading-relaxed">
                    Sorteo v&aacute;lido hasta el 31 de julio de 2026. Aplican restricciones.
                    Consulta t&eacute;rminos y condiciones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}