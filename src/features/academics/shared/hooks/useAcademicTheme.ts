import type { CSSProperties } from "react";
import { useLocation } from "react-router-dom";

import { academicNavigationGroups } from "../config/academic-navigation";

export type AcademicThemeId = "structure" | "curriculum" | "teaching";

type AcademicPalette = {
  accent: string;
  accentStrong: string;
  soft: string;
  softHover: string;
  border: string;
  ring: string;
  shadow: string;
};

/*
 * These tones intentionally follow the Users module hierarchy:
 * - one clear accent
 * - very light surfaces
 * - restrained borders
 * - soft, low-opacity shadows
 */
const palettes: Record<AcademicThemeId, AcademicPalette> = {
  structure: {
    accent: "#6847F5",
    accentStrong: "#5635E8",
    soft: "#F7F5FF",
    softHover: "#F1EEFF",
    border: "#E4DEFF",
    ring: "rgba(104, 71, 245, 0.10)",
    shadow: "rgba(51, 35, 132, 0.08)",
  },
  curriculum: {
    accent: "#5D91ED",
    accentStrong: "#477EDB",
    soft: "#F5F8FE",
    softHover: "#EEF4FD",
    border: "#DCE8FA",
    ring: "rgba(93, 145, 237, 0.10)",
    shadow: "rgba(44, 83, 145, 0.08)",
  },
  teaching: {
    accent: "#46B982",
    accentStrong: "#36A873",
    soft: "#F4FBF7",
    softHover: "#ECF8F2",
    border: "#D8EFE3",
    ring: "rgba(70, 185, 130, 0.10)",
    shadow: "rgba(38, 112, 77, 0.08)",
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

  const id = group.id as AcademicThemeId;
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
