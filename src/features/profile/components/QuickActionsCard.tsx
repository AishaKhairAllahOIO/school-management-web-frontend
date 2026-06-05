import {
  KeyRound,
  PencilLine,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { ProfilePermissions } from "@/features/profile/types/profile.types";

type Props = {
  permissions: ProfilePermissions;
};

export function QuickActionsCard({ permissions }: Props) {
  const navigate = useNavigate();

  return (
    <section className="rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border/60">
      <h2 className="text-base font-bold text-foreground">Quick Actions</h2>

      <div className="mt-5 space-y-3">
        {permissions.canEditPersonalInfo ? (
          <button className="flex w-full items-center gap-3 rounded-2xl bg-primary/10 p-3 text-left text-sm font-bold text-primary transition hover:bg-primary/15">
            <PencilLine size={18} />
            Edit Profile
          </button>
        ) : null}

        <button className="flex w-full items-center gap-3 rounded-2xl bg-background p-3 text-left text-sm font-bold text-foreground ring-1 ring-border/60 transition hover:bg-muted">
          <KeyRound size={18} />
          Change Password
        </button>

        {permissions.canManageUsers ? (
          <button
            onClick={() => navigate("/users")}
            className="flex w-full items-center gap-3 rounded-2xl bg-background p-3 text-left text-sm font-bold text-foreground ring-1 ring-border/60 transition hover:bg-muted"
          >
            <UsersRound size={18} />
            Manage Users
          </button>
        ) : null}
      </div>
    </section>
  );
}