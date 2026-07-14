import { LANGUAGE_STORAGE_KEY } from "./locale.constants";
import type { AppLanguage } from "./locale.types";

export const localeStorage = {
  get(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      return window.localStorage.getItem(
        LANGUAGE_STORAGE_KEY,
      );
    } catch {
      return null;
    }
  },

  set(language: AppLanguage): void {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        language,
      );
    } catch {
      //
    }
  },

  clear(): void {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.removeItem(
        LANGUAGE_STORAGE_KEY,
      );
    } catch {
   //
    }
  },
};