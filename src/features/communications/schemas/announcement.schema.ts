import { z } from "zod";

export const createAnnouncementSchema = z.object({
  audience: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export type CreateAnnouncementForm = z.infer<typeof createAnnouncementSchema>;
