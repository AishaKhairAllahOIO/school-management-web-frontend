import {
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  UserCog,
  UsersRound,
} from "lucide-react";

import { useLocale } from "@/app/providers/locale";

import { UserCategoryCard } from "../components/UserCategoryCard";
import { useUsersOverviewCounts } from "../shared/hooks/useUsersOverviewCounts";
import type { UsersOverviewCounts } from "../shared/types/users-overview.types";

const emptyCounts: UsersOverviewCounts = {};
const categoriesCount = 6;

export function UsersOverviewPage() {
  const { language, t } = useLocale();
  const countsQuery = useUsersOverviewCounts();

  const counts: UsersOverviewCounts =
    countsQuery.data ?? emptyCounts;

  const isInitialCountsLoading =
    countsQuery.isLoading &&
    countsQuery.data === undefined;

  const hasCountsError = countsQuery.isError;

  const copy = t.users.overview;

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
        totalUsers={resolveCount(counts.total)}
        isLoading={isInitialCountsLoading}
        language={language}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <UserCategoryCard
          title={copy.students.title}
          description={copy.students.description}
          path="/users/students"
          icon={GraduationCap}
          count={resolveCount(counts.students)}
          isCountLoading={isInitialCountsLoading}
          countLabel={copy.students.countLabel}
          secondaryCountLabel={copy.students.secondaryCountLabel}
          viewLabel={copy.students.viewLabel}
          accentClassName="bg-primary"
          iconClassName="bg-primary/[0.09] text-primary"
          footerClassName="bg-primary/[0.035] hover:bg-primary/[0.07]"
          footerTextClassName="text-primary"
        />

        <UserCategoryCard
          title={copy.teachers.title}
          description={copy.teachers.description}
          path="/users/teachers"
          icon={BookOpen}
          count={resolveCount(counts.teachers)}
          isCountLoading={isInitialCountsLoading}
          countLabel={copy.teachers.countLabel}
          viewLabel={copy.teachers.viewLabel}
          accentClassName="bg-info"
          iconClassName="bg-info/[0.1] text-info"
          footerClassName="bg-info/[0.035] hover:bg-info/[0.075]"
          footerTextClassName="text-info"
        />

        <UserCategoryCard
          title={copy.supervisors.title}
          description={copy.supervisors.description}
          path="/users/supervisors"
          icon={ShieldCheck}
          count={resolveCount(counts.supervisors)}
          isCountLoading={isInitialCountsLoading}
          countLabel={copy.supervisors.countLabel}
          viewLabel={copy.supervisors.viewLabel}
          accentClassName="bg-success"
          iconClassName="bg-success/[0.1] text-success"
          footerClassName="bg-success/[0.035] hover:bg-success/[0.075]"
          footerTextClassName="text-success"
        />

        <UserCategoryCard
          title={copy.secretaries.title}
          description={copy.secretaries.description}
          path="/users/secretaries"
          icon={BriefcaseBusiness}
          count={resolveCount(counts.secretaries)}
          isCountLoading={isInitialCountsLoading}
          countLabel={copy.secretaries.countLabel}
          viewLabel={copy.secretaries.viewLabel}
          accentClassName="bg-warning"
          iconClassName="bg-warning/[0.11] text-warning"
          footerClassName="bg-warning/[0.04] hover:bg-warning/[0.08]"
          footerTextClassName="text-warning"
        />

        <UserCategoryCard
          title={copy.counselors.title}
          description={copy.counselors.description}
          path="/users/counselors"
          icon={HeartHandshake}
          count={resolveCount(counts.counselors)}
          isCountLoading={isInitialCountsLoading}
          countLabel={copy.counselors.countLabel}
          viewLabel={copy.counselors.viewLabel}
          accentClassName="bg-destructive"
          iconClassName="bg-destructive/[0.09] text-destructive"
          footerClassName="bg-destructive/[0.035] hover:bg-destructive/[0.075]"
          footerTextClassName="text-destructive"
        />

        <UserCategoryCard
          title={copy.serviceStaff.title}
          description={copy.serviceStaff.description}
          path="/users/service-staff"
          icon={UserCog}
          count={resolveCount(counts.serviceStaff)}
          isCountLoading={isInitialCountsLoading}
          countLabel={copy.serviceStaff.countLabel}
          viewLabel={copy.serviceStaff.viewLabel}
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
  language,
}: {
  totalUsers?: number;
  isLoading: boolean;
  language: "ar" | "en";
}) {
  const { t } = useLocale();
  const copy = t.users.overview.summary;

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

          {formatCount(categoriesCount, language)} {copy.categories}
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
              aria-label={copy.loadingTotalUsers}
              className={[
                "h-[14px] w-7",
                "animate-pulse",
                "rounded-[5px]",
                "bg-emerald-500/20",
              ].join(" ")}
            />
          ) : (
            <strong className="font-semibold">
              {formatCount(totalUsers, language)}
            </strong>
          )}

          <span>{copy.totalUsers}</span>
        </span>
      </div>
    </header>
  );
}

function formatCount(
  count: number | undefined,
  language: "ar" | "en",
): string {
  if (typeof count !== "number") {
    return "—";
  }

  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US",
  ).format(count);
}
