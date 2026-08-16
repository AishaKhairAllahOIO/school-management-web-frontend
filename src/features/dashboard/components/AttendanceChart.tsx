import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AttendanceChartProps {
  data: {
    present: number;
    excused_absence: number;
    unexcused_absence: number;
  };
}

const COLORS = ["#7CC9A5", "#F2C978", "#F29AA3"];

export function AttendanceChart({ data }: AttendanceChartProps) {
  const chartData = [
    { name: "Present", value: data.present },
    { name: "Excused Absence", value: data.excused_absence },
    { name: "Unexcused Absence", value: data.unexcused_absence },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="group rounded-[1.5rem] border border-border/60 bg-card p-5 shadow-[0_8px_30px_rgba(148,163,184,0.07)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(148,163,184,0.12)]">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Daily overview
          </p>

          <h3 className="mt-1 text-lg font-bold tracking-tight text-foreground">
            Attendance
          </h3>
        </div>

        <div className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
          Today
        </div>
      </div>

      <div className="flex min-h-[260px] flex-col items-center justify-center gap-5 sm:flex-row">
        <div className="relative h-56 w-full max-w-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={66}
                outerRadius={88}
                paddingAngle={4}
                cornerRadius={7}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="var(--color-card)"
                    strokeWidth={4}
                  />
                ))}
              </Pie>

              <Tooltip
                cursor={false}
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.96)",
                  border: "1px solid rgba(226,232,240,0.8)",
                  borderRadius: "14px",
                  boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
                }}
                formatter={(value: number) => [
                  `${value.toLocaleString()} students`,
                  "Count",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {total.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Students
            </span>
          </div>
        </div>

        <div className="w-full max-w-[220px] space-y-3">
          {chartData.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-muted/40"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />

              <span className="min-w-0 flex-1 text-xs font-medium text-muted-foreground">
                {item.name}
              </span>

              <span className="text-sm font-bold text-foreground">
                {item.value.toLocaleString()}
              </span>
            </div>
          ))}

          <div className="mt-2 border-t border-border/50 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Total
              </span>

              <span className="text-sm font-bold text-foreground">
                {total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}