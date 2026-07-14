import { z } from "zod";

export const installmentItemSchema = z.object({
  title: z.string().min(1, "Title is required"),

  percentage: z
    .number()
    .min(1)
    .max(100),

  dueMonth: z
    .number()
    .min(1)
    .max(12),

  dueDay: z
    .number()
    .min(1)
    .max(31),
});

export const installmentPolicySchema = z.object({
  name: z
    .string()
    .min(3, "Policy name must be at least 3 characters long"),

  items: z
    .array(installmentItemSchema)
    .min(1, "Add at least one installment"),
});

export type InstallmentPolicyFormValues =
  z.infer<typeof installmentPolicySchema>;