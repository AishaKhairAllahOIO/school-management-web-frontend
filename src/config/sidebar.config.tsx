import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  CalendarDays,
  Wallet,
  Bell,
  BarChart3,
  Settings,
} from "lucide-react";

import { routesConfig } from "./routes.config";

export const sidebarConfig = [
  {
    title: "Dashboard",
    path: routesConfig.dashboard,
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    path: routesConfig.users.root,
    icon: Users,
    children: [
      {
        title: "Students",
        path: routesConfig.users.students,
      },
      {
        title: "Teachers",
        path: routesConfig.users.teachers,
      },
      {
        title: "Parents",
        path: routesConfig.users.parents,
      },
    ],
  },
  {
    title: "Academics",
    path: routesConfig.academics.root,
    icon: GraduationCap,
    children: [
      {
        title: "Classes",
        path: routesConfig.academics.classes,
      },
      {
        title: "Subjects",
        path: routesConfig.academics.subjects,
      },
      {
        title: "Exams",
        path: routesConfig.academics.exams,
      },
    ],
  },
  {
    title: "Attendance",
    path: routesConfig.attendance.root,
    icon: CalendarCheck,
  },
  {
    title: "Scheduling",
    path: routesConfig.scheduling.root,
    icon: CalendarDays,
  },
  {
    title: "Finance",
    path: routesConfig.finance.root,
    icon: Wallet,
  },
  {
    title: "Communications",
    path: routesConfig.communications.root,
    icon: Bell,
  },
  {
    title: "Reports",
    path: routesConfig.reports.root,
    icon: BarChart3,
  },
  {
    title: "Settings",
    path: routesConfig.settings.root,
    icon: Settings,
  },
];