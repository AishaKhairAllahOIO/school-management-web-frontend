import {
  CalendarDays,
  Clock,
  GraduationCap,
  Layers3,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

import { AcademicSettingsDangerZone } from "../components/AcademicSettingsDangerZone";
import { AcademicSettingsHeader } from "../components/AcademicSettingsHeader";
import { AcademicStagesSection } from "../components/sections/AcademicStagesSection";
import { AcademicTermsSection } from "../components/sections/AcademicTermsSection";
import { AcademicYearsSection } from "../components/sections/AcademicYearsSection";
import { SchoolScheduleSection } from "../components/sections/SchoolScheduleSection";
import { SettingsWorkspace } from "../components/shared/SettingsWorkspace";
import { useAcademicSettings } from "../hooks/useAcademicSettings";

type ActiveSection =
  | "years"
  | "terms"
  | "stages"
  | "schedule";

const workspaceItems = [
  {
    id: "years",
    title: "Academic Years",
    description: "Manage academic years",
    icon: (
      <CalendarDays
        size={20}
        className="shrink-0"
      />
    ),
  },
  {
    id: "terms",
    title: "Academic Terms",
    description: "Manage academic terms",
    icon: (
      <Layers3
        size={20}
        className="shrink-0"
      />
    ),
  },
  {
    id: "stages",
    title: "Academic Stages",
    description: "Manage academic stages",
    icon: (
      <GraduationCap
        size={20}
        className="shrink-0"
      />
    ),
  },
  {
    id: "schedule",
    title: "School Schedule",
    description: "Configure school schedule",
    icon: (
      <Clock
        size={20}
        className="shrink-0"
      />
    ),
  },
] satisfies Array<{
  id: ActiveSection;
  title: string;
  description: string;
  icon: React.ReactNode;
}>;

export function AcademicSettingsPage() {
  const [activeSection, setActiveSection] =
    useState<ActiveSection>("years");

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useAcademicSettings();

  if (isLoading) {
    return <AcademicSettingsLoadingState />;
  }

  if (isError || !data) {
    return (
      <AcademicSettingsErrorState
        isRetrying={isFetching}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <AcademicSettingsHeader />

      <SettingsWorkspace
        items={workspaceItems}
        activeId={activeSection}
        onChange={(id) => {
          setActiveSection(
            id as ActiveSection,
          );
        }}
        hint="The current academic year is used across the system for attendance, grades and reports."
      >
        {activeSection === "years" ? (
          <AcademicYearsSection
            academicYears={
              data.academicYears
            }
          />
        ) : null}

        {activeSection === "terms" ? (
          <AcademicTermsSection
            academicYears={
              data.academicYears
            }
            academicTerms={
              data.academicTerms
            }
            currentAcademicYearId={
              String(
                data.settings
                  .currentAcademicYearId,
              )
            }
          />
        ) : null}

        {activeSection === "stages" ? (
          <AcademicStagesSection
            academicStages={
              data.academicStages
            }
          />
        ) : null}

        {activeSection === "schedule" ? (
          <SchoolScheduleSection
            settings={data.settings}
          />
        ) : null}
      </SettingsWorkspace>

      {activeSection === "schedule" ? (
        <AcademicSettingsDangerZone />
      ) : null}
    </div>
  );
}

function AcademicSettingsLoadingState() {
  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Loader2
              size={22}
              className="animate-spin"
            />
          </span>

          <div>
            <h1 className="text-xl font-bold text-foreground">
              Loading Academic Settings
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Fetching academic years, terms,
              stages and schedule configuration.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-3 rounded-2xl bg-muted/20 p-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>

          <div className="min-h-[420px] animate-pulse rounded-3xl bg-muted/30" />
        </div>
      </div>
    </div>
  );
}

function AcademicSettingsErrorState({
  isRetrying,
  onRetry,
}: {
  isRetrying: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <div className="rounded-3xl border border-destructive/20 bg-card p-8 shadow-soft">
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <GraduationCap size={26} />
          </span>

          <h1 className="mt-5 text-xl font-bold text-foreground">
            Failed to load academic settings
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The academic configuration could not
            be retrieved. Check the server
            connection and try again.
          </p>

          <button
            type="button"
            disabled={isRetrying}
            onClick={onRetry}
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRetrying ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <RefreshCw size={16} />
            )}

            {isRetrying
              ? "Trying Again..."
              : "Try Again"}
          </button>
        </div>
      </div>
    </div>
  );
}