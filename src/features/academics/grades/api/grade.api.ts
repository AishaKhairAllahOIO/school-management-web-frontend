import { createMockResourceApi } from "../../shared/api/mockAcademicsStore";
import type { Grade, CreateGradePayload, UpdateGradePayload } from "../types/grade.types";

export const gradeApi = createMockResourceApi<Grade, CreateGradePayload, UpdateGradePayload>(
  "grades",
  "grade"
);
