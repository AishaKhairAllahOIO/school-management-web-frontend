export type SchoolDay =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type AcademicStageType = string;

export type AcademicYear = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AcademicTerm = {
  id: string;
  academicYearId: string;
  semesterName: string;
  startDate: string;
  endDate: string;
  order: number;
  isCurrent: boolean;
  isFinalTerm: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AcademicStage = {
  id: string;
  type: AcademicStageType;
  createdAt: string;
  updatedAt: string;
};

export type SchoolBreak = {
  id: string;
  afterPeriodIndex: number;
  durationMinutes: number;
};

export type SchoolDayConfiguration = {
  day: SchoolDay;
  periodsCount: number;
};

export type SchoolScheduleSettings = {
  dayStartTime: string;
  periodDurationMinutes: number;
  workingDays: SchoolDayConfiguration[];
  breaks: SchoolBreak[];
};

export type SchoolDayScheduleSettings =
  SchoolScheduleSettings;

export type AcademicSettings = {
  id: string;
  currentAcademicYearId: string;
  currentSemesterId: string;
  scheduleSettings: SchoolScheduleSettings;
  createdAt: string;
  updatedAt: string;
};

export type UpdateAcademicSettingsPayload = {
  currentAcademicYearId: number;
  currentSemesterId: number;
  scheduleSettings: SchoolScheduleSettings;
};

export type AcademicSettingsViewData = {
  settings: AcademicSettings;
  academicYears: AcademicYear[];
  academicTerms: AcademicTerm[];
  academicStages: AcademicStage[];
};

export type CreateAcademicYearPayload = {
  startDate: string;
  endDate: string;
  isCurrent: boolean;
};

export type UpdateAcademicYearPayload =
  Partial<CreateAcademicYearPayload>;

export type CreateAcademicTermPayload = {
  academicYearId: number;
  semesterName: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isFinalTerm: boolean;
};

export type UpdateAcademicTermPayload =
  Partial<Omit<CreateAcademicTermPayload, "academicYearId">>;

export type CreateAcademicStagePayload = {
  type: string;
};

export type UpdateAcademicStagePayload =
  Partial<CreateAcademicStagePayload>;