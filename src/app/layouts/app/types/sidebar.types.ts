import type { LucideIcon } from "lucide-react";

export type SidebarItem = {
  title: string;
  path: string;
  icon: LucideIcon;

  children?: SidebarItem[];

  badge?: string | number;

  hidden?: boolean;

  disabled?: boolean;

  permissions?: string[];

  exact?: boolean;
};