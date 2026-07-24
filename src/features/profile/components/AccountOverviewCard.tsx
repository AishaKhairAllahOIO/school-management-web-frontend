import {
  BadgeCheck,
  CalendarDays,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import type {
  DashboardProfileUser,
  ProfileIdentity,
} from "@/features/profile/types/profile.types";

import { ProfileInfoItem } from "@/features/profile/components/ProfileInfoItem";

import {
  formatDate,
  formatLabel,
} from "@/features/profile/utils/profileFormatters";

type Props = {
  user: DashboardProfileUser;
  identity: ProfileIdentity;
};

export function AccountOverviewCard({
  user,
  identity,
}: Props) {
  return (
    <section
      className={[
        "overflow-hidden rounded-[26px]",
        "border border-border/70",
        "bg-card",
        "shadow-[var(--shadow-card)]",
      ].join(" ")}
    >
      <header
        className={[
          "flex items-start gap-3",
          "border-b border-border/60",
          "bg-muted/15",
          "px-5 py-4",
        ].join(" ")}
      >
        <span
          className={[
            "flex h-10 w-10 shrink-0",
            "items-center justify-center",
            "rounded-[14px]",
            "bg-primary/[0.07]",
            "text-primary",
          ].join(" ")}
        >
          <ShieldCheck className="h-4.5 w-4.5" />
        </span>

        <div>
          <p
            className={[
              "text-[11px] font-semibold",
              "uppercase tracking-[0.12em]",
              "text-primary",
            ].join(" ")}
          >
            Account
          </p>

          <h2
            className={[
              "mt-1 text-base font-semibold",
              "tracking-[-0.025em]",
              "text-foreground",
            ].join(" ")}
          >
            System identity
          </h2>

          <p className="mt-1 text-[13px] text-muted-foreground">
            Access and account information
          </p>
        </div>
      </header>

      <div className="grid gap-2.5 p-4">
        <ProfileInfoItem
          label="Role"
          value={identity.roleLabel}
          icon={UserCog}
          compact
        />

        <ProfileInfoItem
          label="Email"
          value={identity.email}
          icon={ShieldCheck}
          compact
        />

        <ProfileInfoItem
          label="Status"
          value={formatLabel(
            user.accountStatus,
          )}
          icon={BadgeCheck}
          compact
        />

        <ProfileInfoItem
          label="Created"
          value={formatDate(
            user.createdAt,
          )}
          icon={CalendarDays}
          compact
        />
      </div>
    </section>
  );
}