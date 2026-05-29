import { create } from "zustand";
import type { User } from "../types/auth.types";

interface AuthState {
  token: string | null;
  user: User | null;
  permissions: string[];
  isAuthenticated: boolean;

  setAuth: (token: string, user: User, permissions: string[]) => void;
  restoreAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token:
   localStorage.getItem("access_token"),
  user: 
   localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")!)
  : null,
  permissions:
   localStorage.getItem("permissions")
        ? JSON.parse(
            localStorage.getItem("permissions")!
          )
        : [],
  isAuthenticated: !!localStorage.getItem("access_token"),

  setAuth: (token, user, permissions) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("permissions", JSON.stringify(permissions));
    console.log("SET AUTH ROLE:", user?.role);
    
    set({
      token,
      user,
      permissions,
      isAuthenticated: true,
    });
  },

  restoreAuth: () => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    const permissions = localStorage.getItem("permissions");

    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
        permissions: permissions ? JSON.parse(permissions) : [],
        isAuthenticated: true,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");

    set({
      token: null,
      user: null,
      permissions: [],
      isAuthenticated: false,
    });
  },
}));

 