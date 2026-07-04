"use client";
import Link from "next/link";
import { CircleArrowRight, Sparkles } from "lucide-react";

export function CenterHeroBanner() {
  return (
    <Link href="/categoria/herramientas-electricas" className="enhanced-banner-large block relative w-full overflow-hidden rounded-lg">
      <div className="absolute inset-0 rounded-lg" style={{ background: "linear-gradient(135deg, #0A2A44 0%, #0d3355 30%, #143d5e 60%, #1a4a6e 100%)" }} />
      <div className="absolute inset-0 rounded-lg opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 11px)" }} />
      <div className="absolute -bottom-16 -right-16 w-[300px] h-[300px] rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #E35205 0%, transparent 70%)" }} />
      <div className="enhanced-banner-large-overlay relative z-10 flex flex-col items-center justify-center text-center px-4 py-7 sm:py-10 lg:py-12" style={{ minHeight: "200px" }}>
        <div className="mb-2.5 sm:mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-white/80 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em]">Ofertas de Julio</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          </div>
        </div>
        <p className="enhanced-banner-large-title font-impact text-white text-2xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight mb-1.5 sm:mb-3">4 d&iacute;as para ahorrar</p>
        <p className="enhanced-banner-subtitle text-white/80 text-xs sm:text-sm max-w-md mb-3 sm:mb-5 leading-relaxed">
          Obt&eacute;n <strong className="text-white font-semibold">un 10% de descuento</strong> en herramientas seleccionadas<br className="hidden sm:block" /> con el c&oacute;digo: <strong className="text-amber-300 font-bold text-sm sm:text-base tracking-wider">4JULY</strong>
        </p>
        <span className="enhanced-banner-button group inline-flex items-center gap-2 bg-[#E35205] hover:bg-[#CC4400] text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded text-xs sm:text-sm font-semibold transition-all duration-200 shadow-lg shadow-[#E35205]/25">
          Compra ahora
          <CircleArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>
      </div>
    </Link>
  );
}