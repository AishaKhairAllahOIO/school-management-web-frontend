import { useServerErrorLayer } from "@/features/settings/components/ServerErrorLayer";
import {
  CalendarDays,
  Clock,
  GraduationCap,
  Layers3,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

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
    description: "Create school years and choose the active one",
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
    description: "Divide each school year into teaching periods",
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
    description: "Group grades into clear educational stages",
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
    description: "Define working days, lessons and breaks",
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
  useServerErrorLayer();
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
     

      <SettingsWorkspace
        items={workspaceItems}
        activeId={activeSection}
        onChange={(id) => {
          setActiveSection(
            id as ActiveSection,
          );
        }}
        hint="Changes here affect enrollment, attendance, scheduling, grades and reports, so confirm dates before saving."
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

    </div>
  );
}

function AcademicSettingsLoadingState() {
  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="overflow-hidden rounded-[22px] border border-border/60 bg-card p-2.5 shadow-[0_10px_32px_rgba(30,20,70,0.045)]">
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-[15px] px-3 py-3"
              >
                <div className="h-8 w-8 animate-pulse rounded-[11px] bg-muted/70" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3 w-3/5 animate-pulse rounded bg-muted/75" />
                  <div className="h-2.5 w-4/5 animate-pulse rounded bg-muted/50" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 border-t border-border/45 p-3">
            <div className="h-16 animate-pulse rounded-[14px] bg-muted/45" />
          </div>
        </aside>

        <main className="min-w-0 overflow-hidden rounded-[22px] border border-border/60 bg-card p-5 shadow-[0_10px_32px_rgba(30,20,70,0.045)]">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="h-5 w-40 animate-pulse rounded bg-muted/75" />
              <div className="h-3 w-72 max-w-full animate-pulse rounded bg-muted/50" />
            </div>
            <div className="h-10 w-28 animate-pulse rounded-xl bg-muted/65" />
          </div>

          <div className="mt-5 overflow-hidden rounded-[18px] border border-border/60">
            <div className="grid grid-cols-6 gap-3 bg-muted/25 px-3 py-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-2.5 animate-pulse rounded bg-muted/70" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, row) => (
              <div key={row} className="grid grid-cols-6 gap-3 border-t border-border/40 px-3 py-4">
                {Array.from({ length: 6 }).map((_, cell) => (
                  <div key={cell} className="h-3 animate-pulse rounded bg-muted/50" />
                ))}
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-[18px] bg-muted/40" />
            ))}
          </div>
        </main>
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

          <p className="mt-2 text-[15px] font-normal leading-6 text-muted-foreground">
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
              "text-[15px] font-medium",
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