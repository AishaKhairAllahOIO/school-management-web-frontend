import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  WandSparkles,
} from "lucide-react";

type Props = {
  isGenerating: boolean;
  isRegenerating: boolean;
  hasSchedule: boolean;
  scheduleId?: string;
  error?: Error | null;
  onGenerate: () => void;
  onRegenerate: () => void;
};

export function ScheduleGenerationCard({
  isGenerating,
  isRegenerating,
  hasSchedule,
  scheduleId,
  error,
  onGenerate,
  onRegenerate,
}: Props) {
  const isBusy = isGenerating || isRegenerating;

  return (
    <section className="rounded-[26px] border border-border/45 bg-card p-5 shadow-[0_10px_35px_rgba(30,20,70,0.035)] sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-primary/[0.09] text-primary">
            {isBusy ? (
              <Loader2
                size={19}
                className="animate-spin"
              />
            ) : (
              <WandSparkles
                size={19}
                strokeWidth={1.8}
              />
            )}
          </span>

          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-foreground">
              {hasSchedule
                ? "Class Schedule"
                : "Generate Class Schedule"}
            </h2>

            <p className="mt-1 max-w-[650px] text-[12px] leading-5 text-muted-foreground">
              {isGenerating
                ? "The scheduling engine is generating a new timetable. This may take a little while."
                : isRegenerating
                  ? "The scheduling engine is regenerating the timetable using the current academic period."
                  : hasSchedule
                    ? "A schedule is available for the current academic year and term."
                    : "Generate the timetable for the current academic year and term."}
            </p>

            {scheduleId && !isBusy && (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-muted/40 px-2.5 py-1 text-[10px] text-muted-foreground">
                <CheckCircle2 size={12} className="text-emerald-600" />
                Schedule ready
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {!hasSchedule ? (
            <button
              type="button"
              disabled={isBusy}
              onClick={onGenerate}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground shadow-[0_8px_20px_rgba(98,74,180,0.16)] transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <WandSparkles size={14} />
              )}

              {isGenerating
                ? "Generating..."
                : "Generate Schedule"}
            </button>
          ) : (
            <button
              type="button"
              disabled={isBusy}
              onClick={onRegenerate}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-border/65 bg-background px-4 text-[12px] font-medium text-foreground/75 transition hover:bg-muted/45 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRegenerating ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <RefreshCw size={14} />
              )}

              {isRegenerating
                ? "Regenerating..."
                : "Regenerate"}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-[16px] border border-destructive/15 bg-destructive/[0.045] p-3.5">
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0 text-destructive"
          />

          <div>
            <p className="text-[12px] font-medium text-destructive">
              Schedule generation failed
            </p>

            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
              {error.message ||
                "The schedule could not be generated. Please try again."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}