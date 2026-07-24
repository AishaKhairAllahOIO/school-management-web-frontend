import type {
  DashboardProfileUser,
  ProfileIdentity,
} from "@/features/profile/types/profile.types";


export function getProfileIdentity(
  user: DashboardProfileUser
): ProfileIdentity {


  const role =
    user.role?.[0] ?? "user";


  return {

    email:
      user.email,


    roleLabel:
      role
        .split("_")
        .map(
          word =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(" "),
  };

}