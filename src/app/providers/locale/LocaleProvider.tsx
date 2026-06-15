import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { translations } from "@/app/translations";

import { LocaleContext } from "./LocaleContext";
import { LANGUAGE_STORAGE_KEY } from "./locale.constants";
import { getDirection, getInitialLanguage } from "./locale.helpers";
import type { LocaleContextValue } from "./locale.types";

type LocaleProviderProps = {
  children: ReactNode;
};

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [language, setLanguage] = useState(getInitialLanguage);

  const direction = getDirection(language);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language, direction]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      language,
      direction,
      setLanguage,
      t: translations[language],
    }),
    [language, direction]
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}