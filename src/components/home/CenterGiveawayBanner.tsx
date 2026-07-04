"use client";
import Link from "next/link";
import { CircleArrowRight, Trophy, MessageSquare } from "lucide-react";

export function CenterGiveawayBanner() {
  return (
    <Link href="#" className="crescent-full-width block relative w-full overflow-hidden rounded-lg">
      <div className="absolute inset-0 rounded-lg" style={{ background: "linear-gradient(135deg, #0A2A44 0%, #0d3355 40%, #143d5e 100%)" }} />
      <div className="absolute inset-0 rounded-lg opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(255,255,255,.1) 20px, rgba(255,255,255,.1) 21px)" }} />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #E35205 0%, transparent 70%)" }} />
      <div className="crescent-full-width-railworks-overlay relative z-10 px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <Trophy className="h-5 w-5 text-amber-400" />
              <span className="font-impact text-white text-xl sm:text-2xl tracking-wider">iTools PER&Uacute;</span>
            </div>
            <p className="text-white/70 text-xs sm:text-sm mb-0.5">Participa para ganar un</p>
            <p className="font-impact text-white text-base sm:text-xl leading-tight mb-2.5 sm:mb-4">Kit de Herramientas Milwaukee GRATIS</p>
            <span className="enhanced-banner-button inline-flex items-center gap-2 bg-[#E35205] text-white px-5 py-2 rounded text-xs sm:text-sm font-semibold">
              Ver detalles
              <CircleArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/15 p-3 sm:p-5 shrink-0 sm:w-56">
            <div className="flex items-start gap-2 mb-1">
              <MessageSquare className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-white/70 text-xs leading-relaxed">Env&iacute;a un mensaje con la palabra <span className="text-white font-bold">&quot;GANA&quot;</span><br /> al <span className="text-white font-bold">86657</span>.</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}