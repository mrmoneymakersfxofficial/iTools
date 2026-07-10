"use client";

import {
  Truck,
  ShieldCheck,
  BadgeCheck,
  CreditCard,
  Headphones,
  RotateCcw,
} from "lucide-react";

const features = [
  { icon: Truck, title: "Envío a Todo el Perú", sub: "Lima y provincias" },
  { icon: ShieldCheck, title: "Servicio Técnico Oficial", sub: "Milwaukee autorizado", highlight: true },
  { icon: BadgeCheck, title: "Garantía de Fabricante", sub: "Respaldado por la marca" },
  { icon: CreditCard, title: "Pago 100% Seguro", sub: "SSL encriptado" },
  { icon: Headphones, title: "Atención al Cliente", sub: "Lun - Sáb 8am - 6pm" },
  { icon: RotateCcw, title: "Devoluciones Fáciles", sub: "30 días para cambiar" },
];

/**
 * Acme-style trust/features bar.
 * Dark navy background with icon + text rows.
 */
export function AcmeTrustBar() {
  return (
    <section
      className="bg-[#0A2A44] py-5 md:py-6"
      data-section="¿Por Qué Elegir iTools?"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex flex-col items-center text-center gap-1.5">
                <Icon
                  className={`h-5 w-5 ${
                    f.highlight ? "text-[#E35205]" : "text-white/60"
                  }`}
                />
                <p
                  className={`text-xs sm:text-sm font-medium leading-tight ${
                    f.highlight ? "text-[#E35205]" : "text-white/90"
                  }`}
                >
                  {f.title}
                </p>
                <p className="text-[10px] sm:text-[11px] text-white/40 leading-tight">
                  {f.sub}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}