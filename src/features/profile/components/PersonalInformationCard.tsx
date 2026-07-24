import {
  CalendarDays,
  Home,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import type {
  DashboardProfileUser,
} from "@/features/profile/types/profile.types";

import { ProfileInfoItem } from "@/features/profile/components/ProfileInfoItem";

import {
  formatDate,
  formatLabel,
  formatValue,
} from "@/features/profile/utils/profileFormatters";

type Props = {
  user: DashboardProfileUser;
};

export function PersonalInformationCard({
  user,
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
          "flex items-start justify-between",
          "border-b border-border/60",
          "bg-muted/15",
          "px-5 py-4",
        ].join(" ")}
      >
        <div>
          <p
            className={[
              "text-[11px] font-semibold",
              "uppercase tracking-[0.12em]",
              "text-primary",
            ].join(" ")}
          >
            Personal
          </p>

          <h2
            className={[
              "mt-1 text-base font-semibold",
              "tracking-[-0.025em]",
              "text-foreground",
            ].join(" ")}
          >
            Personal identity
          </h2>

          <p className="mt-1 text-[13px] text-muted-foreground">
            Basic contact and personal details
          </p>
        </div>

        <span
          className={[
            "flex h-10 w-10",
            "items-center justify-center",
            "rounded-[14px]",
            "bg-primary/[0.07]",
            "text-primary",
          ].join(" ")}
        >
          <UserRound className="h-4.5 w-4.5" />
        </span>
      </header>

      <div
        className={[
          "grid gap-3 p-4",
          "sm:grid-cols-2",
          "lg:p-5",
          "2xl:grid-cols-3",
        ].join(" ")}
      >
        <ProfileInfoItem
          label="First name"
          value={user.firstName}
          icon={UserRound}
        />

        <ProfileInfoItem
          label="Last name"
          value={user.lastName}
          icon={UserRound}
        />

        <ProfileInfoItem
          label="Birth date"
          value={formatDate(
            user.birthDate,
          )}
          icon={CalendarDays}
        />

        <ProfileInfoItem
          label="Gender"
          value={formatLabel(
            user.gender,
          )}
          icon={UserRound}
        />

        <ProfileInfoItem
          label="Email"
          value={user.email}
          icon={Mail}
        />

        <ProfileInfoItem
          label="Phone"
          value={
            user.phoneNumber || "—"
          }
          icon={Phone}
        />

        <ProfileInfoItem
          label="Address"
          value={formatValue(
            user.address,
          )}
          icon={Home}
          className="sm:col-span-2 2xl:col-span-3"
        />
      </div>
    </section>
  );
}