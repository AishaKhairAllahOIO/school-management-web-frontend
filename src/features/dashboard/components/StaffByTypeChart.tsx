import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface StaffTypeData {
  type: string;
  label: string;
  count: number;
}

interface StaffByTypeChartProps {
  data: StaffTypeData[];
}

const COLORS = [
  "#B9A7E8",
  "#91B7E8",
  "#7CC9A5",
  "#F2C978",
  "#F29AA3",
];

export function StaffByTypeChart({ data }: StaffByTypeChartProps) {
  return (
    <div className="group rounded-[1.5rem] border border-border/60 bg-card p-5 shadow-[0_8px_30px_rgba(148,163,184,0.07)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(148,163,184,0.12)]">
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Workforce overview
        </p>

        <h3 className="mt-1 text-lg font-bold tracking-tight text-foreground">
          Staff by Type
        </h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              right: 10,
              left: 5,
              bottom: 5,
            }}
          >
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--color-muted-foreground)",
                fontSize: 11,
              }}
            />

            <YAxis
              type="category"
              dataKey="label"
              width={90}
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
                `${value.toLocaleString()} staff`,
                "Count",
              ]}
            />

            <Bar
              dataKey="count"
              radius={[0, 10, 10, 0]}
              barSize={24}
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