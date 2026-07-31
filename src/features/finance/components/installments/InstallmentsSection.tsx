import { useState } from "react";
import { CalendarDays, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { FinancePageSkeleton } from "../shared/FinancePageSkeleton";
import { FinanceSectionHeader } from "../shared/FinanceSectionHeader";

import { InstallmentsTable } from "./InstallmentsTable";
import { InstallmentDetailsDialog } from "./InstallmentDetailsDialog"; // 👈 استيراد النافذة
import { useInstallments } from "../../hooks/useInstallments";

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
    return <FinancePageSkeleton rows={6} />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-12 text-center">
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw size={16} className={isFetching ? "mr-2 animate-spin" : "mr-2"} />
          {isFetching ? "Retrying..." : "Retry Loading Installments"}
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[22px] border border-border/70 bg-card shadow-[0_14px_42px_rgba(38,24,84,0.055)]">
      <FinanceSectionHeader
        icon={<CalendarDays size={19} strokeWidth={1.9} />}
        title="Student Installments"
        description="Track scheduled, paid, pending, and overdue installments for student financial contracts."
      />
      <div className="p-5 sm:p-6">
      <InstallmentsTable 
        installments={installments} 
        onView={(id) => {
          setSelectedInstallmentId(id);
          setViewInstallmentOpen(true);
        }}
      />
      </div>

      <InstallmentDetailsDialog
        open={viewInstallmentOpen}
        onOpenChange={(open) => {
          setViewInstallmentOpen(open);
          if (!open) setSelectedInstallmentId(null);
        }}
        installmentId={selectedInstallmentId}
      />
    </div>
  );
}