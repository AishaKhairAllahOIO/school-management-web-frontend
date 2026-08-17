// features/finance/components/cashier/ProcessPaymentDialog.tsx

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
  initialStudentId?: string | number;
  isLoading?: boolean;
  onSubmit: (values: PaymentFormValues) => void;
};

export function ProcessPaymentDialog({
  open,
  onOpenChange,
  students,
  initialStudentId,
  isLoading,
  onSubmit,
}: Props) {
  function handleSubmit(values: PaymentFormValues) {
    onSubmit(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[28px] border-border/45 bg-background/95 p-0 shadow-[0_24px_80px_rgba(31,22,73,0.16)] backdrop-blur-xl sm:max-w-xl">
        <DialogHeader className="space-y-1.5 px-6 pt-6 text-left sm:px-7">
          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
            Process New Payment
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Record a new payment receipt for a student and update their
            remaining balance automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 sm:px-7">
          <PaymentForm
            students={students}
            initialStudentId={initialStudentId}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
