import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { LocaleContext } from "@/app/providers/locale/LocaleContext";
import { LANGUAGE_STORAGE_KEY } from "@/app/providers/locale/locale.constants";
import {
  getDirection,
  getInitialLanguage,
} from "@/app/providers/locale/locale.helpers";
import type { LocaleContextValue } from "@/app/providers/locale/locale.types";

type LocaleProviderProps = {
  children: ReactNode;
};

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [language, setLanguage] = useState(getInitialLanguage);

  const direction = getDirection(language);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;

    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language, direction]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      language,
      direction,
      setLanguage,
    }),
    [language, direction]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}