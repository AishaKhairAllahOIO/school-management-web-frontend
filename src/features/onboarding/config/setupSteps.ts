import { BookOpen, Building2, CalendarCheck2, Users, Wallet } from "lucide-react";
import type { FeatureTipDefinition, SetupStep } from "../types/onboarding.types";

export const setupSteps: SetupStep[] = [
  {
    id: "general-settings",
    title: "School information",
    description: "Add the school identity, contact details, logo, and website information.",
    path: "/settings/general",
    icon: Building2,
  },
  {
    id: "academic-settings",
    title: "Academic structure",
    description: "Configure academic years, stages, grades, and semesters used by your school.",
    path: "/settings/academic",
    icon: BookOpen,
  },
  {
    id: "users",
    title: "Students and staff",
    description: "Create the people who will use and operate the school system.",
    path: "/users",
    icon: Users,
  },
  {
    id: "financial-settings",
    title: "Financial setup",
    description: "Prepare fee plans, installment policies, and employee finance settings.",
    path: "/settings/financial",
    icon: Wallet,
  },
  {
    id: "attendance-settings",
    title: "Attendance rules",
    description: "Review attendance rules before daily recording begins.",
    path: "/settings/attendance",
    icon: CalendarCheck2,
  },
];

export const featureTips: FeatureTipDefinition[] = [
  {
    id: "finance-printing",
    pathPrefix: "/finance/students/",
    title: "Official finance documents",
    description: "Print each payment receipt as proof. The final financial statement appears only after the account is fully paid.",
  },
  {
    id: "laws-poster",
    pathPrefix: "/communications/laws",
    title: "Poster-ready school laws",
    description: "Use Print poster only when the regulations will be displayed in a classroom or on a notice board.",
  },
  {
    id: "activity-poster",
    pathPrefix: "/communications/activities",
    title: "Print selectively",
    description: "Activity posters are useful for public events. Routine activities should remain digital inside the system.",
  },
];
