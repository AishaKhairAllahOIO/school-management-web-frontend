import {
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  HeartHandshake,
  RefreshCw,
  ShieldCheck,
  UserCog,
  UsersRound,
} from "lucide-react";

import { Button } from "@/shared/ui/button";

import { UserCategoryCard } from "../components/UserCategoryCard";
import { useUsersOverviewCounts } from "../shared/hooks/useUsersOverviewCounts";
import type { UsersOverviewCounts } from "../shared/types/users-overview.types";

const emptyCounts: UsersOverviewCounts = {};

const categoriesCount = 6;

export function UsersOverviewPage() {
  const countsQuery =
    useUsersOverviewCounts();

  const counts: UsersOverviewCounts =
    countsQuery.data ?? emptyCounts;

  if (countsQuery.isLoading) {
    return <UsersOverviewLoading />;
  }

  if (countsQuery.isError) {
    return (
      <section className="-mt-3 space-y-6">
        <UsersOverviewHeading
          totalStaff={undefined}
        />

        <div className="rounded-[20px] border border-destructive/20 bg-card p-6 shadow-[0_10px_32px_rgba(30,20,70,0.05)]">
          <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-destructive/[0.08] text-destructive">
            <UsersRound
              className="h-[18px] w-[18px]"
              strokeWidth={1.75}
            />
          </span>

          <h2 className="mt-4 text-lg font-semibold text-foreground">
            User statistics could not be loaded
          </h2>

          <p className="mt-2 max-w-lg text-sm font-normal leading-6 text-muted-foreground">
            The user category totals are currently unavailable.
            Check the connection and try again.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-5 rounded-xl font-medium"
            onClick={() => {
              void countsQuery.refetch();
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="-mt-3 space-y-6">
      <UsersOverviewHeading
        totalStaff={counts.total}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <UserCategoryCard
          title="Students"
          description="Student profiles, guardians, enrollment and academic records."
          path="/users/students"
          icon={GraduationCap}
          count={counts.students}
          countLabel="Total students"
          secondaryCountLabel="Parents"
          viewLabel="View all students"
          accentClassName="bg-primary"
          iconClassName="bg-primary/[0.09] text-primary"
          footerClassName="bg-primary/[0.035] hover:bg-primary/[0.07]"
          footerTextClassName="text-primary"
        />

        <UserCategoryCard
          title="Teachers"
          description="Teacher profiles, school information and academic assignments."
          path="/users/teachers"
          icon={BookOpen}
          count={counts.teachers}
          countLabel="Total teachers"
          viewLabel="View all teachers"
          accentClassName="bg-info"
          iconClassName="bg-info/[0.1] text-info"
          footerClassName="bg-info/[0.035] hover:bg-info/[0.075]"
          footerTextClassName="text-info"
        />

        <UserCategoryCard
          title="Supervisors"
          description="Educational supervisors and their assigned academic responsibilities."
          path="/users/supervisors"
          icon={ShieldCheck}
          count={counts.supervisors}
          countLabel="Total supervisors"
          viewLabel="View all supervisors"
          accentClassName="bg-success"
          iconClassName="bg-success/[0.1] text-success"
          footerClassName="bg-success/[0.035] hover:bg-success/[0.075]"
          footerTextClassName="text-success"
        />

        <UserCategoryCard
          title="Secretaries"
          description="Administrative secretary profiles and school office information."
          path="/users/secretaries"
          icon={BriefcaseBusiness}
          count={counts.secretaries}
          countLabel="Total secretaries"
          viewLabel="View all secretaries"
          accentClassName="bg-warning"
          iconClassName="bg-warning/[0.11] text-warning"
          footerClassName="bg-warning/[0.04] hover:bg-warning/[0.08]"
          footerTextClassName="text-warning"
        />

        <UserCategoryCard
          title="Counselors"
          description="Student support counselors and psychological guidance records."
          path="/users/counselors"
          icon={HeartHandshake}
          count={counts.counselors}
          countLabel="Total counselors"
          viewLabel="View all counselors"
          accentClassName="bg-destructive"
          iconClassName="bg-destructive/[0.09] text-destructive"
          footerClassName="bg-destructive/[0.035] hover:bg-destructive/[0.075]"
          footerTextClassName="text-destructive"
        />

        <UserCategoryCard
          title="Service Staff"
          description="Service and operational staff working across the school."
          path="/users/service-staff"
          icon={UserCog}
          count={counts.serviceStaff}
          countLabel="Total service staff"
          viewLabel="View all service staff"
          accentClassName="bg-secondary-foreground"
          iconClassName="bg-primary/[0.07] text-secondary-foreground"
          footerClassName="bg-secondary/[0.55] hover:bg-secondary"
          footerTextClassName="text-secondary-foreground"
        />
      </div>
    </section>
  );
}

function UsersOverviewHeading({
  totalStaff,
}: {
  totalStaff?: number;
}) {
  return (
    <header>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={[
            "inline-flex items-center gap-2",
            "rounded-full",
            "bg-primary/[0.07]",
            "px-3 py-1.5",
            "text-xs font-medium",
            "text-primary",
          ].join(" ")}
        >
          <UsersRound
            className="h-3.5 w-3.5"
            strokeWidth={1.8}
          />

          {categoriesCount} Categories
        </span>

        <span
          className={[
            "inline-flex items-center gap-2",
            "rounded-full",
            "bg-emerald-500/[0.09]",
            "px-3 py-1.5",
            "text-xs font-medium",
            "text-emerald-600",
          ].join(" ")}
        >
          <ShieldCheck
            className="h-3.5 w-3.5"
            strokeWidth={1.8}
          />

          <strong className="font-semibold">
            {formatTotalStaff(totalStaff)}
          </strong>

          Total User
        </span>
      </div>
    </header>
  );
}

function formatTotalStaff(
  totalStaff?: number,
) {
  if (typeof totalStaff !== "number") {
    return "—";
  }

  return new Intl.NumberFormat().format(
    totalStaff,
  );
}

function UsersOverviewLoading() {
  return (
    <section className="-mt-3 space-y-6">
      <div>
        <div className="flex gap-2">
          <div className="h-7 w-28 animate-pulse rounded-full bg-muted/55" />

          <div className="h-7 w-28 animate-pulse rounded-full bg-muted/45" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className={[
              "min-h-[268px] animate-pulse",
              "overflow-hidden rounded-[20px]",
              "border border-border/60 bg-card",
              "shadow-[0_8px_28px_rgba(30,20,70,0.04)]",
            ].join(" ")}
          >
            <div className="h-[3px] bg-muted" />

            <div className="p-5">
              <div className="flex justify-between">
                <div className="h-11 w-11 rounded-[14px] bg-muted/70" />

                <div className="h-8 w-8 rounded-full bg-muted/50" />
              </div>

              <div className="mt-4 h-5 w-32 rounded bg-muted/70" />

              <div className="mt-2 h-3.5 w-4/5 rounded bg-muted/50" />

              <div className="mt-2 h-3.5 w-3/5 rounded bg-muted/50" />

              <div className="mt-5 border-t border-border/60 pt-4">
                <div className="h-6 w-14 rounded bg-muted/70" />

                <div className="mt-2 h-3 w-24 rounded bg-muted/50" />
              </div>
            </div>

            <div className="h-12 border-t border-border/40 bg-muted/20" />
          </div>
        ))}
      </div>
    </section>
  );
}