import type {
  DashboardProfileUser,
  ProfilePermissions,
} from "@/features/profile/types/profile.types";


export function getProfilePermissions(
  user: DashboardProfileUser
): ProfilePermissions {


  const isSuperAdmin =
    user.role.includes(
      "super_admin"
    );


  return {

    canEditPersonalInfo:
      isSuperAdmin,


    canChangePassword:
      true,


    canManageUsers:
      isSuperAdmin,

  };

}