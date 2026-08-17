import type {
  PrintIdentity,
  PrintableDocument,
} from "../types/print.types";

import {
  createPrintableHtml,
  escapePrintHtml,
} from "../utils/print-html";

/* =========================================================
   OFFICIAL DOCUMENT — A5 PORTRAIT
   ========================================================= */

export const OFFICIAL_DOCUMENT_STYLES = `
/* =========================================================
   A5 PAGE
   ========================================================= */

@page {
  size: A5 portrait;
  margin: 0;
}

.official-document {
  position: relative;

  width: 148mm;
  min-width: 148mm;

  height: 210mm;
  min-height: 210mm;

  box-sizing: border-box;

  padding:
    10mm
    11mm
    9mm;

  color:
    var(--print-foreground);

  background:
    #ffffff;

  font-family:
    var(--print-font-family);

  overflow: visible;
}


/* =========================================================
   OUTER BORDER
   ========================================================= */

.official-document::before {
  content: "";

  position: absolute;

  inset: 4mm;

  pointer-events: none;

  border:
    0.25mm solid
    rgba(103, 58, 244, 0.18);
}


/* =========================================================
   HEADER
   ========================================================= */

.official-header {
  position: relative;

  z-index: 1;

  display: grid;

  grid-template-columns:
    15mm
    minmax(0, 1fr)
    auto;

  align-items: center;

  gap: 3mm;

  padding:
    0
    1mm
    4mm;

  border-bottom:
    0.45mm solid
    var(--print-primary);
}

.official-logo,
.official-logo-fallback {
  width: 13mm;
  height: 13mm;
}

.official-logo {
  display: block;

  object-fit: contain;

  filter:
    grayscale(1)
    contrast(1.08);
}

.official-logo-fallback {
  display: grid;

  place-items: center;

  border:
    0.35mm solid
    var(--print-primary);

  border-radius: 2.5mm;

  color:
    var(--print-primary);

  background:
    var(--print-secondary);

  font-family:
    var(--print-font-brand);

  font-size: 4.5mm;

  font-weight: 800;
}


/* =========================================================
   SCHOOL INFORMATION
   ========================================================= */

.official-school-name {
  margin: 0;

  color:
    var(--print-foreground);

  font-family:
    var(--print-font-brand);

  font-size: 4.2mm;

  line-height: 1.08;

  font-weight: 700;

  letter-spacing: -0.015em;
}

.official-school-meta {
  margin:
    1mm
    0
    0;

  color:
    var(--print-muted-foreground);

  font-family:
    var(--print-font-family);

  font-size: 2mm;

  line-height: 1.4;
}


/* =========================================================
   DOCUMENT META
   ========================================================= */

.official-document-meta {
  min-width: 31mm;

  text-align: right;
}

[dir="rtl"] .official-document-meta {
  text-align: left;
}

.official-document-meta strong {
  display: block;

  color:
    var(--print-primary);

  font-family:
    var(--print-font-brand);

  font-size: 2.8mm;

  text-transform: uppercase;

  letter-spacing: 0.07em;
}


/* =========================================================
   TITLE
   ========================================================= */

.official-title-block {
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 5mm;

  padding:
    5mm
    1mm
    4mm;
}

.official-kicker {
  margin: 0;

  color:
    var(--print-primary);

  font-size: 1.9mm;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: 0.12em;
}

.official-title {
  margin:
    1mm
    0
    0;

  color:
    var(--print-foreground);

  font-family:
    var(--print-font-brand);

  font-size: 5.5mm;

  line-height: 1.04;

  font-weight: 700;

  letter-spacing: -0.02em;
}

.official-description {
  max-width: 88mm;

  margin:
    1.5mm
    0
    0;

  color:
    var(--print-muted-foreground);

  font-size: 2.15mm;

  line-height: 1.45;
}


/* =========================================================
   HIGHLIGHT
   ========================================================= */

.official-highlight {
  min-width: 33mm;

  border:
    0.35mm solid
    var(--print-primary);

  border-radius: 2.5mm;

  padding:
    2.7mm
    3.2mm;

  text-align: right;

  background:
    var(--print-secondary);
}

[dir="rtl"] .official-highlight {
  text-align: left;
}

.official-highlight small {
  display: block;

  color:
    var(--print-muted-foreground);

  font-size: 1.8mm;

  text-transform: uppercase;

  letter-spacing: 0.07em;
}

.official-highlight strong {
  display: block;

  margin-top: 0.8mm;

  color:
    var(--print-primary);

  font-family:
    var(--print-font-brand);

  font-size: 5.2mm;

  line-height: 1;
}


/* =========================================================
   INFORMATION GRID
   ========================================================= */

.official-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 2mm;
}

.official-field {
  min-height: 12mm;

  border:
    0.28mm solid
    var(--print-border);

  border-radius: 2mm;

  padding:
    2.5mm
    2.8mm;

  background:
    var(--print-card);
}

.official-field span {
  display: block;

  color:
    var(--print-primary);

  font-size: 1.8mm;

  font-weight: 650;

  text-transform: uppercase;

  letter-spacing: 0.06em;
}

.official-field strong {
  display: block;

  margin-top: 1mm;

  color:
    var(--print-foreground);

  font-family:
    var(--print-font-family);

  font-size: 2.7mm;

  line-height: 1.3;

  overflow-wrap: anywhere;
}


/* =========================================================
   SECTION
   ========================================================= */

.official-section {
  margin-top: 4mm;

  break-inside: avoid;
}

.official-section-title {
  display: grid;

  grid-template-columns:
    auto
    1fr;

  align-items: center;

  gap: 2.5mm;

  margin:
    0
    0
    2.2mm;

  color:
    var(--print-primary);

  font-family:
    var(--print-font-brand);

  font-size: 3mm;

  font-weight: 700;
}

.official-section-title::after {
  content: "";

  height: 0.3mm;

  background:
    rgba(103, 58, 244, 0.28);
}


/* =========================================================
   TABLE
   ========================================================= */

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
  padding:
    2mm
    2.2mm;

  border:
    0.3mm solid
    var(--print-primary);

  background:
    var(--print-secondary);

  color:
    var(--print-secondary-foreground);

  font-family:
    var(--print-font-family);

  font-size: 1.9mm;

  font-weight: 750;

  text-align: left;

  text-transform: uppercase;

  letter-spacing: 0.04em;
}

[dir="rtl"] .official-table th {
  text-align: right;
}

.official-table td {
  padding:
    2.1mm
    2.2mm;

  border:
    0.3mm solid
    var(--print-border);

  color:
    var(--print-foreground);

  font-family:
    var(--print-font-family);

  font-size: 2.1mm;

  line-height: 1.3;

  vertical-align: top;

  overflow-wrap: anywhere;
}


/* =========================================================
   SUMMARY
   ========================================================= */

.official-summary {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 2mm;

  margin-top: 3.2mm;
}

.official-summary-card {
  border:
    0.3mm solid
    rgba(103, 58, 244, 0.28);

  border-radius: 2.5mm;

  padding:
    2.6mm;

  background:
    var(--print-secondary);
}

.official-summary-card span {
  color:
    var(--print-muted-foreground);

  font-size: 1.8mm;

  font-weight: 650;

  text-transform: uppercase;

  letter-spacing: 0.05em;
}

.official-summary-card strong {
  display: block;

  margin-top: 0.9mm;

  color:
    var(--print-primary);

  font-family:
    var(--print-font-brand);

  font-size: 3.8mm;
}


/* =========================================================
   NOTE
   ========================================================= */

.official-note {
  margin-top: 3.5mm;

  border-left:
    0.7mm solid
    var(--print-primary);

  border-radius: 1.5mm;

  background:
    var(--print-muted);

  padding:
    2.7mm
    3.2mm;

  color:
    var(--print-muted-foreground);

  font-size: 1.95mm;

  line-height: 1.4;
}


/* =========================================================
   SIGNATURE
   ========================================================= */

.official-signatures {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr);

  margin-top: 10mm;

  break-inside: avoid;
}

.official-signature {
  min-height: 17mm;

  padding-top: 9mm;

  border-top:
    0.3mm solid
    var(--print-primary);

  text-align: center;

  color:
    var(--print-muted-foreground);

  font-size: 1.9mm;
}

.official-signature strong {
  display: block;

  color:
    var(--print-foreground);

  font-family:
    var(--print-font-brand);

  font-size: 2.4mm;

  font-weight: 700;
}

.official-signature span {
  display: block;

  margin-top: 1mm;

  font-size: 1.8mm;
}


/* =========================================================
   FOOTER
   ========================================================= */

.official-footer {
  display: flex;

  justify-content: space-between;

  gap: 5mm;

  margin-top: 6mm;

  padding:
    2.8mm
    1mm
    0;

  border-top:
    0.3mm solid
    var(--print-border);

  color:
    var(--print-muted-foreground);

  font-size: 1.7mm;

  line-height: 1.35;
}


/* =========================================================
   PRINT
   ========================================================= */

@media print {
  @page {
    size: A5 portrait;
    margin: 0;
  }

  .official-document {
    width: 148mm;
    height: 210mm;
    min-height: 210mm;

    break-after: page;
  }
}
`;


