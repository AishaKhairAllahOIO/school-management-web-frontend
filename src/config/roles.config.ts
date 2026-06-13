export type UserRole = "SUPER_ADMIN" | "ADVISOR" | "SECRETARY";

export const rolesConfig = {
  SUPER_ADMIN: "SUPER_ADMIN" as const,
  ADVISOR: "ADVISOR" as const,
  SECRETARY: "SECRETARY" as const,
};
