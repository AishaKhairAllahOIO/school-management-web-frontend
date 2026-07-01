import { create } from "zustand";
import { authStorage } from "../lib/auth.storage";
import type { AuthUser } from "../types/auth.types";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  permissions: string[];
  isAuthenticated: boolean;
  isHydrated: boolean;
  hydrate: () => void;
  setAuth: (payload: { token: string; user: AuthUser; permissions: string[]; rememberMe: boolean }) => void;
  clearAuth: () => void;
};

const storedAuth = authStorage.getAuthData();

export const useAuthStore = create<AuthState>((set) => ({
  token: storedAuth?.token ?? null,
  user: storedAuth?.user ?? null,
  permissions: storedAuth?.permissions ?? [],
  isAuthenticated: Boolean(storedAuth?.token && storedAuth?.user),
  isHydrated: false,

  hydrate: () => {
    const auth = authStorage.getAuthData();

    set({
      token: auth?.token ?? null,
      user: auth?.user ?? null,
      permissions: auth?.permissions ?? [],
      isAuthenticated: Boolean(auth?.token && auth?.user),
      isHydrated: true,
    });
  },

  setAuth: ({ token, user, permissions, rememberMe }) => {
    authStorage.set({ token, user, permissions, rememberMe });

    set({
      token,
      user,
      permissions,
      isAuthenticated: true,
      isHydrated: true,
    });
  },

  clearAuth: () => {
    authStorage.clear();

    set({
      token: null,
      user: null,
      permissions: [],
      isAuthenticated: false,
      isHydrated: true,
    });
  },
}));
