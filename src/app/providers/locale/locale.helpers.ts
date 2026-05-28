import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
} from "@/app/providers/locale/locale.constants";

import type {
  AppDirection,
  AppLanguage,
} from "@/app/providers/locale/locale.types";

export function isSupportedLanguage(
  language: string | null
): language is AppLanguage {
  return SUPPORTED_LANGUAGES.includes(language as AppLanguage);
}

export function getDirection(language: AppLanguage): AppDirection {
  return language === "ar" ? "rtl" : "ltr";
}

export function getInitialLanguage(): AppLanguage {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (isSupportedLanguage(savedLanguage)) {
    return savedLanguage;
  }

  return DEFAULT_LANGUAGE;
}