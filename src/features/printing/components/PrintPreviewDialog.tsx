import {
  ArrowLeft,
  Maximize2,
  Minus,
  Plus,
  Printer,
  Scan,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { Button } from "@/shared/ui/button";
import type { PrintableDocument } from "../types/print.types";

type PrintPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: PrintableDocument | null;
};

type PreviewMode = "custom" | "fit-page" | "fit-width";

const MIN_ZOOM = 0.35;
const MAX_ZOOM = 1.8;
const ZOOM_STEP = 0.1;

const A4_PIXELS = {
  portrait: { width: 794, height: 1123 },
  landscape: { width: 1123, height: 794 },
} as const;

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

export function PrintPreviewDialog({
  open,
  onOpenChange,
  document,
}: PrintPreviewDialogProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const orientation = document?.orientation ?? "portrait";
  const pageSize = A4_PIXELS[orientation];

  const [zoom, setZoom] = useState(0.8);
  const [mode, setMode] = useState<PreviewMode>("fit-page");
  const [documentHeight, setDocumentHeight] = useState(pageSize.height);
  const [isReady, setIsReady] = useState(false);

  const measureDocument = useCallback(() => {
    const frameDocument = iframeRef.current?.contentDocument;
    if (!frameDocument) return;

    const root = frameDocument.documentElement;
    const body = frameDocument.body;
    const measuredHeight = Math.max(
      pageSize.height,
      root.scrollHeight,
      root.offsetHeight,
      body?.scrollHeight ?? 0,
      body?.offsetHeight ?? 0,
    );

    setDocumentHeight(Math.ceil(measuredHeight));
    setIsReady(true);
  }, [pageSize.height]);

  const applyFit = useCallback(
    (nextMode: Exclude<PreviewMode, "custom">) => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const horizontalPadding = viewport.clientWidth < 640 ? 24 : 64;
      const verticalPadding = viewport.clientHeight < 640 ? 24 : 56;
      const availableWidth = Math.max(
        240,
        viewport.clientWidth - horizontalPadding,
      );
      const availableHeight = Math.max(
        240,
        viewport.clientHeight - verticalPadding,
      );

      const widthScale = availableWidth / pageSize.width;
      const heightScale = availableHeight / Math.min(documentHeight, pageSize.height);
      const nextZoom =
        nextMode === "fit-width"
          ? widthScale
          : Math.min(widthScale, heightScale);

      setMode(nextMode);
      setZoom(clampZoom(nextZoom));
    },
    [documentHeight, pageSize.height, pageSize.width],
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "+") {
        event.preventDefault();
        setMode("custom");
        setZoom((current) => clampZoom(current + ZOOM_STEP));
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "-") {
        event.preventDefault();
        setMode("custom");
        setZoom((current) => clampZoom(current - ZOOM_STEP));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open || !document) return;

    setIsReady(false);
    setDocumentHeight(pageSize.height);
    setMode("fit-page");

    const frame = window.requestAnimationFrame(() => {
      applyFit("fit-page");
    });

    return () => window.cancelAnimationFrame(frame);
  }, [applyFit, document, open, pageSize.height]);

  useEffect(() => {
    if (!open) return;

    const handleResize = () => {
      if (mode === "fit-page" || mode === "fit-width") {
        applyFit(mode);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [applyFit, mode, open]);

  const scaledSize = useMemo(
    () => ({
      width: Math.ceil(pageSize.width * zoom),
      height: Math.ceil(documentHeight * zoom),
    }),
    [documentHeight, pageSize.width, zoom],
  );

  if (!open || !document) return null;

  function handlePrint() {
    const frameWindow = iframeRef.current?.contentWindow;
    if (!frameWindow) return;
    frameWindow.focus();
    frameWindow.print();
  }

  function updateZoom(nextZoom: number) {
    setMode("custom");
    setZoom(clampZoom(nextZoom));
  }

  return createPortal(
    <section
      role="dialog"
      aria-modal="true"
      aria-label={document.title}
      className="fixed inset-0 z-[120] flex min-h-0 flex-col bg-background"
    >
      <header className="relative z-10 flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border/55 bg-card/98 px-3 py-2.5 shadow-[0_8px_30px_rgba(34,24,72,0.05)] backdrop-blur-xl sm:px-5 lg:px-7">
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
              Review every page, adjust the zoom, then print or save as PDF.
            </p>
          </div>
        </div>

        <div className="order-3 flex w-full items-center justify-center gap-1.5 sm:order-none sm:w-auto">
          <div className="flex items-center rounded-[13px] border border-border/60 bg-muted/25 p-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => updateZoom(zoom - ZOOM_STEP)}
              disabled={zoom <= MIN_ZOOM}
              className="h-8 w-8 rounded-[9px]"
              aria-label="Zoom out"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>

            <button
              type="button"
              onClick={() => updateZoom(1)}
              className="min-w-[58px] px-2 text-center text-[11px] font-semibold tabular-nums text-foreground"
              title="Reset zoom to 100%"
            >
              {Math.round(zoom * 100)}%
            </button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => updateZoom(zoom + ZOOM_STEP)}
              disabled={zoom >= MAX_ZOOM}
              className="h-8 w-8 rounded-[9px]"
              aria-label="Zoom in"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Button
            type="button"
            variant={mode === "fit-page" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => applyFit("fit-page")}
            className="h-10 w-10 rounded-[12px]"
            title="Fit page"
            aria-label="Fit page"
          >
            <Scan className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant={mode === "fit-width" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => applyFit("fit-width")}
            className="h-10 w-10 rounded-[12px]"
            title="Fit width"
            aria-label="Fit width"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-[10.5px] font-medium text-muted-foreground lg:inline-flex">
            {orientation === "landscape" ? "A4 Landscape" : "A4 Portrait"}
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

      <div
        ref={viewportRef}
        className="relative min-h-0 flex-1 overflow-auto overscroll-contain bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.07),_transparent_34%),linear-gradient(to_bottom,hsl(var(--muted)/0.28),hsl(var(--background)))]"
      >
        <div className="flex min-h-full min-w-full items-start justify-center p-3 sm:p-7 lg:p-10">
          <div
            className="relative shrink-0 transition-[width,height] duration-200 ease-out"
            style={{
              width: scaledSize.width,
              height: scaledSize.height,
            }}
          >
            {!isReady ? (
              <div className="absolute inset-0 z-10 grid place-items-center rounded-[8px] bg-white text-sm text-muted-foreground shadow-[0_24px_80px_rgba(35,25,70,0.16)]">
                Preparing preview…
              </div>
            ) : null}

            <iframe
              ref={iframeRef}
              title={document.title}
              srcDoc={document.html}
              onLoad={() => {
                measureDocument();
                window.requestAnimationFrame(() => {
                  if (mode === "fit-page" || mode === "fit-width") {
                    applyFit(mode);
                  }
                });
              }}
              scrolling="no"
              className="absolute left-0 top-0 origin-top-left border-0 bg-white shadow-[0_24px_80px_rgba(35,25,70,0.16)]"
              style={{
                width: pageSize.width,
                height: documentHeight,
                transform: `scale(${zoom})`,
              }}
            />
          </div>
        </div>
      </div>
    </section>,
    window.document.body,
  );
}
