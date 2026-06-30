import { createMockResourceApi } from "../../shared/api/mockAcademicsStore";
import type { GradeSubject, CreateGradeSubjectPayload, UpdateGradeSubjectPayload } from "../types/grade-subject.types";

export const gradeSubjectApi = createMockResourceApi<GradeSubject, CreateGradeSubjectPayload, UpdateGradeSubjectPayload>(
  "gradeSubjects",
  "grade-subject"
);
