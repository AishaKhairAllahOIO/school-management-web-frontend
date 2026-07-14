import { useContext } from "react";

import { LocaleContext } from "./locale-context";
import type { LocaleContextValue } from "./locale.types";

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);

  if (context === null) {
    throw new Error(
      "useLocale must be used within LocaleProvider",
    );
  }

  return context;
}