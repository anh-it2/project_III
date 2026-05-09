import { create } from "zustand";

interface NavigationState {
  isNavigating: boolean;
  setNavigating: (value: boolean) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  isNavigating: false,
  setNavigating: (value) => set({ isNavigating: value }),
}));
