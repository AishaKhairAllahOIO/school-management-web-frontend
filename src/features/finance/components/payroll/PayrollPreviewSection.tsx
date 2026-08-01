import { BadgeDollarSign, CalendarClock, CircleDollarSign, UsersRound } from "lucide-react";
import { FinanceSectionShell } from "../shared/FinanceSectionShell";

const items = [
  { icon: UsersRound, title: "Salary profiles", text: "Employee salary structures and assignments" },
  { icon: CircleDollarSign, title: "Allowances & deductions", text: "Recurring and one-time payroll adjustments" },
  { icon: CalendarClock, title: "Payroll cycles", text: "Monthly processing and payslip preparation" },
];

export function PayrollPreviewSection() {
  return (
    <FinanceSectionShell
      title="Staff Payroll"
      description="A prepared workspace for employee salaries without introducing unverified backend calls."
      icon={BadgeDollarSign}
      tone="staff"
    >
      <div className="grid gap-3 md:grid-cols-3">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-[17px] border border-info/14 bg-info/[0.035] p-4 transition-colors hover:bg-info/[0.055]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-info/[0.09] text-info">
              <Icon className="h-4 w-4" strokeWidth={1.8} />
            </div>
            <h3 className="mt-3 text-[14px] font-medium text-foreground/88">{title}</h3>
            <p className="mt-1 text-[12.5px] font-normal leading-5 text-muted-foreground/80">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-[16px] border border-dashed border-info/20 bg-info/[0.025] px-4 py-3 text-[12.5px] font-normal text-muted-foreground">
        Payroll UI is included as a safe visual foundation. No salary API, mutation, or query key was invented or changed.
      </div>
    </FinanceSectionShell>
  );
}
