import {
  BookOpen,
  BriefcaseBusiness,
  HeartHandshake,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import type {
  StaffRole,
  StaffSectionConfig,
} from "../types/staff.types";

export const staffSectionConfigs: Record<
  StaffRole,
  StaffSectionConfig
> = {
  teacher: {
    role: "teacher",

    title: "Teachers",
    singularLabel: "Teacher",
    pluralLabel: "Teachers",

    listPath: "/users/teachers",
    createPath: "/users/teachers/new",

    icon: BookOpen,

    color: {
      background: "bg-info",
      light: "bg-info/[0.08]",
      text: "text-info",

      border: "border-info/20",

      hover:
        "hover:border-info/30 hover:bg-info/[0.07] hover:text-info",

      ring:
        "focus-visible:ring-info/15",

      button:
        "bg-info text-white hover:bg-info/90",

      footer:
        "bg-info/[0.035] hover:bg-info/[0.07]",
    },
  },

  adviser: {
    role: "adviser",

    title: "Supervisors",
    singularLabel: "Supervisor",
    pluralLabel: "Supervisors",

    listPath: "/users/supervisors",
    createPath: "/users/supervisors/new",

    icon: ShieldCheck,

    color: {
      background: "bg-success",
      light: "bg-success/[0.08]",
      text: "text-success",

      border: "border-success/20",

      hover:
        "hover:border-success/30 hover:bg-success/[0.07] hover:text-success",

      ring:
        "focus-visible:ring-success/15",

      button:
        "bg-success text-white hover:bg-success/90",

      footer:
        "bg-success/[0.035] hover:bg-success/[0.07]",
    },
  },

  secretary: {
    role: "secretary",

    title: "Secretaries",
    singularLabel: "Secretary",
    pluralLabel: "Secretaries",

    listPath: "/users/secretaries",
    createPath: "/users/secretaries/new",

    icon: BriefcaseBusiness,

    color: {
      background: "bg-warning",
      light: "bg-warning/[0.09]",
      text: "text-warning",

      border: "border-warning/25",

      hover:
        "hover:border-warning/35 hover:bg-warning/[0.08] hover:text-warning",

      ring:
        "focus-visible:ring-warning/15",

      button:
        "bg-warning text-warning-foreground hover:bg-warning/90",

      footer:
        "bg-warning/[0.04] hover:bg-warning/[0.08]",
    },
  },

  counselor: {
    role: "counselor",

    title: "Counselors",
    singularLabel: "Counselor",
    pluralLabel: "Counselors",

    listPath: "/users/counselors",
    createPath: "/users/counselors/new",

    icon: HeartHandshake,

    color: {
      background:
        "bg-destructive",

      light:
        "bg-destructive/[0.08]",

      text:
        "text-destructive",

      border:
        "border-destructive/20",

      hover:
        "hover:border-destructive/30 hover:bg-destructive/[0.07] hover:text-destructive",

      ring:
        "focus-visible:ring-destructive/15",

      button:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",

      footer:
        "bg-destructive/[0.035] hover:bg-destructive/[0.07]",
    },
  },

  service_staff: {
    role: "service_staff",

    title: "Service Staff",
    singularLabel: "Staff Member",
    pluralLabel: "Service Staff",

    listPath:
      "/users/service-staff",

    createPath:
      "/users/service-staff/new",

    icon: UserCog,

    color: {
      background:
        "bg-secondary-foreground",

      light:
        "bg-secondary",

      text:
        "text-secondary-foreground",

      border:
        "border-secondary-foreground/20",

      hover:
        "hover:border-secondary-foreground/30 hover:bg-secondary hover:text-secondary-foreground",

      ring:
        "focus-visible:ring-secondary-foreground/15",

      button:
        "bg-secondary-foreground text-background hover:bg-secondary-foreground/90",

      footer:
        "bg-secondary/55 hover:bg-secondary/80",
    },
  },
};