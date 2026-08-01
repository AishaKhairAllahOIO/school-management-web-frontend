import { ArrowRight, Sparkles } from "lucide-react";

export function ReportAnalyticsCard({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-primary/15 bg-gradient-to-br from-primary/[0.10] via-card to-info/[0.08] p-5 shadow-[0_16px_42px_rgba(75,55,170,0.09)]">
      <div aria-hidden className="absolute -end-12 -top-12 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
      <div aria-hidden className="absolute -bottom-16 start-1/4 h-32 w-32 rounded-full bg-info/10 blur-3xl" />

      <div className="relative flex h-full flex-col">
        <span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-card/80 text-primary shadow-sm backdrop-blur-xl">
          <Sparkles aria-hidden="true" size={18} strokeWidth={1.8} />
        </span>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary/80">
          Reports workspace
        </p>
        <h2 className="mt-2 max-w-[360px] text-[22px] font-semibold leading-[28px] tracking-[-0.035em] text-foreground">
          Turn school operations into decisions.
        </h2>
        <p className="mt-2 max-w-md text-[12px] leading-5 text-muted-foreground">
          Build focused exports across students, academics, attendance, staff, finance and communications.
        </p>

        <button
          type="button"
          onClick={onCreate}
          className="mt-6 inline-flex h-10 w-fit items-center gap-2 rounded-[13px] border border-primary/20 bg-card/85 px-4 text-[12px] font-semibold text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
        >
          Create a report
          <ArrowRight aria-hidden="true" size={15} strokeWidth={1.8} />
        </button>
      </div>
    </section>
  );
}
