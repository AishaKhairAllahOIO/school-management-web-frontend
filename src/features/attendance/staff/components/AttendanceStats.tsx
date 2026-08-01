import { CalendarOff, CheckCircle2, Clock3, ShieldAlert, UsersRound } from "lucide-react";

type Props = {
  total: number;
  present: number;
  absent: number;
  excused: number;
  unexcused: number;
  isLoading?: boolean;
};

const items = [
  { key: "total", label: "Total staff", icon: UsersRound, tone: "text-foreground", iconTone: "bg-primary/[0.08] text-primary" },
  { key: "present", label: "Present", icon: CheckCircle2, tone: "text-success", iconTone: "bg-success/[0.10] text-success" },
  { key: "absent", label: "Absent", icon: CalendarOff, tone: "text-destructive", iconTone: "bg-destructive/[0.09] text-destructive" },
  { key: "excused", label: "Excused", icon: Clock3, tone: "text-info", iconTone: "bg-info/[0.10] text-info" },
  { key: "unexcused", label: "Unexcused", icon: ShieldAlert, tone: "text-warning", iconTone: "bg-warning/[0.11] text-warning" },
] as const;

export function AttendanceStats({ total, present, absent, excused, unexcused, isLoading = false }: Props) {
  const values = { total, present, absent, excused, unexcused };

  return (
    <div className="grid overflow-hidden rounded-[18px] border border-border/60 bg-card shadow-[0_7px_24px_rgba(30,20,70,0.04)] sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={item.key}
            className={[
              "flex min-h-[78px] items-center gap-3 px-4 py-3",
              index > 0 ? "border-t border-border/50 sm:border-s sm:border-t-0" : "",
              index === 2 ? "sm:border-s-0 xl:border-s" : "",
              index >= 2 ? "sm:border-t xl:border-t-0" : "",
            ].join(" ")}
          >
            <span className={["flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]", item.iconTone].join(" ")}>
              <Icon className="h-[17px] w-[17px]" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              {isLoading ? (
                <span className="block h-5 w-10 animate-pulse rounded-[6px] bg-muted/65" />
              ) : (
                <strong className={["block text-[20px] font-semibold leading-none tracking-[-0.035em]", item.tone].join(" ")}>
                  {new Intl.NumberFormat().format(values[item.key])}
                </strong>
              )}
              <span className="mt-1 block truncate text-[11px] font-normal text-muted-foreground">{item.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
