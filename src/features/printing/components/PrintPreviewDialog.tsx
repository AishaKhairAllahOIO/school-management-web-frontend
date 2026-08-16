import {
  ArrowLeft,
  Maximize2,
  Minus,
  Plus,
  Printer,
  Scan,
  Settings2,
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

type PreviewMode =
  | "custom"
  | "fit-page"
  | "fit-width";

type PrintSettings = {
  monochrome: boolean;
};

const MIN_ZOOM = 0.35;
const MAX_ZOOM = 1.8;
const ZOOM_STEP = 0.1;

const A4_PIXELS = {
  portrait: {
    width: 794,
    height: 1123,
  },
  landscape: {
    width: 1123,
    height: 794,
  },
} as const;

function clampZoom(value: number) {
  return Math.min(
    MAX_ZOOM,
    Math.max(MIN_ZOOM, value),
  );
}

export function PrintPreviewDialog({
  open,
  onOpenChange,
  document,
}: PrintPreviewDialogProps) {
  const iframeRef =
    useRef<HTMLIFrameElement | null>(null);

  const viewportRef =
    useRef<HTMLDivElement | null>(null);

  /**
   * Used to invalidate old iframe callbacks.
   *
   * When a new printable document is opened,
   * callbacks belonging to the previous iframe
   * must no longer update the state.
   */
  const previewGenerationRef =
    useRef(0);

  const orientation =
    document?.orientation ?? "portrait";

  const pageSize =
    A4_PIXELS[orientation];

  const [zoom, setZoom] =
    useState(0.8);

  const [mode, setMode] =
    useState<PreviewMode>("fit-page");

  const [documentHeight, setDocumentHeight] =
    useState<number>(pageSize.height);

  const [isReady, setIsReady] =
    useState(false);

  const [showSettings, setShowSettings] =
    useState(false);

  const [settings, setSettings] =
    useState<PrintSettings>({
      monochrome:
        document?.kind ===
        "official-document",
    });

  /**
   * ---------------------------------------------------------
   * SAFE IFRAME DOCUMENT
   * ---------------------------------------------------------
   *
   * Never assume contentDocument/documentElement/body exists.
   */
  const getFrameDocument =
    useCallback(() => {
      const iframe =
        iframeRef.current;

      if (!iframe) {
        return null;
      }

      try {
        return iframe.contentDocument;
      } catch {
        return null;
      }
    }, []);

  /**
   * ---------------------------------------------------------
   * MEASURE DOCUMENT
   * ---------------------------------------------------------
   */
  const measureDocument =
    useCallback(() => {
      const frameDocument =
        getFrameDocument();

      if (!frameDocument) {
        return false;
      }

      const root =
        frameDocument.documentElement;

      const body =
        frameDocument.body;

      const printPage =
        frameDocument.querySelector<HTMLElement>(
          ".print-page",
        );

      /**
       * Posters are always exactly one A4 page.
       */
      if (
        document?.kind === "poster"
      ) {
        setDocumentHeight(
          pageSize.height,
        );

        return true;
      }

      const measuredHeight =
        Math.max(
          pageSize.height,

          root?.scrollHeight ?? 0,
          root?.offsetHeight ?? 0,

          body?.scrollHeight ?? 0,
          body?.offsetHeight ?? 0,

          printPage?.scrollHeight ?? 0,
          printPage?.offsetHeight ?? 0,
        );

      setDocumentHeight(
        Math.ceil(measuredHeight),
      );

      return true;
    }, [
      document?.kind,
      getFrameDocument,
      pageSize.height,
    ]);

  /**
   * ---------------------------------------------------------
   * FIT
   * ---------------------------------------------------------
   */
  const applyFit =
    useCallback(
      (
        nextMode:
          | "fit-page"
          | "fit-width",
      ) => {
        const viewport =
          viewportRef.current;

        if (!viewport) {
          return;
        }

        const horizontalPadding =
          viewport.clientWidth < 640
            ? 24
            : 64;

        const verticalPadding =
          viewport.clientHeight < 640
            ? 24
            : 56;

        const availableWidth =
          Math.max(
            240,
            viewport.clientWidth -
              horizontalPadding,
          );

        const availableHeight =
          Math.max(
            240,
            viewport.clientHeight -
              verticalPadding,
          );

        const widthScale =
          availableWidth /
          pageSize.width;

        /**
         * Posters:
         *
         * Always fit one A4 page.
         *
         * Official documents:
         *
         * fit-page uses the actual document height,
         * but never less than A4.
         */
        const effectiveHeight =
          Math.max(
            pageSize.height,
            documentHeight,
          );

        const heightScale =
          availableHeight /
          effectiveHeight;

        const nextZoom =
          nextMode === "fit-width"
            ? widthScale
            : Math.min(
                widthScale,
                heightScale,
              );

        setMode(nextMode);

        setZoom(
          clampZoom(nextZoom),
        );
      },
      [
        documentHeight,
        pageSize.height,
        pageSize.width,
      ],
    );

  /**
   * ---------------------------------------------------------
   * IFRAME LOAD
   * ---------------------------------------------------------
   */
  const handleFrameLoad =
    useCallback(() => {
      const currentGeneration =
        previewGenerationRef.current;

      const frame =
        iframeRef.current;

      if (!frame) {
        return;
      }

      const frameDocument =
        frame.contentDocument;

      if (!frameDocument) {
        return;
      }

      const apply =
        () => {
          /**
           * Ignore callbacks from an old iframe.
           */
          if (
            currentGeneration !==
            previewGenerationRef.current
          ) {
            return;
          }

          const currentFrame =
            iframeRef.current;

          if (!currentFrame) {
            return;
          }

          const currentDocument =
            currentFrame.contentDocument;

          if (!currentDocument) {
            return;
          }

          measureDocument();

          setIsReady(true);
        };

      apply();

      const raf =
        window.requestAnimationFrame(
          apply,
        );

      const timeout100 =
        window.setTimeout(
          apply,
          100,
        );

      const timeout400 =
        window.setTimeout(
          apply,
          400,
        );

      const timeout800 =
        window.setTimeout(
          apply,
          800,
        );

      /**
       * There is no need to return this cleanup
       * from the event handler itself.
       *
       * The generation mechanism invalidates
       * stale callbacks safely.
       */
      void raf;
      void timeout100;
      void timeout400;
      void timeout800;
    }, [
      measureDocument,
    ]);

  /**
   * ---------------------------------------------------------
   * BODY SCROLL LOCK
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      window.document.body.style
        .overflow;

    window.document.body.style.overflow =
      "hidden";

    return () => {
      window.document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  /**
   * ---------------------------------------------------------
   * KEYBOARD SHORTCUTS
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        if (showSettings) {
          setShowSettings(false);
          return;
        }

        onOpenChange(false);
        return;
      }

      if (
        (event.ctrlKey ||
          event.metaKey) &&
        (event.key === "+" ||
          event.key === "=")
      ) {
        event.preventDefault();

        setMode("custom");

        setZoom((current) =>
          clampZoom(
            current + ZOOM_STEP,
          ),
        );

        return;
      }

      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key === "-"
      ) {
        event.preventDefault();

        setMode("custom");

        setZoom((current) =>
          clampZoom(
            current - ZOOM_STEP,
          ),
        );

        return;
      }

      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key === "0"
      ) {
        event.preventDefault();

        setMode("custom");
        setZoom(1);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    onOpenChange,
    open,
    showSettings,
  ]);

  /**
   * ---------------------------------------------------------
   * RESET WHEN DOCUMENT CHANGES
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!open || !document) {
      return;
    }

    /**
     * Invalidate every callback associated
     * with the previous iframe.
     */
    previewGenerationRef.current += 1;

    setIsReady(false);

    setDocumentHeight(
      pageSize.height,
    );

    setMode("fit-page");

    setZoom(0.8);

    setShowSettings(false);

    setSettings({
      monochrome:
        document.kind ===
        "official-document",
    });

    /**
     * Clear old iframe reference before the
     * new srcDoc is mounted/loaded.
     */
    iframeRef.current = null;
  }, [
    document,
    open,
    pageSize.height,
  ]);

  /**
   * ---------------------------------------------------------
   * APPLY INITIAL FIT
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!open || !isReady) {
      return;
    }

    applyFit("fit-page");
  }, [
    applyFit,
    isReady,
    open,
  ]);

  /**
   * ---------------------------------------------------------
   * RESIZE
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleResize() {
      if (
        mode === "fit-page" ||
        mode === "fit-width"
      ) {
        applyFit(mode);
      }
    }

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, [
    applyFit,
    mode,
    open,
  ]);

  /**
   * ---------------------------------------------------------
   * SAFE MONOCHROME
   * ---------------------------------------------------------
   *
   * THIS IS THE IMPORTANT FIX.
   *
   * Previously:
   *
   * frameDocument.documentElement.classList.toggle(...)
   *
   * could crash when documentElement was null.
   */
  useEffect(() => {
    if (!open || !isReady) {
      return;
    }

    const frame =
      iframeRef.current;

    if (!frame) {
      return;
    }

    let frameDocument:
      | Document
      | null = null;

    try {
      frameDocument =
        frame.contentDocument;
    } catch {
      return;
    }

    if (!frameDocument) {
      return;
    }

    const root =
      frameDocument.documentElement;

    if (!root) {
      return;
    }

    /**
     * Now classList is guaranteed to exist.
     */
    root.classList.toggle(
      "print-monochrome",
      Boolean(settings.monochrome),
    );
  }, [
    open,
    settings.monochrome,
    isReady,
  ]);

  /**
   * ---------------------------------------------------------
   * SCALED SIZE
   * ---------------------------------------------------------
   */
  const scaledSize = useMemo(
    () => ({
      width: Math.ceil(
        pageSize.width * zoom,
      ),

      height: Math.ceil(
        documentHeight * zoom,
      ),
    }),
    [
      documentHeight,
      pageSize.width,
      zoom,
    ],
  );

  if (!open || !document) {
    return null;
  }

  /**
   * ---------------------------------------------------------
   * PRINT
   * ---------------------------------------------------------
   */
  function handlePrint() {
    const frame =
      iframeRef.current;

    if (!frame || !isReady) {
      return;
    }

    try {
      const frameWindow =
        frame.contentWindow;

      if (!frameWindow) {
        return;
      }

      frameWindow.focus();
      frameWindow.print();
    } catch {
      /**
       * Never let a print failure crash
       * the React tree.
       */
      return;
    }
  }

  function updateZoom(
    nextZoom: number,
  ) {
    setMode("custom");

    setZoom(
      clampZoom(nextZoom),
    );
  }

  const kindLabel =
    document.kind === "poster"
      ? "Poster"
      : "Official document";

  const orientationLabel =
    orientation === "landscape"
      ? "A4 Landscape"
      : "A4 Portrait";

  return createPortal(
    <section
      role="dialog"
      aria-modal="true"
      aria-label={document.title}
      className="fixed inset-0 z-[120] flex min-h-0 flex-col bg-background"
    >
      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="relative z-10 shrink-0 border-b border-border/70 bg-card shadow-[0_8px_28px_rgb(31_25_78_/_0.08)]">
        <div className="flex min-h-[64px] items-center gap-3 px-3 py-2 sm:px-5 lg:px-7">

          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                onOpenChange(false)
              }
              className="h-9 w-9 shrink-0 rounded-[11px]"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </Button>

            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">

                <p className="truncate text-[14px] font-semibold tracking-[-0.02em] text-foreground sm:text-[15px]">
                  {document.title}
                </p>

                <span className="hidden shrink-0 rounded-full border border-primary/15 bg-primary/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-primary sm:inline-flex">
                  {kindLabel}
                </span>

              </div>

              <p className="mt-0.5 hidden text-[10px] text-muted-foreground md:block">
                Review the page, adjust the view, then print or save as PDF.
              </p>
            </div>
          </div>

          {/* Desktop controls */}

          <div className="hidden items-center gap-1.5 md:flex">

            <div className="flex items-center rounded-[11px] border border-border/70 bg-muted/30 p-0.5">

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  updateZoom(
                    zoom - ZOOM_STEP,
                  )
                }
                disabled={
                  zoom <= MIN_ZOOM
                }
                className="h-8 w-8 rounded-[8px]"
                aria-label="Zoom out"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>

              <button
                type="button"
                onClick={() =>
                  updateZoom(1)
                }
                className="min-w-[54px] px-1.5 text-center text-[10px] font-semibold tabular-nums text-foreground"
              >
                {Math.round(
                  zoom * 100,
                )}
                %
              </button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  updateZoom(
                    zoom + ZOOM_STEP,
                  )
                }
                disabled={
                  zoom >= MAX_ZOOM
                }
                className="h-8 w-8 rounded-[8px]"
                aria-label="Zoom in"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>

            </div>

            <Button
              type="button"
              variant={
                mode === "fit-page"
                  ? "secondary"
                  : "ghost"
              }
              size="icon"
              onClick={() =>
                applyFit(
                  "fit-page",
                )
              }
              className="h-9 w-9 rounded-[10px]"
              title="Fit page"
              aria-label="Fit page"
            >
              <Scan className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant={
                mode === "fit-width"
                  ? "secondary"
                  : "ghost"
              }
              size="icon"
              onClick={() =>
                applyFit(
                  "fit-width",
                )
              }
              className="h-9 w-9 rounded-[10px]"
              title="Fit width"
              aria-label="Fit width"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>

          </div>

          {/* Right controls */}

          <div className="relative flex shrink-0 items-center gap-1.5">

            <span className="hidden rounded-full border border-border/70 bg-muted/25 px-2.5 py-1.5 text-[9.5px] font-medium text-muted-foreground lg:inline-flex">
              {orientationLabel}
            </span>

            <Button
              type="button"
              variant={
                showSettings
                  ? "secondary"
                  : "ghost"
              }
              size="icon"
              onClick={() =>
                setShowSettings(
                  (value) => !value,
                )
              }
              className="h-9 w-9 rounded-[11px]"
              aria-label="Print settings"
              aria-expanded={
                showSettings
              }
            >
              <Settings2 className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              onClick={handlePrint}
              disabled={!isReady}
              className="h-9 rounded-[11px] px-3 sm:h-10 sm:px-3.5"
            >
              <Printer className="h-4 w-4" />

              <span className="hidden sm:inline">
                Print / Save PDF
              </span>

              <span className="sm:hidden">
                Print
              </span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                onOpenChange(false)
              }
              className="h-9 w-9 rounded-[11px]"
              aria-label="Close print preview"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Settings */}

            {showSettings ? (
              <div className="absolute end-0 top-full z-20 mt-2 w-[260px] rounded-[16px] border border-border/80 bg-card p-3 shadow-[0_20px_60px_rgb(31_25_78_/_0.16)]">

                <p className="text-[11px] font-semibold text-foreground">
                  Print settings
                </p>

                <div className="mt-3 space-y-2">

                  <div className="flex items-center justify-between rounded-[11px] border border-border/60 bg-muted/20 px-3 py-2.5">
                    <span className="text-[11px] font-medium text-foreground">
                      Paper
                    </span>

                    <span className="text-[10px] text-muted-foreground">
                      A4
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-[11px] border border-border/60 bg-muted/20 px-3 py-2.5">
                    <span className="text-[11px] font-medium text-foreground">
                      Orientation
                    </span>

                    <span className="text-[10px] text-muted-foreground">
                      {orientationLabel.replace(
                        "A4 ",
                        "",
                      )}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSettings(
                        (current) => ({
                          ...current,
                          monochrome:
                            !current.monochrome,
                        }),
                      )
                    }
                    className="flex w-full items-center justify-between rounded-[11px] border border-border/60 bg-muted/20 px-3 py-2.5 text-start transition-colors hover:bg-muted/40"
                  >
                    <span>
                      <span className="block text-[11px] font-medium text-foreground">
                        Black &amp; white
                      </span>

                      <span className="mt-0.5 block text-[9px] text-muted-foreground">
                        Official documents are monochrome by default.
                      </span>
                    </span>

                    <span
                      className={[
                        "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                        settings.monochrome
                          ? "bg-primary"
                          : "bg-muted-foreground/25",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                          settings.monochrome
                            ? "translate-x-4"
                            : "translate-x-0.5",
                        ].join(" ")}
                      />
                    </span>
                  </button>

                  <p className="px-1 pt-1 text-[9px] leading-4 text-muted-foreground">
                    The browser controls the final printer and PDF destination.
                  </p>

                </div>
              </div>
            ) : null}

          </div>
        </div>

        {/* Mobile controls */}

        <div className="flex items-center justify-center gap-1 border-t border-border/50 px-3 py-1.5 md:hidden">

          <div className="flex items-center rounded-[10px] border border-border/70 bg-muted/30 p-0.5">

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                updateZoom(
                  zoom - ZOOM_STEP,
                )
              }
              disabled={
                zoom <= MIN_ZOOM
              }
              className="h-7 w-7 rounded-[7px]"
              aria-label="Zoom out"
            >
              <Minus className="h-3 w-3" />
            </Button>

            <button
              type="button"
              onClick={() =>
                updateZoom(1)
              }
              className="min-w-[48px] text-center text-[9px] font-semibold tabular-nums"
            >
              {Math.round(
                zoom * 100,
              )}
              %
            </button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                updateZoom(
                  zoom + ZOOM_STEP,
                )
              }
              disabled={
                zoom >= MAX_ZOOM
              }
              className="h-7 w-7 rounded-[7px]"
              aria-label="Zoom in"
            >
              <Plus className="h-3 w-3" />
            </Button>

          </div>

          <Button
            type="button"
            variant={
              mode === "fit-page"
                ? "secondary"
                : "ghost"
            }
            size="icon"
            onClick={() =>
              applyFit("fit-page")
            }
            className="h-8 w-8 rounded-[9px]"
            title="Fit page"
            aria-label="Fit page"
          >
            <Scan className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            variant={
              mode === "fit-width"
                ? "secondary"
                : "ghost"
            }
            size="icon"
            onClick={() =>
              applyFit("fit-width")
            }
            className="h-8 w-8 rounded-[9px]"
            title="Fit width"
            aria-label="Fit width"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>

          <span className="ml-1 text-[9px] font-medium text-muted-foreground">
            {orientationLabel}
          </span>

        </div>
      </header>

      {/* =====================================================
          PREVIEW
          ===================================================== */}

      <div
        ref={viewportRef}
        className="relative min-h-0 flex-1 overflow-auto overscroll-contain bg-muted/20"
      >
        <div className="flex min-h-full min-w-full items-start justify-center px-3 py-7 sm:px-7 sm:py-9 lg:px-10 lg:py-10">

          <div
            className="relative shrink-0 transition-[width,height] duration-200 ease-out"
            style={{
              width:
                scaledSize.width,
              height:
                scaledSize.height,
            }}
          >

            {!isReady ? (
              <div className="absolute inset-0 z-10 grid place-items-center rounded-[3px] bg-card text-muted-foreground shadow-[0_24px_80px_rgb(35_25_70_/_0.16)]">

                <div className="flex flex-col items-center gap-2.5">

                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
                    <Scan className="h-4 w-4 animate-pulse" />
                  </span>

                  <span className="text-xs font-medium">
                    Preparing preview…
                  </span>

                </div>

              </div>
            ) : null}

            <iframe
              key={`${document.title}-${document.kind}-${previewGenerationRef.current}`}
              ref={iframeRef}
              title={document.title}
              srcDoc={document.html}
              onLoad={handleFrameLoad}
              scrolling="no"
              className="absolute left-0 top-0 origin-top-left border-0 bg-white shadow-[0_24px_80px_rgb(35_25_70_/_0.16)]"
              style={{
                width:
                  pageSize.width,

                height:
                  documentHeight,

                transform:
                  `scale(${zoom})`,
              }}
            />

          </div>
        </div>
      </div>
    </section>,
    window.document.body,
  );
}