"use client";

import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { useSectionDeepLinking, sectionId } from "@/hooks/useSectionDeepLinking";
import type { Product, Category } from "@/types";

const SECTION_PRODUCTS = "Productos";
const SECTION_SUBCATEGORIES = "Subcategorías";
const SECTION_FILTERS = "Filtros y Ordenamiento";

export function CategoryPageClient({ category, products }: { category: Category; products: Product[] }) {
  useSectionDeepLinking();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link href="/" className="hover:text-itools-blue transition-colors">Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{category.name}</span>
        </nav>

        {/* Section: Header */}
        <section data-section={category.name}>
          <div className="bg-itools-dark text-white rounded-xl px-6 py-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-impact leading-tight">
              {category.name}
            </h1>
            <p className="text-white/60 mt-2 text-sm md:text-base">
              {products.length > 0
                ? `${products.length} producto${products.length !== 1 ? "s" : ""} encontrado${products.length !== 1 ? "s" : ""}`
                : "No hay productos en esta categoría aún"}
            </p>
            <p className="text-white/40 mt-1 text-xs">
              Comparte esta sección: {typeof window !== "undefined" && (
                <span className="underline cursor-pointer" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                  Copiar enlace
                </span>
              )}
            </p>
          </div>
        </section>

        {/* Section: Subcategories */}
        {category.children && category.children.length > 0 && (
          <section data-section={SECTION_SUBCATEGORIES} className="mb-8">
            <h2 className="text-lg font-impact text-foreground mb-3">{SECTION_SUBCATEGORIES}</h2>
            <div className="flex flex-wrap gap-2">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/categoria/${child.slug}`}
                  className="px-4 py-2 bg-white border border-border rounded-lg text-sm text-foreground hover:border-itools-blue hover:text-itools-blue transition-colors"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Section: Filters */}
        <section data-section={SECTION_FILTERS} className="mb-6">
          <div className="flex items-center justify-between bg-white rounded-lg border border-border px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              <span>{products.length} resultado{products.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:inline">Ordenar por:</span>
              <select className="text-sm bg-transparent border border-border rounded-md px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-itools-blue/30">
                <option>Más relevantes</option>
                <option>Precio: menor a mayor</option>
                <option>Precio: mayor a menor</option>
                <option>Mejor valorados</option>
                <option>Más nuevos</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section: Products Grid */}
        <section data-section={SECTION_PRODUCTS} id={sectionId(SECTION_PRODUCTS)}>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-border">
              <p className="text-muted-foreground mb-4">
                No hay productos disponibles en esta categoría.
              </p>
              <Link
                href="/"
                className="text-sm text-itools-blue hover:underline"
              >
                Volver al inicio
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}