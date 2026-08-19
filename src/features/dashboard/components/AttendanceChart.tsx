import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

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
    <div className="group rounded-2xl border border-border/60 bg-card p-4 shadow-[0_6px_24px_rgba(148,163,184,0.06)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(148,163,184,0.10)]">
      <div className="mb-1.5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Daily overview
          </p>

          <h3 className="mt-0.5 text-lg font-semibold tracking-tight text-foreground">
            Attendance
          </h3>
        </div>

        <div className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
          Today
        </div>
      </div>

      <div className="flex min-h-[250px] flex-col items-center justify-center gap-4 sm:flex-row">
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
                  borderRadius: "10px",
                  boxShadow: "0 6px 18px rgba(15,23,42,0.07)",
                  padding: "6px 9px",
                  fontSize: "11px",
                }}
                itemStyle={{
                  fontSize: "11px",
                  padding: "0",
                }}
                labelStyle={{
                  fontSize: "10px",
                  marginBottom: "2px",
                }}
                formatter={(value) => [
                  `${Number(value).toLocaleString()} students`,
                  "Count",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold tracking-tight text-foreground">
              {total.toLocaleString()}
            </span>

            <span className="text-xs font-normal text-muted-foreground">
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

              <span className="min-w-0 flex-1 text-xs font-normal text-muted-foreground">
                {item.name}
              </span>

              <span className="text-sm font-semibold text-foreground">
                {item.value.toLocaleString()}
              </span>
            </div>
          ))}

          <div className="mt-2 border-t border-border/50 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-normal text-muted-foreground">
                Total
              </span>

              <span className="text-sm font-semibold text-foreground">
                {total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}