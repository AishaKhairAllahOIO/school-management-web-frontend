export type AnnouncementTarget =
  | "All Students"
  | "All Parents"
  | "All Staff"
  | "Grade 10"
  | "Grade 11"
  | "Grade 12";

export type AnnouncementPriority =
  | "Low"
  | "Medium"
  | "High";

export interface Announcement {
  id: string;

  title: string;

  description: string;

  target: AnnouncementTarget;

  priority: AnnouncementPriority;

  publishDate: string;

  createdBy: string;

  attachments?: string[];

  delivered: number;

  opened: number;
}