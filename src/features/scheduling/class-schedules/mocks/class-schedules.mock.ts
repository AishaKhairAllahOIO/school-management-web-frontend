import type {
  ClassSchedule,
  TimeSlot,
  WeekDay,
} from "@/features/scheduling/class-schedules/types/class-schedule.types";

export const weekDays: WeekDay[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
];

export const timeSlots: TimeSlot[] = [
  { id: "slot-1", start: "08:00", end: "08:45", label: "08:00 - 08:45" },
  { id: "slot-2", start: "08:50", end: "09:35", label: "08:50 - 09:35" },
  { id: "slot-3", start: "09:45", end: "10:30", label: "09:45 - 10:30" },
  { id: "slot-4", start: "10:35", end: "11:20", label: "10:35 - 11:20" },
  { id: "slot-5", start: "11:30", end: "12:15", label: "11:30 - 12:15" },
  { id: "slot-6", start: "12:20", end: "13:05", label: "12:20 - 13:05" },
];

export const classSchedulesMock: ClassSchedule[] = [
  {
    id: "schedule-1",
    classroomId: "classroom-7-a",
    subjectId: "subject-math",
    teacherId: "teacher-1",
    day: "Sunday",
    timeSlotId: "slot-1",
    roomNumber: "101",
    academicYearId: "year-2024-2025",
    status: "upcoming",
    createdAt: "2025-01-01T10:00:00.000Z",
    updatedAt: "2025-01-01T10:00:00.000Z",
  },
  {
    id: "schedule-2",
    classroomId: "classroom-7-a",
    subjectId: "subject-english",
    teacherId: "teacher-2",
    day: "Monday",
    timeSlotId: "slot-2",
    roomNumber: "101",
    academicYearId: "year-2024-2025",
    status: "upcoming",
    createdAt: "2025-01-01T10:00:00.000Z",
    updatedAt: "2025-01-01T10:00:00.000Z",
  },
  {
    id: "schedule-3",
    classroomId: "classroom-8-a",
    subjectId: "subject-science",
    teacherId: "teacher-3",
    day: "Tuesday",
    timeSlotId: "slot-3",
    roomNumber: "102",
    academicYearId: "year-2024-2025",
    status: "upcoming",
    createdAt: "2025-01-01T10:00:00.000Z",
    updatedAt: "2025-01-01T10:00:00.000Z",
  },
  {
    id: "schedule-4",
    classroomId: "classroom-9-a",
    subjectId: "subject-arabic",
    teacherId: "teacher-4",
    day: "Wednesday",
    timeSlotId: "slot-4",
    roomNumber: "103",
    academicYearId: "year-2024-2025",
    status: "upcoming",
    createdAt: "2025-01-01T10:00:00.000Z",
    updatedAt: "2025-01-01T10:00:00.000Z",
  },
];