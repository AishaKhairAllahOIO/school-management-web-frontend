export type SchoolDay =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type AcademicStageType = "primary" | "middle" | "secondary";

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

export type SchoolDayScheduleSettings = {
  workingDays: SchoolDayConfiguration[];
  dayStartTime: string;
  periodDurationMinutes: number;
  breaks: SchoolBreak[];
};

export type AcademicSettings = {
  id: string;
  currentAcademicYearId: string;
  currentAcademicTermId: string;
  scheduleSettings: SchoolDayScheduleSettings;
  createdAt: string;
  updatedAt: string;
};

export type UpdateAcademicSettingsPayload = Omit<
  AcademicSettings,
  "id" | "createdAt" | "updatedAt"
>;

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

export type UpdateAcademicYearPayload = Partial<CreateAcademicYearPayload>;

export type CreateAcademicTermPayload = {
  academicYearId: string;
  startDate: string;
  endDate: string;
  order: number;
  isCurrent: boolean;
  isFinalTerm: boolean;
};

export type UpdateAcademicTermPayload = Partial<CreateAcademicTermPayload>;

export type CreateAcademicStagePayload = {
  type: AcademicStageType;
};

export type UpdateAcademicStagePayload = Partial<CreateAcademicStagePayload>;
