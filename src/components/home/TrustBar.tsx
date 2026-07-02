"use client";

import { motion } from "framer-motion";
import {
  Truck,
  Shield,
  Clock,
  Award,
  CreditCard,
  Headphones,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const features: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Truck, title: "Envío a Todo el Perú", desc: "Lima y provincias. Entrega en 24-72h" },
  { icon: Shield, title: "Garantía Oficial", desc: "Servicio Técnico Autorizado Milwaukee" },
  { icon: CreditCard, title: "Pago Seguro", desc: "Yape, Plin, tarjeta de crédito/débito" },
  { icon: Clock, title: "Entrega Rápida", desc: "Despacho el mismo día antes de las 2pm" },
  { icon: Headphones, title: "Soporte Experto", desc: "Asesoría técnica personalizada" },
  { icon: Award, title: "+10 Años", desc: "Experiencia en el mercado industrial" },
];

export function TrustBar() {
  return (
    <section className="bg-steel-dark text-white" aria-label="Beneficios de comprar en iTools">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-5 md:py-6">
          {/* Slogan */}
          <div className="text-center mb-4 md:mb-5">
            <p className="text-white/90 text-xs md:text-sm tracking-widest uppercase font-medium">
              LAS HERRAMIENTAS ADECUADAS LO HACEN.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <feature.icon className="h-7 w-7 md:h-8 md:w-8 text-milwaukee-red" strokeWidth={1.5} />
                <div>
                  <p className="text-xs md:text-sm font-semibold leading-tight">
                    {feature.title}
                  </p>
                  <p className="text-[10px] md:text-xs text-white/50 mt-0.5 hidden sm:block">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}