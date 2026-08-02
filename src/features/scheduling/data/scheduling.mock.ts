import type {
  ExamScheduleItem,
  QuizScheduleItem,
  TimeSlot,
  UpcomingClassItem,
  WeekDay,
} from "@/features/scheduling/types/scheduling.types";

export const weekDays: WeekDay[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Saturday",
];

export const timeSlots: TimeSlot[] = [
  { id: "slot-1", start: "08:00", end: "08:45" },
  { id: "slot-2", start: "08:55", end: "09:40" },
  { id: "slot-3", start: "09:50", end: "10:35" },
  { id: "slot-4", start: "10:45", end: "11:30" },
  { id: "slot-5", start: "11:40", end: "12:25" },
  { id: "slot-6", start: "12:35", end: "13:20" },
  { id: "slot-7", start: "13:30", end: "14:15" },
];

export const upcomingClasses: UpcomingClassItem[] = [];

/*
 * Exam and quiz records remain local until their backend endpoints are ready.
 * Grades, classrooms and subjects are now selected from the Academics feature.
 */
export const examSchedules: ExamScheduleItem[] = [];
export const quizSchedules: QuizScheduleItem[] = [];
