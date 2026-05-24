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

export const sidebarItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    path: "/users/students",
    icon: Users,
  },
  {
    title: "Academic",
    path: "/academics/classes",
    icon: GraduationCap,
  },
  {
    title: "Attendance",
    path: "/attendance/students",
    icon: ClipboardCheck,
  },
  {
    title: "Scheduling",
    path: "/scheduling/classes",
    icon: CalendarDays,
  },
  {
    title: "Finance",
    path: "/finance/fees",
    icon: Wallet,
  },
  {
    title: "Communication",
    path: "/communication/announcements",
    icon: MessageCircle,
  },
  {
    title: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    path: "/settings/roles",
    icon: Settings,
  },
];