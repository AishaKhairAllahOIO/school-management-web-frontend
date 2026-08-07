import type { PrintOrientation } from "../types/print.types";

export function escapePrintHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export const PRINT_DESIGN_TOKENS = `
  :root {
    /* Typography */
    --print-font-family:
      "AppArabic",
      "Exo",
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;

    --print-font-brand:
      "Exo",
      "AppArabic",
      ui-sans-serif,
      system-ui,
      sans-serif;

    /* Main application colors */
    --print-background: rgb(250 250 255);
    --print-foreground: rgb(21 20 44);

    --print-card: rgb(255 255 255);
    --print-card-foreground: rgb(21 20 44);

    --print-popover: rgb(255 255 255);
    --print-popover-foreground: rgb(21 20 44);

    --print-primary: rgb(103 58 244);
    --print-primary-foreground: rgb(255 255 255);

    --print-secondary: rgb(244 241 255);
    --print-secondary-foreground: rgb(57 38 131);

    --print-muted: rgb(245 246 252);
    --print-muted-foreground: rgb(103 102 125);

    --print-accent: rgb(236 231 255);
    --print-accent-foreground: rgb(77 50 183);

    --print-border: rgb(226 224 240);
    --print-input: rgb(226 224 240);
    --print-ring: rgb(124 86 255);

    --print-success: rgb(95 186 143);
    --print-warning: rgb(223 181 88);
    --print-info: rgb(108 153 224);
    --print-destructive: rgb(223 118 128);

    /* Application gradients */
    --print-gradient-primary:
      linear-gradient(
        135deg,
        #5b4fc7 0%,
        #6d5fdb 45%,
        #8b5cf6 100%
      );

    --print-gradient-soft-purple:
      linear-gradient(
        135deg,
        rgba(103, 58, 244, 0.14),
        rgba(139, 92, 246, 0.06)
      );

    /* Shadows */
    --print-shadow-card:
      0 12px 30px rgba(31, 25, 78, 0.08);

    --print-shadow-soft:
      0 18px 45px rgba(39, 32, 92, 0.10);
  }

  @font-face {
    font-family: "AppArabic";
    src: url("/fonts/Cairo-Arabic.woff2") format("woff2");
    font-weight: 200 1000;
    font-style: normal;
    font-display: swap;

    unicode-range:
      U+0600-06FF,
      U+0750-077F,
      U+08A0-08FF,
      U+FB50-FDFF,
      U+FE70-FEFF;
  }

  
  @import url("https://fonts.googleapis.com/css2?family=Exo:wght@300;400;500;600;700;800&display=swap");

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    margin: 0;
    padding: 0;
    background: #ffffff;
  }

  body {
    margin: 0;
    padding: 0;

    color: var(--print-foreground);
    background: #ffffff;

    font-family: var(--print-font-family);

    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  img {
    max-width: 100%;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  [dir="rtl"] {
    direction: rtl;
    text-align: right;
  }

  [dir="ltr"] {
    direction: ltr;
    text-align: left;
  }

 
  @media print {
    html,
    body {
      background: #ffffff !important;
    }

    *,
    *::before,
    *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
`;

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
  const pageWidth = orientation === "landscape" ? "297mm" : "210mm";
  const pageHeight = orientation === "landscape" ? "210mm" : "297mm";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  />

  <title>${escapePrintHtml(title)}</title>

  <style>
    @page {
      size: A4 ${orientation};
      margin: 0;
    }

    ${PRINT_DESIGN_TOKENS}

    .print-page {
      position: relative;

      width: ${pageWidth};
      min-width: ${pageWidth};

      min-height: ${pageHeight};

      margin: 0 auto;

      background: #ffffff;

      overflow: visible;

      isolation: isolate;
    }

    
    @media screen {
      .print-page {
        margin: 20px auto;
      }
    }

    html.print-monochrome,
    html.print-monochrome body {
      filter: grayscale(1) !important;
    }

    
    @media print {
      html,
      body {
        width: ${pageWidth};
        min-width: ${pageWidth};

        margin: 0;
        padding: 0;

        background: #ffffff !important;
      }

      .print-page {
        width: ${pageWidth};
        min-width: ${pageWidth};

        min-height: ${pageHeight};

        margin: 0;

        box-shadow: none !important;
      }
    }

    ${styles}
  </style>
</head>

<body>
  ${body}
</body>
</html>`;
}