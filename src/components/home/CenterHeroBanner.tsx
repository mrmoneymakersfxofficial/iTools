"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, CircleArrowRight } from "lucide-react";

/**
 * Center column: Hero banner — full-width horizontal card.
 * Uses shadcn Card + CardContent + Button.
 * Mobile: h-[200px]  |  Tablet: h-[320px]  |  Desktop: h-[400px]
 * Clickable Link wrapping the entire Card.
 */
export function CenterHeroBanner() {
  return (
    <Link href="/categoria/herramientas-electricas" className="block">
      <Card className="relative overflow-hidden border-0 shadow-sm gap-0 py-0 rounded-xl">
        {/* Navy gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0A2A44 0%, #0d3355 30%, #143d5e 60%, #1a4a6e 100%)",
          }}
        />
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 11px)",
          }}
        />
        {/* Glow accent */}
        <div
          className="absolute -bottom-16 -right-16 w-[300px] h-[300px] rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #E35205 0%, transparent 70%)",
          }}
        />

        <CardContent
          className="relative z-10 flex h-[200px] items-center justify-center p-6 text-center md:h-[320px] lg:h-[400px]"
        >
          <div className="max-w-2xl space-y-2 md:space-y-4">
            {/* Tag pill */}
            <div className="mb-1.5 md:mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-white/80 text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em]">
                  Ofertas de Julio
                </span>
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              </span>
            </div>

            <h2 className="font-impact text-white text-2xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
              4 d&iacute;as para ahorrar
            </h2>

            <p className="text-white/80 text-sm md:text-lg leading-relaxed">
              Obt&eacute;n{" "}
              <strong className="text-white font-semibold">
                un 10% de descuento
              </strong>{" "}
              en herramientas seleccionadas
              <br className="hidden sm:block" /> con el c&oacute;digo:{" "}
              <strong className="text-amber-300 font-bold text-sm md:text-base tracking-wider">
                4JULY
              </strong>
            </p>

            <Button
              variant="secondary"
              size="lg"
              className="mt-2 rounded-full font-semibold shadow-lg shadow-[#E35205]/25 bg-[#E35205] hover:bg-[#CC4400] text-white transition-all hover:scale-105"
              asChild
            >
              <span className="inline-flex items-center gap-2">
                Compra ahora
                <CircleArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}