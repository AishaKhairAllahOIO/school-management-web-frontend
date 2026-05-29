import { Toaster } from "sonner";

import { useLocale } from "@/app/providers/locale";

export function AppToaster() {
  const { direction } = useLocale();

  return (
    <Toaster
      richColors
      closeButton
      position={direction === "rtl" ? "top-left" : "top-right"}
      toastOptions={{
        duration: 4000,
      }}
    />
  );
}