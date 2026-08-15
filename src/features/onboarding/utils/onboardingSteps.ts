import {
  BarChart3,
  Bell,
  CalendarDays,
  ClipboardCheck,
  Globe,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  Settings,
  UserCircle,
  Users,
  Wallet,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export interface OnboardingStep {
  target: string;
  title: string;
  content: string;
  placement?: "top" | "bottom" | "left" | "right" | "center";
  icon: LucideIcon;
}

/* -------------------------------------------------------------------------- */
/* Desktop                                                                    */
/* -------------------------------------------------------------------------- */

export const DESKTOP_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    target: "#sidebar-dashboard",
    title: "Dashboard",
    content: "Get a complete overview of your school metrics at a glance.",
    placement: "right",
    icon: LayoutDashboard,
  },

  {
    target: "#sidebar-users",
    title: "User Management",
    content: "Easily manage students, teachers, and staff profiles.",
    placement: "right",
    icon: Users,
  },

  {
    target: "#sidebar-academics",
    title: "Academics",
    content: "Manage grades, classes, subjects, and teaching assignments.",
    placement: "right",
    icon: GraduationCap,
  },

  {
    target: "#sidebar-attendance",
    title: "Attendance",
    content:
      "Track daily attendance for students and staff with real-time updates.",
    placement: "right",
    icon: ClipboardCheck,
  },

  {
    target: "#sidebar-scheduling",
    title: "Scheduling",
    content: "Organize timetables, class schedules, and exam dates.",
    placement: "right",
    icon: CalendarDays,
  },

  {
    target: "#sidebar-finance",
    title: "Finance",
    content: "Track payments, manage fees, handle invoices, and view reports.",
    placement: "right",
    icon: Wallet,
  },

  {
    target: "#sidebar-communications",
    title: "Communications",
    content: "Send announcements, alerts, and share school policies.",
    placement: "right",
    icon: MessageCircle,
  },

  {
    target: "#sidebar-reports",
    title: "Reports & Analytics",
    content:
      "Access detailed data insights, trends, and performance analytics.",
    placement: "right",
    icon: BarChart3,
  },

  {
    target: "#sidebar-settings",
    title: "Settings",
    content:
      "Configure system preferences, manage permissions, and global options.",
    placement: "right",
    icon: Settings,
  },

  {
    target: "#sidebar-content",
    title: "Manage Website",
    content: "Manage public content and information for your school website.",
    placement: "right",
    icon: Globe,
  },

  {
    target: "#topbar-notifications",
    title: "Notifications",
    content:
      "Stay updated with real-time alerts, reminders, and important messages.",
    placement: "bottom",
    icon: Bell,
  },

  {
    target: "#topbar-profile",
    title: "Your Profile",
    content:
      "View and manage your account details, and restart this tour anytime.",
    placement: "bottom",
    icon: UserCircle,
  },
];

/* -------------------------------------------------------------------------- */
/* Mobile                                                                     */
/* -------------------------------------------------------------------------- */

export const MOBILE_ONBOARDING_STEPS: OnboardingStep[] = [
  /* ---------------------------- Mobile Sidebar --------------------------- */

  {
    target: "#topbar-mobile-sidebar",
    title: "Navigation Menu",
    content:
      "Tap here to open the navigation menu and access all school sections.",
    placement: "bottom",
    icon: LayoutDashboard,
  },

  /* ---------------------------- Sidebar Dialogs --------------------------- */

  {
    target: "",
    title: "Dashboard",
    content: "Get a complete overview of your school metrics at a glance.",
    placement: "center",
    icon: LayoutDashboard,
  },

  {
    target: "",
    title: "User Management",
    content: "Easily manage students, teachers, and staff profiles.",
    placement: "center",
    icon: Users,
  },

  {
    target: "",
    title: "Academics",
    content: "Manage grades, classes, subjects, and teaching assignments.",
    placement: "center",
    icon: GraduationCap,
  },

  {
    target: "",
    title: "Attendance",
    content:
      "Track daily attendance for students and staff with real-time updates.",
    placement: "center",
    icon: ClipboardCheck,
  },

  {
    target: "",
    title: "Scheduling",
    content: "Organize timetables, class schedules, and exam dates.",
    placement: "center",
    icon: CalendarDays,
  },

  {
    target: "",
    title: "Finance",
    content: "Track payments, manage fees, handle invoices, and view reports.",
    placement: "center",
    icon: Wallet,
  },

  {
    target: "",
    title: "Communications",
    content: "Send announcements, alerts, and share school policies.",
    placement: "center",
    icon: MessageCircle,
  },

  {
    target: "",
    title: "Reports & Analytics",
    content:
      "Access detailed data insights, trends, and performance analytics.",
    placement: "center",
    icon: BarChart3,
  },

  {
    target: "",
    title: "Settings",
    content:
      "Configure system preferences, manage permissions, and global options.",
    placement: "center",
    icon: Settings,
  },

  {
    target: "",
    title: "Manage Website",
    content: "Manage public content and information for your school website.",
    placement: "center",
    icon: Globe,
  },

  /* ------------------------------ Topbar --------------------------------- */

  {
    target: "#topbar-notifications",
    title: "Notifications",
    content:
      "Stay updated with important alerts, reminders, and school messages.",
    placement: "bottom",
    icon: Bell,
  },

  {
    target: "#topbar-profile",
    title: "Your Profile",
    content: "View your account details and access your profile settings.",
    placement: "bottom",
    icon: UserCircle,
  },
];

export const ONBOARDING_STEPS = DESKTOP_ONBOARDING_STEPS;
