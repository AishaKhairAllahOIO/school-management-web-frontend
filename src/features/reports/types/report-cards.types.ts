import type {
  ApiId,
} from "../../users/shared/types/api.types";

export type AcademicResult = "passed" | "failed" | "graduated";
export type FinancialStatus = "cleared" | "blocked";

export interface ReportCardRecord {
  student_id: ApiId;
  student_name: string;
  total_marks: number;
  gpa: number;
  academic_result: AcademicResult;
  financial_status: FinancialStatus;
  is_published: boolean;
}

export interface PromoteStats {
  promoted_students_count: number;
  graduated_students_count: number;
  skipped_students_count: number;
  promoted_but_without_class_count: number;
}