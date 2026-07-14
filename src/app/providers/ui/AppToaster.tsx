import { Toaster } from "sonner";

import { useAppTheme } from "@/app/providers/theme";

export function AppToaster() {
  const { resolvedTheme } = useAppTheme();

  return (
    <Toaster
      theme={
        resolvedTheme === "dark"
          ? "dark"
          : "light"
      }
      position="top-right"
      richColors
      closeButton
      expand
      toastOptions={{
        duration: 4000,
      }}
    />
  );
}