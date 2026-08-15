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
  const safeLaws = Array.isArray(laws) ? laws : [];

  const cards = safeLaws
    .map(
      (law, index) => `
        <article class="poster-law-item">
          <div class="poster-law-number">
            ${String(index + 1).padStart(2, "0")}
          </div>

          <div class="poster-law-text">
            <h2 dir="auto">
              ${escapePrintHtml(law.title || "")}
            </h2>

            ${
              law.description
                ? `
                  <p dir="auto">
                    ${escapePrintHtml(law.description)}
                  </p>
                `
                : ""
            }
          </div>
        </article>
      `,
    )
    .join("");

  const emptyState = `
    <div class="poster-law-empty">
      No school laws are currently available.
    </div>
  `;

  return createPosterDocument({
    title: "School laws poster",
    identity,

    eyebrow: "Our shared values",

    headline: "School Laws & Community Promises",

    description:
      "Simple choices that help create a respectful, safe, and welcoming school community.",

    bodyHtml: `
      <section class="school-laws-content">

        <div class="school-laws-heading">
          <span>Our community promises</span>
        </div>

        <div class="school-laws-list">
          ${cards || emptyState}
        </div>

      </section>
    `,

    footer: "Respect · Responsibility · Safety · Kindness",

    tone: "violet",
  });
}