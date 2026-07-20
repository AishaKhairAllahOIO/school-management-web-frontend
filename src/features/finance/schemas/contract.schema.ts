import { z } from "zod";

export const contractSchema = z.object({
  studentId: z.coerce.number().min(1, "الرجاء اختيار الطالب"),
  academicYearId: z.coerce.number().min(1, "الرجاء اختيار السنة الدراسية"),
  feePlanId: z.coerce.number().min(1, "الرجاء اختيار خطة الرسوم"),
  installmentPolicyId: z.coerce.number().min(1, "الرجاء اختيار سياسة التقسيط"),
  

  selectedExtraServiceIds: z.array(z.number()).optional().default([]),
});

export type ContractFormValues = z.infer<typeof contractSchema>;