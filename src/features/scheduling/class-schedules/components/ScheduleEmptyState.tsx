import {
  CalendarDays,
  RefreshCw,
} from "lucide-react";

type Props = {
  onGenerate: () => void;
  isGenerating?: boolean;
};

export function ScheduleEmptyState({
  onGenerate,
  isGenerating = false,
}: Props) {
  return (
    <section className="rounded-[26px] border border-border/45 bg-card p-8 shadow-[0_10px_35px_rgba(30,20,70,0.035)]">
      <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-primary/[0.08] text-primary">
          <CalendarDays size={23} />
        </span>

        <h2 className="mt-4 text-[15px] font-semibold text-foreground">
          No schedule has been generated
        </h2>

        <p className="mt-1.5 max-w-md text-[12px] leading-5 text-muted-foreground">
          There is no schedule for the currently active
          academic year and semester. Generate one to start
          working with the timetable.
        </p>

        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="mt-5 inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground shadow-[0_8px_20px_rgba(98,74,180,0.16)] transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
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
      </div>
    </section>
  );
}