import type { ReactNode } from "react";

import { LocaleProvider } from "@/app/providers/locale";
import { QueryProvider } from "@/app/providers/query";
import { ThemeProvider } from "@/app/providers/theme";
import { AppToaster } from "@/app/providers/ui";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <LocaleProvider>
          {children}
          <AppToaster />
        </LocaleProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}