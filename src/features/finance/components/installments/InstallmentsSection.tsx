import { useMemo, useState } from "react";
import { CalendarClock, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";

import { InstallmentsTable } from "./InstallmentsTable";
import { InstallmentDetailsDialog } from "./InstallmentDetailsDialog";
import { useInstallments } from "../../hooks/useInstallments";
import { FinanceSectionShell } from "../shared/FinanceSectionShell";
import { FinanceTableSkeleton } from "../shared/FinanceTableSkeleton";

type InstallmentsSectionProps = {
  studentId?: string | number;
  installments?: import("../../types/finance.types").Installment[];
  title?: string;
  description?: string;
};

export function InstallmentsSection({
  studentId,
  installments: providedInstallments,
  title = "Installment Schedule",
  description = "Review due dates, paid amounts, and installment status.",
}: InstallmentsSectionProps = {}) {
  const {
    data: queriedInstallments = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useInstallments();

  const visibleInstallments = useMemo(() => {
    if (providedInstallments) return providedInstallments;
    return studentId === undefined
      ? queriedInstallments
      : queriedInstallments.filter(
          (installment) => String(installment.studentId) === String(studentId),
        );
  }, [providedInstallments, queriedInstallments, studentId]);

  const [viewInstallmentOpen, setViewInstallmentOpen] = useState(false);
  const [selectedInstallmentId, setSelectedInstallmentId] = useState<string | number | null>(null);

  if (!providedInstallments && isLoading) {
    return (
      <FinanceSectionShell title={title} description={description} icon={CalendarClock}>
        <FinanceTableSkeleton />
      </FinanceSectionShell>
    );
  }

  if (!providedInstallments && isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[18px] border border-destructive/20 bg-destructive/[0.045] py-12 text-center">
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw size={16} className="mr-2" />
          {isFetching ? "Retrying..." : "Retry loading installments"}
        </Button>
      </div>
    );
  }

  return (
    <FinanceSectionShell title={title} description={description} icon={CalendarClock}>
      <InstallmentsTable
        installments={visibleInstallments}
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