/* =========================================================
   IDENTITY
   ========================================================= */

function compactIdentity(
  identity: PrintIdentity,
): string {
  return [
    identity.address,
    identity.city,
    identity.country,
    identity.phoneNumber,
    identity.email,
  ]
    .filter(Boolean)
    .map(escapePrintHtml)
    .join(" · ");
}


/* =========================================================
   HEADER
   ========================================================= */

export function buildOfficialHeader(
  identity: PrintIdentity,
  documentTitle: string,
  reference?: string,
): string {
  void reference;

  const logo =
    identity.logoUrl
      ? `
        <img
          class="official-logo"
          src="${escapePrintHtml(
            identity.logoUrl,
          )}"
          alt=""
        />
      `
      : `
        <div class="official-logo-fallback">
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

  const identityMeta =
    compactIdentity(identity) ||
    "Official school document";

  return `
    <header class="official-header">

      ${logo}

      <div>

        <h1 class="official-school-name">
          ${escapePrintHtml(
            identity.schoolName,
          )}
        </h1>

        <p class="official-school-meta">
          ${identityMeta}
        </p>

      </div>

      <div class="official-document-meta">

        <strong>
          ${escapePrintHtml(
            documentTitle,
          )}
        </strong>

      </div>

    </header>
  `;
}


/* =========================================================
   CREATE OFFICIAL DOCUMENT
   ========================================================= */

export function createOfficialDocument({
  title,
  identity,
  documentTitle,
  reference,
  content,
  signatureLabel,
}: {
  title: string;

  identity: PrintIdentity;

  documentTitle: string;

  reference?: string;

  content: string;

  signatureLabel?: string;
}): PrintableDocument {
  void reference;

  const resolvedSignatureLabel =
    signatureLabel ||
    "Director / Principal signature";

  const signatureHtml = `
    <section class="official-signatures">

      <div class="official-signature">

        <strong>
          ${escapePrintHtml(
            resolvedSignatureLabel,
          )}
        </strong>

        <span>
          Signature and date
        </span>

      </div>

    </section>
  `;

  const body = `
    <main
      class="print-page official-document"
      dir="auto"
    >

      ${buildOfficialHeader(
        identity,
        documentTitle,
      )}

      ${content}

      ${signatureHtml}

    </main>
  `;

  return {
    title,

    /*
     * Official documents are ALWAYS
     * A5 portrait.
     */
    orientation: "portrait",

    kind: "official-document",

    html: createPrintableHtml({
      title,

      body,

      styles:
        OFFICIAL_DOCUMENT_STYLES,

      orientation: "portrait",
    }),
  };
}