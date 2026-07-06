"use client";

import Link from "next/link";
import { ChevronRight, SlidersHorizontal, Wrench, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { useSectionDeepLinking, sectionId } from "@/hooks/useSectionDeepLinking";
import { brands, getBrandTheme } from "@/lib/data";
import type { Product, Category } from "@/types";

const SECTION_PRODUCTS = "Productos";
const SECTION_SUBCATEGORIES = "Subcategorías";
const SECTION_FILTERS = "Filtros y Ordenamiento";
const SECTION_BRANDS = "Marcas Disponibles";

export function CategoryPageClient({ category, products }: { category: Category; products: Product[] }) {
  useSectionDeepLinking();

  // Get unique brands from products in this category
  const categoryBrands = products.reduce((acc, p) => {
    if (p.brand && !acc.find((b) => b.id === p.brand.id)) {
      acc.push(p.brand);
    }
    return acc;
  }, [] as typeof products[0]["brand"][]).filter(Boolean);

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
          </div>
        </section>

        {/* Section: Brands in this category */}
        {categoryBrands.length > 0 && (
          <section data-section={SECTION_BRANDS} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-impact text-foreground">{SECTION_BRANDS}</h2>
              <Link href="/" className="text-xs text-itools-blue hover:underline flex items-center gap-1">
                Ver todas las marcas <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {categoryBrands.map((brand) => {
                const theme = getBrandTheme(brand.slug);
                const productCount = products.filter((p) => p.brandId === brand.id).length;
                return (
                  <Link
                    key={brand.id}
                    href={`/marca/${brand.slug}`}
                    className="shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border hover:border-transparent transition-all group"
                    style={{
                      backgroundColor: productCount > 0 ? `${theme.color}10` : undefined,
                      borderColor: productCount > 0 ? `${theme.color}30` : undefined,
                    }}
                  >
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: theme.color }}
                    >
                      {brand.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-itools-blue transition-colors">
                        {brand.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{productCount} productos</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Section: Subcategories */}
        {category.children && category.children.length > 0 && (
          <section data-section={SECTION_SUBCATEGORIES} className="mb-8">
            <h2 className="text-lg font-impact text-foreground mb-3">{SECTION_SUBCATEGORIES}</h2>
            <div className="flex flex-wrap gap-2">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/categoria/${child.slug}`}
                  className="px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-border dark:border-[#333] rounded-lg text-sm text-foreground hover:border-itools-blue hover:text-itools-blue transition-colors"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Section: Filters */}
        <section data-section={SECTION_FILTERS} className="mb-6">
          <div className="flex items-center justify-between bg-white dark:bg-[#1a1a1a] rounded-lg border border-border dark:border-[#333] px-4 py-3">
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
            <div className="text-center py-20 bg-white dark:bg-[#1a1a1a] rounded-xl border border-border dark:border-[#333]">
              <Wrench className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
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

        {/* Bottom: Link back to all brands */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-impact text-foreground">Explorar por Marca</h2>
            <Link href="/" className="text-xs text-itools-blue hover:underline flex items-center gap-1">
              Ver tienda completa <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {brands.filter(b => b.featured).map((brand) => {
              const theme = getBrandTheme(brand.slug);
              return (
                <Link
                  key={brand.id}
                  href={`/marca/${brand.slug}`}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border hover:border-transparent transition-all group text-center justify-center"
                  style={{ hoverBackgroundColor: `${theme.color}10` }}
                >
                  <div
                    className="h-6 w-6 rounded-md flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                    style={{ backgroundColor: theme.color }}
                  >
                    {brand.name.charAt(0)}
                  </div>
                  <span className="text-xs text-foreground group-hover:text-itools-blue transition-colors truncate">
                    {brand.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}