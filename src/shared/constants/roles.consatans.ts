export const USER_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADVISOR: "ADVISOR",
  SECRETARY: "SECRETARY",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];