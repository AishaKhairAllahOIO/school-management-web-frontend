import {
  BookOpen,
  BriefcaseBusiness,
  HeartHandshake,
  ShieldCheck,
  UserCog,
  UserRoundCog,
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

      fieldHover: "hover:border-info/25 hover:bg-card",
      fieldFocus: "focus:border-info/40 focus:bg-card",
      fieldRing: "focus:ring-info/[0.10]",
      itemHover: "hover:border-info/20 hover:bg-info/[0.035]",
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

      fieldHover: "hover:border-success/25 hover:bg-card",
      fieldFocus: "focus:border-success/40 focus:bg-card",
      fieldRing: "focus:ring-success/[0.10]",
      itemHover: "hover:border-success/20 hover:bg-success/[0.035]",
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
        "bg-warning text-white hover:bg-warning/90",

      footer:
        "bg-warning/[0.04] hover:bg-warning/[0.08]",

      fieldHover: "hover:border-warning/30 hover:bg-card",
      fieldFocus: "focus:border-warning/45 focus:bg-card",
      fieldRing: "focus:ring-warning/[0.12]",
      itemHover: "hover:border-warning/25 hover:bg-warning/[0.04]",
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

      fieldHover: "hover:border-destructive/25 hover:bg-card",
      fieldFocus: "focus:border-destructive/40 focus:bg-card",
      fieldRing: "focus:ring-destructive/[0.10]",
      itemHover: "hover:border-destructive/20 hover:bg-destructive/[0.035]",
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

      fieldHover: "hover:border-secondary-foreground/25 hover:bg-card",
      fieldFocus: "focus:border-secondary-foreground/40 focus:bg-card",
      fieldRing: "focus:ring-secondary-foreground/[0.10]",
      itemHover: "hover:border-secondary-foreground/20 hover:bg-secondary/70",
    },
  },

  super_admin: {
    role: "super_admin",

    title: "Administrators",
    singularLabel: "Administrator",
    pluralLabel: "Administrators",

    listPath: "/profile",
    createPath: "/users/administrators/new",

    icon: UserRoundCog,

    color: {
      background: "bg-primary",
      light: "bg-primary/[0.08]",
      text: "text-primary",

      border: "border-primary/20",

      hover:
        "hover:border-primary/30 hover:bg-primary/[0.07] hover:text-primary",

      ring:
        "focus-visible:ring-primary/15",

      button:
        "bg-primary text-primary-foreground hover:bg-primary/90",

      footer:
        "bg-primary/[0.035] hover:bg-primary/[0.07]",

      fieldHover: "hover:border-primary/25 hover:bg-card",
      fieldFocus: "focus:border-primary/40 focus:bg-card",
      fieldRing: "focus:ring-primary/[0.10]",
      itemHover: "hover:border-primary/20 hover:bg-primary/[0.035]",
    },
  },

};