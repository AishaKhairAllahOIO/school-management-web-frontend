import { useQuery } from "@tanstack/react-query";

import {
  getMyProfile,
} from "../api/profile.api";

import type {
  DashboardProfileUser,
  ProfileIdentity,
  ProfilePermissions,
} from "../types/profile.types";


function getRoleLabel(
  roles: string[],
): string {

  const role = roles?.[0];

  if (!role) {
    return "User";
  }

  return role
    .split("_")
    .map(
      (item) =>
        item.charAt(0).toUpperCase() +
        item.slice(1),
    )
    .join(" ");
}



function buildIdentity(
  user: DashboardProfileUser,
): ProfileIdentity {

  return {
    email: user.email,
    roleLabel: getRoleLabel(user.role),
  };
}



function buildPermissions(
  user: DashboardProfileUser,
): ProfilePermissions {

  const isSuperAdmin =
    user.role.includes("super_admin");


  return {
    canEditPersonalInfo:
      isSuperAdmin,

    canChangePassword:
      true,

    canManageUsers:
      isSuperAdmin,
  };
}


export function useProfile() {

  const query =
    useQuery({
      queryKey:[
        "my-profile",
      ],

      queryFn:
        getMyProfile,

      staleTime:
        1000 * 60 * 10,
    });



  const user =
    query.data as
      | DashboardProfileUser
      | undefined;



  return {

    ...query,

    user,

    identity:
      user
        ? buildIdentity(user)
        : undefined,


    permissions:
      user
        ? buildPermissions(user)
        : undefined,

  };
}