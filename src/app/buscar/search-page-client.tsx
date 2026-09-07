"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { Search, SlidersHorizontal, ArrowLeft } from "lucide-react";

interface SearchPageClientProps {
  query: string;
  products: any[];
}

export function SearchPageClient({ query, products }: SearchPageClientProps) {
  const [sortBy, setSortBy] = useState<"relevant" | "price-asc" | "price-desc">("relevant");

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0D0D0D] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Búsqueda</span>
        </nav>

        {/* Header Title Banner */}
        <div className="bg-itools-dark text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Search className="h-6 w-6 text-itools-red" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {query ? `Resultados para "${query}"` : "Explorar Productos"}
            </h1>
          </div>
          <p className="text-white/70 text-sm">
            {products.length === 1
              ? "1 producto encontrado en nuestro catálogo oficial"
              : `${products.length} productos encontrados en nuestro catálogo oficial`}
          </p>
        </div>

        {/* Filter / Sort bar */}
        {products.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#141414] p-4 rounded-xl border border-border dark:border-[#262626] mb-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Mostrando {products.length} resultados</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-surface dark:bg-[#202020] border border-border dark:border-[#333] rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-itools-blue"
              >
                <option value="relevant">Más relevantes</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
              </select>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {sortedProducts.map((product, idx) => (
              <ProductCard key={product.id || idx} product={product} index={idx} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white dark:bg-[#141414] rounded-2xl border border-border dark:border-[#262626] p-12 text-center max-w-lg mx-auto shadow-sm my-8">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 text-itools-red rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              No encontramos resultados para &ldquo;{query}&rdquo;
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Revisa si el SKU o nombre de la herramienta está bien escrito, o prueba buscar por marca o categoría general.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/categoria/herramientas-electricas"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold bg-itools-blue text-white hover:bg-itools-blue/90 transition-colors shadow-sm"
              >
                Ver Herramientas Eléctricas
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-surface text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Inicio
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
