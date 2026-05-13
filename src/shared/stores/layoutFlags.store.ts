import { create } from "zustand";

interface LayoutFlagsState {
  rightSidebarMounted: boolean;
  setRightSidebarMounted: (mounted: boolean) => void;
}

export const useLayoutFlagsStore = create<LayoutFlagsState>((set) => ({
  rightSidebarMounted: false,
  setRightSidebarMounted: (mounted) => set({ rightSidebarMounted: mounted }),
}));
