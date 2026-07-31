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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Process New Payment</DialogTitle>
          <DialogDescription>
            Record a new payment receipt for a student and update their remaining balance.
          </DialogDescription>
        </DialogHeader>

        <PaymentForm
          students={students}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}