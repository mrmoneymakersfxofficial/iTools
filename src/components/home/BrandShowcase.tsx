"use client";

import { motion } from "framer-motion";
import { Zap, Battery, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFeaturedBrands } from "@/lib/data";

export function BrandShowcase() {
  const featuredBrands = getFeaturedBrands();

  return (
    <section className="py-10 md:py-14 bg-white overflow-hidden" aria-labelledby="brand-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Milwaukee Hero Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-xl overflow-hidden mb-8 md:mb-10"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-itools-dark via-[#1A1A3D] to-[#0D1A3D]" />
          <div className="absolute inset-0 texture-overlay opacity-30" />

          {/* Blue accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-itools-blue" />

          <div className="relative z-10 px-6 sm:px-10 md:px-14 py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Left content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-itools-blue text-white text-[10px] font-impact px-2.5 py-1 rounded-sm uppercase tracking-wider">
                  Distribuidor Oficial
                </span>
              </div>
              <h2
                id="brand-heading"
                className="text-2xl md:text-3xl lg:text-4xl font-impact text-white leading-tight mb-3"
              >
                Milwaukee M18 FUEL™
              </h2>
              <p className="text-sm md:text-base text-white/60 max-w-lg mb-6 leading-relaxed">
                La línea más potente de herramientas inalámbricas del mercado. Motor POWERSTATE
                Brushless, tecnología REDLINK PLUS y baterías REDLITHIUM. Rendimiento que supera
                a las herramientas con cable.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-itools-blue" />
                  <span className="text-sm text-white/80 font-medium">Motor POWERSTATE Brushless</span>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="h-5 w-5 text-itools-blue" />
                  <span className="text-sm text-white/80 font-medium">REDLITHIUM XC5.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-itools-blue" />
                  <span className="text-sm text-white/80 font-medium">Garantía 5 años</span>
                </div>
              </div>
              <Button className="bg-itools-blue hover:bg-itools-blue-dark text-white font-impact px-8 h-11 transition-colors">
                Ver Colección M18
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Right decorative */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="w-48 h-48 rounded-full border-2 border-itools-blue/30" />
                <div className="absolute inset-6 rounded-full border border-white/10" />
                <div className="absolute inset-12 rounded-full bg-itools-blue/10 flex items-center justify-center">
                  <span className="text-5xl font-impact text-itools-blue">M18</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Brand logos row */}
        <div className="text-center">
          <h3 className="text-sm font-impact text-muted-foreground uppercase tracking-wider mb-6">
            Marcas que trabajamos
          </h3>
          <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
            {featuredBrands.map((brand) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div
                  className="h-12 md:h-14 w-24 md:w-28 rounded-lg bg-surface flex items-center justify-center group-hover:shadow-md transition-shadow"
                  style={{
                    borderLeft: `3px solid ${
                      brand.slug === "milwaukee" ? "#D1001C" :
                      brand.slug === "dewalt" ? "#FFD700" :
                      brand.slug === "bosch" ? "#005691" : "#999"
                    }`,
                  }}
                >
                  <span
                    className="text-sm md:text-base font-impact tracking-tight"
                    style={{
                      color:
                        brand.slug === "milwaukee" ? "#D1001C" :
                        brand.slug === "dewalt" ? "#1A1A2E" :
                        brand.slug === "bosch" ? "#005691" : "#666",
                    }}
                  >
                    {brand.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}