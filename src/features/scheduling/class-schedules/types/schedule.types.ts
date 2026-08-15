export type ScheduleDay =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type ScheduleViolation = {
  type: string;

  subject?: number | string;

  class?: number | string;

  class_room_id?: number | string;

  day?: ScheduleDay;

  count?: number;

  limit?: number;

  grade_name?: string;

  class_room_name?: string;

  [key: string]: unknown;
};

export type ScheduleStatistics = {
  entries: number;
  teacher_conflicts: number;
  class_conflicts: number;
};

export type ScheduleQualityReport = {
  statistics: ScheduleStatistics;
  violations: ScheduleViolation[];
};

export type SchedulePeriod = {
  entry_id: number | string;
  period_index: number;
  subject_name: string | null;
  teacher_name: string | null;
  is_heavy: boolean;
  start_time: string;
  end_time: string;
};

export type ScheduleClass = {
  grade_name: string;
  class_room_name: string;
  schedule: Partial<Record<ScheduleDay, SchedulePeriod[]>>;
};

export type AdminSchedule = {
  id?: number | string;
  is_perfect: boolean;
  quality_report: ScheduleQualityReport;
  classes: ScheduleClass[];
};

export type GenerateSchedulePayload = {
  academic_year_id: number;
  semester_id: number;
};

export type ScheduleViewPayload = {
  academic_year_id: number;
  semester_id: number;
};

export type UpdateScheduleEntryPayload = {
  teacher_id?: number;
  grade_subject_id?: number;
};
export type UpdateScheduleEntryVariables = {
  entryId: number | string;
  payload: UpdateScheduleEntryPayload;
};

export type GenerateScheduleResponse = null;

export type TeacherSchedulePeriod = {
  entry_id: number | string;
  period_index: number;
  subject_name: string;
  classroom: string;
  is_heavy: boolean;
  start_time: string;
  end_time: string;
};

export type TeacherSchedule = Record<
  string,
  Record<string, TeacherSchedulePeriod[]>
>;

export interface GenerateScheduleParams {
  academic_year_id: number;
  semester_id: number;
}
export type AddScheduleEntryPayload = {
  schedule_id: number;
  class_room_id: number;
  teacher_id: number;
  teacher_assignment_id: number;
  grade_subject_id: number;
  day: ScheduleDay;
};

export type AddScheduleEntryVariables = {
  payload: AddScheduleEntryPayload;
};
