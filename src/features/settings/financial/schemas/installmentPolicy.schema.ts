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
  name: z.string().min(2, "Name is required"),
  items: z.array(installmentItemSchema) // تم تصحيح الاسم هنا ليتطابق مع الـ Schema أعلاه
}).refine((data) => {
  const totalPercentage = data.items.reduce((sum, item) => sum + item.percentage, 0);
  return totalPercentage === 100;
}, {
  message: "Total percentage of all installments must equal exactly 100%",
  path: ["items"],  
});

export type InstallmentPolicyFormValues =
  z.infer<typeof installmentPolicySchema>;