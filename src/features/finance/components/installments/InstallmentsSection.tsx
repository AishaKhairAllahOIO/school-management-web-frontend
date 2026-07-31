import { useState } from "react";
import { CalendarClock, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";

import { InstallmentsTable } from "./InstallmentsTable";
import { InstallmentDetailsDialog } from "./InstallmentDetailsDialog"; // 👈 استيراد النافذة
import { useInstallments } from "../../hooks/useInstallments";
import { FinanceSectionShell } from "../shared/FinanceSectionShell";
import { FinanceTableSkeleton } from "../shared/FinanceTableSkeleton";

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