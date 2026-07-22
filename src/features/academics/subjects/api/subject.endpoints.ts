import { API_ENDPOINTS } from "@/services/api/endpoints";

import type {
  ApiId,
} from "../../shared/types/api.types";

export const subjectEndpoints = {
  list:
    API_ENDPOINTS.ACADEMICS.SUBJECTS.LIST,

  create:
    API_ENDPOINTS.ACADEMICS.SUBJECTS.CREATE,

  update: (subjectId: ApiId) =>
    API_ENDPOINTS.ACADEMICS.SUBJECTS.UPDATE(
      subjectId,
    ),

  remove: (subjectId: ApiId) =>
    API_ENDPOINTS.ACADEMICS.SUBJECTS.DELETE(
      subjectId,
    ),
} as const;