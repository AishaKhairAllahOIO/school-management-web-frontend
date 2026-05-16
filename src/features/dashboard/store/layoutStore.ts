import { create } from "zustand";

type LayoutStore = 
{
  isMobileSidebarOpen: boolean;
  openMenus: string[];

  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleMobileSidebar: () => void;

  toggleMenu: (title: string) => void;
};

export const useLayoutStore = create<LayoutStore>((set) => ({
  isMobileSidebarOpen: false,
  openMenus: ["User Management"],

  openMobileSidebar: () => set({ isMobileSidebarOpen: true }),

  closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),

  toggleMobileSidebar: () =>
    set((state) => ({
      isMobileSidebarOpen: !state.isMobileSidebarOpen,
    })),

  toggleMenu: (title) =>
    set((state) => ({
      openMenus: state.openMenus.includes(title)
        ? state.openMenus.filter((item) => item !== title)
        : [...state.openMenus, title],
    })),
}));