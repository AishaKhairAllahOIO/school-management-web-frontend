import type { Notification } from "../types/notification.types";

export const notificationsMock: Notification[] = [
  {
    id: "1",
    title: "Exam schedule published",
    description: "The term 2 exam timetable is now available for all students.",
    category: "Academics",
    date: "2026-06-10",
    isUnread: true,
  },
  {
    id: "2",
    title: "New school announcement",
    description: "The principal posted a new announcement for the whole school.",
    category: "General",
    date: "2026-06-09",
    isUnread: false,
  },
  {
    id: "3",
    title: "Attendance alert",
    description: "A student absence was recorded for grade 8 today.",
    category: "Attendance",
    date: "2026-06-09",
    isUnread: true,
  },
  {
    id: "4",
    title: "Fee payment reminder",
    description: "The next tuition payment deadline is approaching.",
    category: "Finance",
    date: "2026-06-08",
    isUnread: false,
  },
];
