import {
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  UserCog,
  UsersRound,
} from "lucide-react";

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

  /*
   * نعرض Skeleton فقط في التحميل الأول،
   * عندما لا توجد بيانات سابقة.
   *
   * لا نستخدم isFetching وحدها، لأن ذلك سيعيد
   * إظهار Skeleton أثناء refetch رغم توفر البيانات.
   */
  const isInitialCountsLoading =
    countsQuery.isLoading &&
    countsQuery.data === undefined;

  const hasCountsError =
    countsQuery.isError;

  function resolveCount(
    count?: number,
  ): number | undefined {
    if (hasCountsError) {
      return undefined;
    }

    return count;
  }

  return (
    <section className="-mt-3 space-y-6">
      <UsersOverviewHeading
        totalUsers={resolveCount(
          counts.total,
        )}
        isLoading={
          isInitialCountsLoading
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <UserCategoryCard
          title="Students"
          description="Student profiles, guardians, enrollment and academic records."
          path="/users/students"
          icon={GraduationCap}
          count={resolveCount(
            counts.students,
          )}
          isCountLoading={
            isInitialCountsLoading
          }
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
          count={resolveCount(
            counts.teachers,
          )}
          isCountLoading={
            isInitialCountsLoading
          }
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
          count={resolveCount(
            counts.supervisors,
          )}
          isCountLoading={
            isInitialCountsLoading
          }
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
          count={resolveCount(
            counts.secretaries,
          )}
          isCountLoading={
            isInitialCountsLoading
          }
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
          count={resolveCount(
            counts.counselors,
          )}
          isCountLoading={
            isInitialCountsLoading
          }
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
          count={resolveCount(
            counts.serviceStaff,
          )}
          isCountLoading={
            isInitialCountsLoading
          }
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
  totalUsers,
  isLoading,
}: {
  totalUsers?: number;
  isLoading: boolean;
}) {
  return (
    <header>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={[
            "inline-flex min-h-7 items-center gap-2",
            "rounded-full",
            "bg-primary/[0.07]",
            "px-3 py-1.5",
            "text-xs font-medium",
            "text-primary",
          ].join(" ")}
        >
          <UsersRound
            aria-hidden="true"
            className="h-3.5 w-3.5"
            strokeWidth={1.8}
          />

          {categoriesCount} Categories
        </span>

        <span
          className={[
            "inline-flex min-h-7 items-center gap-2",
            "rounded-full",
            "bg-emerald-500/[0.09]",
            "px-3 py-1.5",
            "text-xs font-medium",
            "text-emerald-600",
          ].join(" ")}
        >
          <ShieldCheck
            aria-hidden="true"
            className="h-3.5 w-3.5"
            strokeWidth={1.8}
          />

          {isLoading ? (
            <span
              aria-label="Loading total users"
              className={[
                "h-[14px] w-7",
                "animate-pulse",
                "rounded-[5px]",
                "bg-emerald-500/20",
              ].join(" ")}
            />
          ) : (
            <strong className="font-semibold">
              {formatCount(totalUsers)}
            </strong>
          )}

          <span>Total User</span>
        </span>
      </div>
    </header>
  );
}

function formatCount(
  count?: number,
): string {
  if (typeof count !== "number") {
    return "—";
  }

  return new Intl.NumberFormat().format(
    count,
  );
}