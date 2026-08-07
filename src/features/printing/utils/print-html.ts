import type { PrintOrientation } from "../types/print.types";

export function escapePrintHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function createPrintableHtml({
  title,
  body,
  styles = "",
  orientation = "portrait",
}: {
  title: string;
  body: string;
  styles?: string;
  orientation?: PrintOrientation;
}): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapePrintHtml(title)}</title>
  <style>
    @page { size: A4 ${orientation}; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    html, body { margin: 0; min-height: 100%; background: #f4f5f8; }
    body { color: #242238; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .print-page { width: ${orientation === "landscape" ? "297mm" : "210mm"}; min-height: ${orientation === "landscape" ? "210mm" : "297mm"}; margin: 0 auto; background: #fff; }
    @media screen { .print-page { margin: 20px auto; box-shadow: 0 18px 60px rgba(43, 35, 83, .14); } }
    .print-monochrome,
    .print-monochrome body {
      filter: grayscale(1) !important;
    }
    @media print { html, body { background: #fff; } .print-page { margin: 0; box-shadow: none; } }
    ${styles}
  </style>
</head>
<body>${body}</body>
</html>`;
}
