import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";

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
    return <div className="py-10 text-center text-muted-foreground">Loading installments data...</div>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-12 text-center">
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? <Loader2 size={16} className="mr-2 animate-spin" /> : <RefreshCw size={16} className="mr-2" />}
          {isFetching ? "Retrying..." : "Retry Loading Installments"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Scheduled Installments</h2>
          <p className="text-muted-foreground">
            Track all upcoming and overdue payments across all student accounts.
          </p>
        </div>
      </div>


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
    </div>
  );
}