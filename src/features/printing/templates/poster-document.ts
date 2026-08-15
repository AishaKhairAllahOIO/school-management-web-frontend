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
    background: "rgb(251 250 255)",
    primary: "rgb(103 58 244)",
    secondary: "rgb(246 244 252)",
    accent: "rgb(139 92 246)",
    ink: "rgb(34 32 48)",
    muted: "rgb(112 109 126)",
  },

  sky: {
    background: "rgb(249 251 255)",
    primary: "rgb(103 58 244)",
    secondary: "rgb(244 246 252)",
    accent: "rgb(126 155 202)",
    ink: "rgb(34 32 48)",
    muted: "rgb(112 109 126)",
  },

  coral: {
    background: "rgb(253 250 250)",
    primary: "rgb(103 58 244)",
    secondary: "rgb(248 244 245)",
    accent: "rgb(204 130 136)",
    ink: "rgb(34 32 48)",
    muted: "rgb(112 109 126)",
  },

  mint: {
    background: "rgb(249 252 250)",
    primary: "rgb(103 58 244)",
    secondary: "rgb(243 248 246)",
    accent: "rgb(112 169 143)",
    ink: "rgb(34 32 48)",
    muted: "rgb(112 109 126)",
  },

  sunset: {
    background: "rgb(253 251 248)",
    primary: "rgb(103 58 244)",
    secondary: "rgb(248 246 241)",
    accent: "rgb(193 159 92)",
    ink: "rgb(34 32 48)",
    muted: "rgb(112 109 126)",
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
  footer = "",
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

  /*
   * عندما يكون هناك bodyHtml فهذا يعني أن لدينا محتوى إضافياً
   * مثل قوانين المدرسة.
   *
   * عندها نستخدم layout مضغوط حتى نحاول إبقاء كل شيء
   * ضمن صفحة A4 واحدة.
   */
  const hasContent = Boolean(bodyHtml.trim());

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
            (
              identity.shortName ||
              identity.schoolName
            )
              .slice(0, 1)
              .toUpperCase(),
          )}
        </div>
      `;

  const body = `
    <main
      class="print-page poster-page ${
        hasContent ? "poster-page-compact" : ""
      }"
      style="${posterCssVariables(palette)}"
      dir="auto"
    >

      <div class="poster-frame">

        <!-- ================= BRAND ================= -->

        <header class="poster-brand">

          <div class="poster-brand-mark">
            ${logo}
          </div>

          <div class="poster-brand-copy">

            <strong>
              ${escapePrintHtml(identity.schoolName)}
            </strong>

            ${
              identity.city ||
              identity.country
                ? `
                  <span>
                    ${escapePrintHtml(
                      identity.city ||
                        identity.country ||
                        "",
                    )}
                  </span>
                `
                : ""
            }

          </div>

        </header>


        <!-- ================= HERO ================= -->

        <section class="poster-hero">

          <p class="poster-eyebrow">
            ${escapePrintHtml(eyebrow)}
          </p>

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

        </section>


        <!-- ================= DETAILS ================= -->

        ${detailsHtml}


        <!-- ================= CONTENT ================= -->

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


        <!-- ================= FOOTER ================= -->

        ${
          footer
            ? `
              <footer class="poster-footer">

                <span>
                  ${escapePrintHtml(footer)}
                </span>

                ${
                  identity.website ||
                  identity.phoneNumber
                    ? `
                      <span>
                        ${escapePrintHtml(
                          identity.website ||
                            identity.phoneNumber ||
                            "",
                        )}
                      </span>
                    `
                    : ""
                }

              </footer>
            `
            : ""
        }

      </div>

    </main>
  `;

  const styles = `
    /* =========================================================
       BASE
       ========================================================= */

    .poster-page {
      position: relative;

      width: 210mm;
      height: 297mm;
      min-height: 297mm;

      box-sizing: border-box;

      padding: 9mm;

      overflow: hidden;

      background:
        linear-gradient(
          150deg,
          var(--poster-bg) 0%,
          #ffffff 58%,
          var(--poster-secondary) 100%
        );

      color: var(--poster-ink);

      font-family:
        var(--print-font-family);

      page-break-after: avoid;
      break-after: avoid;
    }


    /* =========================================================
       FRAME
       ========================================================= */

    .poster-frame {
      position: relative;

      width: 100%;
      height: 279mm;
      min-height: 279mm;

      box-sizing: border-box;

      display: flex;
      flex-direction: column;

      padding: 8mm 10mm;

      background:
        rgba(255, 255, 255, 0.95);

      border:
        0.25mm solid
        rgba(103, 58, 244, 0.12);

      overflow: hidden;

      page-break-inside: avoid;
      break-inside: avoid;
    }


    /* =========================================================
       BRAND
       ========================================================= */

    .poster-brand {
      display: flex;

      align-items: center;

      gap: 3.5mm;

      flex-shrink: 0;

      padding-bottom: 5mm;

      border-bottom:
        0.25mm solid
        rgba(103, 58, 244, 0.12);

      page-break-inside: avoid;
      break-inside: avoid;
    }


    .poster-brand-mark {
      display: grid;

      width: 11mm;
      height: 11mm;

      flex-shrink: 0;

      place-items: center;

      border:
        0.25mm solid
        rgba(103, 58, 244, 0.16);

      background:
        var(--poster-secondary);
    }


    .poster-logo,
    .poster-logo-fallback {
      width: 8mm;
      height: 8mm;

      object-fit: contain;
    }


    .poster-logo {
      display: block;
    }


    .poster-logo-fallback {
      display: grid;

      place-items: center;

      color:
        var(--poster-primary);

      font-family:
        var(--print-font-brand);

      font-size: 3.5mm;

      font-weight: 400;
    }


    .poster-brand-copy strong {
      display: block;

      color:
        var(--poster-ink);

      font-family:
        var(--print-font-brand);

      font-size: 3.2mm;

      line-height: 1.25;

      font-weight: 400;
    }


    .poster-brand-copy span {
      display: block;

      margin-top: 0.8mm;

      color:
        var(--poster-muted);

      font-size: 2mm;

      line-height: 1.3;

      font-weight: 400;
    }


    /* =========================================================
       HERO
       ========================================================= */

    .poster-hero {
      flex-shrink: 0;

      padding:
        17mm
        7mm
        11mm;

      text-align: center;

      page-break-inside: avoid;
      break-inside: avoid;
    }


    .poster-eyebrow {
      margin: 0;

      color:
        var(--poster-primary);

      font-size: 2.2mm;

      line-height: 1.3;

      font-weight: 400;

      letter-spacing: 0.1em;

      text-transform: uppercase;
    }


    .poster-hero h1 {
      max-width: 160mm;

      margin:
        4.5mm
        auto
        0;

      color:
        var(--poster-ink);

      font-family:
        var(--print-font-brand);

      font-size: 10mm;

      line-height: 1.1;

      font-weight: 400;

      letter-spacing: -0.02em;

      text-wrap: balance;
    }


    .poster-description {
      max-width: 130mm;

      margin:
        4mm
        auto
        0;

      color:
        var(--poster-muted);

      font-size: 2.8mm;

      line-height: 1.5;

      font-weight: 400;

      text-wrap: balance;
    }


    /* =========================================================
       COMPACT HERO
       يستخدم عندما يكون لدينا محتوى طويل مثل القوانين
       ========================================================= */

    .poster-page-compact .poster-hero {
      padding:
        8mm
        5mm
        6mm;
    }


    .poster-page-compact .poster-hero h1 {
      margin-top: 3mm;

      font-size: 7.5mm;

      line-height: 1.08;
    }


    .poster-page-compact .poster-description {
      margin-top: 2.5mm;

      font-size: 2.45mm;

      line-height: 1.4;
    }


    /* =========================================================
       DETAILS
       ========================================================= */

    .poster-details {
      display: grid;

      grid-template-columns:
        repeat(3, minmax(0, 1fr));

      gap: 0;

      flex-shrink: 0;

      margin:
        0
        6mm;

      padding:
        5mm
        0;

      border-top:
        0.25mm solid
        rgba(103, 58, 244, 0.12);

      border-bottom:
        0.25mm solid
        rgba(103, 58, 244, 0.12);

      page-break-inside: avoid;
      break-inside: avoid;
    }


    .poster-detail {
      padding:
        0
        4mm;

      text-align: center;

      border-right:
        0.25mm solid
        rgba(103, 58, 244, 0.1);

      page-break-inside: avoid;
      break-inside: avoid;
    }


    .poster-detail:last-child {
      border-right: none;
    }


    [dir="rtl"] .poster-detail {
      border-right: none;

      border-left:
        0.25mm solid
        rgba(103, 58, 244, 0.1);
    }


    [dir="rtl"] .poster-detail:last-child {
      border-left: none;
    }


    .poster-detail span {
      display: block;

      color:
        var(--poster-muted);

      font-size: 1.9mm;

      line-height: 1.3;

      font-weight: 400;

      letter-spacing: 0.06em;

      text-transform: uppercase;
    }


    .poster-detail strong {
      display: block;

      margin-top: 1.8mm;

      color:
        var(--poster-ink);

      font-family:
        var(--print-font-brand);

      font-size: 3mm;

      line-height: 1.3;

      font-weight: 400;

      overflow-wrap: anywhere;
    }


    /* =========================================================
       CONTENT
       ========================================================= */

    .poster-content {
      flex: 1;

      min-height: 0;

      margin:
        4mm
        4mm
        0;

      color:
        var(--poster-ink);

      font-size: 2.6mm;

      line-height: 1.4;

      overflow: hidden;

      page-break-inside: avoid;
      break-inside: avoid;
    }


    /* =========================================================
       CONTENT TITLE
       ========================================================= */

    .poster-content-title {
      margin:
        0
        0
        3.5mm;

      color:
        var(--poster-ink);

      font-family:
        var(--print-font-brand);

      font-size: 4mm;

      line-height: 1.25;

      font-weight: 400;

      page-break-after: avoid;
      break-after: avoid;
    }


    /* =========================================================
       LAWS GRID
       ========================================================= */

    .poster-grid {
      display: grid;

      /*
       * أهم تعديل:
       * القوانين أصبحت عمودين بدلاً من عمود واحد.
       */
      grid-template-columns:
        repeat(2, minmax(0, 1fr));

      column-gap: 8mm;

      row-gap: 0;

      width: 100%;

      box-sizing: border-box;
    }


    /* =========================================================
       LAW CARD
       ========================================================= */

    .poster-card {
      display: grid;

      grid-template-columns:
        7mm
        minmax(0, 1fr);

      gap: 2.5mm;

      align-items: start;

      min-width: 0;

      padding:
        2.5mm
        0;

      border-bottom:
        0.25mm solid
        rgba(103, 58, 244, 0.09);

      background: transparent;

      page-break-inside: avoid;
      break-inside: avoid;
    }


    /* =========================================================
       LAW NUMBER
       ========================================================= */

    .poster-card-number {
      display: block;

      color:
        var(--poster-accent);

      font-family:
        var(--print-font-brand);

      font-size: 2.6mm;

      line-height: 1.3;

      font-weight: 400;
    }


    /* =========================================================
       LAW TITLE
       ========================================================= */

    .poster-card h2 {
      margin: 0;

      color:
        var(--poster-ink);

      font-family:
        var(--print-font-brand);

      font-size: 3mm;

      line-height: 1.3;

      font-weight: 400;

      overflow-wrap: anywhere;
    }


    /* =========================================================
       LAW DESCRIPTION
       ========================================================= */

    .poster-card p {
      margin:
        1mm
        0
        0;

      color:
        var(--poster-muted);

      font-size: 2.3mm;

      line-height: 1.35;

      font-weight: 400;

      overflow-wrap: anywhere;
    }


    /* =========================================================
       FOOTER
       ========================================================= */

    .poster-footer {
      display: flex;

      justify-content: space-between;

      align-items: center;

      gap: 8mm;

      flex-shrink: 0;

      margin-top: auto;

      padding:
        5mm
        4mm
        0;

      color:
        var(--poster-muted);

      font-size: 1.9mm;

      line-height: 1.3;

      font-weight: 400;

      page-break-inside: avoid;
      break-inside: avoid;
    }


    .poster-footer span {
      min-width: 0;

      overflow-wrap: anywhere;
    }


    .poster-footer span:first-child {
      color:
        var(--poster-primary);
    }


    /* =========================================================
       PRINT
       ========================================================= */

    @media print {

      @page {
        size: A4 portrait;

        margin: 0;
      }


      .poster-page {
        width: 210mm;

        height: 297mm;

        min-height: 297mm;

        max-height: 297mm;

        margin: 0;

        padding: 9mm;

        overflow: hidden;

        page-break-after: avoid;
        break-after: avoid;
      }


      .poster-frame {
        width: 100%;

        height: 279mm;

        min-height: 279mm;

        max-height: 279mm;

        overflow: hidden;

        box-shadow: none;

        page-break-inside: avoid;
        break-inside: avoid;
      }


      .poster-brand,
      .poster-hero,
      .poster-details,
      .poster-content,
      .poster-card,
      .poster-footer {
        page-break-inside: avoid;
        break-inside: avoid;
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