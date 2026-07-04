"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleArrowRight, Star } from "lucide-react";

/**
 * Center column: Two small promo banners in a 2-column grid.
 * Uses shadcn Card + CardContent + Button.
 * Mobile: always grid-cols-2 (side-by-side, never stacked).
 * Tall vertical cards: h-[150px] mobile, h-[200px] tablet, h-[240px] desktop.
 * Each is a full clickable Link wrapping the Card.
 */
export function CenterSmallBanners() {
  return (
    <div className="grid grid-cols-2 gap-2.5 md:gap-6">
      {/* ─── EGO Banner (Teal) ─── */}
      <Link href="/categoria/herramientas-electricas" className="block">
        <Card className="relative overflow-hidden border-0 shadow-sm gap-0 py-0 rounded-xl h-full">
          {/* Teal gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #0a4a3a 0%, #0d5c4a 40%, #11735a 100%)",
            }}
          />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />

          <CardContent
            className="relative z-10 flex h-[150px] flex-col justify-center items-center p-4 text-center text-white md:h-[200px] lg:h-[240px]"
          >
            <div className="space-y-1 md:space-y-2">
              <span className="font-impact text-xl md:text-2xl lg:text-3xl tracking-wider opacity-90 block">
                EGO
              </span>
              <p className="text-xs md:text-sm font-semibold leading-tight">
                Compra m&aacute;s, por menos
              </p>
              <p className="text-[10px] md:text-xs leading-relaxed text-white/70">
                Obt&eacute;n{" "}
                <strong className="text-white">
                  entre S/ 200 y S/ 400 de descuento
                </strong>{" "}
                en pedidos EGO de S/ 1,200+
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-1.5 md:mt-2 rounded-full text-[11px] md:text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 shadow-sm transition-all hover:scale-105"
                asChild
              >
                <span className="inline-flex items-center gap-1.5">
                  Compra ahora
                  <CircleArrowRight className="h-3 w-3" />
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* ─── FIRECRACKER / EXTRA20 Banner (Red-Orange) ─── */}
      <Link href="/categoria/herramientas-electricas" className="block">
        <Card className="relative overflow-hidden border-0 shadow-sm gap-0 py-0 rounded-xl h-full">
          {/* Red-orange gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #8B1A00 0%, #A52000 30%, #CC3300 70%, #E35205 100%)",
            }}
          />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl" />

          <CardContent
            className="relative z-10 flex h-[150px] flex-col justify-center items-center p-4 text-center text-white md:h-[200px] lg:h-[240px]"
          >
            <div className="space-y-1 md:space-y-2">
              <span className="font-impact text-xl md:text-2xl lg:text-3xl tracking-wider opacity-90 flex items-center justify-center gap-1.5">
                <Star className="h-5 w-5 text-amber-300" />
                LIQUIDACI&Oacute;N
              </span>
              <p className="text-xs md:text-sm font-semibold leading-tight">
                20% de descuento adicional
              </p>
              <p className="text-[10px] md:text-xs leading-relaxed text-white/75">
                Seleccione herramientas con el c&oacute;digo:{" "}
                <strong className="text-amber-300 text-xs md:text-sm tracking-wider">
                  EXTRA20
                </strong>
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-1.5 md:mt-2 rounded-full text-[11px] md:text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 shadow-sm transition-all hover:scale-105"
                asChild
              >
                <span className="inline-flex items-center gap-1.5">
                  Compra ahora
                  <CircleArrowRight className="h-3 w-3" />
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}