import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { paymentSchema, type PaymentFormValues } from "../../schemas/payment.schema";

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
  isLoading?: boolean;
  onSubmit: (values: PaymentFormValues) => void;
};

export function PaymentForm({ students, onSubmit, isLoading = false }: Props) {
  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: {
      studentId: 0,
      paidAmount: 0,
      paymentMethod: "cash",
      paperReceiptNo: "",
      digitalReference: "",
    },
  });

  const selectedMethod = watch("paymentMethod");

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as PaymentFormValues))} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        
        {/* Student Selection */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Student Account</label>
          <Controller
            control={control}
            name="studentId"
            render={({ field }) => (
              <Select value={field.value ? String(field.value) : ""} onValueChange={(val) => field.onChange(Number(val))}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={String(student.id)}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.studentId && <p className="text-sm text-red-500">{String(errors.studentId.message)}</p>}
        </div>

        {/* Paid Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount to Pay ($)</label>
          <Input 
            type="number" 
            className="h-11 rounded-xl text-lg font-bold text-violet-700" 
            {...register("paidAmount")} 
          />
          {errors.paidAmount && <p className="text-sm text-red-500">{String(errors.paidAmount.message)}</p>}
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Method</label>
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
          {errors.paymentMethod && <p className="text-sm text-red-500">{String(errors.paymentMethod.message)}</p>}
        </div>

        {/* Paper Receipt (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Paper Receipt No. (Optional)</label>
          <Input 
            type="text" 
            className="h-11 rounded-xl" 
            placeholder="e.g. REC-12345"
            {...register("paperReceiptNo")} 
          />
        </div>

        {/* Digital Reference (Shows only if not cash) */}
        {selectedMethod !== "cash" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Digital Reference (Optional)</label>
            <Input 
              type="text" 
              className="h-11 rounded-xl" 
              placeholder="e.g. TXN-987654321"
              {...register("digitalReference")} 
            />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full h-12 text-lg bg-green-600 hover:bg-green-700" disabled={isLoading}>
        {isLoading ? "Processing..." : "Process Payment"}
      </Button>
    </form>
  );
}