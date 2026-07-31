import { useState } from "react";
import { CalendarRange, ReceiptText } from "lucide-react";

import { FinancialDashboard } from "./FinancialDashboard";
import { FinancialWorkspace } from "../shared/FinancialWorkspace";

export type FinancialSection = "fee-plans" | "policies";

const workspaceItems = [
  {
    id: "fee-plans",
    title: "Fee Plans",
    description: "Tuition and service pricing",
    icon: <ReceiptText size={18} strokeWidth={1.75} />,
  },
  {
    id: "policies",
    title: "Installment Policies",
    description: "Payment dates and percentages",
    icon: <CalendarRange size={18} strokeWidth={1.75} />,
  },
] satisfies Array<{
  id: FinancialSection;
  title: string;
  description: string;
  icon: React.ReactNode;
}>;

export function FinancialSettingsPage() {
  const [activeSection, setActiveSection] =
    useState<FinancialSection>("fee-plans");

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6">
      <FinancialWorkspace
        items={workspaceItems}
        activeId={activeSection}
        onChange={(id) => setActiveSection(id as FinancialSection)}
        hint="Financial settings are used during enrollment, invoicing and student payment tracking."
      >
        <FinancialDashboard activeSection={activeSection} />
      </FinancialWorkspace>
    </div>
  );
}
