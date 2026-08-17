import {
  ArrowRight,
  FileBarChart2,
} from "lucide-react";

export function ReportAnalyticsCard({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <section className="rounded-[22px] border border-border/60 bg-card px-5 py-4 shadow-[0_8px_28px_rgba(30,20,70,0.035)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-primary/10 bg-primary/[0.07] text-primary">
            <FileBarChart2
              aria-hidden="true"
              size={20}
              strokeWidth={1.8}
            />
          </span>

          <div className="min-w-0">
            <h1 className="text-[18px] font-semibold tracking-[-0.025em] text-foreground">
              Reports workspace
            </h1>

            <p className="mt-1 max-w-[720px] text-[12px] leading-5 text-muted-foreground">
              View live school reports from the backend and
              download their data when needed.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[13px] border border-primary/25 bg-transparent px-4 text-[12px] font-semibold text-primary transition-colors hover:bg-primary/[0.055] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
        >
          Create report

          <ArrowRight
            aria-hidden="true"
            size={15}
            strokeWidth={1.8}
          />
        </button>
      </div>
    </section>
  );
}