import {
  createPosterDocument,
  escapePrintHtml,
  type PrintIdentity,
} from "@/features/printing";
import type { SchoolLaw } from "../../types/school-laws.types";

export function buildSchoolLawsPosterDocument(
  laws: SchoolLaw[],
  identity: PrintIdentity,
) {
  const cards = laws
    .map(
      (law, index) => `<article class="poster-card">
        <span class="poster-card-number">${String(index + 1).padStart(2, "0")}</span>
        <div><h2 dir="auto">${escapePrintHtml(law.title)}</h2>${law.description ? `<p dir="auto">${escapePrintHtml(law.description)}</p>` : ""}</div>
      </article>`,
    )
    .join("");

  return createPosterDocument({
    title: "School laws poster",
    identity,
    eyebrow: "Our shared values",
    headline: "School Laws & Community Promises",
    description:
      "Respectful choices, safe actions, and responsible behavior help everyone learn and belong.",
    bodyHtml: `<section class="poster-content"><h2 class="poster-content-title">Our community promises</h2><div class="poster-grid">${cards}</div></section>`,
    footer: "Respect · Responsibility · Safety · Kindness",
    tone: "violet",
  });
}
