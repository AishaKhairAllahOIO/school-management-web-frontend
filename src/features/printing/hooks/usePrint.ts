import { useCallback } from "react";

import type { PrintableDocument } from "../types/print.types";

export function usePrint() {
  const print = useCallback(
    (printableDocument: PrintableDocument) => {
      const iframe =
        window.document.createElement(
          "iframe",
        );

      iframe.style.position = "fixed";
      iframe.style.inset = "0";
      iframe.style.width = "1px";
      iframe.style.height = "1px";
      iframe.style.border = "0";
      iframe.style.opacity = "0";
      iframe.style.pointerEvents = "none";

      window.document.body.appendChild(
        iframe,
      );

      let cleaned = false;

      const cleanup = () => {
        if (cleaned) {
          return;
        }

        cleaned = true;

        window.setTimeout(() => {
          iframe.remove();
        }, 500);
      };

      iframe.onload = async () => {
        const frameWindow =
          iframe.contentWindow;

        const frameDocument =
          iframe.contentDocument;

        if (
          !frameWindow ||
          !frameDocument
        ) {
          cleanup();
          return;
        }

        try {
          /*
           * Wait for custom fonts.
           */
          if (
            frameDocument.fonts
          ) {
            await frameDocument.fonts.ready;
          }

          /*
           * Wait for images.
           */
          const images =
            Array.from(
              frameDocument.images,
            );

          await Promise.all(
            images.map(
              (image) =>
                new Promise<void>(
                  (resolve) => {
                    if (
                      image.complete
                    ) {
                      resolve();
                      return;
                    }

                    image.addEventListener(
                      "load",
                      () => resolve(),
                      {
                        once: true,
                      },
                    );

                    image.addEventListener(
                      "error",
                      () => resolve(),
                      {
                        once: true,
                      },
                    );
                  },
                ),
            ),
          );

          /*
           * Allow layout / fonts / images
           * to settle before printing.
           */
          await new Promise<void>(
            (resolve) => {
              frameWindow.requestAnimationFrame(
                () => {
                  frameWindow.requestAnimationFrame(
                    () => resolve(),
                  );
                },
              );
            },
          );

          frameWindow.focus();

          frameWindow.addEventListener(
            "afterprint",
            cleanup,
            {
              once: true,
            },
          );

          frameWindow.print();

          /*
           * Fallback cleanup.
           */
          window.setTimeout(
            cleanup,
            60000,
          );
        } catch {
          cleanup();
        }
      };

      iframe.srcdoc =
        printableDocument.html;
    },
    [],
  );

  return {
    print,
  };
}