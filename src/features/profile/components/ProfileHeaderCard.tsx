import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";

import type {
  DashboardProfileUser,
  ProfileIdentity,
} from "@/features/profile/types/profile.types";

import { useAuthenticatedImage } from "@/shared/hooks/useAuthenticatedImage";
import {
  formatDate,
  formatFullName,
  formatLabel,
} from "@/features/profile/utils/profileFormatters";

type ProfileHeaderCardProps = {
  user: DashboardProfileUser;
  identity: ProfileIdentity;
};

export function ProfileHeaderCard({
  user,
  identity,
}: ProfileHeaderCardProps) {
  const fullName =
    user.fullName ||
    formatFullName(
      user.firstName,
      user.lastName,
    );

const photoUrl =
  useAuthenticatedImage(user?.photoUrl);

  const isEnabled =
    String(
      user.accountStatus,
    ).toLowerCase() ===
      "enabled" ||
    String(
      user.accountStatus,
    ).toLowerCase() ===
      "active";

  return (
    <section
      className={[
        "relative overflow-hidden",
        "rounded-[26px]",
        "border border-border/70",
        "bg-card",
        "shadow-[var(--shadow-card)]",
      ].join(" ")}
    >
      <div className="absolute inset-x-0 top-0 h-1 primary-gradient" />

      <div
        className={[
          "pointer-events-none absolute",
          "-right-16 -top-20",
          "h-56 w-56 rounded-full",
          "bg-primary/[0.08] blur-3xl",
        ].join(" ")}
      />

      <div
        className={[
          "relative flex flex-col gap-5",
          "px-5 py-5 sm:px-6",
          "lg:flex-row lg:items-center",
          "lg:justify-between",
        ].join(" ")}
      >
        <div className="flex min-w-0 items-center gap-4">
          <div className="relative shrink-0">
            <div
              className={[
                "rounded-[22px] p-1",
                "bg-gradient-to-br",
                "from-primary/20",
                "via-primary/5",
                "to-transparent",
              ].join(" ")}
            >
              <img
                src={photoUrl}
                alt={fullName}
                className={[
                  "h-[74px] w-[74px]",
                  "rounded-[18px]",
                  "border border-card",
                  "bg-muted object-cover",
                  "shadow-sm",
                ].join(" ")}
              />
            </div>

            <span
              className={[
                "absolute bottom-0 right-0",
                "h-4 w-4 rounded-full",
                "border-[3px] border-card",
                isEnabled
                  ? "bg-emerald-500"
                  : "bg-amber-500",
              ].join(" ")}
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1
                className={[
                  "truncate text-xl font-semibold",
                  "tracking-[-0.035em]",
                  "text-foreground",
                  "sm:text-[22px]",
                ].join(" ")}
              >
                {fullName}
              </h1>

              <span
                className={[
                  "inline-flex items-center gap-1.5",
                  "rounded-full",
                  "bg-primary/[0.08]",
                  "px-2.5 py-1",
                  "text-[11px] font-semibold",
                  "text-primary",
                ].join(" ")}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {identity.roleLabel}
              </span>
            </div>

            <div
              className={[
                "mt-3 flex flex-wrap",
                "gap-x-4 gap-y-2",
                "text-[13px]",
                "text-muted-foreground",
              ].join(" ")}
            >
              <HeaderMeta
                icon={Mail}
                value={identity.email}
              />

              <HeaderMeta
                icon={Phone}
                value={
                  user.phoneNumber ||
                  "No phone"
                }
              />

              <HeaderMeta
                icon={BriefcaseBusiness}
                value={formatLabel(
                  user.role?.[0] ??
                    identity.roleLabel,
                )}
              />

              <HeaderMeta
                icon={CalendarDays}
                value={`Joined ${formatDate(
                  user.hireDate,
                )}`}
              />
            </div>
          </div>
        </div>

        <div
          className={[
            "inline-flex w-fit items-center",
            "gap-2 self-start",
            "rounded-xl border",
            "px-3.5 py-2.5",
            "text-xs font-semibold",
            isEnabled
              ? [
                  "border-emerald-200/80",
                  "bg-emerald-50",
                  "text-emerald-700",
                  "dark:border-emerald-500/20",
                  "dark:bg-emerald-500/10",
                  "dark:text-emerald-400",
                ].join(" ")
              : [
                  "border-amber-200/80",
                  "bg-amber-50",
                  "text-amber-700",
                  "dark:border-amber-500/20",
                  "dark:bg-amber-500/10",
                  "dark:text-amber-400",
                ].join(" "),
            "lg:self-center",
          ].join(" ")}
        >
          <BadgeCheck className="h-4 w-4" />

          {formatLabel(
            user.accountStatus,
          )}
        </div>
      </div>
    </section>
  );
}

type HeaderMetaProps = {
  icon: typeof Mail;
  value: string;
};

function HeaderMeta({
  icon: Icon,
  value,
}: HeaderMetaProps) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />

      <span className="max-w-[230px] truncate">
        {value}
      </span>
    </span>
  );
}