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

// مخطط التحقق الخاص بالتعديل (بدون حقل المبلغ أو الطالب)
const updatePaymentSchema = z.object({
  paymentMethod: z.string().min(1, "الرجاء اختيار طريقة الدفع") as z.ZodType<"cash" | "bank_transfer" | "cheque" | "electronic_wallet">,
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

export function UpdatePaymentDialog({ open, onOpenChange, payment, isLoading, onSubmit }: Props) {
  const { control, handleSubmit, register, reset, watch } = useForm<UpdatePaymentPayload>({
    resolver: zodResolver(updatePaymentSchema) as any,
    defaultValues: {
      paymentMethod: "cash",
      paperReceiptNo: "",
      digitalReference: "",
    },
  });

  // تعبئة الفورم ببيانات الإيصال عند فتحه
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
    
    // تحويل القيم الفارغة إلى null لتطابق الباك إند
    const payload = {
      ...values,
      paperReceiptNo: values.paperReceiptNo || null,
      digitalReference: values.digitalReference || null,
    };
    
    onSubmit(payment.id, payload);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Payment Details</DialogTitle>
          <DialogDescription>
            Modify the payment method or references. Amount cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
          
          {/* حقل للعرض فقط لتذكير المحاسب بالمبلغ */}
          <div className="rounded-xl bg-gray-50 p-3 border border-gray-100 flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Receipt Amount:</span>
            <span className="font-bold text-gray-700">{payment?.paidAmount?.toLocaleString()} $</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <Controller
              control={control}
              name="paymentMethod"
              render={({ field }) => (
                <Select value={field.value as string} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Select Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="electronic_wallet">E-Wallet</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Paper Receipt No.</label>
            <Input className="h-11 rounded-xl" {...register("paperReceiptNo")} />
          </div>

          {selectedMethod !== "cash" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Digital Reference</label>
              <Input className="h-11 rounded-xl" {...register("digitalReference")} />
            </div>
          )}

          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}