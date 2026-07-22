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
  },

  adviser: {
    role: "adviser",
    title: "Supervisors",
    singularLabel: "Supervisor",
    pluralLabel: "Supervisors",
    listPath: "/users/supervisors",
    createPath: "/users/supervisors/new",
  },

  secretary: {
    role: "secretary",
    title: "Secretaries",
    singularLabel: "Secretary",
    pluralLabel: "Secretaries",
    listPath: "/users/secretaries",
    createPath: "/users/secretaries/new",
  },

  counselor: {
    role: "counselor",
    title: "Counselors",
    singularLabel: "Counselor",
    pluralLabel: "Counselors",
    listPath: "/users/counselors",
    createPath: "/users/counselors/new",
  },

  service_staff: {
    role: "service_staff",
    title: "Service Staff",
    singularLabel: "Staff Member",
    pluralLabel: "Service Staff",
    listPath: "/users/service-staff",
    createPath: "/users/service-staff/new",
  },
};