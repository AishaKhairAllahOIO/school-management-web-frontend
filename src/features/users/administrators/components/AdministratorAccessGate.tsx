import type {
  ReactNode,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  useCurrentUser,
} from "@/app/layout/hooks/useCurrentUser";

type AdministratorAccessGateProps = {
  children: ReactNode;
};

export function AdministratorAccessGate({
  children,
}: AdministratorAccessGateProps) {
  const {
    user,
    isLoading,
  } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="space-y-5 pb-8">
        <div className="h-10 w-36 animate-pulse rounded-xl bg-muted/55" />

        <div className="h-40 animate-pulse rounded-[24px] border border-border/60 bg-card" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-[315px] animate-pulse rounded-[20px] border border-border/60 bg-card"
            />
          ))}
        </div>
      </div>
    );
  }

  const isSuperAdmin =
    user?.role?.includes(
      "super_admin",
    );

  if (!isSuperAdmin) {
    return (
      <Navigate
        to="/profile"
        replace
      />
    );
  }

  return children;
}
