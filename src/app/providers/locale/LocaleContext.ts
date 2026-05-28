import { createContext } from "react";

import type { LocaleContextValue } from "@/app/providers/locale/locale.types";

export const LocaleContext = createContext<LocaleContextValue | null>(null);