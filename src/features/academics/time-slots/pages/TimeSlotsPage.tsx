import { CalendarClock } from "lucide-react";

export function TimeSlotsPage() {
  return (
    <section className="rounded-[24px] border border-border/70 bg-card p-6 shadow-[0_12px_35px_rgba(38,24,84,0.05)]">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-success/10 text-success">
          <CalendarClock size={22} strokeWidth={1.8} />
        </span>

        <div>
          <h1 className="text-lg font-semibold text-foreground">Time Slots</h1>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            The Time Slots route is ready. Connect this page to its API when the backend endpoints are available.
          </p>
        </div>
      </div>
    </section>
  );
}
