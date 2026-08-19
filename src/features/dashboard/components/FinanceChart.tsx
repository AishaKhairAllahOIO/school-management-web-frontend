import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface FinanceChartProps {
  data: {
    total_due: number;
    total_paid: number;
    total_remaining: number;
  };
}

const COLORS = ["#F2C978", "#7CC9A5", "#91B7E8"];

export function FinanceChart({ data }: FinanceChartProps) {
  const chartData = [
    {
      name: "Due",
      value: data.total_due,
    },
    {
      name: "Paid",
      value: data.total_paid,
    },
    {
      name: "Remaining",
      value: data.total_remaining,
    },
  ];

  return (
    <div className="group rounded-2xl border border-border/60 bg-card p-4 shadow-[0_6px_24px_rgba(148,163,184,0.06)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(148,163,184,0.10)]">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Financial overview
          </p>

          <h3 className="mt-0.5 text-lg font-semibold tracking-tight text-foreground">
            Finance Summary
          </h3>
        </div>

        <div className="rounded-lg bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-600">
          Overview
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 5,
              right: 10,
              left: 10,
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
              dataKey="name"
              width={75}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--color-muted-foreground)",
                fontSize: 12,
              }}
            />

            <Tooltip
              cursor={{
                fill: "rgba(148,163,184,0.06)",
              }}
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
                Number(value).toLocaleString(),
                "Amount",
              ]}
            />

            <Bar
              dataKey="value"
              radius={[0, 10, 10, 0]}
              barSize={24}
            >
              {chartData.map((_, index) => (
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