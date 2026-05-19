import { create } from "zustand";

type LayoutState = {
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;

  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
};

export const useLayoutStore = create<LayoutState>((set) => ({
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,

  toggleSidebar: () =>
    set((state) => ({
      isSidebarCollapsed: !state.isSidebarCollapsed,
    })),

  toggleMobileSidebar: () =>
    set((state) => ({
      isMobileSidebarOpen: !state.isMobileSidebarOpen,
    })),

  closeMobileSidebar: () =>
    set({
      isMobileSidebarOpen: false,
    }),
}));