import { createContext } from "react";

import type { LocaleContextValue } from "./locale.types";

export const LocaleContext =
  createContext<LocaleContextValue | null>(null);