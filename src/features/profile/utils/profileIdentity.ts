import type {
  DashboardProfileUser,
  ProfileIdentity,
} from "@/features/profile/types/profile.types";

export function getProfileIdentity(
  user: DashboardProfileUser
): ProfileIdentity {
  switch (user.category) {
    case "super_admin":
      return {
        code: user.superAdminCode,
        email: user.superAdminEmail,
        roleLabel: "Super Admin",
        category: user.category,
      };

    case "secretary":
      return {
        code: user.secretaryCode,
        email: user.secretaryEmail,
        roleLabel: "Secretary",
        category: user.category,
      };

    case "supervisor":
      return {
        code: user.supervisorCode,
        email: user.supervisorEmail,
        roleLabel: "Supervisor",
        category: user.category,
      };

    default:
      throw new Error(`Unsupported profile category: ${user.category}`);
  }
}