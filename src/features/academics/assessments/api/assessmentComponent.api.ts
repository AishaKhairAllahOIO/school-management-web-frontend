import { createMockResourceApi } from "../../shared/api/mockAcademicsStore";
import type { AssessmentComponent, CreateAssessmentComponentPayload, UpdateAssessmentComponentPayload } from "../types/assessment-component.types";

export const assessmentComponentApi = createMockResourceApi<AssessmentComponent, CreateAssessmentComponentPayload, UpdateAssessmentComponentPayload>(
  "assessmentComponents",
  "assessment"
);
