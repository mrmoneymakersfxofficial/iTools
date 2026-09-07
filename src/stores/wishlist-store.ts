import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: string[];
  toggleItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  addItem: (itemOrId: any) => void;
  removeItem: (productId: string) => void;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (productId) => {
        if (!productId) return;
        set((state) => {
          if (state.items.includes(productId)) {
            return { items: state.items.filter((id) => id !== productId) };
          }
          return { items: [...state.items, productId] };
        });
      },
      isWishlisted: (productId) => {
        if (!productId) return false;
        return get().items.includes(productId);
      },
      isInWishlist: (productId) => {
        if (!productId) return false;
        return get().items.includes(productId);
      },
      addItem: (itemOrId) => {
        const id = typeof itemOrId === "string" ? itemOrId : itemOrId?._id || itemOrId?.id;
        if (!id) return;
        set((state) => {
          if (state.items.includes(id)) return state;
          return { items: [...state.items, id] };
        });
      },
      removeItem: (productId) => {
        if (!productId) return;
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }));
      },
      getCount: () => get().items.length,
    }),
    { name: "itools-wishlist" }
  )
);