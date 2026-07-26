import type { CSSProperties } from "react";
import { useLocation } from "react-router-dom";

import { academicNavigationGroups } from "../config/academic-navigation";

export type AcademicThemeId = "structure" | "curriculum" | "teaching";

export function useAcademicTheme() {
  const { pathname } = useLocation();

  const group =
    academicNavigationGroups.find((candidate) =>
      candidate.items.some((item) => pathname.startsWith(item.path)),
    ) ?? academicNavigationGroups[0];

  const item =
    group.items.find((candidate) => pathname.startsWith(candidate.path)) ??
    group.items[0];

  const primary =
    group.id === "structure"
      ? "258 74% 58%"
      : group.id === "curriculum"
        ? "217 91% 60%"
        : "153 60% 42%";

  return {
    id: group.id,
    label: group.label,
    description: group.description,
    icon: item.icon,
    itemLabel: item.label,
    style: {
      "--primary": primary,
      "--primary-foreground": "0 0% 100%",
    } as CSSProperties,
  };
}
