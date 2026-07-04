"use client";

import Link from "next/link";
import { CircleArrowRight } from "lucide-react";

/**
 * Center column: Two small promo banners.
 * Mobile: 2 columns side-by-side, taller vertical cards.
 * Desktop: 2 columns side-by-side (sm:grid-cols-2).
 * Each is a full clickable link.
 */
export function CenterSmallBanners() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {/* EGO Banner */}
      <Link
        href="/categoria/herramientas-electricas"
        className="enhanced-banner-small egohp2jul3-banner block relative overflow-hidden rounded-lg"
      >
        {/* Background */}
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: "linear-gradient(135deg, #0a4a3a 0%, #0d5c4a 40%, #11735a 100%)",
          }}
        />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />

        {/* Content — tall vertical card on mobile */}
        <div className="enhanced-banner-small-overlay egohp2jul3-banner-overlay relative z-10 flex flex-col justify-end h-full p-3 sm:p-5" style={{ minHeight: "220px" }}>
          <span className="font-impact text-white text-xl sm:text-xl tracking-wider opacity-90 mb-2 sm:mb-3">
            EGO
          </span>
          <div className="enhanced-banner-small-overlay-text">
            <p className="enhanced-banner-small-title font-impact text-white text-sm sm:text-base leading-tight mb-1">
              Compra m&aacute;s, por menos
            </p>
            <p className="enhanced-banner-subtitle text-white/70 text-[10px] sm:text-xs leading-relaxed mb-2.5 line-clamp-3">
              Obt&eacute;n{" "}
              <strong className="text-white">entre S/ 200 y S/ 400 de descuento</strong>{" "}
              en pedidos de EGO de S/ 1,200 o m&aacute;s.
            </p>
            <span className="enhanced-banner-button inline-flex items-center gap-1.5 bg-white/15 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-[11px] sm:text-xs font-semibold border border-white/20">
              Compra ahora
              <CircleArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>

      {/* Firecracker Banner */}
      <Link
        href="/categoria/herramientas-electricas"
        className="enhanced-banner-small firecrackerhp3jul1-banner block relative overflow-hidden rounded-lg"
      >
        {/* Background */}
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: "linear-gradient(135deg, #8B1A00 0%, #A52000 30%, #CC3300 70%, #E35205 100%)",
          }}
        />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl" />

        {/* Content — tall vertical card on mobile */}
        <div className="enhanced-banner-small-overlay firecrackerhp3jul3-banner-overlay relative z-10 flex flex-col justify-end h-full p-3 sm:p-5" style={{ minHeight: "220px" }}>
          <span className="font-impact text-white text-xl sm:text-xl tracking-wider opacity-90 mb-2 sm:mb-3 flex items-center gap-1.5">
            <svg className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2z" />
            </svg>
            LIQUIDACI&Oacute;N
          </span>
          <div className="enhanced-banner-small-overlay-text">
            <p className="enhanced-banner-small-title font-impact text-white text-sm sm:text-base leading-tight mb-1">
              20% de descuento adicional
            </p>
            <p className="enhanced-banner-subtitle text-white/75 text-[10px] sm:text-xs leading-relaxed mb-2.5">
              Seleccione las herramientas con el c&oacute;digo:{" "}
              <strong className="text-amber-300 text-xs sm:text-sm tracking-wider">
                EXTRA20
              </strong>
            </p>
            <span className="enhanced-banner-button inline-flex items-center gap-1.5 bg-white/15 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-[11px] sm:text-xs font-semibold border border-white/20">
              Compra ahora
              <CircleArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}