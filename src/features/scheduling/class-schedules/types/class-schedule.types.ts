export type WeekDay =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday";

export type ScheduleStatus = "upcoming" | "completed" | "cancelled";

export type TimeSlot = {
  id: string;
  start: string;
  end: string;
  label: string;
};

export type ClassSchedule = {
  id: string;

  classroomId: string;
  subjectId: string;
  teacherId: string;

  day: WeekDay;
  timeSlotId: string;
  roomNumber?: string | null;

  academicYearId: string;
  status: ScheduleStatus;

  createdAt: string;
  updatedAt: string;
};

export type CreateClassSchedulePayload = {
  classroomId: string;
  subjectId: string;
  teacherId: string;
  day: WeekDay;
  timeSlotId: string;
  roomNumber?: string | null;
  academicYearId: string;
  status: ScheduleStatus;
};

export type UpdateClassSchedulePayload = Partial<CreateClassSchedulePayload>;