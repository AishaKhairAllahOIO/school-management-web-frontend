import type { SchoolLaw } from "../../types/school-laws.types";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function resolveDensity(laws: SchoolLaw[]) {
  const totalCharacters = laws.reduce(
    (sum, law) => sum + law.title.length + (law.description?.length ?? 0),
    0,
  );

  if (laws.length >= 13 || totalCharacters > 4_600) {
    return "ultra-compact";
  }

  if (laws.length >= 9 || totalCharacters > 2_900) {
    return "compact";
  }

  return "comfortable";
}

const pastelThemes = [
  { bg: "#FFF1F2", border: "#F8C8CF", badge: "#F9A8B4", ink: "#9F2D45" },
  { bg: "#EEF6FF", border: "#C7DEFF", badge: "#9CC7FF", ink: "#285F9E" },
  { bg: "#F1F8EC", border: "#CEE7BD", badge: "#B9DB9F", ink: "#416D2F" },
  { bg: "#FFF8E8", border: "#F4D8A4", badge: "#F6C96E", ink: "#8E5C18" },
  { bg: "#F6F0FF", border: "#DCCBFA", badge: "#C8B0F2", ink: "#64439A" },
  { bg: "#FFF0F8", border: "#F5CAE1", badge: "#EFA9CB", ink: "#9C3C70" },
  { bg: "#ECFBFA", border: "#BFE9E5", badge: "#95D8D1", ink: "#236B66" },
  { bg: "#FFF3EB", border: "#F5CFB8", badge: "#F0B48E", ink: "#985235" },
];

