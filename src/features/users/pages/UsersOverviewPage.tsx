import {
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  HeartHandshake,
  RefreshCw,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import {
  Button,
} from "@/shared/ui/button";

import {
  UserCategoryCard,
} from "../components/UserCategoryCard";

import {
  useUsersOverviewCounts,
} from "../shared/hooks/useUsersOverviewCounts";

import type {
  UsersOverviewCounts,
} from "../types/users-overview.types";

const emptyCounts: UsersOverviewCounts = {};

export function UsersOverviewPage() {
  const countsQuery =
    useUsersOverviewCounts();

  const counts =
    countsQuery.data ??
    emptyCounts;

  if (countsQuery.isLoading) {
    return (
      <section className="space-y-7">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-52 animate-pulse rounded-xl border bg-muted/40"
            />
          ))}
        </div>
      </section>
    );
  }

  if (countsQuery.isError) {
    return (
      <section className="space-y-5">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="text-lg font-semibold text-destructive">
            Failed to load user statistics
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            The user role counts could not be loaded.
            Please try again.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => {
              void countsQuery.refetch();
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-7">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <UserCategoryCard
          title="Students"
          description="Manage student records and their parents."
          path="/users/students"
          icon={GraduationCap}
          count={counts.students}
          countLabel="Total students"

         
          secondaryCount={
            counts.parents
          }
          secondaryCountLabel="Parents"

          accentClassName="primary-gradient"
          iconClassName="bg-primary/10 text-primary"
        />

        <UserCategoryCard
          title="Teachers"
          description="Manage teachers and their school information."
          path="/users/teachers"
          icon={BookOpen}
          count={counts.teachers}
          countLabel="Total teachers"
          accentClassName="bg-info"
          iconClassName="bg-info/10 text-info"
        />

        <UserCategoryCard
          title="Supervisors"
          description="Manage educational supervisors."
          path="/users/supervisors"
          icon={ShieldCheck}
          count={counts.supervisors}
          countLabel="Total supervisors"
          accentClassName="bg-success"
          iconClassName="bg-success/10 text-success"
        />

        <UserCategoryCard
          title="Secretaries"
          description="Manage school secretaries."
          path="/users/secretaries"
          icon={BriefcaseBusiness}
          count={counts.secretaries}
          countLabel="Total secretaries"
          accentClassName="bg-warning"
          iconClassName="bg-warning/10 text-warning"
        />

        <UserCategoryCard
          title="Counselors"
          description="Manage psychological counselors."
          path="/users/counselors"
          icon={HeartHandshake}
          count={counts.counselors}
          countLabel="Total counselors"
          accentClassName="bg-destructive"
          iconClassName="bg-destructive/10 text-destructive"
        />

        <UserCategoryCard
          title="Service Staff"
          description="Manage school service staff."
          path="/users/service-staff"
          icon={UserCog}
          count={counts.serviceStaff}
          countLabel="Total service staff"
          accentClassName="bg-secondary-foreground"
          iconClassName="bg-secondary text-secondary-foreground"
        />
      </div>
    </section>
  );
}