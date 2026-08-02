import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { PaymentForm } from "./PaymentForm";
import type { PaymentFormValues } from "../../schemas/payment.schema";

type Option = { id: number | string; name: string };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Option[];
  isLoading?: boolean;
  onSubmit: (values: PaymentFormValues) => void;
};

export function ProcessPaymentDialog({
  open,
  onOpenChange,
  students,
  isLoading,
  onSubmit,
}: Props) {
  function handleSubmit(values: PaymentFormValues) {
    onSubmit(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="floating-card sm:max-w-xl rounded-3xl border border-border p-6 shadow-2xl">
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">Process New Payment</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Record a new payment receipt for a student and update their remaining balance automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <PaymentForm
            students={students}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}