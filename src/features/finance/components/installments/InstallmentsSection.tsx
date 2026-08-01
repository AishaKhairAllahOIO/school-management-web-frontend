import { useState } from "react";
import { AlertCircle, CalendarClock, CircleDollarSign, Loader2, RefreshCw, WalletCards } from "lucide-react";
import { Button } from "@/shared/ui/button";

import { InstallmentsTable } from "./InstallmentsTable";
import { InstallmentDetailsDialog } from "./InstallmentDetailsDialog"; // 👈 استيراد النافذة
import { useInstallments } from "../../hooks/useInstallments";
import { FinanceSectionShell } from "../shared/FinanceSectionShell";
import { FinanceTableSkeleton } from "../shared/FinanceTableSkeleton";
import { FinanceSummaryGrid } from "../shared/FinanceSummaryGrid";

export function InstallmentsSection() {
  const {
    data: installments = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useInstallments();


  const [viewInstallmentOpen, setViewInstallmentOpen] = useState(false);
  const [selectedInstallmentId, setSelectedInstallmentId] = useState<string | number | null>(null);

  if (isLoading) {
    return <FinanceSectionShell title="Student Installments" description="Track upcoming, paid, and overdue student installments." icon={CalendarClock}><FinanceTableSkeleton /></FinanceSectionShell>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[18px] border border-destructive/20 bg-destructive/[0.045] py-12 text-center">
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? <Loader2 size={16} className="mr-2 animate-spin" /> : <RefreshCw size={16} className="mr-2" />}
          {isFetching ? "Retrying..." : "Retry Loading Installments"}
        </Button>
      </div>
    );
  }

  return (
    <FinanceSectionShell
      title="Student Installments"
      description="Track upcoming, paid, and overdue student installments."
      icon={CalendarClock}
    >
      <FinanceSummaryGrid
        items={[
          {
            label: "Installments",
            value: new Intl.NumberFormat().format(installments.length),
            hint: "Across active contracts",
            icon: CalendarClock,
            tone: "primary",
          },
          {
            label: "Amount due",
            value: `${installments.reduce((sum, item) => sum + Number(item.amountDue ?? 0), 0).toLocaleString()} $`,
            hint: "Scheduled total",
            icon: CircleDollarSign,
            tone: "info",
          },
          {
            label: "Amount paid",
            value: `${installments.reduce((sum, item) => sum + Number(item.amountPaid ?? 0), 0).toLocaleString()} $`,
            hint: "Collected against installments",
            icon: WalletCards,
            tone: "success",
          },
          {
            label: "Overdue",
            value: new Intl.NumberFormat().format(installments.filter((item) => item.status === "overdue" || (item.status !== "paid" && new Date(item.dueDate) < new Date())).length),
            hint: "Requires follow-up",
            icon: AlertCircle,
            tone: "destructive",
          },
        ]}
      />

      <InstallmentsTable 
        installments={installments} 
        onView={(id) => {
          setSelectedInstallmentId(id);
          setViewInstallmentOpen(true);
        }}
      />


      <InstallmentDetailsDialog
        open={viewInstallmentOpen}
        onOpenChange={(open) => {
          setViewInstallmentOpen(open);
          if (!open) setSelectedInstallmentId(null);
        }}
        installmentId={selectedInstallmentId}
      />
    </FinanceSectionShell>
  );
}