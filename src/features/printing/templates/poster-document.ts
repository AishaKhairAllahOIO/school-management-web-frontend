import type {
  PrintIdentity,
  PrintableDocument,
} from "../types/print.types";

import {
  createPrintableHtml,
  escapePrintHtml,
} from "../utils/print-html";

export type PosterTone =
  | "violet"
  | "sky"
  | "coral"
  | "mint"
  | "sunset";

/**
 * Poster tones now inherit the application's design language.
 *
 * The primary application purple remains the source of truth.
 * Other tones are controlled through controlled secondary values
 * instead of creating a completely separate design system.
 */
type PosterPalette = {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  ink: string;
  muted: string;
};

const toneMap: Record<PosterTone, PosterPalette> = {
  violet: {
    background: "rgb(250 250 255)",
    primary: "rgb(103 58 244)",
    secondary: "rgb(244 241 255)",
    accent: "rgb(139 92 246)",
    ink: "rgb(21 20 44)",
    muted: "rgb(103 102 125)",
  },

  sky: {
    background: "rgb(247 250 255)",
    primary: "rgb(103 58 244)",
    secondary: "rgb(236 231 255)",
    accent: "rgb(108 153 224)",
    ink: "rgb(21 20 44)",
    muted: "rgb(103 102 125)",
  },

  coral: {
    background: "rgb(252 248 250)",
    primary: "rgb(103 58 244)",
    secondary: "rgb(244 241 255)",
    accent: "rgb(223 118 128)",
    ink: "rgb(21 20 44)",
    muted: "rgb(103 102 125)",
  },

  mint: {
    background: "rgb(247 252 250)",
    primary: "rgb(103 58 244)",
    secondary: "rgb(244 241 255)",
    accent: "rgb(95 186 143)",
    ink: "rgb(21 20 44)",
    muted: "rgb(103 102 125)",
  },

  sunset: {
    background: "rgb(253 250 247)",
    primary: "rgb(103 58 244)",
    secondary: "rgb(244 241 255)",
    accent: "rgb(223 181 88)",
    ink: "rgb(21 20 44)",
    muted: "rgb(103 102 125)",
  },
};

function posterCssVariables(
  palette: PosterPalette,
): string {
  return `
    --poster-bg: ${palette.background};
    --poster-primary: ${palette.primary};
    --poster-secondary: ${palette.secondary};
    --poster-accent: ${palette.accent};
    --poster-ink: ${palette.ink};
    --poster-muted: ${palette.muted};
  `;
}

