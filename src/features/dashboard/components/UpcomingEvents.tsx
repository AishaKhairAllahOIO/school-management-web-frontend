import { upcomingEvents } from "@/features/dashboard/data/dashboard.mock";

export function UpcomingEvents() {
  return (
    <section className="soft-card rounded-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Upcoming Events</h2>

        <button
          type="button"
          className="rounded-2xl border border-border/70 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          View calendar
        </button>
      </div>

      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <div key={event.id} className="flex items-center gap-4">
            <div className="w-14 overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 text-center">
              <div className="bg-primary px-2 py-1 text-[11px] font-bold text-primary-foreground">
                {event.month}
              </div>

              <div className="py-2 text-2xl font-bold tracking-[-0.04em] text-foreground">
                {event.day}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-foreground">
                {event.title}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {event.dateTime}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}