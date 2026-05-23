export const rolesConfig = 
{
  SUPER_ADMIN: "SUPER_ADMIN",
  ADVISOR: "ADVISOR",
  SECRETARY: "SECRETARY",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  PARENT: "PARENT",
  COUNSELOR: "COUNSELOR",
} as const;

export type UserRole =
  (typeof rolesConfig)[keyof typeof rolesConfig];

 