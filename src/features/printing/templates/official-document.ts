import type {
  PrintIdentity,
  PrintOrientation,
  PrintableDocument,
} from "../types/print.types";
import {
  createPrintableHtml,
  escapePrintHtml,
} from "../utils/print-html";

export const OFFICIAL_DOCUMENT_STYLES = `
  :root {
    --official-ink: #101010;
    --official-muted: #555;
    --official-soft: #f7f7f7;
    --official-line: #a9a9a9;
    --official-line-strong: #191919;
  }

  .official-document {
    position: relative;
    min-height: 297mm;
    padding: 13mm 15mm 12mm;
    color: var(--official-ink);
    background: #fff;
  }

  .official-document::before {
    content: "";
    position: absolute;
    inset: 5mm;
    pointer-events: none;
    border: .25mm solid #cfcfcf;
  }

  .official-header {
    position: relative;
    display: grid;
    grid-template-columns: 18mm minmax(0, 1fr) auto;
    align-items: center;
    gap: 4mm;
    padding: 0 1mm 5mm;
    border-bottom: .45mm solid var(--official-line-strong);
  }

  .official-logo,
  .official-logo-fallback {
    width: 16mm;
    height: 16mm;
  }

  .official-logo {
    object-fit: contain;
    filter: grayscale(1) contrast(1.08);
  }

  .official-logo-fallback {
    display: grid;
    place-items: center;
    border: .35mm solid var(--official-line-strong);
    font-size: 5.2mm;
    font-weight: 800;
  }

  .official-school-name {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 5.1mm;
    line-height: 1.08;
    font-weight: 700;
    letter-spacing: -.015em;
  }

  .official-school-meta {
    margin: 1.2mm 0 0;
    color: var(--official-muted);
    font-size: 2.35mm;
    line-height: 1.45;
  }

  .official-document-meta {
    min-width: 39mm;
    text-align: right;
  }

  .official-document-meta strong {
    display: block;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 3.35mm;
    text-transform: uppercase;
    letter-spacing: .08em;
  }


  .official-title-block {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8mm;
    padding: 7mm 1mm 5mm;
  }

  .official-kicker {
    margin: 0;
    color: #3c3c3c;
    font-size: 2.25mm;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .14em;
  }

  .official-title {
    margin: 1.2mm 0 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 6.8mm;
    line-height: 1.04;
    font-weight: 700;
    letter-spacing: -.025em;
  }

  .official-description {
    max-width: 125mm;
    margin: 2mm 0 0;
    color: var(--official-muted);
    font-size: 2.65mm;
    line-height: 1.55;
  }

  .official-highlight {
    min-width: 43mm;
    border: .4mm solid var(--official-line-strong);
    padding: 3.5mm 4.5mm;
    text-align: right;
  }

  .official-highlight small {
    display: block;
    color: var(--official-muted);
    font-size: 2.15mm;
    text-transform: uppercase;
    letter-spacing: .09em;
  }

  .official-highlight strong {
    display: block;
    margin-top: 1mm;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 6.3mm;
    line-height: 1;
  }

  .official-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2.5mm;
  }

  .official-field {
    min-height: 15mm;
    border: .28mm solid var(--official-line);
    padding: 3mm 3.3mm;
    background: #fff;
  }

  .official-field span {
    display: block;
    color: var(--official-muted);
    font-size: 2.1mm;
    font-weight: 650;
    text-transform: uppercase;
    letter-spacing: .075em;
  }

  .official-field strong {
    display: block;
    margin-top: 1.25mm;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 3.15mm;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  .official-section {
    margin-top: 5.5mm;
    break-inside: avoid;
  }

  .official-section-title {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 3mm;
    margin: 0 0 2.8mm;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 3.65mm;
    font-weight: 700;
  }

  .official-section-title::after {
    content: "";
    height: .35mm;
    background: var(--official-line-strong);
  }

  .official-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .official-table thead {
    display: table-header-group;
  }

  .official-table tr {
    break-inside: avoid;
  }

  .official-table th {
    padding: 2.5mm 2.7mm;
    border: .3mm solid var(--official-line-strong);
    background: var(--official-soft);
    font-size: 2.3mm;
    font-weight: 750;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: .045em;
  }

  .official-table td {
    padding: 2.65mm 2.7mm;
    border: .3mm solid var(--official-line);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 2.55mm;
    line-height: 1.35;
    vertical-align: top;
    overflow-wrap: anywhere;
  }

  .official-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2.5mm;
    margin-top: 4mm;
  }

  .official-summary-card {
    border: .35mm solid var(--official-line-strong);
    padding: 3.3mm;
    background: #fff;
  }

  .official-summary-card span {
    color: var(--official-muted);
    font-size: 2.15mm;
    font-weight: 650;
    text-transform: uppercase;
    letter-spacing: .06em;
  }

  .official-summary-card strong {
    display: block;
    margin-top: 1.15mm;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 4.8mm;
  }

  .official-note {
    margin-top: 5mm;
    border-left: .8mm solid var(--official-line-strong);
    background: #fafafa;
    padding: 3.5mm 4mm;
    color: #3f3f3f;
    font-size: 2.45mm;
    line-height: 1.5;
  }

  .official-signatures {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    margin-top: 18mm;
    break-inside: avoid;
  }

  .official-signature {
    min-height: 24mm;
    padding-top: 14mm;
    border-top: .3mm solid var(--official-line-strong);
    text-align: center;
    color: var(--official-muted);
    font-size: 2.4mm;
  }

  .official-signature strong {
    display: block;
    color: var(--official-ink);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 2.9mm;
    font-weight: 700;
  }

  .official-signature span {
    display: block;
    margin-top: 1.5mm;
    font-size: 2.2mm;
  }

  .official-footer {
    display: flex;
    justify-content: space-between;
    gap: 8mm;
    margin-top: 9mm;
    padding: 3.5mm 1mm 0;
    border-top: .3mm solid var(--official-line);
    color: var(--official-muted);
    font-size: 2.1mm;
    line-height: 1.4;
  }

  @media print {
    .official-document {
      break-after: page;
    }
  }
`;

