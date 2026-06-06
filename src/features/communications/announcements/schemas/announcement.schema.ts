import { z } from "zod";

export const createAnnouncementSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000),
  target: z.enum([
    "All Students",
    "All Parents",
    "All Staff",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ]),
  priority: z.enum(["Low", "Medium", "High"]),
  publishDate: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, "Publish date must be today or in the future"),
});

export type CreateAnnouncementFormData = z.infer<
  typeof createAnnouncementSchema
>;
