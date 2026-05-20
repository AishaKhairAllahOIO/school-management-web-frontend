import { create } from "zustand";

type Language = "en" | "ar";

type LayoutState = {
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  isProfilePanelOpen: boolean;

  language: Language;

  toggleSidebar: () => void;

  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;

  toggleProfilePanel: () => void;

  toggleLanguage: () => void;
};

export const useLayoutStore = create<LayoutState>((set) => ({
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  isProfilePanelOpen: false,

  language: "en",

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

  toggleProfilePanel: () =>
    set((state) => ({
      isProfilePanelOpen: !state.isProfilePanelOpen,
    })),

  toggleLanguage: () =>
    set((state) => ({
      language: state.language === "en" ? "ar" : "en",
    })),
}));