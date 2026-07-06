"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { getOnSaleProducts, getFeaturedProducts, getNewArrivals } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DealsSection() {
  const deals = getOnSaleProducts().slice(0, 8);

  return (
    <section className="py-10 md:py-14 bg-surface" aria-labelledby="deals-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2
              id="deals-heading"
              className="text-xl md:text-2xl font-impact text-foreground"
            >
              Ofertas del Día
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Precios especiales en herramientas seleccionadas
            </p>
          </div>
          <a href="#">
            <Button
              variant="outline"
              size="sm"
              className="border-itools-blue text-itools-blue hover:bg-itools-blue hover:text-white font-impact text-xs transition-colors"
            >
              Ver Todas
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </a>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
          {deals.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedSection() {
  const featured = getFeaturedProducts().slice(0, 8);

  return (
    <section className="py-10 md:py-14 bg-white dark:bg-[#111111]" aria-labelledby="featured-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2
              id="featured-heading"
              className="text-xl md:text-2xl font-impact text-foreground"
            >
              Productos Destacados
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Los más vendidos y recomendados por nuestros expertos
            </p>
          </div>
          <a href="#">
            <Button
              variant="outline"
              size="sm"
              className="border-itools-blue text-itools-blue hover:bg-itools-blue hover:text-white font-impact text-xs transition-colors"
            >
              Ver Todos
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewArrivalsSection() {
  const arrivals = getNewArrivals();

  return (
    <section className="py-10 md:py-14 bg-surface" aria-labelledby="new-arrivals-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2
              id="new-arrivals-heading"
              className="text-xl md:text-2xl font-impact text-foreground"
            >
              Nuevos Ingresos
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Lo último en herramientas profesionales
            </p>
          </div>
          <a href="#">
            <Button
              variant="outline"
              size="sm"
              className="border-itools-blue text-itools-blue hover:bg-itools-blue hover:text-white font-impact text-xs transition-colors"
            >
              Ver Todos
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
          {arrivals.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}