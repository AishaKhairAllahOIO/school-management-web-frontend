import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { useAcademicSettings } from "@/features/settings/academic/hooks/useAcademicSettings";

import {
  useGenerateSchedule,
  useRegenerateSchedule,
} from "../hooks/useScheduleGenerator";

import { ScheduleGenerationCard } from "../components/ScheduleGeneratorCard";
import { ScheduleGenerationDialog } from "../components/ScheduleGenerationDialog";
import { ScheduleGenerationStatus } from "../components/ScheduleGenerationStatus";

export function ScheduleGenerationPage() {
  const settingsQuery = useAcademicSettings();

  const generateMutation = useGenerateSchedule();
  const regenerateMutation = useRegenerateSchedule();

  const [regenerateOpen, setRegenerateOpen] =
    useState(false);

  const settings = settingsQuery.data;

  const generatedScheduleId =
    regenerateMutation.data?.scheduleId ??
    generateMutation.data?.scheduleId;

  const hasSchedule = Boolean(generatedScheduleId);

  const isProcessing =
    generateMutation.isPending ||
    regenerateMutation.isPending;

  function handleGenerate() {
    generateMutation.mutate();
  }

  function handleRegenerate() {
    setRegenerateOpen(true);
  }

  function confirmRegenerate() {
    regenerateMutation.mutate(undefined, {
      onSuccess: () => {
        setRegenerateOpen(false);
      },
    });
  }

  if (settingsQuery.isLoading) {
    return (
      <div className="space-y-5">
        <section className="rounded-[26px] border border-border/45 bg-card p-6">
          <div className="flex items-center gap-3">
            <Loader2
              size={18}
              className="animate-spin text-primary"
            />
            <p className="text-sm text-muted-foreground">
              Loading academic settings...
            </p>
          </div>
        </section>
      </div>
    );
  }

  if (settingsQuery.isError || !settings) {
    return (
      <section className="rounded-[26px] border border-destructive/15 bg-card p-8 text-center">
        <p className="text-sm font-medium text-destructive">
          Academic settings could not be loaded.
        </p>

        <p className="mt-2 text-[12px] text-muted-foreground">
          The current academic year and term are required before
          generating a schedule.
        </p>

        <button
          type="button"
          onClick={() => void settingsQuery.refetch()}
          className="mt-4 rounded-full bg-primary px-4 py-2 text-[12px] font-medium text-primary-foreground"
        >
          Try again
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[26px] border border-border/45 bg-card p-5 shadow-[0_10px_35px_rgba(30,20,70,0.035)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-primary/[0.09] text-primary">
              <CalendarDays
                size={19}
                strokeWidth={1.8}
              />
            </span>

            <div>
              <p className="text-[11px] font-medium text-muted-foreground">
                Scheduling
              </p>

              <h1 className="mt-1 text-[21px] font-semibold tracking-[-0.025em] text-foreground">
                Class Schedule Generator
              </h1>

              <p className="mt-1.5 max-w-[680px] text-[12px] leading-5 text-muted-foreground">
                Generate a timetable using the current academic
                year and current term. The scheduling engine handles
                the constraints automatically.
              </p>
            </div>
          </div>

          <ScheduleGenerationStatus
            isLoading={isProcessing}
            hasSchedule={hasSchedule}
            scheduleId={generatedScheduleId}
          />
        </div>
      </section>

      <ScheduleGenerationCard
        isGenerating={generateMutation.isPending}
        isRegenerating={regenerateMutation.isPending}
        hasSchedule={hasSchedule}
        scheduleId={generatedScheduleId}
        error={
          generateMutation.error ??
          regenerateMutation.error
        }
        onGenerate={handleGenerate}
        onRegenerate={handleRegenerate}
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <InfoCard
          icon={Sparkles}
          title="Automatic generation"
          description="The scheduling engine assigns lessons while respecting the configured constraints."
        />

        <InfoCard
          icon={RefreshCw}
          title="Regenerate when needed"
          description="If the generated timetable needs improvement, regenerate it for the current academic period."
        />

        <InfoCard
          icon={CheckCircle2}
          title="Ready for review"
          description="Once generation succeeds, the returned schedule ID can be used to open the generated timetable."
        />
      </section>

      <ScheduleGenerationDialog
        open={regenerateOpen}
        isSubmitting={regenerateMutation.isPending}
        onClose={() => {
          if (!regenerateMutation.isPending) {
            setRegenerateOpen(false);
          }
        }}
        onConfirm={confirmRegenerate}
      />
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Sparkles;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[22px] border border-border/45 bg-card p-4 shadow-[0_10px_35px_rgba(30,20,70,0.025)]">
      <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-primary/[0.07] text-primary">
        <Icon size={16} />
      </span>

      <h3 className="mt-3 text-[13px] font-semibold">
        {title}
      </h3>

      <p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}