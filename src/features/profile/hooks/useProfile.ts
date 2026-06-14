import { useCurrentUser } from "@/app/layouts/app/hooks/useCurrentUser";
import { getProfileIdentity } from "@/features/profile/utils/profileIdentity";
import { getProfilePermissions } from "@/features/profile/utils/profilePermissions";
import type { DashboardProfileUser } from "@/features/profile/types/profile.types";

export function useProfile() {
  const { user } = useCurrentUser();

  const profileUser = user as unknown as DashboardProfileUser;

  const identity = getProfileIdentity(profileUser);
  const permissions = getProfilePermissions(profileUser);

  return {
    user: profileUser,
    identity,
    permissions,
  };
}