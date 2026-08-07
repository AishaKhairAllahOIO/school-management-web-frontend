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
    background: "#f7f3ff",
    primary: "#7656d8",
    secondary: "#a995ec",
    accent: "#f6bdde",
    ink: "#28223b",
    muted: "#665e7a",
  },
  sky: {
    background: "#f1f9ff",
    primary: "#278dc7",
    secondary: "#83c9e9",
    accent: "#f8cf76",
    ink: "#17364a",
    muted: "#557184",
  },
  coral: {
    background: "#fff5f5",
    primary: "#e56c79",
    secondary: "#f3a5a9",
    accent: "#78bde8",
    ink: "#4b2930",
    muted: "#7c5b61",
  },
  mint: {
    background: "#f2fbf7",
    primary: "#3ca67a",
    secondary: "#92d4b7",
    accent: "#f4c56e",
    ink: "#1f4134",
    muted: "#587267",
  },
  sunset: {
    background: "#fff8ef",
    primary: "#e68448",
    secondary: "#f4b57f",
    accent: "#ba9be8",
    ink: "#4f3526",
    muted: "#795f50",
  },
};

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
  details?: Array<{ label: string; value: string }>;
  bodyHtml?: string;
  footer?: string;
  tone?: PosterTone;
}): PrintableDocument {
  const palette = toneMap[tone];

  const detailsHtml = details.length
    ? `<section class="poster-details">${details
        .map(
          (item) => `<div class="poster-detail">
            <span>${escapePrintHtml(item.label)}</span>
            <strong dir="auto">${escapePrintHtml(item.value)}</strong>
          </div>`,
        )
        .join("")}</section>`
    : "";

  const logo = identity.logoUrl
    ? `<img class="poster-logo" src="${escapePrintHtml(identity.logoUrl)}" alt="" />`
    : `<div class="poster-logo-fallback">${escapePrintHtml((identity.shortName || identity.schoolName).slice(0, 1).toUpperCase())}</div>`;

  const body = `<main class="print-page poster-page" style="--poster-bg:${palette.background};--poster-primary:${palette.primary};--poster-secondary:${palette.secondary};--poster-accent:${palette.accent};--poster-ink:${palette.ink};--poster-muted:${palette.muted}">
    <div class="poster-shape poster-shape-one"></div>
    <div class="poster-shape poster-shape-two"></div>
    <div class="poster-shape poster-shape-three"></div>
    <div class="poster-dot-grid"></div>

    <div class="poster-frame">
      <header class="poster-brand">
        <div class="poster-brand-mark">${logo}</div>
        <div>
          <strong>${escapePrintHtml(identity.schoolName)}</strong>
          <span>${escapePrintHtml(identity.city || identity.country || "School community")}</span>
        </div>
      </header>

      <section class="poster-hero">
        <div class="poster-eyebrow">${escapePrintHtml(eyebrow)}</div>
        <h1 dir="auto">${escapePrintHtml(headline)}</h1>
        ${description ? `<p class="poster-description" dir="auto">${escapePrintHtml(description)}</p>` : ""}
        <div class="poster-hero-rule"><span></span><i></i><span></span></div>
      </section>

      ${detailsHtml}
      ${bodyHtml}

      <footer class="poster-footer">
        <strong>${escapePrintHtml(footer)}</strong>
        <span>${escapePrintHtml(identity.website || identity.phoneNumber || "")}</span>
      </footer>
    </div>
  </main>`;

  const styles = `
    html, body {
      overflow: visible;
      background: #fff;
    }

    .poster-page {
      position: relative;
      height: 297mm;
      overflow: hidden;
      padding: 7mm;
      color: var(--poster-ink);
      background: linear-gradient(145deg, color-mix(in srgb, var(--poster-bg) 72%, #fff), #fff 58%, color-mix(in srgb, var(--poster-secondary) 16%, #fff));
    }

    .poster-shape {
      position: absolute;
      border: .45mm solid color-mix(in srgb, var(--poster-primary) 24%, transparent);
      pointer-events: none;
    }

    .poster-shape-one {
      width: 58mm;
      height: 58mm;
      left: -22mm;
      top: 82mm;
      border-radius: 18mm;
      transform: rotate(26deg);
      background: color-mix(in srgb, var(--poster-secondary) 22%, transparent);
    }

    .poster-shape-two {
      width: 42mm;
      height: 42mm;
      right: -13mm;
      top: -11mm;
      border-radius: 50%;
      background: color-mix(in srgb, var(--poster-accent) 28%, transparent);
    }

    .poster-shape-three {
      width: 48mm;
      height: 18mm;
      right: 16mm;
      bottom: 25mm;
      border-radius: 50%;
      transform: rotate(-18deg);
      background: color-mix(in srgb, var(--poster-primary) 11%, transparent);
    }

    .poster-dot-grid {
      position: absolute;
      right: 9mm;
      top: 62mm;
      width: 24mm;
      height: 38mm;
      opacity: .28;
      background-image: radial-gradient(var(--poster-primary) .65mm, transparent .7mm);
      background-size: 4mm 4mm;
    }

    .poster-frame {
      position: relative;
      z-index: 2;
      display: flex;
      min-height: 281mm;
      flex-direction: column;
      border: .45mm solid color-mix(in srgb, var(--poster-primary) 26%, #fff);
      border-radius: 5mm;
      background: rgba(255, 255, 255, .96);
      padding: 8mm;
      box-shadow: 0 3mm 14mm rgba(48, 38, 74, .10);
    }

    .poster-frame::before {
      content: "";
      position: absolute;
      inset: 3mm;
      pointer-events: none;
      border: .22mm solid color-mix(in srgb, var(--poster-primary) 15%, transparent);
      border-radius: 3.8mm;
    }

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
      border-radius: 3.5mm;
      background: color-mix(in srgb, var(--poster-primary) 8%, #fff);
      border: .35mm solid color-mix(in srgb, var(--poster-primary) 22%, transparent);
    }

    .poster-logo,
    .poster-logo-fallback {
      width: 11mm;
      height: 11mm;
      object-fit: contain;
    }

    .poster-logo-fallback {
      display: grid;
      place-items: center;
      border-radius: 3mm;
      background: #fff;
      color: var(--poster-primary);
      font-size: 4.5mm;
      font-weight: 900;
    }

    .poster-brand strong {
      display: block;
      font-size: 3.5mm;
      line-height: 1.15;
    }

    .poster-brand span {
      display: block;
      margin-top: .8mm;
      color: var(--poster-muted);
      font-size: 2.25mm;
    }

    .poster-hero {
      position: relative;
      z-index: 1;
      padding: 13mm 8mm 7mm;
      text-align: center;
    }

    .poster-eyebrow {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 8mm;
      border-radius: 2mm;
      background: color-mix(in srgb, var(--poster-primary) 9%, #fff);
      border: .3mm solid color-mix(in srgb, var(--poster-primary) 22%, transparent);
      padding: 1.8mm 4mm;
      color: var(--poster-primary);
      font-size: 2.35mm;
      font-weight: 900;
      letter-spacing: .16em;
      text-transform: uppercase;
    }

    .poster-hero h1 {
      max-width: 165mm;
      margin: 5mm auto 0;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 12.2mm;
      line-height: .98;
      font-weight: 800;
      letter-spacing: -.05em;
      text-wrap: balance;
    }

    .poster-description {
      max-width: 145mm;
      margin: 4.5mm auto 0;
      color: var(--poster-muted);
      font-size: 3.35mm;
      line-height: 1.58;
      text-wrap: balance;
    }

    .poster-hero-rule {
      display: grid;
      grid-template-columns: 24mm 3mm 24mm;
      align-items: center;
      justify-content: center;
      gap: 2mm;
      margin-top: 6mm;
    }

    .poster-hero-rule span {
      height: .4mm;
      background: color-mix(in srgb, var(--poster-primary) 42%, transparent);
    }

    .poster-hero-rule i {
      width: 3mm;
      height: 3mm;
      border-radius: 50%;
      background: var(--poster-accent);
    }

    .poster-details {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 3mm;
      margin: 4mm 2mm 0;
    }

    .poster-detail {
      min-height: 23mm;
      border-radius: 5mm;
      background: #fff;
      border: .35mm solid color-mix(in srgb, var(--poster-primary) 18%, transparent);
      padding: 4mm;
      text-align: center;
      box-shadow: 0 2mm 6mm color-mix(in srgb, var(--poster-primary) 8%, transparent);
    }

    .poster-detail span {
      display: block;
      color: var(--poster-muted);
      font-size: 2.1mm;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .085em;
    }

    .poster-detail strong {
      display: block;
      margin-top: 2mm;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 3.6mm;
      line-height: 1.25;
    }

    .poster-content {
      position: relative;
      z-index: 1;
      margin: 6mm 2mm 0;
      border-radius: 6mm;
      background: color-mix(in srgb, var(--poster-bg) 58%, #fff);
      border: .35mm solid color-mix(in srgb, var(--poster-primary) 15%, transparent);
      padding: 6mm;
    }

    .poster-content-title {
      margin: 0 0 4mm;
      text-align: center;
      color: var(--poster-primary);
      font-size: 2.8mm;
      font-weight: 900;
      letter-spacing: .12em;
      text-transform: uppercase;
    }

    .poster-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 3mm;
    }

    .poster-card {
      display: grid;
      grid-template-columns: 9mm 1fr;
      gap: 3mm;
      border-radius: 4.5mm;
      background: #fff;
      border: .3mm solid color-mix(in srgb, var(--poster-primary) 15%, transparent);
      padding: 3.5mm;
      break-inside: avoid;
    }

    .poster-card-number {
      display: grid;
      width: 8mm;
      height: 8mm;
      place-items: center;
      border-radius: 50%;
      background: var(--poster-primary);
      color: #fff;
      font-size: 2.7mm;
      font-weight: 900;
    }

    .poster-card h2 {
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 3.2mm;
      line-height: 1.2;
    }

    .poster-card p {
      margin: 1.2mm 0 0;
      color: var(--poster-muted);
      font-size: 2.4mm;
      line-height: 1.44;
    }

    .poster-footer {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 8mm;
      margin-top: auto;
      padding: 8mm 2mm 1mm;
    }

    .poster-footer strong {
      color: var(--poster-primary);
      font-size: 3mm;
    }

    .poster-footer span {
      color: var(--poster-muted);
      font-size: 2.35mm;
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
