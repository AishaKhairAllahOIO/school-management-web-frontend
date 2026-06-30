import { createMockResourceApi } from "../../shared/api/mockAcademicsStore";
import type { Subject, CreateSubjectPayload, UpdateSubjectPayload } from "../types/subject.types";

export const subjectApi = createMockResourceApi<Subject, CreateSubjectPayload, UpdateSubjectPayload>(
  "subjects",
  "subject"
);
