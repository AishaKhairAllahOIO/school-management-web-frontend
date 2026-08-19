import {
  Clock3,
  Bell,
  Sparkles,
} from "lucide-react";

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  created_at: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export function RecentActivities({
  activities,
}: RecentActivitiesProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-[0_6px_24px_rgba(148,163,184,0.06)]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Activity Feed
          </p>

          <h3 className="mt-0.5 text-base font-semibold tracking-tight text-foreground">
            Recent Activities
          </h3>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-600">
          <Sparkles
            className="h-3 w-3"
            strokeWidth={1.8}
          />
          Latest 5
        </div>
      </div>

      {/* Activities */}
      <div className="space-y-1.5">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-3 rounded-xl border border-transparent px-2.5 py-2 transition-colors duration-200 hover:border-border/40 hover:bg-muted/30"
          >
            {/* Activity Icon */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-primary">
              {activity.type === "notification" ? (
                <Bell
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              ) : (
                <Clock3
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">
                {activity.title}
              </p>

              <p className="mt-0.5 truncate text-[11px] font-normal text-muted-foreground">
                {activity.description}
              </p>
            </div>

            {/* Date */}
            <span className="shrink-0 text-[10px] font-normal text-muted-foreground">
              {new Date(activity.created_at).toLocaleDateString(
                "en-US",
              )}
            </span>
          </div>
        ))}

        {/* Empty State */}
        {activities.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl bg-muted/30 py-6 text-center">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-muted/60">
              <Clock3
                className="h-4 w-4 text-muted-foreground"
                strokeWidth={1.8}
              />
            </div>

            <p className="text-xs font-normal text-muted-foreground">
              No Recent Activities
            </p>
          </div>
        )}
      </div>
    </div>
  );
}