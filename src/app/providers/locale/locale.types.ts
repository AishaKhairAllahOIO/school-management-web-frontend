import type { TranslationDictionary } from "@/app/translations/types";

export type AppLanguage = "ar" | "en";

export type AppDirection = "rtl" | "ltr";

export type LocaleContextValue = {
  language: AppLanguage;
  direction: AppDirection;
  t: TranslationDictionary;
  setLanguage: (language: AppLanguage) => void;
};