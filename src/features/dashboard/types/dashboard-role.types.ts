export type DashboardRole =
  | "super_admin"
  | "secretary"
  | "adviser";

export type DashboardRoleResolution = {
  role: DashboardRole | null;
  rawRole: string | null;
};
