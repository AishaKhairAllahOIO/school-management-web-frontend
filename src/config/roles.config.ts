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

<<<<<<< HEAD
export type UserRole =
  (typeof rolesConfig)[keyof typeof rolesConfig];

 
=======
export type UserRole = keyof typeof rolesConfig;
>>>>>>> e393295b03180ed0e70bb8e4353e7ea928f66909
