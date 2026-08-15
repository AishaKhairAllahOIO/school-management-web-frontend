import { z } from "zod";

export const paymentSchema = z.object({
  studentId: z.coerce.number().min(1, "الرجاء اختيار الطالب"),
  paidAmount: z.coerce.number().positive("المبلغ يجب أن يكون أكبر من صفر"),
  paymentMethod: z.enum(
    ["cash", "bank_transfer", "cheque", "electronic_wallet"],
    {
      errorMap: () => ({ message: "الرجاء اختيار طريقة الدفع" }),
    },
  ),
  paperReceiptNo: z.string().trim().optional(),
  digitalReference: z.string().trim().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
