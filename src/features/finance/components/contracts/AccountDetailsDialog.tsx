import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { useStudentFinancialAccount } from "../../hooks/useFinancialAccounts";
import type { FinancialAccount } from "../../types/finance.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId?: string | number | null;
};

export function AccountDetailsDialog({ open, onOpenChange, studentId }: Props) {
  // استخدام الـ Hook الذي جلبناه مسبقاً، وسيعمل فقط إذا كان هناك studentId
  const { data: account, isLoading, isError } = useStudentFinancialAccount(studentId ?? undefined);

  // دالة لتنسيق حالة الدفع
  const formatStatus = (status?: string) => {
    switch (status) {
      case "paid": return <span className="text-green-600 font-bold">Paid</span>;
      case "partially_paid": return <span className="text-orange-600 font-bold">Partially Paid</span>;
      case "unpaid": return <span className="text-red-600 font-bold">Unpaid</span>;
      default: return <span>{status || "Unknown"}</span>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Financial Account Profile</DialogTitle>
          <DialogDescription>
            Detailed view of the student's financial contract.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 min-h-[200px]">
          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center space-y-3 py-10">
              <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
              <p className="text-sm text-muted-foreground">Loading account details...</p>
            </div>
          ) : isError || !account ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">
              <p className="font-medium">Failed to load account details.</p>
              <p className="text-sm opacity-80">Please check the connection or try again.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* بطاقات الملخص المالي */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border bg-muted/20 p-4">
                  <p className="text-sm text-muted-foreground">Total Required</p>
                  <p className="mt-1 text-2xl font-bold text-gray-800">
                    {account.totalRequiredAmount?.toLocaleString()} $
                  </p>
                </div>
                <div className="rounded-xl border bg-violet-50/50 p-4 border-violet-100">
                  <p className="text-sm text-violet-600/80">Remaining Balance</p>
                  <p className="mt-1 text-2xl font-bold text-violet-700">
                    {account.remainingBalance?.toLocaleString()} $
                  </p>
                </div>
              </div>

              {/* تفاصيل العقد */}
              <div className="rounded-xl border p-5 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span>{formatStatus(account.paymentStatus)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-sm text-muted-foreground">Fee Plan</span>
                  <span className="font-medium">{account.feePlan?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-sm text-muted-foreground">Installment Policy</span>
                  <span className="font-medium">{account.installmentPolicy?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Contract Date</span>
                  <span className="font-medium text-sm">
                    {new Date(account.createdAt).toLocaleDateString()}
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