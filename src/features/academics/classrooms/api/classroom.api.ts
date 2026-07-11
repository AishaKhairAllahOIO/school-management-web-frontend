import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import type {
  Classroom,
  CreateClassroomApiPayload,
  CreateClassroomPayload,
  UpdateClassroomApiPayload,
  UpdateClassroomPayload,
} from "../types/classroom.types";

function requireClassroom(
  classroom: Classroom | undefined,
  errorMessage: string,
): Classroom {
  if (!classroom) {
    throw new Error(errorMessage);
  }

  return classroom;
}

function toCreateApiPayload(
  payload: CreateClassroomPayload,
): CreateClassroomApiPayload {
  return {
    academicYearId: payload.academicYearId,
    grade_level_id: payload.gradeId,
    capacity: payload.capacity,
  };
}

function toUpdateApiPayload(
  payload: UpdateClassroomPayload,
): UpdateClassroomApiPayload {
  const apiPayload: UpdateClassroomApiPayload = {};

  if (payload.capacity !== undefined) {
    apiPayload.capacity = payload.capacity;
  }

  return apiPayload;
}

export const classroomApi = {
  /**
   * The provided backend documentation does not
   * define a GET endpoint for listing classrooms.
   */
  async list(): Promise<Classroom[]> {
    return [];
  },

  async create(
    payload: CreateClassroomPayload,
  ): Promise<Classroom> {
    const response =
      await axiosClient.post<ApiResponse<Classroom>>(
        API_ENDPOINTS.SETTINGS.ACADEMIC_CLASSROOMS,
        toCreateApiPayload(payload),
      );

    return requireClassroom(
      response.data.data,
      "Created classroom was not returned by the server.",
    );
  },

  async update(
    id: string,
    payload: UpdateClassroomPayload,
  ): Promise<Classroom> {
    const response =
      await axiosClient.post<ApiResponse<Classroom>>(
        API_ENDPOINTS.SETTINGS.ACADEMIC_CLASSROOM(id),
        toUpdateApiPayload(payload),
      );

    return requireClassroom(
      response.data.data,
      "Updated classroom was not returned by the server.",
    );
  },
};