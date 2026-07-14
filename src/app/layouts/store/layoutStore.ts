import { create } from "zustand";

type LayoutState = {
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  isProfilePanelOpen: boolean;

  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;

  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleMobileSidebar: () => void;

  openProfilePanel: () => void;
  closeProfilePanel: () => void;
  toggleProfilePanel: () => void;
};

export const useLayoutStore = create<LayoutState>((set) => ({
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  isProfilePanelOpen: false,

  toggleSidebar: () =>
    set((state) => ({
      isSidebarCollapsed: !state.isSidebarCollapsed,
    })),

  collapseSidebar: () =>
    set({
      isSidebarCollapsed: true,
    }),

  expandSidebar: () =>
    set({
      isSidebarCollapsed: false,
    }),

  openMobileSidebar: () =>
    set({
      isMobileSidebarOpen: true,
    }),

  closeMobileSidebar: () =>
    set({
      isMobileSidebarOpen: false,
    }),

  toggleMobileSidebar: () =>
    set((state) => ({
      isMobileSidebarOpen: !state.isMobileSidebarOpen,
    })),

  openProfilePanel: () =>
    set({
      isProfilePanelOpen: true,
    }),

  closeProfilePanel: () =>
    set({
      isProfilePanelOpen: false,
    }),

  toggleProfilePanel: () =>
    set((state) => ({
      isProfilePanelOpen: !state.isProfilePanelOpen,
    })),
}));