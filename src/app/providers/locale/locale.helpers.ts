import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from "./locale.constants";
import { localeStorage } from "./locale.storage";
import type {
  AppDirection,
  AppLanguage,
} from "./locale.types";

export function isSupportedLanguage(
  language: string | null | undefined,
): language is AppLanguage {
  if (!language) {
    return false;
  }

  return SUPPORTED_LANGUAGES.some(
    (supportedLanguage) =>
      supportedLanguage === language,
  );
}

export function getDirection(
  language: AppLanguage,
): AppDirection {
  return language === "ar" ? "rtl" : "ltr";
}

export function normalizeBrowserLanguage(
  language: string,
): string {
  return language.trim().toLowerCase().split("-")[0] ?? "";
}

function getBrowserLanguage(): AppLanguage | null {
  if (
    typeof navigator === "undefined" ||
    !navigator.languages
  ) {
    return null;
  }

  for (const browserLanguage of navigator.languages) {
    const normalizedLanguage =
      normalizeBrowserLanguage(browserLanguage);

    if (isSupportedLanguage(normalizedLanguage)) {
      return normalizedLanguage;
    }
  }

  return null;
}

export function getInitialLanguage(): AppLanguage {
  const storedLanguage = localeStorage.get();

  if (isSupportedLanguage(storedLanguage)) {
    return storedLanguage;
  }

  const browserLanguage = getBrowserLanguage();

  return browserLanguage ?? DEFAULT_LANGUAGE;
}