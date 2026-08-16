import { useCurrentUser } from "@/app/layout/hooks/useCurrentUser";
import { AdviserDashboard } from "@/features/dashboard/supervisor/SupervisorDashboard";
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
    return <div className="space-y-5">
      <h1>loding</h1>
    </div>;
  }

  const { role } =
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
         <div className="space-y-5">
      <h1>unsupport</h1>
    </div>
      );
  }
}
