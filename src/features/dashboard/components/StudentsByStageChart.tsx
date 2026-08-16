interface StudentStageData {
  stage_id: number;
  stage_name: string;
  students_count: number;
}

interface StudentsByStageChartProps {
  data: StudentStageData[];
}

const STAGE_STYLES = [
  {
    number: "01",
    bg: "bg-sky-50",
    border: "border-sky-100",
    numberColor: "text-sky-400",
    valueColor: "text-sky-600",
  },
  {
    number: "02",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    numberColor: "text-emerald-400",
    valueColor: "text-emerald-600",
  },
  {
    number: "03",
    bg: "bg-amber-50",
    border: "border-amber-100",
    numberColor: "text-amber-400",
    valueColor: "text-amber-600",
  },
  {
    number: "04",
    bg: "bg-rose-50",
    border: "border-rose-100",
    numberColor: "text-rose-400",
    valueColor: "text-rose-600",
  },
  {
    number: "05",
    bg: "bg-violet-50",
    border: "border-violet-100",
    numberColor: "text-violet-400",
    valueColor: "text-violet-600",
  },
];

export function StudentsByStageChart({
  data,
}: StudentsByStageChartProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-[0_6px_24px_rgba(148,163,184,0.06)]">
      {/* Header */}
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Student Distribution
        </p>

        <h3 className="mt-0.5 text-base font-bold tracking-tight text-foreground">
          Students by Grade
        </h3>
      </div>

      {/* Grades */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {data.map((stage, index) => {
          const style =
            STAGE_STYLES[index % STAGE_STYLES.length];

          return (
            <div
              key={stage.stage_id}
              className={`
                ${style.bg}
                ${style.border}
                group relative overflow-hidden rounded-xl border p-3
                transition-all duration-200
                hover:-translate-y-0.5 hover:shadow-sm
              `}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-[10px] font-bold ${style.numberColor}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="text-[10px] font-medium text-muted-foreground">
                  Grade
                </span>
              </div>

              <p className="mt-3 truncate text-sm font-semibold text-foreground">
                {stage.stage_name}
              </p>

              <div className="mt-2 flex items-baseline gap-1.5">
                <span
                  className={`text-xl font-bold tracking-tight ${style.valueColor}`}
                >
                  {stage.students_count.toLocaleString()}
                </span>

                <span className="text-[10px] font-medium text-muted-foreground">
                  Students
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {data.length === 0 && (
        <div className="flex min-h-[150px] items-center justify-center rounded-xl bg-muted/30">
          <p className="text-sm text-muted-foreground">
            No student data available
          </p>
        </div>
      )}
    </div>
  );
}