export function createPosterDocument({
  title,
  identity,
  eyebrow,
  headline,
  description,
  details = [],
  bodyHtml = "",
  footer = "Learn · Connect · Grow",
  tone = "violet",
}: {
  title: string;
  identity: PrintIdentity;
  eyebrow: string;
  headline: string;
  description?: string;
  details?: Array<{
    label: string;
    value: string;
  }>;
  bodyHtml?: string;
  footer?: string;
  tone?: PosterTone;
}): PrintableDocument {
  const palette = toneMap[tone];

  const detailsHtml =
    details.length > 0
      ? `
        <section
          class="poster-details"
          aria-label="Poster details"
        >
          ${details
            .map(
              (item) => `
                <div class="poster-detail">
                  <span>
                    ${escapePrintHtml(item.label)}
                  </span>

                  <strong dir="auto">
                    ${escapePrintHtml(item.value)}
                  </strong>
                </div>
              `,
            )
            .join("")}
        </section>
      `
      : "";

  const logo = identity.logoUrl
    ? `
        <img
          class="poster-logo"
          src="${escapePrintHtml(identity.logoUrl)}"
          alt=""
        />
      `
    : `
        <div class="poster-logo-fallback">
          ${escapePrintHtml(
            (identity.shortName || identity.schoolName)
              .slice(0, 1)
              .toUpperCase(),
          )}
        </div>
      `;

  const body = `
    <main
      class="print-page poster-page"
      style="${posterCssVariables(palette)}"
      dir="auto"
    >
      <!-- Decorative shapes -->
      <div
        class="poster-shape poster-shape-one"
        aria-hidden="true"
      ></div>

      <div
        class="poster-shape poster-shape-two"
        aria-hidden="true"
      ></div>

      <div
        class="poster-shape poster-shape-three"
        aria-hidden="true"
      ></div>

      <div
        class="poster-dot-grid"
        aria-hidden="true"
      ></div>

      <div class="poster-frame">

        <!-- Brand -->
        <header class="poster-brand">
          <div class="poster-brand-mark">
            ${logo}
          </div>

          <div class="poster-brand-copy">
            <strong>
              ${escapePrintHtml(identity.schoolName)}
            </strong>

            <span>
              ${escapePrintHtml(
                identity.city ||
                  identity.country ||
                  "School community",
              )}
            </span>
          </div>
        </header>

        <!-- Hero -->
        <section class="poster-hero">
          <div class="poster-eyebrow">
            ${escapePrintHtml(eyebrow)}
          </div>

          <h1 dir="auto">
            ${escapePrintHtml(headline)}
          </h1>

          ${
            description
              ? `
                <p
                  class="poster-description"
                  dir="auto"
                >
                  ${escapePrintHtml(description)}
                </p>
              `
              : ""
          }

          <div
            class="poster-hero-rule"
            aria-hidden="true"
          >
            <span></span>
            <i></i>
            <span></span>
          </div>
        </section>

        ${detailsHtml}

        ${
          bodyHtml
            ? `
              <section
                class="poster-content"
                dir="auto"
              >
                ${bodyHtml}
              </section>
            `
            : ""
        }

        <!-- Footer -->
        <footer class="poster-footer">
          <strong>
            ${escapePrintHtml(footer)}
          </strong>

          <span dir="auto">
            ${escapePrintHtml(
              identity.website ||
                identity.phoneNumber ||
                "",
            )}
          </span>
        </footer>
      </div>
    </main>
  `;

  const styles = `
    /* =====================================================
       POSTER PAGE
       ===================================================== */

    .poster-page {
      position: relative;

      width: 210mm;
      height: 297mm;
      min-height: 297mm;

      overflow: hidden;

      padding: 7mm;

      color: var(--poster-ink);

      background:
        linear-gradient(
          145deg,
          var(--poster-bg) 0%,
          #ffffff 62%,
          var(--poster-secondary) 100%
        );

      font-family:
        var(--print-font-family);
    }

    /* =====================================================
       DECORATION
       ===================================================== */

    .poster-shape {
      position: absolute;

      pointer-events: none;

      border:
        0.45mm solid
        rgba(103, 58, 244, 0.18);
    }

    .poster-shape-one {
      width: 58mm;
      height: 58mm;

      left: -22mm;
      top: 82mm;

      border-radius: 18mm;

      transform: rotate(26deg);

      background:
        rgba(103, 58, 244, 0.06);
    }

    .poster-shape-two {
      width: 42mm;
      height: 42mm;

      right: -13mm;
      top: -11mm;

      border-radius: 50%;

      background:
        rgba(139, 92, 246, 0.10);
    }

    .poster-shape-three {
      width: 48mm;
      height: 18mm;

      right: 16mm;
      bottom: 25mm;

      border-radius: 50%;

      transform: rotate(-18deg);

      background:
        rgba(103, 58, 244, 0.06);
    }

    .poster-dot-grid {
      position: absolute;

      right: 9mm;
      top: 62mm;

      width: 24mm;
      height: 38mm;

      opacity: 0.22;

      background-image:
        radial-gradient(
          var(--poster-primary) 0.65mm,
          transparent 0.7mm
        );

      background-size: 4mm 4mm;
    }

    /* =====================================================
       FRAME
       ===================================================== */

    .poster-frame {
      position: relative;

      z-index: 2;

      display: flex;

      min-height: 281mm;

      flex-direction: column;

      border:
        0.45mm solid
        rgba(103, 58, 244, 0.22);

      border-radius: 5mm;

      background:
        rgba(255, 255, 255, 0.97);

      padding: 8mm;

      box-shadow:
        var(--print-shadow-card);
    }

    .poster-frame::before {
      content: "";

      position: absolute;

      inset: 3mm;

      pointer-events: none;

      border:
        0.22mm solid
        rgba(103, 58, 244, 0.13);

      border-radius: 3.8mm;
    }

    /* =====================================================
       BRAND
       ===================================================== */

    .poster-brand {
      position: relative;

      z-index: 1;

      display: flex;

      align-items: center;

      gap: 3mm;
    }

    .poster-brand-mark {
      display: grid;

      width: 15mm;
      height: 15mm;

      place-items: center;

      flex-shrink: 0;

      border-radius: 3.5mm;

      background:
        var(--print-secondary);

      border:
        0.35mm solid
        rgba(103, 58, 244, 0.22);
    }

    .poster-logo,
    .poster-logo-fallback {
      width: 11mm;
      height: 11mm;

      object-fit: contain;
    }

    .poster-logo {
      display: block;
    }

    .poster-logo-fallback {
      display: grid;

      place-items: center;

      border-radius: 3mm;

      background: #ffffff;

      color:
        var(--poster-primary);

      font-family:
        var(--print-font-brand);

      font-size: 4.5mm;

      font-weight: 900;
    }

    .poster-brand-copy strong {
      display: block;

      color:
        var(--poster-ink);

      font-family:
        var(--print-font-brand);

      font-size: 3.5mm;

      line-height: 1.15;
    }

    .poster-brand-copy span {
      display: block;

      margin-top: 0.8mm;

      color:
        var(--poster-muted);

      font-size: 2.25mm;
    }

    /* =====================================================
       HERO
       ===================================================== */

    .poster-hero {
      position: relative;

      z-index: 1;

      padding:
        13mm
        8mm
        7mm;

      text-align: center;
    }

    .poster-eyebrow {
      display: inline-flex;

      align-items: center;
      justify-content: center;

      min-height: 8mm;

      border-radius: 2mm;

      background:
        var(--print-secondary);

      border:
        0.3mm solid
        rgba(103, 58, 244, 0.22);

      padding:
        1.8mm
        4mm;

      color:
        var(--poster-primary);

      font-size: 2.35mm;

      font-weight: 900;

      letter-spacing: 0.16em;

      text-transform: uppercase;
    }

    .poster-hero h1 {
      max-width: 165mm;

      margin:
        5mm
        auto
        0;

      color:
        var(--poster-ink);

      font-family:
        var(--print-font-brand);

      font-size: 12.2mm;

      line-height: 0.98;

      font-weight: 800;

      letter-spacing: -0.05em;

      text-wrap: balance;
    }

    .poster-description {
      max-width: 145mm;

      margin:
        4.5mm
        auto
        0;

      color:
        var(--poster-muted);

      font-size: 3.35mm;

      line-height: 1.58;

      text-wrap: balance;
    }

    .poster-hero-rule {
      display: grid;

      grid-template-columns:
        24mm
        3mm
        24mm;

      align-items: center;
      justify-content: center;

      gap: 2mm;

      margin-top: 6mm;
    }

    .poster-hero-rule span {
      height: 0.4mm;

      background:
        rgba(103, 58, 244, 0.30);
    }

    .poster-hero-rule i {
      width: 3mm;
      height: 3mm;

      border-radius: 50%;

      background:
        var(--poster-accent);
    }

    /* =====================================================
       DETAILS
       ===================================================== */

    .poster-details {
      position: relative;

      z-index: 1;

      display: grid;

      grid-template-columns:
        repeat(3, minmax(0, 1fr));

      gap: 3mm;

      margin:
        4mm
        2mm
        0;
    }

    .poster-detail {
      min-height: 23mm;

      border-radius: 5mm;

      background: #ffffff;

      border:
        0.35mm solid
        rgba(103, 58, 244, 0.18);

      padding: 4mm;

      text-align: center;

      box-shadow:
        0 2mm 6mm
        rgba(31, 25, 78, 0.06);

      break-inside: avoid;
    }

    .poster-detail span {
      display: block;

      color:
        var(--poster-muted);

      font-size: 2.1mm;

      font-weight: 800;

      text-transform: uppercase;

      letter-spacing: 0.085em;
    }

    .poster-detail strong {
      display: block;

      margin-top: 2mm;

      color:
        var(--poster-primary);

      font-family:
        var(--print-font-brand);

      font-size: 3.6mm;

      line-height: 1.25;

      overflow-wrap: anywhere;
    }

    /* =====================================================
       BODY CONTENT
       ===================================================== */

    .poster-content {
      position: relative;

      z-index: 1;

      margin:
        6mm
        2mm
        0;

      border-radius: 6mm;

      background:
        var(--print-secondary);

      border:
        0.35mm solid
        rgba(103, 58, 244, 0.15);

      padding: 6mm;

      color:
        var(--poster-ink);
    }

    .poster-content-title {
      margin:
        0
        0
        4mm;

      text-align: center;

      color:
        var(--poster-primary);

      font-size: 2.8mm;

      font-weight: 900;

      letter-spacing: 0.12em;

      text-transform: uppercase;
    }

    .poster-grid {
      display: grid;

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

      gap: 3mm;
    }

    .poster-card {
      display: grid;

      grid-template-columns:
        9mm
        1fr;

      gap: 3mm;

      border-radius: 4.5mm;

      background: #ffffff;

      border:
        0.3mm solid
        rgba(103, 58, 244, 0.15);

      padding: 3.5mm;

      break-inside: avoid;
    }

    .poster-card-number {
      display: grid;

      width: 8mm;
      height: 8mm;

      place-items: center;

      border-radius: 50%;

      background:
        var(--poster-primary);

      color: #ffffff;

      font-family:
        var(--print-font-brand);

      font-size: 2.7mm;

      font-weight: 900;
    }

    .poster-card h2 {
      margin: 0;

      color:
        var(--poster-ink);

      font-family:
        var(--print-font-brand);

      font-size: 3.2mm;

      line-height: 1.2;
    }

    .poster-card p {
      margin:
        1.2mm
        0
        0;

      color:
        var(--poster-muted);

      font-size: 2.4mm;

      line-height: 1.44;
    }

    /* =====================================================
       FOOTER
       ===================================================== */

    .poster-footer {
      position: relative;

      z-index: 1;

      display: flex;

      align-items: flex-end;
      justify-content: space-between;

      gap: 8mm;

      margin-top: auto;

      padding:
        8mm
        2mm
        1mm;
    }

    .poster-footer strong {
      color:
        var(--poster-primary);

      font-family:
        var(--print-font-brand);

      font-size: 3mm;
    }

    .poster-footer span {
      color:
        var(--poster-muted);

      font-size: 2.35mm;

      overflow-wrap: anywhere;
    }

    /* =====================================================
       PRINT
       ===================================================== */

    @media print {
      .poster-page {
        width: 210mm;
        height: 297mm;
        min-height: 297mm;

        margin: 0;

        overflow: hidden;
      }

      .poster-frame {
        box-shadow: none;
      }
    }
  `;

  return {
    title,

    orientation: "portrait",

    kind: "poster",

    html: createPrintableHtml({
      title,
      body,
      styles,
      orientation: "portrait",
    }),
  };
}