import { useState } from "react";
import { Banknote, CalendarRange, ReceiptText } from "lucide-react";

import { SectionHeader } from "@/features/settings/academic/components/shared/SectionHeader";

import { FinancialDashboard } from "./FinancialDashboard";
import { FinancialWorkspace } from "../components/shared/FinancialWorkspace";

export type FinancialAudience = "students" | "staff";
export type FinancialSection = "fee-plans" | "policies";

const studentWorkspaceItems = [
  {
    id: "fee-plans",
    title: "Fee Plans",
    description: "Set tuition by year and grade",
    icon: <ReceiptText size={18} strokeWidth={1.75} />,
  },
  {
    id: "policies",
    title: "Installment Policies",
    description: "Control payment stages and due dates",
    icon: <CalendarRange size={18} strokeWidth={1.75} />,
  },
] satisfies Array<{
  id: FinancialSection;
  title: string;
  description: string;
  icon: React.ReactNode;
}>;

export function FinancialSettingsPage() {
  const [audience] = useState<FinancialAudience>("students");
  const [activeSection, setActiveSection] =
    useState<FinancialSection>("fee-plans");

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-4">
      {audience === "students" ? (
        <FinancialWorkspace
          items={studentWorkspaceItems}
          activeId={activeSection}
          onChange={(id) => setActiveSection(id as FinancialSection)}
          hint="Student financial settings determine which charges and payment schedules are available during enrollment and invoicing."
        >
          <FinancialDashboard activeSection={activeSection} />
        </FinancialWorkspace>
      ) : (
        <StaffFinancialSettings />
      )}
    </div>
  );
}

function StaffFinancialSettings() {
  return (
    <section className="rounded-[20px] border border-border/55 bg-card p-5 shadow-[0_8px_26px_rgba(30,20,70,0.04)] sm:p-6">
      <SectionHeader
        title="Staff Financial Configuration"
        description="Manage the rules that shape staff payroll, including salary structures, recurring allowances and deductions."
      />

      <div className="rounded-[20px] border border-dashed border-primary/20 bg-primary/[0.025] px-6 py-14 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-primary/[0.08] text-primary">
          <Banknote size={24} strokeWidth={1.7} />
        </span>
        <h3 className="mt-5 text-[17px] font-medium text-foreground">
          Staff finance endpoints are not included in this package
        </h3>
        <p className="mx-auto mt-2 max-w-xl text-[13px] leading-6 text-muted-foreground">
          The student and staff areas are now clearly separated. Connect the
          staff salary, allowance and deduction services here once their API
          files are available; no temporary records or mock data have been
          added.
        </p>
      </div>
    </section>
  );
}
