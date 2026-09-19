import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product, quantity = 1) => {
        const prodId = product.id || (product as any)._id || "";
        const maxStock = typeof product.stock === "number" && product.stock >= 0 ? product.stock : Infinity;
        if (maxStock === 0) return;
        const normalizedProduct: Product = { ...(product as any), id: prodId, _id: prodId };
        set((state) => {
          const existing = state.items.find(
            (i) => (i.product.id || (i.product as any)._id) === prodId
          );
          if (existing) {
            const newQty = Math.min(existing.quantity + quantity, maxStock);
            return {
              items: state.items.map((i) =>
                (i.product.id || (i.product as any)._id) === prodId
                  ? { ...i, quantity: newQty }
                  : i
              ),
            };
          }
          const initialQty = Math.min(quantity, maxStock);
          return { items: [...state.items, { product: normalizedProduct, quantity: initialQty }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => (i.product.id || (i.product as any)._id) !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => {
          const item = state.items.find(
            (i) => (i.product.id || (i.product as any)._id) === productId
          );
          const maxStock = item && typeof item.product.stock === "number" && item.product.stock >= 0 ? item.product.stock : Infinity;
          const cappedQty = Math.min(quantity, maxStock);
          return {
            items: state.items.map((i) =>
              (i.product.id || (i.product as any)._id) === productId
                ? { ...i, quantity: cappedQty }
                : i
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
        );
      },
    }),
    { name: "itools-cart", partialize: (s) => ({ items: s.items }) }
  )
);