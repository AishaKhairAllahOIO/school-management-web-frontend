import {
  Award,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  GraduationCap,
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

export function EmploymentInformationCard({
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
            Professional
          </p>

          <h2
            className={[
              "mt-1 text-base font-semibold",
              "tracking-[-0.025em]",
              "text-foreground",
            ].join(" ")}
          >
            Professional identity
          </h2>

          <p className="mt-1 text-[13px] text-muted-foreground">
            Employment and academic background
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
          <BriefcaseBusiness className="h-4.5 w-4.5" />
        </span>
      </header>

      <div className="space-y-6 p-4 lg:p-5">
        <InformationGroup
          label="Employment"
        >
          <ProfileInfoItem
            label="Hire date"
            value={formatDate(
              user.hireDate,
            )}
            icon={CalendarDays}
          />

          <ProfileInfoItem
            label="Experience"
            value={`${formatValue(
              user.experienceYears,
            )} years`}
            icon={Award}
          />

          <ProfileInfoItem
            label="Service type"
            value={formatValue(
              user.serviceType,
            )}
            icon={Building2}
          />
        </InformationGroup>

        <InformationGroup
          label="Education"
        >
          <ProfileInfoItem
            label="Degree"
            value={formatLabel(
              user.degree ?? "",
            )}
            icon={GraduationCap}
          />

          <ProfileInfoItem
            label="Specialization"
            value={formatValue(
              user.specialization,
            )}
            icon={BriefcaseBusiness}
          />

          <ProfileInfoItem
            label="University"
            value={formatValue(
              user.university,
            )}
            icon={Building2}
          />

          <ProfileInfoItem
            label="Graduation year"
            value={formatValue(
              user.graduationYear,
            )}
            icon={CalendarDays}
          />
        </InformationGroup>
      </div>
    </section>
  );
}

type InformationGroupProps = {
  label: string;
  children: React.ReactNode;
};

function InformationGroup({
  label,
  children,
}: InformationGroupProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <h3
          className={[
            "text-[11px] font-semibold",
            "uppercase tracking-[0.12em]",
            "text-muted-foreground",
          ].join(" ")}
        >
          {label}
        </h3>

        <span className="h-px flex-1 bg-border/60" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {children}
      </div>
    </div>
  );
}