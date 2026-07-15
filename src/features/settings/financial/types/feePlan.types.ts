import type { AcademicYear } from "../../academic/types/academic-settings.types";
import type { GradeLevel } from "./gradeLevel.types";
import type { InstallmentPolicy } from "./installmentPolicy.types";
import type { ExtraService } from "./extraService.types";

export type FeePlan = {
  id: number;

  academicYearId: number;

  gradeLevelId: number;

  name: string;

  baseAmount: number;

  createdAt: string;

  updatedAt: string;

  academicYear?: AcademicYear;

  gradeLevel?: GradeLevel;

  installmentPolicy?: InstallmentPolicy | null;

  extraServices: ExtraService[];
};

export type FeePlanExtraService = ExtraService;