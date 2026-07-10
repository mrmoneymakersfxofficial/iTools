"use client";

import Link from "next/link";
import { CircleArrowRight } from "lucide-react";

/**
 * Two side-by-side Acme-style small banners:
 * Left = EGO brand (teal/green), Right = Firecracker Clearance (orange/red)
 */
export function SmallBanners() {
  return (
    <section className="w-full" data-section="Ofertas de Marca" aria-label="Promociones de marca">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* ── LEFT: EGO Banner ── */}
          <div className="enhanced-banner-small egohp2jul3-banner relative overflow-hidden rounded-lg" style={{ minHeight: "200px" }}>
            {/* Background */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, #0a4a3a 0%, #0d5c4a 40%, #11735a 100%)",
              }}
            />
            {/* Decorative circles */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
            <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-white/5" />

            {/* Overlay content */}
            <div className="enhanced-banner-small-overlay egohp2jul3-banner-overlay relative z-10 flex flex-col justify-end h-full p-5 sm:p-6 md:p-8" style={{ minHeight: "200px" }}>
              {/* Brand logo area */}
              <div className="mb-3 sm:mb-4">
                <span
                  className="inline-block text-white font-impact text-xl sm:text-2xl md:text-3xl tracking-wider opacity-90"
                  style={{ fontFamily: "'Impact', 'Arial Narrow Bold', sans-serif" }}
                >
                  EGO
                </span>
              </div>

              <div className="enhanced-banner-small-overlay-text">
                <p className="enhanced-banner-small-title egohp2jul3-banner-title text-white font-impact text-lg sm:text-xl md:text-2xl leading-tight mb-1.5 sm:mb-2">
                  Compra m&aacute;s, por menos
                </p>
                <p className="enhanced-banner-subtitle egohp2jul3-banner-subtitle text-white/75 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">
                  Obt&eacute;n{" "}
                  <strong className="text-white">entre S/ 200 y S/ 400 de descuento</strong>{" "}
                  en pedidos seleccionados
                  <br /> de EGO de S/ 1,200 o m&aacute;s.
                </p>
                <Link
                  href="/categoria/herramientas-electricas"
                  className="enhanced-banner-button egohp2jul3-banner-button group inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-5 py-2.5 rounded text-sm font-semibold transition-all duration-200 border border-white/20"
                >
                  Compra ahora
                  <CircleArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Firecracker Clearance Banner ── */}
          <div className="enhanced-banner-small firecrackerhp3jul1-banner relative overflow-hidden rounded-lg" style={{ minHeight: "200px" }}>
            {/* Background */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, #8B1A00 0%, #A52000 30%, #CC3300 70%, #E35205 100%)",
              }}
            />
            {/* Decorative elements */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />

            {/* Overlay content */}
            <div className="enhanced-banner-small-overlay firecrackerhp3jul3-banner-overlay relative z-10 flex flex-col justify-end h-full p-5 sm:p-6 md:p-8" style={{ minHeight: "200px" }}>
              {/* Brand logo area */}
              <div className="mb-3 sm:mb-4">
                <span
                  className="inline-flex items-center gap-2 text-white font-impact text-xl sm:text-2xl md:text-3xl tracking-wider opacity-90"
                  style={{ fontFamily: "'Impact', 'Arial Narrow Bold', sans-serif" }}
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2z" />
                  </svg>
                  LIQUIDACI&Oacute;N
                </span>
              </div>

              <div className="enhanced-banner-small-overlay-text">
                <p className="enhanced-banner-small-title firecrackerhp3jul1-banner-title text-white font-impact text-lg sm:text-xl md:text-2xl leading-tight mb-1.5 sm:mb-2">
                  20% de descuento adicional
                </p>
                <p className="enhanced-banner-subtitle firecrackerhp3jul1-banner-subtitle text-white/80 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">
                  Seleccione las herramientas con el c&oacute;digo:{" "}
                  <strong className="text-amber-300 font-bold text-sm sm:text-base tracking-wider">
                    EXTRA20
                  </strong>
                </p>
                <Link
                  href="/categoria/herramientas-electricas"
                  className="enhanced-banner-button firecrackerhp3jul1-banner-button group inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-5 py-2.5 rounded text-sm font-semibold transition-all duration-200 border border-white/20"
                >
                  Compra ahora
                  <CircleArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}