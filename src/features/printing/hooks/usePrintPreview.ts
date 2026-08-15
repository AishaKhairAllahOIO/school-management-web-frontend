import { useCallback, useState } from "react";

import type { PrintableDocument } from "../types/print.types";

export function usePrintPreview() {
  const [document, setDocument] =
    useState<PrintableDocument | null>(null);

  const openPreview = useCallback(
    (printableDocument: PrintableDocument) => {
      setDocument(printableDocument);
    },
    [],
  );

  const closePreview = useCallback(() => {
    setDocument(null);
  }, []);

  const setOpen = useCallback(
    (open: boolean) => {
      if (!open) {
        setDocument(null);
      }
    },
    [],
  );

  return {
    document,

    isOpen: Boolean(document),

    openPreview,

    closePreview,

    setOpen,
  };
}