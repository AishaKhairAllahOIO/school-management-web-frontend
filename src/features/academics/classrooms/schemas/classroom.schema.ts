import { z } from "zod";

export const classroomSchema = z.object({
  name: z.string().min(2, "Classroom name is required"),
  code: z.string().min(1, "Classroom code is required"),
  gradeId: z.string().min(1, "Grade is required"),
  capacity: z.coerce.number().min(1, "Capacity is required"),
  roomNumber: z.string().optional().nullable(),
  isActive: z.boolean(),
});

export type ClassroomFormValues = z.infer<typeof classroomSchema>;