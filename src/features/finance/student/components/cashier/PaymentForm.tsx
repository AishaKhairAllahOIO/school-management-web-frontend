// features/finance/components/cashier/PaymentForm.tsx

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  paymentSchema,
  type PaymentFormValues,
} from "../../schemas/payment.schema";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

type Option = { id: number | string; name: string };

type Props = {
  students: Option[];
  initialStudentId?: string | number;
  isLoading?: boolean;
  onSubmit: (values: PaymentFormValues) => void;
};

export function PaymentForm({
  students,
  initialStudentId,
  onSubmit,
  isLoading = false,
}: Props) {
  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: {
      studentId: initialStudentId ? Number(initialStudentId) : 0,
      paidAmount: 0,
      paymentMethod: "cash",
      paperReceiptNo: "",
      digitalReference: "",
    },
  });

  const selectedMethod = watch("paymentMethod");

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data as PaymentFormValues))}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Student Selection */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Student Account
          </label>
          <Controller
            control={control}
            name="studentId"
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(val) => field.onChange(Number(val))}
              >
                <SelectTrigger className="h-11 rounded-xl border-border bg-card text-foreground focus:ring-2 focus:ring-ring">
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-popover text-popover-foreground shadow-lg">
                  {students.map((student) => (
                    <SelectItem
                      key={student.id}
                      value={String(student.id)}
                      className="rounded-lg cursor-pointer"
                    >
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.studentId && (
            <p className="text-xs font-medium text-destructive">
              {String(errors.studentId.message)}
            </p>
          )}
        </div>

        {/* Paid Amount */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Amount to Pay ($)
          </label>
          <Input
            type="number"
            className="h-11 rounded-xl border-border bg-card text-lg font-bold text-primary focus-visible:ring-ring"
            {...register("paidAmount")}
          />
          {errors.paidAmount && (
            <p className="text-xs font-medium text-destructive">
              {String(errors.paidAmount.message)}
            </p>
          )}
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Payment Method
          </label>
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
          {errors.paymentMethod && (
            <p className="text-xs font-medium text-destructive">
              {String(errors.paymentMethod.message)}
            </p>
          )}
        </div>

        {/* Paper Receipt */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Paper Receipt No. (Optional)
          </label>
          <Input
            type="text"
            className="h-11 rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-ring"
            placeholder="e.g. REC-12345"
            {...register("paperReceiptNo")}
          />
        </div>

        {/* Digital Reference */}
        {selectedMethod !== "cash" && (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Digital Reference (Optional)
            </label>
            <Input
              type="text"
              className="h-11 rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-ring"
              placeholder="e.g. TXN-987654321"
              {...register("digitalReference")}
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="primary-gradient h-12 w-full rounded-xl text-base font-semibold text-primary-foreground shadow-md transition-all hover:opacity-95 active:scale-[0.99]"
        disabled={isLoading}
      >
        {isLoading ? "Processing Transaction..." : "Process Payment"}
      </Button>
    </form>
  );
}
