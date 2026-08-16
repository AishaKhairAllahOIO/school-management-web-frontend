import {
  Clock3,
  Bell,
  Sparkles,
  Activity as ActivityIcon,
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
    <div className="rounded-[1.5rem] border border-border/60 bg-card p-5 shadow-[0_8px_30px_rgba(148,163,184,0.07)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Activity feed
          </p>

          <h3 className="mt-1 text-lg font-bold tracking-tight text-foreground">
            Recent Activities
          </h3>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600">
          <Sparkles className="h-3.5 w-3.5" />
          Latest 5
        </div>
      </div>

      <div className="space-y-2.5">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="group flex items-start gap-3 rounded-2xl border border-transparent bg-muted/30 p-3.5 transition-all duration-200 hover:border-border/50 hover:bg-muted/50"
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm ring-1 ring-border/40">
              {activity.type === "notification" ? (
                <Bell className="h-4 w-4" strokeWidth={1.8} />
              ) : (
                <Clock3 className="h-4 w-4" strokeWidth={1.8} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <ActivityIcon className="h-3 w-3 shrink-0 text-muted-foreground" />

                <p className="truncate text-sm font-semibold text-foreground">
                  {activity.title}
                </p>
              </div>

              <p className="mt-1 line-clamp-1 text-xs leading-5 text-muted-foreground">
                {activity.description}
              </p>
            </div>

            <span className="whitespace-nowrap pt-1 text-[11px] font-medium text-muted-foreground">
              {new Date(activity.created_at).toLocaleDateString("en-US")}
            </span>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/30 py-10 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
              <ActivityIcon className="h-5 w-5 text-muted-foreground" />
            </div>

            <p className="text-sm font-medium text-muted-foreground">
              No recent activities
            </p>

            <p className="mt-1 text-xs text-muted-foreground/70">
              New activities will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}