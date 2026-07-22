import {
  API_ENDPOINTS,
} from "@/services/api/endpoints";

import type {
  ApiId,
} from "../../shared/types/api.types";

export const gradeSubjectEndpoints = {
  list:
    API_ENDPOINTS.ACADEMICS
      .GRADE_SUBJECTS.LIST,

  details: (
    gradeSubjectId: ApiId,
  ) =>
    API_ENDPOINTS.ACADEMICS
      .GRADE_SUBJECTS.DETAILS(
        gradeSubjectId,
      ),

  create:
    API_ENDPOINTS.ACADEMICS
      .GRADE_SUBJECTS.CREATE,

  update: (
    gradeSubjectId: ApiId,
  ) =>
    API_ENDPOINTS.ACADEMICS
      .GRADE_SUBJECTS.UPDATE(
        gradeSubjectId,
      ),

  remove: (
    gradeSubjectId: ApiId,
  ) =>
    API_ENDPOINTS.ACADEMICS
      .GRADE_SUBJECTS.DELETE(
        gradeSubjectId,
      ),
} as const;