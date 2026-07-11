import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import type {
  CreateGradeConfigurationApiPayload,
  CreateGradeConfigurationPayload,
  GradeConfiguration,
  UpdateGradeConfigurationApiPayload,
  UpdateGradeConfigurationPayload,
} from "../types/grade-configuration.types";

function requireConfiguration(
  configuration: GradeConfiguration | undefined,
  errorMessage: string,
): GradeConfiguration {
  if (!configuration) {
    throw new Error(errorMessage);
  }

  return configuration;
}

function toCreateApiPayload(
  payload: CreateGradeConfigurationPayload,
): CreateGradeConfigurationApiPayload {
  return {
    academicYearId: payload.academicYearId,
    grade_level_id: payload.gradeId,
    supervisor_id: payload.supervisorId,
    planned_classrooms_count:
      payload.plannedClassroomsCount,
  };
}

function toUpdateApiPayload(
  payload: UpdateGradeConfigurationPayload,
): UpdateGradeConfigurationApiPayload {
  const apiPayload: UpdateGradeConfigurationApiPayload = {};

  if (payload.supervisorId !== undefined) {
    apiPayload.supervisor_id = payload.supervisorId;
  }

  if (payload.plannedClassroomsCount !== undefined) {
    apiPayload.planned_classrooms_count =
      payload.plannedClassroomsCount;
  }

  return apiPayload;
}

export const gradeConfigurationApi = {
  /**
   * No list endpoint is documented by the backend.
   * Do not use mock rows with real update requests.
   */
  async list(): Promise<GradeConfiguration[]> {
    return [];
  },

  async create(
    payload: CreateGradeConfigurationPayload,
  ): Promise<GradeConfiguration> {
    const response =
      await axiosClient.post<
        ApiResponse<GradeConfiguration>
      >(
        API_ENDPOINTS.SETTINGS
          .ACADEMIC_CONFIGURATIONS,
        toCreateApiPayload(payload),
      );

    return requireConfiguration(
      response.data.data,
      "Created grade configuration was not returned by the server.",
    );
  },

  async update(
    id: string,
    payload: UpdateGradeConfigurationPayload,
  ): Promise<GradeConfiguration> {
    const response =
      await axiosClient.post<
        ApiResponse<GradeConfiguration>
      >(
        API_ENDPOINTS.SETTINGS
          .ACADEMIC_CONFIGURATION(id),
        toUpdateApiPayload(payload),
      );

    return requireConfiguration(
      response.data.data,
      "Updated grade configuration was not returned by the server.",
    );
  },
};