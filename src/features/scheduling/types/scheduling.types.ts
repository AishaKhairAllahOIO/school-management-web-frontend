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
  grade: string;
  day: WeekDay;
  timeSlotId: string;
  subject: string;
  teacherName: string;
  room: string;
};

export type ExamScheduleItem = {
  id: string;
  gradeId: string;
  classroomId: string;
  subjectId: string;
  date: string;
  startTime: string;
  duration: string;
  room: string;
  status: "scheduled" | "completed" | "cancelled";
};

export type QuizScheduleItem = {
  id: string;
  gradeId: string;
  classroomId: string;
  subjectId: string;
  date: string;
  lesson: string;
  status: "scheduled" | "completed" | "cancelled";
};

export type UpcomingClassItem = {
  id: string;
  day: WeekDay;
  time: string;
  subject: string;
  teacherName: string;
  room: string;
};
