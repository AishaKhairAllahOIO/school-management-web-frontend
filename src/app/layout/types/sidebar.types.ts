import type { LucideIcon } from "lucide-react";

import type { TranslationDictionary } from "@/app/translations/types";

export type SidebarNavigationKey =
  keyof TranslationDictionary["navigation"];

export type SidebarItem = {
  titleKey: SidebarNavigationKey;
  path: string;
  icon: LucideIcon;
  exact?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  badge?: string;
};