import type { SuperAdminUser } from "@/features/users/super-admin/types/super-admin.types";
import type { SecretaryUser } from "@/features/users/secretaries/types/secretary.types";
import type { SupervisorUser } from "@/features/users/supervisors/types/supervisor.types";

export type DashboardProfileUser =
  | SuperAdminUser
  | SecretaryUser
  | SupervisorUser;

export type ProfileIdentity = {
  code: string;
  email: string;
  roleLabel: string;
  category: DashboardProfileUser["category"];
};

export type ProfilePermissions = {
  canEditPersonalInfo: boolean;
  canChangePassword: boolean;
  canManageUsers: boolean;
};