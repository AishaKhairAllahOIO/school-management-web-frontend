import type { TranslationDictionary } from "@/app/translations/types";

import type { UserRoleSource } from "./topbar.types";

type NavigationKey =
  keyof TranslationDictionary["navigation"];

export function formatPathSegment(
  value?: string,
): string {
  if (!value) {
    return "";
  }

  return value
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

export function getSectionKey(
  pathname: string,
): NavigationKey {
  if (pathname === "/") return "dashboard";
  if (pathname.startsWith("/users")) return "users";
  if (pathname.startsWith("/academics")) return "academics";
  if (pathname.startsWith("/attendance")) return "attendance";
  if (pathname.startsWith("/scheduling")) return "scheduling";
  if (pathname.startsWith("/finance")) return "finance";

  if (pathname.startsWith("/communications")) {
    return "communications";
  }

  if (pathname.startsWith("/reports")) return "reports";
  if (pathname.startsWith("/settings")) return "settings";
  if (pathname.startsWith("/profile")) return "profile";

  return "dashboard";
}

export function getCurrentPageTitle(
  pathname: string,
  overviewLabel: string,
): string {
  const segments = pathname
    .split("/")
    .filter(Boolean);

  if (segments.length <= 1) {
    return overviewLabel;
  }

  return formatPathSegment(segments[1]);
}

export function getRoleLabel(
  user: UserRoleSource,
): string {
  if (user.role) {
    return user.role;
  }

  if (user.category === "super_admin") {
    return "Super Admin";
  }

  if (user.category === "secretary") {
    return "Secretary";
  }

  if (user.category === "supervisor") {
    return "Supervisor";
  }

  return "User";
}