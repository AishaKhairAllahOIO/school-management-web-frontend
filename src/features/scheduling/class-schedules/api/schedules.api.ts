import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import type {
  AdminSchedule,
  GenerateSchedulePayload,
  TeacherSchedule,
  UpdateScheduleEntryPayload,
} from "../types/schedule.types";

function requireResponseData<T>(
  data: T | undefined,
  message: string,
): T {
  if (data === undefined) {
    throw new Error(message);
  }

  return data;
}

export const schedulesApi = {
  async generate(
    payload: GenerateSchedulePayload,
  ): Promise<null> {
    const response = await axiosClient.post<
      ApiResponse<null>
    >(
      API_ENDPOINTS.SCHEDULING.GENERATE,
      payload,
    );

    return response.data.data ?? null;
  },

  async regenerate(
    payload: GenerateSchedulePayload,
  ): Promise<null> {
    const response = await axiosClient.post<
      ApiResponse<null>
    >(
      API_ENDPOINTS.SCHEDULING.REGENERATE,
      payload,
    );

    return response.data.data ?? null;
  },

  async getAdminSchedule(
    payload: GenerateSchedulePayload,
  ): Promise<AdminSchedule> {
    const response =
      await axiosClient.get<
        ApiResponse<AdminSchedule>
      >(
        API_ENDPOINTS.SCHEDULING.ADMIN_VIEW,
        {
          params: {
            academic_year_id:
              payload.academic_year_id,
            semester_id:
              payload.semester_id,
          },
        },
      );

    return requireResponseData(
      response.data.data,
      "Schedule was not returned by the server.",
    );
  },

  async getTeacherSchedule(
    payload: GenerateSchedulePayload,
  ): Promise<TeacherSchedule> {
    const response =
      await axiosClient.get<
        ApiResponse<TeacherSchedule>
      >(
        API_ENDPOINTS.SCHEDULING.TEACHER_VIEW,
        {
          params: {
            academic_year_id:
              payload.academic_year_id,
            semester_id:
              payload.semester_id,
          },
        },
      );

    return requireResponseData(
      response.data.data,
      "Teacher schedules were not returned by the server.",
    );
  },

  async updateEntry(
    entryId: number | string,
    payload: UpdateScheduleEntryPayload,
  ) {
    const response =
      await axiosClient.put<
        ApiResponse<unknown>
      >(
        API_ENDPOINTS.SCHEDULING.UPDATE_ENTRY(
          entryId,
        ),
        payload,
      );

    return requireResponseData(
      response.data.data,
      "Updated schedule entry was not returned by the server.",
    );
  },
};