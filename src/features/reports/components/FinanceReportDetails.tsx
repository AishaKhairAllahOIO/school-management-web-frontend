import type {
  StudentFinanceReportResponse,
  StaffFinanceReportResponse,
} from "../types/reports.types";

type Props =
  | {
      type: "student";
      report: StudentFinanceReportResponse | null;
    }
  | {
      type: "staff";
      report: StaffFinanceReportResponse | null;
    };

export function FinanceReportDetails({ type, report }: Props) {
  if (!report) {
    return (
      <section className="rounded-[22px] border border-border/60 bg-card p-6 shadow-sm">
        <p className="text-[13px] font-medium text-muted-foreground">
          Financial report data is currently unavailable.
        </p>
      </section>
    );
  }

  if (type === "student") {
    return (
      <section className="rounded-[22px] border border-border/60 bg-card p-6 shadow-sm overflow-hidden">
        <header className="mb-5">
          <h2 className="text-[16px] font-semibold text-foreground">
            Student Finance
          </h2>

          <p className="mt-1 text-[12px] font-medium text-muted-foreground">
            Student revenue and collection summary.
          </p>
        </header>

        <div className="mt-5 flex flex-wrap gap-3">
          <FinanceItem
            label="Expected revenue"
            value={report.total_expected_revenue}
            tone="primary"
          />

          <FinanceItem
            label="Collected revenue"
            value={report.total_collected_revenue}
            tone="success"
          />

          <FinanceItem
            label="Outstanding"
            value={report.total_outstanding_amount}
            tone="destructive"
          />

          <FinanceItem
            label="Collection rate"
            value={`${report.overall_collection_rate}`}
            tone="info"
          />

          <FinanceItem
            label="Payments"
            value={report.total_payments_count}
            tone="warning"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[22px] border border-border/60 bg-card p-6 shadow-sm overflow-hidden">
      <header className="mb-5">
        <h2 className="text-[16px] font-semibold text-foreground">
          Staff Finance
        </h2>

        <p className="mt-1 text-[12px] font-medium text-muted-foreground">
          Payroll and salary payment summary.
        </p>
      </header>

      <div className="mt-5 flex flex-wrap gap-3">
        <FinanceItem
          label="Payrolls processed"
          value={report.total_payrolls_processed}
          tone="primary"
        />

        <FinanceItem
          label="Net salaries paid"
          value={report.total_net_salaries_paid}
          tone="success"
        />

        <FinanceItem
          label="Average salary"
          value={report.average_salary_paid}
          tone="info"
        />
      </div>
    </section>
  );
}

function FinanceItem({
  label,
  value,
  tone = "primary",
}: {
  label: string;
  value: number | string;
  tone?: "primary" | "success" | "destructive" | "warning" | "info";
}) {
  const formattedValue =
    typeof value === "number"
      ? new Intl.NumberFormat("en-US", {
          maximumFractionDigits: 2,
        }).format(value)
      : value;

  const toneColors = {
    primary: "text-primary",
    success: "text-success",
    destructive: "text-destructive",
    warning: "text-warning",
    info: "text-info",
  };

  return (
    <div className="flex-1 min-w-[140px] flex flex-col justify-center rounded-[16px] border border-border/50 bg-muted/20 p-4 transition-colors hover:bg-muted/40">
      <p
        className="text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider truncate"
        title={label}
      >
        {label}
      </p>

      <strong
        className={`mt-1.5 block text-[18px] lg:text-[20px] font-semibold tracking-tight truncate ${toneColors[tone]}`}
        title={String(formattedValue)}
      >
        {formattedValue}
      </strong>
    </div>
  );
}