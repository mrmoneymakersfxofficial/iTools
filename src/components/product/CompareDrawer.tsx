"use client";

import { useCompareStore } from "@/stores/compare-store";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { GitCompare, X, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import Image from "next/image";

export function CompareDrawer() {
  const { items, removeItem, clearAll } = useCompareStore();

  if (items.length === 0) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="fixed bottom-20 right-4 z-40 gap-2 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 md:bottom-4">
          <GitCompare className="h-4 w-4" />
          Comparar ({items.length})
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-auto">
        <SheetTitle className="sr-only">Comparar Productos</SheetTitle>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Comparar Productos</h3>
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground">
            <Trash2 className="h-4 w-4 mr-1" /> Limpiar
          </Button>
        </div>
        {items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2 min-w-[100px]">Producto</th>
                  {items.map((item) => (
                    <th key={item.slug} className="p-2 min-w-[150px]">
                      <div className="relative">
                        <button onClick={() => removeItem(item.slug)} className="absolute -top-1 -right-1 p-0.5 rounded-full bg-muted">
                          <X className="h-3 w-3" />
                        </button>
                        {item.image && (
                          <div className="relative w-20 h-20 mx-auto mb-2">
                            <Image src={item.image} alt={item.name} fill className="object-contain" />
                          </div>
                        )}
                        <p className="font-medium text-xs truncate">{item.name}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2 font-medium">Precio</td>
                  {items.map((item) => (
                    <td key={item.slug} className="p-2 text-center">
                      {item.salePrice ? (
                        <><span className="text-red-500 font-bold">{formatPrice(item.salePrice)}</span><br /><span className="line-through text-xs text-muted-foreground">{formatPrice(item.price)}</span></>
                      ) : (
                        <span className="font-bold">{formatPrice(item.price)}</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-t">
                  <td className="p-2 font-medium">Marca</td>
                  {items.map((item) => (
                    <td key={item.slug} className="p-2 text-center">{item.brand || "—"}</td>
                  ))}
                </tr>
                {items.some((i) => i.specs) && Object.keys(items.find((i) => i.specs)?.specs || {}).map((key) => (
                  <tr key={key} className="border-t">
                    <td className="p-2 font-medium">{key}</td>
                    {items.map((item) => (
                      <td key={item.slug} className="p-2 text-center">{item.specs?.[key] || "—"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
