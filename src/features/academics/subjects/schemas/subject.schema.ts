import { z } from "zod";

export const subjectSchema = z.object({
  name: z.string().min(2, "Subject name is required"),
  code: z.string().min(1, "Subject code is required"),
  description: z.string().optional().nullable(),
  isCore: z.boolean(),
  isActive: z.boolean(),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;