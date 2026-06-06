import type {
  Announcement,
} from "../types/announcement.types";

export const announcementsMock: Announcement[] = [
  {
    id: "1",

    title:
      "Second Semester Exams",

    description:
      "The exam schedule for Grade 10 students has been published.",

    target: "Grade 10",

    priority: "High",

    publishDate:
      "2026-02-15",

    createdBy:
      "Administrator",

    delivered: 350,

    opened: 290,
  },

  {
    id: "2",

    title:
      "Parent Meeting",

    description:
      "A parent-teacher meeting will be held next week.",

    target:
      "All Parents",

    priority:
      "Medium",

    publishDate:
      "2026-02-12",

    createdBy:
      "Principal",

    delivered: 1200,

    opened: 850,
  },

  {
    id: "3",

    title:
      "Staff Workshop",

    description:
      "Mandatory training workshop for all staff members.",

    target:
      "All Staff",

    priority:
      "High",

    publishDate:
      "2026-02-10",

    createdBy:
      "HR Manager",

    delivered: 120,

    opened: 108,
  },
];