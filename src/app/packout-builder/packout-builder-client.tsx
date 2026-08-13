"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Package, Layers, Check } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { urlFor } from "@/sanity/image";
import { useCartStore } from "@/stores/cart-store";
import Image from "next/image";
import Link from "next/link";

interface PackoutItem {
  _id: string;
  name?: string;
  slug?: string;
  price?: number;
  salePrice?: number;
  image?: any;
  compatibleBaseIds?: string[];
  specs?: Record<string, string>;
}

export function PackoutBuilderClient({
  bases,
  stackables,
}: {
  bases: PackoutItem[];
  stackables: PackoutItem[];
}) {
  const [selectedBase, setSelectedBase] = useState<PackoutItem | null>(null);
  const [stack, setStack] = useState<PackoutItem[]>([]);
  const addToCart = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const safeBases = Array.isArray(bases) ? bases : [];
  const safeStackables = Array.isArray(stackables) ? stackables : [];

  // Filter stackables compatible with selected base
  const compatibleModules = selectedBase
    ? safeStackables.filter(
        (m) =>
          !m.compatibleBaseIds ||
          m.compatibleBaseIds.length === 0 ||
          m.compatibleBaseIds.includes(selectedBase._id)
      )
    : [];

  const addModule = (module: PackoutItem) => {
    setStack((prev) => [...prev, module]);
  };

  const removeModule = (index: number) => {
    setStack((prev) => prev.filter((_, i) => i !== index));
  };

  const basePrice = selectedBase?.salePrice || selectedBase?.price || 0;
  const stackPrice = stack.reduce((sum, m) => sum + (m.salePrice || m.price || 0), 0);
  const totalPrice = basePrice + stackPrice;

  const handleAddAllToCart = () => {
    if (!selectedBase) return;
    // Add base as a cart item (simplified — using product-like shape)
    addToCart({
      id: selectedBase._id,
      name: selectedBase.name || "Base PACKOUT",
      slug: selectedBase.slug || "",
      price: selectedBase.price || 0,
      comparePrice: selectedBase.salePrice ? selectedBase.price : undefined,
      image: selectedBase.image,
      sku: selectedBase._id,
      brand: { name: "Milwaukee", slug: "milwaukee" },
    } as any);
    // Add each module
    stack.forEach((m) => {
      addToCart({
        id: m._id,
        name: m.name || "Módulo PACKOUT",
        slug: m.slug || "",
        price: m.price || 0,
        comparePrice: m.salePrice ? m.price : undefined,
        image: m.image,
        sku: m._id,
        brand: { name: "Milwaukee", slug: "milwaukee" },
      } as any);
    });
    openCart();
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge className="bg-[#DB001A] text-white border-0 mb-3">PACKOUT™</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Configurador PACKOUT Milwaukee
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Diseña tu sistema de almacenamiento modular PACKOUT. Selecciona una base y agrega módulos compatibles para crear tu configuración ideal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Configuration (base + modules) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Select Base */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                Selecciona tu Base
              </h2>
              {safeBases.length === 0 ? (
                <div className="text-center py-12 border rounded-xl bg-muted/30">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No hay bases disponibles en este momento.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {safeBases.map((base) => {
                    const isSelected = selectedBase?._id === base._id;
                    const price = base.salePrice || base.price || 0;
                    return (
                      <button
                        key={base._id}
                        onClick={() => {
                          setSelectedBase(base);
                          setStack([]);
                        }}
                        className={`relative text-left rounded-xl border-2 p-3 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/40 hover:shadow-sm"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        )}
                        <div className="relative aspect-square mb-2 bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center">
                          {base.image ? (
                            <img
                              src={urlFor(base.image).width(200).height(200).format("webp").url()}
                              alt={base.name || ""}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Package className="h-10 w-10 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-xs font-medium line-clamp-2">{base.name}</p>
                        <p className="text-sm font-bold text-primary mt-1">{formatPrice(price)}</p>
                        {base.salePrice && base.price && (
                          <p className="text-xs text-muted-foreground line-through">{formatPrice(base.price)}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Step 2: Add Modules */}
            {selectedBase && (
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                  Agrega Módulos Compatibles
                </h2>
                {compatibleModules.length === 0 ? (
                  <div className="text-center py-12 border rounded-xl bg-muted/30">
                    <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No hay módulos compatibles disponibles.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {compatibleModules.map((mod) => {
                      const price = mod.salePrice || mod.price || 0;
                      const countInStack = stack.filter((s) => s._id === mod._id).length;
                      return (
                        <Card key={mod._id} className="overflow-hidden">
                          <CardContent className="p-3">
                            <div className="relative aspect-square mb-2 bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center">
                              {mod.image ? (
                                <img
                                  src={urlFor(mod.image).width(200).height(200).format("webp").url()}
                                  alt={mod.name || ""}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Layers className="h-8 w-8 text-muted-foreground" />
                              )}
                            </div>
                            <p className="text-xs font-medium line-clamp-2">{mod.name}</p>
                            <p className="text-sm font-bold text-primary mt-1">{formatPrice(price)}</p>
                            {mod.salePrice && mod.price && (
                              <p className="text-xs text-muted-foreground line-through">{formatPrice(mod.price)}</p>
                            )}
                            <div className="flex items-center gap-1 mt-2">
                              {countInStack > 0 && (
                                <Badge variant="secondary" className="text-[10px]">{countInStack}×</Badge>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addModule(mod)}
                                className="flex-1 h-7 text-xs"
                              >
                                <Plus className="h-3 w-3 mr-0.5" /> Agregar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Right: Stack Preview & Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Visual Stack Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tu Configuración</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedBase ? (
                    <div className="space-y-3">
                      {/* Visual 2D Stack */}
                      <div className="flex flex-col-reverse items-center gap-1 py-4">
                        {/* Base at bottom */}
                        <div className="relative w-full h-16 rounded-lg bg-primary/10 border-2 border-primary flex items-center justify-center overflow-hidden">
                          {selectedBase.image && (
                            <img
                              src={urlFor(selectedBase.image).width(120).height(60).format("webp").url()}
                              alt=""
                              className="absolute inset-0 w-full h-full object-contain opacity-30"
                            />
                          )}
                          <span className="text-xs font-medium text-center px-2 z-10">{selectedBase.name}</span>
                        </div>
                        {/* Modules stacked on top (rendered bottom-up visually) */}
                        {stack.map((mod, i) => (
                          <div key={i} className="relative w-full group">
                            <div className="w-[90%] mx-auto h-12 rounded-md bg-primary/5 border border-primary/30 flex items-center justify-between px-3 overflow-hidden">
                              <span className="text-[10px] font-medium truncate">{mod.name}</span>
                              <button
                                onClick={() => removeModule(i)}
                                className="shrink-0 h-5 w-5 rounded-full bg-muted flex items-center justify-center hover:bg-destructive/20 transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-3 space-y-2">
                        {/* Base line */}
                        <div className="flex justify-between text-sm">
                          <span>{selectedBase.name}</span>
                          <span className="font-medium">{formatPrice(basePrice)}</span>
                        </div>
                        {/* Module lines */}
                        {stack.map((mod, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="truncate mr-2">{mod.name}</span>
                            <span className="font-medium shrink-0">{formatPrice(mod.salePrice || mod.price || 0)}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between text-base font-bold">
                          <span>Total</span>
                          <span className="text-primary">{formatPrice(totalPrice)}</span>
                        </div>
                      </div>

                      <Button
                        onClick={handleAddAllToCart}
                        className="w-full bg-itools-red hover:bg-itools-red-dark text-white"
                        size="lg"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Agregar todo al carrito
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Layers className="h-10 w-10 mx-auto mb-3" />
                      <p className="text-sm">Selecciona una base para comenzar</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info */}
              <Card>
                <CardContent className="p-4 text-sm text-muted-foreground space-y-2">
                  <p>🔒 Sistema de almacenamiento modular más versátil del mercado.</p>
                  <p>🚚 Envío gratis en configuraciones sobre S/ 500.</p>
                  <p>✅ Garantía oficial Milwaukee incluida.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
