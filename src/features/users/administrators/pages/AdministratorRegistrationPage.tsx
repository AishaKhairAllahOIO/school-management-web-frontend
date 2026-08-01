import {
  Navigate,
} from "react-router-dom";

import {
  useCurrentUser,
} from "@/app/layout/hooks/useCurrentUser";

import {
  StaffRegistrationPage,
} from "../../staff/pages/StaffRegistrationPage";

export function AdministratorRegistrationPage() {
  const {
    user,
    isLoading,
  } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="space-y-5 pb-8">
        <div className="h-10 w-36 animate-pulse rounded-xl bg-muted/55" />

        <div className="h-40 animate-pulse rounded-[24px] border border-border/60 bg-card" />

        <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="h-[340px] animate-pulse rounded-[24px] border border-border/60 bg-card" />
          <div className="h-[340px] animate-pulse rounded-[24px] border border-border/60 bg-card" />
        </div>
      </div>
    );
  }

  const isSuperAdmin =
    user?.role?.includes("super_admin");

  if (!isSuperAdmin) {
    return (
      <Navigate
        to="/profile"
        replace
      />
    );
  }

  return (
    <StaffRegistrationPage role="super_admin" />
  );
}
