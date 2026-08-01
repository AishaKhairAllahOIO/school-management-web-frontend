import { useCurrentUser } from "@/app/layout/hooks/useCurrentUser";
import { AdviserDashboard } from "@/features/dashboard/adviser/AdviserDashboard";
import {
  DashboardLoadingState,
  UnsupportedDashboardRole,
} from "@/features/dashboard/components/DashboardRoleState";
import { resolveDashboardRole } from "@/features/dashboard/lib/dashboard-role";
import { SecretaryDashboard } from "@/features/dashboard/secretary/SecretaryDashboard";
import { SuperAdminDashboard } from "@/features/dashboard/super-admin/SuperAdminDashboard";

function isLoadingCurrentUser(
  source: unknown,
): boolean {
  if (!source || typeof source !== "object") {
    return false;
  }

  const record = source as Record<string, unknown>;

  return Boolean(
    record.isLoading ??
      record.isPending ??
      record.loading,
  );
}

export function DashboardPage() {
  const currentUserState = useCurrentUser();

  if (isLoadingCurrentUser(currentUserState)) {
    return <DashboardLoadingState />;
  }

  const { role, rawRole } =
    resolveDashboardRole(currentUserState);

  switch (role) {
    case "super_admin":
      return <SuperAdminDashboard />;

    case "secretary":
      return <SecretaryDashboard />;

    case "adviser":
      return <AdviserDashboard />;

    default:
      return (
        <UnsupportedDashboardRole
          rawRole={rawRole}
        />
      );
  }
}
