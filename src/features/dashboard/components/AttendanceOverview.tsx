import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown } from "lucide-react";

import { attendanceOverview } from "@/features/dashboard/data/dashboard.mock";

export function AttendanceOverview() {
  return (
    <section className="soft-card rounded-3xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-base font-bold text-foreground">
          Attendance Overview
        </h2>

        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-2xl border border-border/70 bg-card px-4 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          This Week
          <ChevronDown size={15} />
        </button>
      </div>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={attendanceOverview}>
            <defs>
              <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.28} />
                <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgb(var(--border))" vertical={false} opacity={0.7} />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgb(var(--muted-foreground))", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgb(var(--muted-foreground))", fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip
              formatter={(value) => [`${value}%`, "Attendance"]}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid rgb(var(--border))",
                background: "rgb(var(--card))",
                color: "rgb(var(--foreground))",
              }}
            />

            <Area
              type="monotone"
              dataKey="rate"
              stroke="rgb(var(--primary))"
              strokeWidth={3}
              fill="url(#attendanceGradient)"
              dot={{ r: 4, fill: "rgb(var(--primary))" }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}