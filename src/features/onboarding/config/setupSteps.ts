import {
  BarChart3,
  BellRing,
  CalendarDays,
  ClipboardCheck,
  Globe2,
  GraduationCap,
  MessageCircle,
  Settings,
  UserCircle2,
  Users,
  Wallet,
} from "lucide-react";

import type { FeatureTipDefinition, SetupStep } from "../types/onboarding.types";

const navigationTarget = (path: string, fallback = "main") => [
  `[data-onboarding-path="${path}"]`,
  `a[href="${path}"]`,
  fallback,
];

export const setupSteps: SetupStep[] = [
  {
    id: "settings",
    sectionId: "settings",
    sectionTitle: "Start with setup",
    title: "Settings",
    description:
      "Begin here to enter the school's information and configure academic, attendance, financial, role and permission settings before daily work starts.",
    path: "/settings/general",
    icon: Settings,
    targetSelectors: navigationTarget("/settings/general"),
  },
  {
    id: "users",
    sectionId: "administration",
    sectionTitle: "Create system users",
    title: "Users",
    description:
      "Add administrators, supervisors, secretaries, teachers and other staff here. Add students only after grades and classrooms are prepared in Academics.",
    path: "/users",
    icon: Users,
    targetSelectors: navigationTarget("/users"),
  },
  {
    id: "academics",
    sectionId: "academic-setup",
    sectionTitle: "Prepare the academic structure",
    title: "Academics",
    description:
      "Set up grades, grade configuration, classrooms, subjects, grade-subject links and assessment rules, then complete teacher workloads and assignments.",
    path: "/academics",
    icon: GraduationCap,
    targetSelectors: navigationTarget("/academics"),
  },
  {
    id: "scheduling",
    sectionId: "scheduling",
    sectionTitle: "Organize school time",
    title: "Scheduling",
    description:
      "Create weekly class schedules, exam and quiz plans, and holidays after classrooms, subjects and teacher assignments are ready.",
    path: "/scheduling/classes",
    icon: CalendarDays,
    targetSelectors: navigationTarget("/scheduling/classes"),
  },
  {
    id: "attendance",
    sectionId: "attendance",
    sectionTitle: "Track daily attendance",
    title: "Attendance",
    description:
      "Record and review student and staff attendance using the working days and attendance rules configured in Settings.",
    path: "/attendance/students",
    icon: ClipboardCheck,
    targetSelectors: navigationTarget("/attendance/students"),
  },
  {
    id: "finance",
    sectionId: "finance",
    sectionTitle: "Manage financial records",
    title: "Finance",
    description:
      "Manage student contracts, installments and payments, and keep employee payroll in its separate staff area.",
    path: "/finance",
    icon: Wallet,
    targetSelectors: navigationTarget("/finance"),
  },
  {
    id: "communications",
    sectionId: "communications",
    sectionTitle: "Communicate with the school",
    title: "Communications",
    description:
      "Create announcements and alerts, organize activities, and publish school laws for the audiences you are authorized to reach.",
    path: "/communications/announcements",
    icon: MessageCircle,
    targetSelectors: navigationTarget("/communications/announcements"),
  },
  {
    id: "reports",
    sectionId: "reports",
    sectionTitle: "Review recorded information",
    title: "Reports",
    description:
      "Review academic, attendance and financial information already recorded across the system when you need a consolidated view.",
    path: "/reports",
    icon: BarChart3,
    targetSelectors: navigationTarget("/reports"),
  },
  {
    id: "notifications",
    sectionId: "system",
    sectionTitle: "Stay informed",
    title: "Notifications",
    description:
      "The bell shows system notices and announcements or alerts sent to you by higher administration. These are separate from messages you create in Communications.",
    path: "/reports",
    icon: BellRing,
    targetSelectors: ["[data-onboarding-target=\"notifications\"]"],
  },
  {
    id: "profile",
    sectionId: "system",
    sectionTitle: "Access your account tools",
    title: "Profile menu",
    description:
      "Open your profile, administrator tools and help options here. You can restart this guide from this menu at any time.",
    path: "/profile",
    icon: UserCircle2,
    targetSelectors: ["[data-onboarding-target=\"profile\"]"],
  },
  {
    id: "website",
    sectionId: "system",
    sectionTitle: "Open the public website",
    title: "View website",
    description:
      "Use this shortcut to open the school's public website in a new tab without leaving the management system.",
    path: "/profile",
    icon: Globe2,
    targetSelectors: ["[data-onboarding-target=\"website\"]"],
  },

];

export const featureTips: FeatureTipDefinition[] = [
  {
    id: "student-finance-final-document",
    pathPrefix: "/finance/students/",
    title: "Print only official financial evidence",
    description:
      "Print payment receipts when proof is needed. The final statement is intended for a fully paid account.",
  },
  {
    id: "laws-poster-purpose",
    pathPrefix: "/communications/laws",
    title: "Keep one digital source for school laws",
    description:
      "Update laws here first, then print a poster only when a physical notice-board copy is needed.",
  },
  {
    id: "activity-poster-purpose",
    pathPrefix: "/communications/activities",
    title: "Activity posters are optional",
    description:
      "Create a poster only for an activity that will be displayed publicly. Other activities can remain fully digital.",
  },
];
