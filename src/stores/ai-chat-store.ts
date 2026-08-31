import { create } from "zustand";

interface AiChatStore {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

export const useAiChatStore = create<AiChatStore>((set) => ({
  isOpen: false,
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
}));
