import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface StudentStageData {
  stage_id: number;
  stage_name: string;
  students_count: number;
}

interface StudentsByStageChartProps {
  data: StudentStageData[];
}

const COLORS = [
  "#91B7E8",
  "#7CC9A5",
  "#F2C978",
  "#F29AA3",
  "#B9A7E8",
];

export function StudentsByStageChart({
  data,
}: StudentsByStageChartProps) {
  return (
    <div className="group rounded-[1.5rem] border border-border/60 bg-card p-5 shadow-[0_8px_30px_rgba(148,163,184,0.07)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(148,163,184,0.12)]">
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Student distribution
        </p>

        <h3 className="mt-1 text-lg font-bold tracking-tight text-foreground">
          Students by Stage
        </h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 8,
              right: 8,
              left: -10,
              bottom: 5,
            }}
          >
            <XAxis
              dataKey="stage_name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--color-muted-foreground)",
                fontSize: 11,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--color-muted-foreground)",
                fontSize: 11,
              }}
            />

            <Tooltip
              cursor={{
                fill: "rgba(148,163,184,0.06)",
              }}
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

            <Bar
              dataKey="students_count"
              radius={[10, 10, 4, 4]}
              barSize={34}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}