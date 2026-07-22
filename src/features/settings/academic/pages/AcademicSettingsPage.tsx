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
    description: "Define yearly periods",
    icon: (
      <CalendarDays
        size={18}
        strokeWidth={1.75}
        className="shrink-0"
      />
    ),
  },
  {
    id: "terms",
    title: "Academic Terms",
    description: "Arrange terms and breaks",
    icon: (
      <Layers3
        size={18}
        strokeWidth={1.75}
        className="shrink-0"
      />
    ),
  },
  {
    id: "stages",
    title: "Academic Stages",
    description: "Organize grade levels",
    icon: (
      <GraduationCap
        size={18}
        strokeWidth={1.75}
        className="shrink-0"
      />
    ),
  },
  {
    id: "schedule",
    title: "School Calendar",
    description: "Set days and lesson timing",
    icon: (
      <Clock
        size={18}
        strokeWidth={1.75}
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
        hint="The active academic year connects attendance, grades and reporting across the system."
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
            currentAcademicYearId={String(
              data.settings
                .currentAcademicYearId,
            )}
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
      <div className="rounded-[26px] border border-border/60 bg-card p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Loader2
              size={20}
              className="animate-spin"
            />
          </span>

          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Preparing academic workspace
            </h1>

            <p className="mt-1 text-sm font-normal text-muted-foreground">
              Loading years, terms, stages and
              calendar information.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">
          <div className="space-y-3 rounded-[22px] bg-muted/20 p-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>

          <div className="min-h-[420px] animate-pulse rounded-[24px] bg-muted/30" />
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
      <div className="rounded-[26px] border border-destructive/20 bg-card p-8 shadow-soft">
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <GraduationCap size={25} />
          </span>

          <h1 className="mt-5 text-xl font-semibold text-foreground">
            Academic data is unavailable
          </h1>

          <p className="mt-2 text-sm font-normal leading-6 text-muted-foreground">
            The academic configuration could not
            be retrieved. Check the server
            connection and try again.
          </p>

          <button
            type="button"
            disabled={isRetrying}
            onClick={onRetry}
            className={[
              "mt-5 inline-flex h-11",
              "items-center justify-center gap-2",
              "rounded-xl bg-primary px-6",
              "text-sm font-medium",
              "text-primary-foreground",
              "shadow-soft transition",
              "hover:bg-primary/90",
              "disabled:cursor-not-allowed",
              "disabled:opacity-60",
            ].join(" ")}
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
              ? "Trying again..."
              : "Try again"}
          </button>
        </div>
      </div>
    </div>
  );
}