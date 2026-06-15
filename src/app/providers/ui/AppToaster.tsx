import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export function AppToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      theme={resolvedTheme as "light" | "dark"}
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        duration: 4000,
      }}
    />
  );
}