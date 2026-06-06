import type {
  ClassScheduleCell,
  ExamScheduleItem,
  QuizScheduleItem,
  TimeSlot,
  UpcomingClassItem,
  WeekDay,
} from "@/features/scheduling/types/scheduling.types";

export const schoolGrades = ["seventh", "eighth", "ninth"] as const;

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

const subjects = [
  "arabic",
  "english",
  "math",
  "science",
  "french",
  "national",
  "sports",
] as const;

export const classSchedules: ClassScheduleCell[] = timeSlots.flatMap(
  (slot, slotIndex) =>
    weekDays.map((day, dayIndex) => ({
      id: `${slot.id}-${day}`,
      grade: "seventh",
      day,
      timeSlotId: slot.id,
      subject: subjects[(slotIndex + dayIndex) % subjects.length],
      teacherName: [
        "Ms. Aisha Ali",
        "Mr. John Smith",
        "Mr. Ahmad Hassan",
        "Ms. Sara Mocha",
      ][(slotIndex + dayIndex) % 4],
      room: `${101 + ((slotIndex + dayIndex) % 6)}`,
    }))
);

export const upcomingClasses: UpcomingClassItem[] = [
  {
    id: "upcoming-1",
    day: "Monday",
    time: "08:00 - 08:45",
    subject: "english",
    teacherName: "Mr. John Smith",
    room: "101",
  },
  {
    id: "upcoming-2",
    day: "Monday",
    time: "08:55 - 09:40",
    subject: "arabic",
    teacherName: "Ms. Aisha Ali",
    room: "102",
  },
  {
    id: "upcoming-3",
    day: "Monday",
    time: "09:50 - 10:35",
    subject: "math",
    teacherName: "Mr. Ahmad Hassan",
    room: "103",
  },
  {
    id: "upcoming-4",
    day: "Monday",
    time: "10:45 - 11:30",
    subject: "science",
    teacherName: "Ms. Sara Mocha",
    room: "105",
  },
];

export const examSchedules: ExamScheduleItem[] = [
  {
    id: "exam-1",
    grade: "seventh",
    subject: "arabic",
    date: "2026-06-02",
    startTime: "09:00",
    duration: "90 min",
    room: "Hall A",
    status: "scheduled",
  },
  {
    id: "exam-2",
    grade: "seventh",
    subject: "math",
    date: "2026-06-04",
    startTime: "09:00",
    duration: "90 min",
    room: "Hall B",
    status: "scheduled",
  },
  {
    id: "exam-3",
    grade: "seventh",
    subject: "science",
    date: "2026-06-07",
    startTime: "10:00",
    duration: "75 min",
    room: "Lab 1",
    status: "scheduled",
  },
];

export const quizSchedules: QuizScheduleItem[] = [
  {
    id: "quiz-1",
    grade: "seventh",
    subject: "physics",
    date: "2026-06-01",
    lesson: "Unit 3",
    teacherName: "Mr. Ahmad Hassan",
    status: "scheduled",
  },
  {
    id: "quiz-2",
    grade: "seventh",
    subject: "english",
    date: "2026-06-03",
    lesson: "Grammar",
    teacherName: "Mr. John Smith",
    status: "scheduled",
  },
  {
    id: "quiz-3",
    grade: "seventh",
    subject: "arabic",
    date: "2026-06-05",
    lesson: "Reading",
    teacherName: "Ms. Aisha Ali",
    status: "scheduled",
  },
];