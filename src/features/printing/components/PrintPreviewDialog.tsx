import { ArrowLeft, Printer, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/shared/ui/button";
import type { PrintableDocument } from "../types/print.types";

type PrintPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: PrintableDocument | null;
};

export function PrintPreviewDialog({
  open,
  onOpenChange,
  document,
}: PrintPreviewDialogProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open || !document) return null;

  function handlePrint() {
    const frameWindow = iframeRef.current?.contentWindow;
    if (!frameWindow) return;
    frameWindow.focus();
    frameWindow.print();
  }

  return createPortal(
    <section
      role="dialog"
      aria-modal="true"
      aria-label={document.title}
      className="fixed inset-0 z-[120] flex min-h-0 flex-col bg-background"
    >
      <header className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-border/55 bg-card px-3 py-2.5 sm:px-5 lg:px-7">
        <div className="flex min-w-0 items-center gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-10 w-10 shrink-0 rounded-[13px]"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>

          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold tracking-[-0.02em] text-foreground sm:text-[17px]">
              {document.title}
            </p>
            <p className="mt-0.5 hidden text-[11px] text-muted-foreground sm:block">
              Full-page preview · Review the document before printing or saving as PDF.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-[10.5px] font-medium text-muted-foreground md:inline-flex">
            {document.orientation === "landscape" ? "A4 Landscape" : "A4 Portrait"}
          </span>
          <Button
            type="button"
            onClick={handlePrint}
            className="h-10 rounded-[13px] px-3.5"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print / Save PDF</span>
            <span className="sm:hidden">Print</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="hidden h-10 w-10 rounded-[13px] sm:inline-flex"
            aria-label="Close print preview"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-auto bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.06),_transparent_38%),hsl(var(--muted)/0.28)] p-2 sm:p-5 lg:p-8">
        <div className="mx-auto h-full min-h-[620px] w-full max-w-[1120px] overflow-hidden rounded-[18px] border border-border/55 bg-white shadow-[0_22px_70px_rgba(34,24,72,0.14)] sm:rounded-[22px]">
          <iframe
            ref={iframeRef}
            title={document.title}
            srcDoc={document.html}
            className="h-full min-h-[620px] w-full bg-white"
          />
        </div>
      </div>
    </section>,
    window.document.body,
  );
}
