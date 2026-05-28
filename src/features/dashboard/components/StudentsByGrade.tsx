import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { studentsByGrade } from "@/features/dashboard/data/dashboard.mock";

const gradeColors = [
  "rgb(var(--primary))",
  "rgb(var(--info))",
  "rgb(var(--success))",
  "rgb(var(--warning))",
];

export function StudentsByGrade() {
  return (
    <section className="soft-card rounded-3xl p-6">
      <h2 className="mb-5 text-base font-bold text-foreground">
        Students by Grade
      </h2>

      <div className="grid gap-5 md:grid-cols-[190px_1fr]">
        <div className="relative h-[190px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={studentsByGrade}
                dataKey="total"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={1}
              >
                {studentsByGrade.map((item, index) => (
                  <Cell key={item.grade} fill={gradeColors[index % gradeColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <strong className="text-3xl font-bold tracking-[-0.04em] text-foreground">
              1,248
            </strong>
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
        </div>

        <div className="space-y-4 self-center">
          {studentsByGrade.map((item, index) => (
            <div key={item.grade} className="flex items-center gap-3 text-sm">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: gradeColors[index % gradeColors.length] }}
              />

              <span className="min-w-[72px] font-medium text-foreground">
                {item.grade}
              </span>

              <span className="ml-auto text-muted-foreground">
                {item.total} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}