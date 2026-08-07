import { useState } from "react";

import type {
  PrintableDocument,
} from "../types/print.types";

export function usePrintPreview() {
  const [document, setDocument] =
    useState<PrintableDocument | null>(null);

  return {
    document,

    isOpen: Boolean(document),

    openPreview: (
      printableDocument: PrintableDocument,
    ) => {
      setDocument(printableDocument);
    },

    closePreview: () => {
      setDocument(null);
    },

    setOpen: (open: boolean) => {
      if (!open) {
        setDocument(null);
      }
    },
  };
}