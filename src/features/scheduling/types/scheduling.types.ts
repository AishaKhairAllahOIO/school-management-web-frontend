import type {
  SchoolGrade,
  SchoolSubject,
} from "@/features/settings/school-config/types/school.enums";

export type ScheduleType = "classes" | "teachers" | "exams" | "quizzes" | "holidays";

export type WeekDay =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Saturday";

export type TimeSlot = {
  id: string;
  start: string;
  end: string;
};

export type ClassScheduleCell = {
  id: string;
  grade: SchoolGrade;
  day: WeekDay;
  timeSlotId: string;
  subject: SchoolSubject;
  teacherName: string;
  room: string;
};

export type ExamScheduleItem = {
  id: string;
  grade: SchoolGrade;
  subject: SchoolSubject;
  date: string;
  startTime: string;
  duration: string;
  room: string;
  status: "scheduled" | "completed" | "cancelled";
};

export type QuizScheduleItem = {
  id: string;
  grade: SchoolGrade;
  subject: SchoolSubject;
  date: string;
  lesson: string;
  teacherName: string;
  status: "scheduled" | "completed" | "cancelled";
};

export type UpcomingClassItem = {
  id: string;
  day: WeekDay;
  time: string;
  subject: SchoolSubject;
  teacherName: string;
  room: string;
};