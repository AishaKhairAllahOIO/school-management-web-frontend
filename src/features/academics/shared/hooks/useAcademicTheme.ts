import type { CSSProperties } from "react";
import { useLocation } from "react-router-dom";

import { academicNavigationGroups } from "../config/academic-navigation";

export type AcademicThemeId =
  | "structure"
  | "curriculum"
  | "teaching"
  | "overview";

type AcademicPalette = {
  accent: string;
  accentStrong: string;
  soft: string;
  softHover: string;
  border: string;
  ring: string;
  shadow: string;
};

const palettes: Record<AcademicThemeId, AcademicPalette> = {
  // =========================================================
  // Structure
  // =========================================================
  structure: {
    accent: "#6847F5",
    accentStrong: "#5635E8",
    soft: "#F7F5FF",
    softHover: "#F1EEFF",
    border: "#E4DEFF",
    ring: "rgba(104, 71, 245, 0.10)",
    shadow: "rgba(51, 35, 132, 0.08)",
  },

  // =========================================================
  // Curriculum
  // =========================================================
  curriculum: {
    accent: "#5D91ED",
    accentStrong: "#477EDB",
    soft: "#F5F8FE",
    softHover: "#EEF4FD",
    border: "#DCE8FA",
    ring: "rgba(93, 145, 237, 0.10)",
    shadow: "rgba(44, 83, 145, 0.08)",
  },

  // =========================================================
  // Teaching
  // =========================================================
  teaching: {
    accent: "#46B982",
    accentStrong: "#36A873",
    soft: "#F4FBF7",
    softHover: "#ECF8F2",
    border: "#D8EFE3",
    ring: "rgba(70, 185, 130, 0.10)",
    shadow: "rgba(38, 112, 77, 0.08)",
  },

  // =========================================================
  // Academic Overview
  //
  // Warm pastel yellow.
  // This is intentionally softer than warning.
  // It represents an overview/navigation section,
  // not an alert state.
  // =========================================================
  overview: {
    accent: "#C59A28",
    accentStrong: "#AA801C",
    soft: "#FFF9E8",
    softHover: "#FFF4D2",
    border: "#F1E2B5",
    ring: "rgba(197, 154, 40, 0.10)",
    shadow: "rgba(148, 113, 24, 0.07)",
  },
};

export function useAcademicTheme() {
  const { pathname } = useLocation();

  const group =
    academicNavigationGroups.find((candidate) =>
      candidate.items.some((item) => pathname.startsWith(item.path)),
    ) ?? academicNavigationGroups[0];

  const item =
    group.items.find((candidate) => pathname.startsWith(candidate.path)) ??
    group.items[0];

  /*
   * `overview` exists in the palette as a reusable theme,
   * but it is not part of academicNavigationGroups.
   *
   * Therefore the current route continues to resolve only
   * structure / curriculum / teaching here.
   */
  const id = group.id as Exclude<AcademicThemeId, "overview">;
  const palette = palettes[id];

  return {
    id,
    label: group.label,
    description: group.description,
    icon: item.icon,
    itemLabel: item.label,
    palette,

    style: {
      "--academic-accent": palette.accent,
      "--academic-accent-strong": palette.accentStrong,
      "--academic-soft": palette.soft,
      "--academic-soft-hover": palette.softHover,
      "--academic-border": palette.border,
      "--academic-ring": palette.ring,
      "--academic-shadow": palette.shadow,
    } as CSSProperties,
  };
}

/**
 * Reusable palette for standalone Academic Overview UI.
 *
 * This does not depend on the current route.
 */
export const academicOverviewPalette = palettes.overview;