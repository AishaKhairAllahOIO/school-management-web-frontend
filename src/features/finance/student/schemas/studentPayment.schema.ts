import { z } from "zod";

const emptyStringToNull = z.preprocess(
  (value) => (value === "" ? null : value),
  z.string().nullable(),
);

export const paymentSchema = z.object({
  studentId: z.coerce.number().int().min(1, "Please select a student."),
  paidAmount: z.coerce
    .number()
    .finite("Please enter a valid amount.")
    .positive("Payment amount must be greater than zero."),
  paymentMethod: z.enum([
    "cash",
    "bank_transfer",
    "cheque",
    "electronic_wallet",
  ]),
  paperReceiptNo: emptyStringToNull,
  digitalReference: emptyStringToNull,
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
