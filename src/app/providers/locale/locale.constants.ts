import type { AppLanguage } from "./locale.types";

export const LANGUAGE_STORAGE_KEY = "app-language";

export const DEFAULT_LANGUAGE: AppLanguage = "en";

export const SUPPORTED_LANGUAGES = [
  "ar",
  "en",
] as const satisfies readonly AppLanguage[];