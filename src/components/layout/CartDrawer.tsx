"use client";

import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/stores/cart-store";
import type { CartItem } from "@/types";

function formatPrice(price: number): string {
  return `S/ ${price.toFixed(2)}`;
}

export function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, getItemCount, getSubtotal } =
    useCartStore();

  const itemCount = getItemCount();
  const subtotal = getSubtotal();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg text-foreground font-impact">
              Mi Carrito ({itemCount} {itemCount === 1 ? "item" : "items"})
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mr-2"
              onClick={closeCart}
              aria-label="Cerrar carrito"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg text-foreground mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-sm text-muted-foreground max-w-[260px] mb-6">
              Explora nuestros productos y añade tus herramientas favoritas.
            </p>
            <Button
              variant="outline"
              className="border-itools-blue text-itools-blue hover:bg-itools-blue hover:text-white transition-colors"
              onClick={closeCart}
            >
              Ver Productos
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1 px-6">
              <div className="py-2">
                {items.map((item: CartItem) => (
                  <div
                    key={item.product.id}
                    className="group py-4 transition-colors hover:bg-gray-50 rounded-lg px-2 -mx-2"
                  >
                    <div className="flex gap-4">
                      {/* Product Image Placeholder */}
                      <div className="w-20 h-20 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center">
                        <Wrench className="h-8 w-8 text-gray-300" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground leading-snug line-clamp-2">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.product.brand?.name ?? "Marca"}
                        </p>
                        <p className="text-itools-blue text-sm mt-1">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      {/* Quantity & Remove Controls */}
                      <div className="flex flex-col items-end justify-between shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-red-500 transition-colors -mr-1 -mt-1"
                          onClick={() => removeItem(item.product.id)}
                          aria-label={`Eliminar ${item.product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center border border-input rounded hover:bg-gray-100 transition-colors"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center border border-input rounded hover:bg-gray-100 transition-colors"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Subtotal Row */}
                    <div className="flex justify-end mt-2 pr-1">
                      <span className="text-xs text-muted-foreground">
                        Subtotal:{" "}
                        <span className="text-foreground">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </span>
                    </div>

                    {/* Separator between items (not after the last one) */}
                    {items.indexOf(item) < items.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <SheetFooter className="shrink-0 border-t bg-background px-6 pt-4 pb-6">
              <div className="w-full space-y-3">
                {/* Subtotal Row */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
                  <span className="text-lg text-foreground tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  Envío calculado en checkout
                </p>

                {/* Checkout Button */}
                <Button className="w-full bg-itools-red hover:bg-itools-red-dark text-white font-impact h-11 transition-colors">
                  Ir a Pagar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {/* Continue Shopping */}
                <button
                  type="button"
                  className="w-full text-sm text-itools-blue hover:underline cursor-pointer text-center py-1"
                  onClick={closeCart}
                >
                  Seguir Comprando
                </button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}