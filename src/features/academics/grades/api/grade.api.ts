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
  async list(): Promise<Grade[]> {
    const response = await axiosClient.get<ApiResponse<Grade[]>>(
      API_ENDPOINTS.SETTINGS.ACADEMIC_GRADES,
    );

    return response.data.data ?? [];
  },

  async getById(id: string): Promise<Grade> {
    const response = await axiosClient.get<ApiResponse<Grade>>(
      API_ENDPOINTS.SETTINGS.ACADEMIC_GRADE(id),
    );

    return requireGrade(
      response.data.data,
      "The selected grade was not returned by the server.",
    );
  },

  async create(payload: CreateGradePayload): Promise<Grade> {
    const response = await axiosClient.post<ApiResponse<Grade>>(
      API_ENDPOINTS.SETTINGS.ACADEMIC_GRADES,
      payload,
    );

    return requireGrade(
      response.data.data,
      "The created grade was not returned by the server.",
    );
  },

  async update(
    id: string,
    payload: UpdateGradePayload,
  ): Promise<Grade> {
    const response = await axiosClient.post<ApiResponse<Grade>>(
      API_ENDPOINTS.SETTINGS.ACADEMIC_GRADE(id),
      payload,
    );

    return requireGrade(
      response.data.data,
      "The updated grade was not returned by the server.",
    );
  },

  async delete(id: string): Promise<void> {
    await axiosClient.delete(
      API_ENDPOINTS.SETTINGS.ACADEMIC_GRADE(id),
    );
  },
};
