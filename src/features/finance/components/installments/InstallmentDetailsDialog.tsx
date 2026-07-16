import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Loader2, CreditCard } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { financeOperationsService } from "../../services/finance-operations.service";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  installmentId: string | number | null;
};

export function InstallmentDetailsDialog({ open, onOpenChange, installmentId }: Props) {
  const { data: installment, isLoading, isError } = useQuery({
    queryKey: ["installment-details", installmentId],
    queryFn: () => financeOperationsService.getInstallmentDetails(installmentId!),
    enabled: !!installmentId && open,
  });


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">Paid</span>;
      case "partially_paid":
        return <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">Partially Paid</span>;
      case "overdue":
        return <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">Overdue</span>;
      default:
        return <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">Pending</span>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#fdfdfd]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="text-violet-600" />
            Installment Details
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-[200px] p-2 mt-2">
          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
              <p className="text-sm text-muted-foreground">Loading installment data...</p>
            </div>
          ) : isError || !installment ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-500">
              <p>Failed to load installment details.</p>
            </div>
          ) : (
            <div className="space-y-6">

              <div className="border-b border-dashed border-gray-300 pb-4 text-center">
                <h3 className="text-xl font-bold text-gray-800">
                  {installment.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Installment #{installment.installmentNumber}
                </p>
              </div>


              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  {getStatusBadge(installment.status)}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Due Date</span>
                  <span className="font-semibold text-gray-800">
                    {installment.dueDate ? new Date(installment.dueDate).toLocaleDateString() : "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <span className="text-muted-foreground">Amount Due</span>
                  <span className="font-semibold text-gray-800">{installment.amountDue?.toLocaleString()} $</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-semibold text-green-600">{installment.amountPaid?.toLocaleString()} $</span>
                </div>

                <div className="flex justify-between items-center p-3 mt-2 bg-muted/30 rounded-xl border">
                  <span className="font-medium text-gray-800">Remaining to Pay</span>
                  <span className="font-bold text-violet-700 text-lg">

                    {((installment.amountDue || 0) - (installment.amountPaid || 0)).toLocaleString()} $
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}