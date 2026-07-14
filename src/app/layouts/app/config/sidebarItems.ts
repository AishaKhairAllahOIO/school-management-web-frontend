import {
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

import type { SidebarItem } from "@/app/layouts/app/types/sidebar.types";

export const sidebarItems: SidebarItem[] = [
  {
    titleKey: "dashboard",
    path: "/",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    titleKey: "users",
    path: "/users/students",
    icon: Users,
  },
  {
    titleKey: "academics",
    path: "/academics/grades",
    icon: GraduationCap,
  },
  {
    titleKey: "attendance",
    path: "/attendance/students",
    icon: ClipboardCheck,
  },
  {
    titleKey: "scheduling",
    path: "/scheduling/classes",
    icon: CalendarDays,
  },
  {
    titleKey: "finance",
    path: "/finance/fees",
    icon: Wallet,
  },
  {
    titleKey: "communications",
    path: "/communication/announcements",
    icon: MessageCircle,
  },
  {
    titleKey: "reports",
    path: "/reports",
    icon: BarChart3,
  },
  {
    titleKey: "settings",
    path: "/settings/general",
    icon: Settings,
  },
];