export function printSchoolLaws(laws: SchoolLaw[]) {
  if (!laws.length) {
    throw new Error("There are no school laws available to print.");
  }

  const density = resolveDensity(laws);
  const useTwoColumns = laws.length > 6;

  const items = laws
    .map((law, index) => {
      const theme = pastelThemes[index % pastelThemes.length];

      return `
        <article
          class="law-item"
          style="--card-bg:${theme.bg};--card-border:${theme.border};--badge-bg:${theme.badge};--card-ink:${theme.ink}"
        >
          <div class="law-number">${String(index + 1).padStart(2, "0")}</div>
          <div class="law-copy">
            <h2 dir="auto">${escapeHtml(law.title)}</h2>
            ${
              law.description
                ? `<p dir="auto">${escapeHtml(law.description)}</p>`
                : ""
            }
          </div>
        </article>
      `;
    })
    .join("");

  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.inset = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";

  document.body.appendChild(iframe);

  const printDocument = iframe.contentDocument;
  const printWindow = iframe.contentWindow;

  if (!printDocument || !printWindow) {
    iframe.remove();
    throw new Error("The print document could not be prepared.");
  }

  printDocument.open();
  printDocument.write(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>School Laws & Regulations</title>
  <style>
    @page { size: A4 portrait; margin: 0; }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    html,
    body {
      width: 210mm;
      height: 297mm;
      margin: 0;
      overflow: hidden;
      background: #fffafc;
    }

    body {
      color: #28243f;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .print-page {
      width: 210mm;
      height: 297mm;
      padding: 8mm;
      overflow: hidden;
      background:
        radial-gradient(circle at 8% 7%, rgba(244, 167, 185, 0.34), transparent 18%),
        radial-gradient(circle at 93% 10%, rgba(143, 194, 255, 0.34), transparent 20%),
        radial-gradient(circle at 89% 92%, rgba(179, 226, 156, 0.32), transparent 22%),
        radial-gradient(circle at 12% 91%, rgba(255, 214, 143, 0.30), transparent 20%),
        linear-gradient(145deg, #fffafd 0%, #fbfcff 48%, #fffdf7 100%);
    }

    .poster-frame {
      position: relative;
      width: 194mm;
      height: 281mm;
      overflow: hidden;
      border: 0.55mm solid rgba(99, 80, 142, 0.13);
      border-radius: 7mm;
      background: rgba(255, 255, 255, 0.93);
      box-shadow:
        0 3mm 8mm rgba(93, 71, 137, 0.08),
        inset 0 0 0 0.45mm rgba(255,255,255,0.9);
    }

    .poster-frame::before,
    .poster-frame::after {
      position: absolute;
      z-index: 0;
      content: "";
      border-radius: 999px;
      filter: blur(0.2mm);
    }

    .poster-frame::before {
      top: -16mm;
      right: -10mm;
      width: 48mm;
      height: 48mm;
      background: linear-gradient(135deg, rgba(255, 178, 190, 0.42), rgba(182, 210, 255, 0.34));
    }

    .poster-frame::after {
      left: -14mm;
      bottom: -18mm;
      width: 54mm;
      height: 54mm;
      background: linear-gradient(135deg, rgba(188, 228, 166, 0.34), rgba(255, 218, 150, 0.36));
    }

    .poster-content {
      position: relative;
      z-index: 1;
      display: flex;
      width: 100%;
      min-height: 100%;
      transform-origin: top left;
      flex-direction: column;
    }

    .poster-header {
      position: relative;
      display: grid;
      grid-template-columns: 20mm minmax(0, 1fr) 20mm;
      align-items: center;
      gap: 4mm;
      padding: 7mm 8mm 5.5mm;
      border-bottom: 0.35mm solid rgba(111, 92, 151, 0.12);
      background:
        linear-gradient(90deg, rgba(255, 239, 244, 0.80), rgba(239, 246, 255, 0.88) 52%, rgba(247, 242, 255, 0.86));
    }

    .emblem {
      display: grid;
      width: 16mm;
      height: 16mm;
      place-items: center;
      border: 0.45mm solid rgba(111, 92, 151, 0.14);
      border-radius: 5mm;
      color: #6f4aa5;
      background: rgba(255,255,255,0.86);
      box-shadow: 0 1.5mm 3mm rgba(104, 78, 145, 0.08);
      font-size: 7mm;
      font-weight: 900;
    }

    .header-copy { min-width: 0; text-align: center; }

    .eyebrow {
      margin: 0 0 1.2mm;
      color: #8a5bbb;
      font-size: 2.35mm;
      font-weight: 900;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      color: #2f2944;
      font-size: 7.2mm;
      line-height: 1.03;
      letter-spacing: -0.035em;
    }

    .subtitle {
      max-width: 138mm;
      margin: 2mm auto 0;
      color: #6e6780;
      font-size: 2.7mm;
      line-height: 1.42;
    }

    .motto-strip {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2mm;
      padding: 2.5mm 5mm;
      border-bottom: 0.3mm solid rgba(111, 92, 151, 0.10);
      background: linear-gradient(90deg, #fff5f6, #f5f9ff, #f8f5ff, #f2fbf2, #fff8ec);
      color: #625c75;
      font-size: 2.25mm;
      font-weight: 750;
      letter-spacing: 0.02em;
      text-align: center;
    }

    .motto-dot {
      width: 1.7mm;
      height: 1.7mm;
      border-radius: 999px;
      background: linear-gradient(135deg, #ff9cab, #8fbcff);
    }

    .laws-wrap {
      display: flex;
      min-height: 0;
      flex: 1;
      flex-direction: column;
      padding: 4.5mm 6mm 3.5mm;
    }

    .section-label {
      display: flex;
      align-items: center;
      gap: 2.5mm;
      margin-bottom: 3mm;
      color: #6f6780;
      font-size: 2.35mm;
      font-weight: 850;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .section-label::after {
      height: 0.3mm;
      flex: 1;
      background: linear-gradient(90deg, #f0b4bd, #a9c8f6, #c8afe7, #b8dca8, #efd49f);
      content: "";
    }

    .laws {
      display: grid;
      grid-template-columns: ${useTwoColumns ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)"};
      align-content: start;
      gap: 2.5mm;
    }

    .law-item {
      display: grid;
      min-width: 0;
      grid-template-columns: 9mm minmax(0, 1fr);
      gap: 2.7mm;
      align-items: start;
      padding: 3mm 3.3mm;
      border: 0.35mm solid var(--card-border);
      border-radius: 4.2mm;
      break-inside: avoid;
      background: var(--card-bg);
      box-shadow: 0 1mm 2.5mm rgba(70, 58, 102, 0.045);
    }

    .law-number {
      display: grid;
      width: 8mm;
      height: 8mm;
      place-items: center;
      border-radius: 2.8mm;
      color: var(--card-ink);
      background: var(--badge-bg);
      font-size: 2.5mm;
      font-weight: 900;
      line-height: 1;
    }

    .law-copy { min-width: 0; }

    .law-copy h2 {
      margin: 0.15mm 0 0.8mm;
      color: var(--card-ink);
      font-size: 3.05mm;
      line-height: 1.24;
      overflow-wrap: anywhere;
    }

    .law-copy p {
      margin: 0;
      color: #686275;
      font-size: 2.45mm;
      line-height: 1.36;
      overflow-wrap: anywhere;
      white-space: pre-line;
    }

    .poster-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4mm;
      margin-top: auto;
      padding: 3.2mm 7mm 3.6mm;
      border-top: 0.3mm solid rgba(111, 92, 151, 0.11);
      background: linear-gradient(90deg, rgba(255,244,248,0.88), rgba(242,248,255,0.9), rgba(250,246,255,0.9));
      color: #716a80;
      font-size: 2.15mm;
    }

    .footer-mark {
      color: #6d4fa3;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .compact .poster-header { padding-top: 5.5mm; padding-bottom: 4.3mm; }
    .compact h1 { font-size: 6.4mm; }
    .compact .subtitle { font-size: 2.4mm; }
    .compact .motto-strip { padding-top: 2mm; padding-bottom: 2mm; font-size: 2.05mm; }
    .compact .laws-wrap { padding-top: 3.7mm; }
    .compact .laws { gap: 1.9mm; }
    .compact .law-item { grid-template-columns: 7.7mm minmax(0,1fr); gap: 2.1mm; padding: 2.45mm 2.7mm; }
    .compact .law-number { width: 6.8mm; height: 6.8mm; font-size: 2.2mm; }
    .compact .law-copy h2 { margin-bottom: 0.55mm; font-size: 2.78mm; }
    .compact .law-copy p { font-size: 2.18mm; line-height: 1.3; }

    .ultra-compact .poster-header { grid-template-columns: 14mm minmax(0,1fr) 14mm; padding: 4mm 6mm 3.2mm; }
    .ultra-compact .emblem { width: 11.5mm; height: 11.5mm; font-size: 5.2mm; }
    .ultra-compact .eyebrow { margin-bottom: 0.7mm; font-size: 1.85mm; }
    .ultra-compact h1 { font-size: 5.45mm; }
    .ultra-compact .subtitle { margin-top: 1.2mm; font-size: 2mm; line-height: 1.28; }
    .ultra-compact .motto-strip { padding: 1.7mm 4mm; font-size: 1.85mm; }
    .ultra-compact .laws-wrap { padding: 2.8mm 4.8mm 2.4mm; }
    .ultra-compact .section-label { margin-bottom: 1.7mm; font-size: 1.95mm; }
    .ultra-compact .laws { gap: 1.35mm; }
    .ultra-compact .law-item { grid-template-columns: 6.1mm minmax(0,1fr); gap: 1.6mm; padding: 1.8mm 2.15mm; border-radius: 2.8mm; }
    .ultra-compact .law-number { width: 5.5mm; height: 5.5mm; border-radius: 1.7mm; font-size: 1.8mm; }
    .ultra-compact .law-copy h2 { margin: 0 0 0.35mm; font-size: 2.35mm; line-height: 1.17; }
    .ultra-compact .law-copy p { font-size: 1.82mm; line-height: 1.2; }
    .ultra-compact .poster-footer { padding-top: 2mm; padding-bottom: 2.3mm; font-size: 1.82mm; }
  </style>
</head>
<body>
  <main class="print-page">
    <section class="poster-frame">
      <div id="poster-content" class="poster-content ${density}">
        <header class="poster-header">
          <div class="emblem" aria-hidden="true">★</div>
          <div class="header-copy">
            <p class="eyebrow">Our shared promise</p>
            <h1>School Laws & Regulations</h1>
            <p class="subtitle">
              Together we create a safe, kind, respectful, and inspiring place where every learner can shine.
            </p>
          </div>
          <div class="emblem" aria-hidden="true">✓</div>
        </header>

        <div class="motto-strip">
          <span class="motto-dot"></span>
          Respect everyone
          <span>•</span>
          Learn with purpose
          <span>•</span>
          Act with kindness
          <span>•</span>
          Keep our school safe
          <span class="motto-dot"></span>
        </div>

        <div class="laws-wrap">
          <div class="section-label">Guidelines for a positive school community</div>
          <section class="laws">${items}</section>
        </div>

        <footer class="poster-footer">
          <span class="footer-mark">Learn • Respect • Grow</span>
          <span>Every choice helps build the school community we are proud of.</span>
        </footer>
      </div>
    </section>
  </main>
</body>
</html>`);
  printDocument.close();

  const cleanup = () => {
    window.setTimeout(() => {
      iframe.remove();
    }, 300);
  };

  const prepareAndPrint = () => {
    const poster = printDocument.getElementById("poster-content");
    const frame = printDocument.querySelector<HTMLElement>(".poster-frame");

    if (!poster || !frame) {
      cleanup();
      throw new Error("The printable poster could not be prepared.");
    }

    const availableHeight = frame.clientHeight;
    const availableWidth = frame.clientWidth;
    const requiredHeight = poster.scrollHeight;
    const requiredWidth = poster.scrollWidth;

    const scale = Math.min(
      1,
      availableHeight / requiredHeight,
      availableWidth / requiredWidth,
    );

    if (scale < 1) {
      const safeScale = Math.max(scale, 0.7);
      poster.style.transform = `scale(${safeScale})`;
      poster.style.width = `${100 / safeScale}%`;
    }

    printWindow.focus();
    printWindow.print();
  };

  printWindow.addEventListener("afterprint", cleanup, { once: true });

  if (printDocument.fonts?.ready) {
    void printDocument.fonts.ready.then(() => {
      printWindow.requestAnimationFrame(() => {
        printWindow.requestAnimationFrame(prepareAndPrint);
      });
    });
  } else {
    printWindow.setTimeout(prepareAndPrint, 250);
  }

  window.setTimeout(cleanup, 60_000);
}
