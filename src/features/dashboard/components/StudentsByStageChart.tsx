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
    bg: "bg-sky-50 dark:bg-sky-950/25",
    border: "border-sky-100 dark:border-sky-900/40",
    numberColor: "text-sky-400 dark:text-sky-300",
    valueColor: "text-sky-600 dark:text-sky-300",
  },
  {
    number: "02",
    bg: "bg-emerald-50 dark:bg-emerald-950/25",
    border: "border-emerald-100 dark:border-emerald-900/40",
    numberColor: "text-emerald-400 dark:text-emerald-300",
    valueColor: "text-emerald-600 dark:text-emerald-300",
  },
  {
    number: "03",
    bg: "bg-amber-50 dark:bg-amber-950/25",
    border: "border-amber-100 dark:border-amber-900/40",
    numberColor: "text-amber-400 dark:text-amber-300",
    valueColor: "text-amber-600 dark:text-amber-300",
  },
  {
    number: "04",
    bg: "bg-rose-50 dark:bg-rose-950/25",
    border: "border-rose-100 dark:border-rose-900/40",
    numberColor: "text-rose-400 dark:text-rose-300",
    valueColor: "text-rose-600 dark:text-rose-300",
  },
  {
    number: "05",
    bg: "bg-violet-50 dark:bg-violet-950/25",
    border: "border-violet-100 dark:border-violet-900/40",
    numberColor: "text-violet-400 dark:text-violet-300",
    valueColor: "text-violet-600 dark:text-violet-300",
  },
];

export function StudentsByStageChart({
  data,
}: StudentsByStageChartProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-[0_6px_24px_rgba(148,163,184,0.06)] dark:shadow-black/10">
      {/* Header */}
      <div className="mb-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Student Distribution
        </p>

        <h3 className="mt-0.5 text-base font-semibold tracking-tight text-foreground">
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
                dark:hover:border-border/60
              `}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-[10px] font-medium ${style.numberColor}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="text-[10px] font-normal text-muted-foreground">
                  Grade
                </span>
              </div>

              <p className="mt-3 truncate text-sm font-medium text-foreground">
                {stage.stage_name}
              </p>

              <div className="mt-2 flex items-baseline gap-1.5">
                <span
                  className={`text-xl font-semibold tracking-tight ${style.valueColor}`}
                >
                  {stage.students_count.toLocaleString()}
                </span>

                <span className="text-[10px] font-normal text-muted-foreground">
                  Students
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {data.length === 0 && (
        <div className="flex min-h-[150px] items-center justify-center rounded-xl bg-muted/30">
          <p className="text-sm font-normal text-muted-foreground">
            No student data available
          </p>
        </div>
      )}
    </div>
  );
}