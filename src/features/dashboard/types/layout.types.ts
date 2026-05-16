import type { LucideIcon } from "lucide-react";

export type SidebarChildItem =
{
  title: string;
  path: string;
};

export type SidebarItem = 
{
  title: string;
  path?: string;
  icon: LucideIcon;
  children?: SidebarChildItem[];
};