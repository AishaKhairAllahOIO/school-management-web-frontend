import {
  RefreshCw,
  RotateCcw,
} from "lucide-react";

type Props = {
  academicYearName?: string;
  semesterName?: string;
  isGenerating?: boolean;
  isRegenerating?: boolean;
  hasSchedule: boolean;
  onGenerate: () => void;
  onRegenerate: () => void;
  onRefresh: () => void;
};

export function ScheduleToolbar({
  academicYearName,
  semesterName,
  isGenerating = false,
  isRegenerating = false,
  hasSchedule,
  onGenerate,
  onRegenerate,
  onRefresh,
}: Props) {
  const isBusy =
    isGenerating || isRegenerating;

  return (
    <section className="rounded-[26px] border border-border/45 bg-card p-4 shadow-[0_10px_35px_rgba(30,20,70,0.035)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground">
            Active academic period
          </p>

          <h1 className="mt-1 text-[17px] font-semibold tracking-[-0.02em] text-foreground">
            {academicYearName ?? "Current Academic Year"}
          </h1>

          <p className="mt-1 text-[12px] text-muted-foreground">
            {semesterName ?? "Current Semester"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isBusy}
            onClick={onRefresh}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border/65 bg-background px-4 text-[12px] font-medium text-foreground/75 transition hover:bg-muted/45 disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={
                isBusy
                  ? "animate-spin"
                  : undefined
              }
            />
            Refresh
          </button>

          {!hasSchedule ? (
            <button
              type="button"
              disabled={isBusy}
              onClick={onGenerate}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground shadow-[0_8px_20px_rgba(98,74,180,0.16)] transition hover:bg-primary/90 disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={
                  isGenerating
                    ? "animate-spin"
                    : undefined
                }
              />
              {isGenerating
                ? "Generating..."
                : "Generate Schedule"}
            </button>
          ) : (
            <button
              type="button"
              disabled={isBusy}
              onClick={onRegenerate}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground shadow-[0_8px_20px_rgba(98,74,180,0.16)] transition hover:bg-primary/90 disabled:opacity-50"
            >
              <RotateCcw
                size={14}
                className={
                  isRegenerating
                    ? "animate-spin"
                    : undefined
                }
              />
              {isRegenerating
                ? "Regenerating..."
                : "Regenerate"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}