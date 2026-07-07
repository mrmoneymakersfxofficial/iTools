import { create } from "zustand";
import type { Product } from "@/types";

interface QuickViewState {
  isOpen: boolean;
  product: Product | null;
  brandColor: string;
  openQuickView: (product: Product, brandColor?: string) => void;
  closeQuickView: () => void;
}

export const useQuickViewStore = create<QuickViewState>()((set) => ({
  isOpen: false,
  product: null,
  brandColor: "#D1001C",
  openQuickView: (product, brandColor = "#D1001C") =>
    set({ isOpen: true, product, brandColor }),
  closeQuickView: () => set({ isOpen: false, product: null }),
}));