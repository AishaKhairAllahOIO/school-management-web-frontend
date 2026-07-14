import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import { translations } from "@/app/translations";

import { LocaleContext } from "./locale-context";
import {
  getDirection,
  getInitialLanguage,
} from "./locale.helpers";
import { localeStorage } from "./locale.storage";
import type {
  AppLanguage,
  LocaleContextValue,
} from "./locale.types";

type LocaleProviderProps = {
  children: ReactNode;
};

export function LocaleProvider({
  children,
}: LocaleProviderProps) {
  const [language, setLanguageState] =
    useState<AppLanguage>(getInitialLanguage);

  const direction = getDirection(language);

  const setLanguage = useCallback(
    (nextLanguage: AppLanguage) => {
      setLanguageState(nextLanguage);
    },
    [],
  );

  useEffect(() => {
    const documentElement =
      window.document.documentElement;

    documentElement.lang = language;
    documentElement.dir = direction;

    localeStorage.set(language);
  }, [language, direction]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      language,
      direction,
      setLanguage,
      t: translations[language],
    }),
    [language, direction, setLanguage],
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}