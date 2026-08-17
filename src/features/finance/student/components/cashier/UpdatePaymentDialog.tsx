// features/finance/components/cashier/UpdatePaymentDialog.tsx

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import type { PaymentReceipt } from "../../types/finance.types";
import type { UpdatePaymentPayload } from "../../types/finance.payloads";

const updatePaymentSchema = z.object({
  paymentMethod: z.string().min(1, "الرجاء اختيار طريقة الدفع") as z.ZodType<
    "cash" | "bank_transfer" | "cheque" | "electronic_wallet"
  >,
  paperReceiptNo: z.string().optional(),
  digitalReference: z.string().optional(),
});

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentReceipt | null;
  isLoading?: boolean;
  onSubmit: (id: string, values: UpdatePaymentPayload) => void;
};

export function UpdatePaymentDialog({
  open,
  onOpenChange,
  payment,
  isLoading,
  onSubmit,
}: Props) {
  const { control, handleSubmit, register, reset, watch } =
    useForm<UpdatePaymentPayload>({
      resolver: zodResolver(updatePaymentSchema) as any,
      defaultValues: {
        paymentMethod: "cash",
        paperReceiptNo: "",
        digitalReference: "",
      },
    });

  useEffect(() => {
    if (payment && open) {
      reset({
        paymentMethod: payment.paymentMethod,
        paperReceiptNo: payment.paperReceiptNo || "",
        digitalReference: payment.digitalReference || "",
      });
    }
  }, [payment, open, reset]);

  const selectedMethod = watch("paymentMethod");

  function handleFormSubmit(values: UpdatePaymentPayload) {
    if (!payment) return;

    const payload = {
      ...values,
      paperReceiptNo: values.paperReceiptNo || null,
      digitalReference: values.digitalReference || null,
    };

    onSubmit(payment.id, payload);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[28px] border-border/45 bg-background/95 p-0 shadow-[0_24px_80px_rgba(31,22,73,0.16)] backdrop-blur-xl sm:max-w-md">
        <DialogHeader className="space-y-1.5 px-6 pt-6 text-left sm:px-7">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Update Payment Details
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Modify the payment method or reference numbers. The paid amount
            cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-5 px-6 pb-6 pt-5 sm:px-7"
        >
          {/* Read-Only Receipt Amount Reminder */}
          <div className="soft-purple-gradient flex items-center justify-between rounded-2xl border border-primary/20 p-4 text-sm">
            <span className="font-medium text-muted-foreground">
              Receipt Amount:
            </span>
            <span className="text-lg font-bold text-primary">
              {payment?.paidAmount?.toLocaleString()} $
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Payment Method
            </label>
            <Controller
              control={control}
              name="paymentMethod"
              render={({ field }) => (
                <Select
                  value={field.value as string}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="h-11 rounded-xl border-border bg-card text-foreground focus:ring-2 focus:ring-ring">
                    <SelectValue placeholder="Select Method" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border bg-popover text-popover-foreground shadow-lg">
                    <SelectItem
                      value="cash"
                      className="rounded-lg cursor-pointer"
                    >
                      Cash
                    </SelectItem>
                    <SelectItem
                      value="bank_transfer"
                      className="rounded-lg cursor-pointer"
                    >
                      Bank Transfer
                    </SelectItem>
                    <SelectItem
                      value="cheque"
                      className="rounded-lg cursor-pointer"
                    >
                      Cheque
                    </SelectItem>
                    <SelectItem
                      value="electronic_wallet"
                      className="rounded-lg cursor-pointer"
                    >
                      E-Wallet
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Paper Receipt No.
            </label>
            <Input
              className="h-11 rounded-xl border-border bg-card text-foreground focus-visible:ring-ring"
              {...register("paperReceiptNo")}
            />
          </div>

          {selectedMethod !== "cash" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Digital Reference
              </label>
              <Input
                className="h-11 rounded-xl border-border bg-card text-foreground focus-visible:ring-ring"
                {...register("digitalReference")}
              />
            </div>
          )}

          <Button
            type="submit"
            className="primary-gradient h-11 w-full rounded-xl font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-95"
            disabled={isLoading}
          >
            {isLoading ? "Saving Changes..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
