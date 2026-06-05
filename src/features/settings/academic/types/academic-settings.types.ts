export type AcademicTermStatus = "active" | "upcoming" | "completed";

export type AcademicYear = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
};

export type AcademicTerm = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: AcademicTermStatus;
};

export type GradeScaleItem = {
  id: string;
  grade: string;
  minimumScore: number;
  maximumScore: number;
  description: string;
};

export type AcademicPreferences = {
  autoPromoteStudents: boolean;
  allowStudentRepeating: boolean;
  calculateGpa: boolean;
  rankStudents: boolean;
  useAttendanceInPromotion: boolean;
};

export type AcademicSettings = {
  id: string;

  currentAcademicYearId: string;
  academicYears: AcademicYear[];
  terms: AcademicTerm[];
  gradeScale: GradeScaleItem[];
  preferences: AcademicPreferences;

  passingGrade: string;
  maximumGrade: number;
  gpaScale: "4.0" | "5.0" | "100";
  minimumAttendancePercentage: number;
  promotionThreshold: number;

  createdAt: string;
  updatedAt: string;
};

export type UpdateAcademicSettingsPayload = Omit<
  AcademicSettings,
  "id" | "createdAt" | "updatedAt"
>;