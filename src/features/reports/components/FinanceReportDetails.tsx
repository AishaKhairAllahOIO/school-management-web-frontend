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

export function FinanceReportDetails({
  type,
  report,
}: Props) {
  if (!report) {
    return (
      <section className="rounded-[22px] border border-border/60 bg-card p-5">
        <p className="text-[12px] text-muted-foreground">
          Financial report data is currently unavailable.
        </p>
      </section>
    );
  }

  if (type === "student") {
    return (
      <section className="rounded-[22px] border border-border/60 bg-card p-5">
        <header>
          <h2 className="text-[15px] font-semibold text-foreground">
            Student finance
          </h2>

          <p className="mt-1 text-[11px] text-muted-foreground">
            Student revenue and collection summary.
          </p>
        </header>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <FinanceItem
            label="Expected revenue"
            value={report.total_expected_revenue}
          />

          <FinanceItem
            label="Collected revenue"
            value={report.total_collected_revenue}
          />

          <FinanceItem
            label="Outstanding"
            value={report.total_outstanding_amount}
          />

          <FinanceItem
            label="Collection rate"
            value={`${report.overall_collection_rate}%`}
          />

          <FinanceItem
            label="Payments"
            value={report.total_payments_count}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[22px] border border-border/60 bg-card p-5">
      <header>
        <h2 className="text-[15px] font-semibold text-foreground">
          Staff finance
        </h2>

        <p className="mt-1 text-[11px] text-muted-foreground">
          Payroll and salary payment summary.
        </p>
      </header>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <FinanceItem
          label="Payrolls processed"
          value={report.total_payrolls_processed}
        />

        <FinanceItem
          label="Net salaries paid"
          value={report.total_net_salaries_paid}
        />

        <FinanceItem
          label="Average salary"
          value={report.average_salary_paid}
        />
      </div>
    </section>
  );
}

function FinanceItem({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  const formattedValue =
    typeof value === "number"
      ? new Intl.NumberFormat("en-US", {
          maximumFractionDigits: 2,
        }).format(value)
      : value;

  return (
    <div className="rounded-[15px] border border-border/50 bg-muted/15 p-3.5">
      <p className="text-[10px] text-muted-foreground">
        {label}
      </p>

      <strong className="mt-1 block text-[17px] font-semibold tracking-[-0.03em] text-foreground">
        {formattedValue}
      </strong>
    </div>
  );
}