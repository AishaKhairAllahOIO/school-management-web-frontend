export type AppLanguage = "ar" | "en";
export type AppDirection = "rtl" | "ltr";

export type LocaleContextValue = {
  language: AppLanguage;
  direction: AppDirection;
  setLanguage: (language: AppLanguage) => void;
};