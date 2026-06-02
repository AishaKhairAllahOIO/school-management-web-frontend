import { z } from "zod";

export const attendanceSchema =
  z.object({
    employeeName: z.string().min(2),

    role: z.string(),

    date: z.string(),

    status: z.enum([
      "Present",
      "Late",
      "Absent",
    ]),

    checkIn:
      z.string().optional(),

    checkOut:
      z.string().optional(),

    absenceType:
      z.string().optional(),

    notes:
      z.string().optional(),
  });

export type AttendanceSchema =
  z.infer<
    typeof attendanceSchema
  >;