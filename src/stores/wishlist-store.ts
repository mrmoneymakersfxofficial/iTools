import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: string[];
  toggleItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  addItem: (itemOrId: any) => void;
  removeItem: (productId: string) => void;
  syncFromDb: () => Promise<void>;
  getCount: () => number;
}

async function syncWishlistApi(productId: string, action: "add" | "remove" | "toggle") {
  if (typeof window === "undefined") return;
  try {
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, action }),
    });
  } catch (err) {
    console.warn("Wishlist sync error:", err);
  }
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (productId) => {
        if (!productId) return;
        const exists = get().items.includes(productId);
        set((state) => {
          if (exists) {
            return { items: state.items.filter((id) => id !== productId) };
          }
          return { items: [...state.items, productId] };
        });
        syncWishlistApi(productId, exists ? "remove" : "add");
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
        const id = typeof itemOrId === "string" ? itemOrId : itemOrId?._id || itemOrId?.id || itemOrId?.slug;
        if (!id) return;
        if (get().items.includes(id)) return;
        set((state) => ({ items: [...state.items, id] }));
        syncWishlistApi(id, "add");
      },
      removeItem: (productId) => {
        if (!productId) return;
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }));
        syncWishlistApi(productId, "remove");
      },
      syncFromDb: async () => {
        if (typeof window === "undefined") return;
        try {
          const res = await fetch("/api/wishlist");
          if (!res.ok) return;
          const data = await res.json();
          if (Array.isArray(data.items) && data.items.length > 0) {
            set((state) => {
              const merged = Array.from(new Set([...state.items, ...data.items]));
              return { items: merged };
            });
          }
        } catch (err) {
          console.warn("Error syncing wishlist from DB:", err);
        }
      },
      getCount: () => get().items.length,
    }),
    { name: "itools-wishlist" }
  )
);