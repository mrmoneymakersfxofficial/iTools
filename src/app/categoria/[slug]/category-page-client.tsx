"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product, Category } from "@/types";

export function CategoryPageClient({ category, products }: { category: Category; products: Product[] }) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-itools-blue transition-colors">Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="bg-itools-dark text-white rounded-xl px-6 py-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-impact leading-tight">
            {category.name}
          </h1>
          <p className="text-white/60 mt-2 text-sm md:text-base">
            {products.length > 0
              ? `${products.length} producto${products.length !== 1 ? "s" : ""} encontrado${products.length !== 1 ? "s" : ""}`
              : "No hay productos en esta categoría aún"}
          </p>
        </div>

        {/* Subcategories */}
        {category.children && category.children.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
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
        )}

        {/* Products Grid */}
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
      </div>
    </main>
  );
}