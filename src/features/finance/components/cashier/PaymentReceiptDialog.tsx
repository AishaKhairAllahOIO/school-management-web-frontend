import { useQuery } from "@tanstack/react-query";

import { Loader2, Printer, Receipt } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { financeOperationsService } from "../../services/finance-operations.service";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentId: string | number | null;
};

export function PaymentReceiptDialog({ open, onOpenChange, paymentId }: Props) {

    const { data: receipt, isLoading, isError } = useQuery({
    queryKey: ["payment-details", paymentId],
    queryFn: () => financeOperationsService.getPaymentDetails(paymentId!),
    enabled: !!paymentId && open,
  });

  const formatMethod = (method: string) => {
    switch (method) {
      case "cash": return "Cash";
      case "bank_transfer": return "Bank Transfer";
      case "cheque": return "Cheque";
      case "electronic_wallet": return "E-Wallet";
      default: return method;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#fdfdfd]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Receipt className="text-violet-600" />
            Payment Receipt Details
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-[250px] p-2 mt-2">
          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
              <p className="text-sm text-muted-foreground">Loading receipt details...</p>
            </div>
          ) : isError || !receipt ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-500">
              <p>Failed to load receipt details.</p>
            </div>
          ) : (
            <div className="space-y-6">

              <div className="border-b border-dashed border-gray-300 pb-4 text-center">
                <h3 className="text-2xl font-bold text-gray-800">
                  {receipt.paidAmount?.toLocaleString()} $
                </h3>
                <p className="text-sm text-green-600 font-medium mt-1">Payment Successful</p>
              </div>


              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Receipt ID</span>
                  <span className="font-semibold text-gray-800">#{receipt.id}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Payment Date</span>
                  <span className="font-medium text-gray-800">

                    {receipt.paymentDate || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium text-gray-800">
                    {formatMethod(receipt.paymentMethod)}
                  </span>
                </div>

                {receipt.paperReceiptNo && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Paper Ref. No.</span>
                    <span className="font-medium text-gray-800">{receipt.paperReceiptNo}</span>
                  </div>
                )}

                {receipt.digitalReference && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Digital Ref. No.</span>
                    <span className="font-medium text-gray-800">{receipt.digitalReference}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Processed By</span>
                  <span className="font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">
                    {receipt.cashierName || "System Admin"}
                  </span>
                </div>
              </div>


              <div className="pt-4">
                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800" 
                  onClick={() => window.print()}
                >
                  <Printer className="mr-2 h-4 w-4" /> Print Receipt
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}