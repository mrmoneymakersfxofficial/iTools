import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareProduct {
  slug: string;
  name: string;
  price: number;
  salePrice?: number;
  image?: string;
  brand?: string;
  specs?: Record<string, string>;
}

interface CompareStore {
  items: CompareProduct[];
  addItem: (item: CompareProduct) => void;
  removeItem: (slug: string) => void;
  clearAll: () => void;
  isInCompare: (slug: string) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const { items } = get();
        if (items.length >= 4) return; // Max 4 products
        if (items.find((i) => i.slug === item.slug)) return;
        set({ items: [...items, item] });
      },
      removeItem: (slug) => set({ items: get().items.filter((i) => i.slug !== slug) }),
      clearAll: () => set({ items: [] }),
      isInCompare: (slug) => get().items.some((i) => i.slug === slug),
    }),
    { name: "compare-store" }
  )
);
