import type {
  DashboardProfileUser,
  ProfileIdentity,
} from "@/features/profile/types/profile.types";

export function getProfileIdentity(
  user: DashboardProfileUser
): ProfileIdentity {
  if (user.category === "super_admin") {
    return {
      code: user.superAdminCode,
      email: user.superAdminEmail,
      roleLabel: "Super Admin",
      category: user.category,
    };
  }

  if (user.category === "secretary") {
    return {
      code: user.secretaryCode,
      email: user.secretaryEmail,
      roleLabel: "Secretary",
      category: user.category,
    };
  }

  if (user.category === "supervisor") {
    return {
      code: user.supervisorCode,
      email: user.supervisorEmail,
      roleLabel: "Supervisor",
      category: user.category,
    };
  }

  const category = user;
  throw new Error(`Unsupported profile category: ${category}`);
}