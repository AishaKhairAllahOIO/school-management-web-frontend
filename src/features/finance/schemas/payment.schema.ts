import { z } from "zod";

export const paymentSchema = z.object({
  studentId: z.coerce.number().min(1, "الرجاء اختيار الطالب"),
  paidAmount: z.coerce.number().min(1, "المبلغ يجب أن يكون أكبر من صفر"),
  

  paymentMethod: z.string().min(1, "الرجاء اختيار طريقة الدفع") as z.ZodType<"cash" | "bank_transfer" | "cheque" | "electronic_wallet">,
  
  paperReceiptNo: z.string().optional(),
  digitalReference: z.string().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;