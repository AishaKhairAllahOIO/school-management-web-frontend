import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import type {
  CreateGradePayload,
  Grade,
  UpdateGradePayload,
} from "../types/grade.types";

function requireGrade(
  grade: Grade | undefined,
  errorMessage: string,
): Grade {
  if (!grade) {
    throw new Error(errorMessage);
  }

  return grade;
}

export const gradeApi = {
  /**
   * There is currently no documented GET endpoint
   * for listing grades.
   *
   * Do not return mock rows here because their IDs
   * cannot be used with the real update endpoint.
   */
  async list(): Promise<Grade[]> {
    return [];
  },

  async create(
    payload: CreateGradePayload,
  ): Promise<Grade> {
    const response =
      await axiosClient.post<ApiResponse<Grade>>(
        API_ENDPOINTS.SETTINGS.ACADEMIC_GRADES,
        payload,
      );

    return requireGrade(
      response.data.data,
      "Created grade was not returned by the server.",
    );
  },

  async update(
    id: string,
    payload: UpdateGradePayload,
  ): Promise<Grade> {
    const response =
      await axiosClient.post<ApiResponse<Grade>>(
        API_ENDPOINTS.SETTINGS.ACADEMIC_GRADE(id),
        payload,
      );

    return requireGrade(
      response.data.data,
      "Updated grade was not returned by the server.",
    );
  },
};