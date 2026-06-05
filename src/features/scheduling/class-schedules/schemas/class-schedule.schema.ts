import { z } from "zod";

export const classScheduleSchema = z.object({
  classroomId: z.string().min(1, "Classroom is required"),
  subjectId: z.string().min(1, "Subject is required"),
  teacherId: z.string().min(1, "Teacher is required"),
  day: z.enum(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"]),
  timeSlotId: z.string().min(1, "Time slot is required"),
  roomNumber: z.string().optional().nullable(),
  academicYearId: z.string().min(1, "Academic year is required"),
  status: z.enum(["upcoming", "completed", "cancelled"]),
});

export type ClassScheduleFormValues = z.infer<typeof classScheduleSchema>;