function compactIdentity(identity: PrintIdentity) {
  return [identity.address, identity.phoneNumber, identity.email]
    .filter(Boolean)
    .map(escapePrintHtml)
    .join(" · ");
}

export function buildOfficialHeader(
  identity: PrintIdentity,
  documentTitle: string,
  reference?: string,
) {
  // Kept for backwards compatibility; official documents intentionally do not
  // print internal references or IDs.
  void reference;

  const logo = identity.logoUrl
    ? `<img class="official-logo" src="${escapePrintHtml(identity.logoUrl)}" alt="" />`
    : `<div class="official-logo-fallback">${escapePrintHtml((identity.shortName || identity.schoolName).slice(0, 1).toUpperCase())}</div>`;

  return `<header class="official-header">
    ${logo}
    <div>
      <p class="official-school-name">${escapePrintHtml(identity.schoolName)}</p>
      <p class="official-school-meta">${compactIdentity(identity) || "Official school document"}</p>
    </div>
    <div class="official-document-meta">
      <strong>${escapePrintHtml(documentTitle)}</strong>
    </div>
  </header>`;
}

export function createOfficialDocument({
  title,
  identity,
  documentTitle,
  reference,
  content,
  orientation = "portrait",
  signatureLabel,
}: {
  title: string;
  identity: PrintIdentity;
  documentTitle: string;
  reference?: string;
  content: string;
  orientation?: PrintOrientation;
  signatureLabel?: string;
}): PrintableDocument {
  // Kept in the API for backwards compatibility, but references/IDs are never
  // rendered on official documents.
  void reference;

  const resolvedSignatureLabel = signatureLabel || "Director / Principal signature";
  const signatureHtml = `<section class="official-signatures">
    <div class="official-signature">
      <strong>${escapePrintHtml(resolvedSignatureLabel)}</strong>
      <span>Signature and date</span>
    </div>
  </section>`;

  const body = `<main class="print-page official-document">${buildOfficialHeader(identity, documentTitle)}${content}${signatureHtml}</main>`;

  return {
    title,
    orientation,
    kind: "official-document",
    html: createPrintableHtml({
      title,
      body,
      styles: OFFICIAL_DOCUMENT_STYLES,
      orientation,
    }),
  };
}
