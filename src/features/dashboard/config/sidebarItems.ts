import {BarChart3, CalendarDays, ClipboardCheck, GraduationCap, LayoutDashboard, Settings, Users, Wallet} from "lucide-react";

export const sidebarItems = 
[
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    path: "/users",
    icon: Users,
  },
  {
    title: "Academic",
    path: "/academics",
    icon: GraduationCap,
  },
  {
    title: "Attendance",
    path: "/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Scheduling",
    path: "/scheduling",
    icon: CalendarDays,
  },
  {
    title: "Finance",
    path: "/finance",
    icon: Wallet,
  },
  {
    title: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];