import {axiosClient} from "@/services/axios/axiosClient";

import { API_ENDPOINTS } from "@/services/api/endpoints";

import type {
  GenerateScheduleParams,
  UpdateScheduleEntryPayload,
} from "../types/schedule.types";

export const schedulingApi = {
  generate: async (
    params: GenerateScheduleParams,
  ) => {
    const response = await axiosClient.post(
      API_ENDPOINTS.SCHEDULING.GENERATE,
      null,
      {
        params: {
          academic_year_id:
            params.academic_year_id,
          semester_id:
            params.semester_id,
        },
      },
    );

    return response.data;
  },

  regenerate: async (
    params: GenerateScheduleParams,
  ) => {
    const response = await axiosClient.post(
      API_ENDPOINTS.SCHEDULING.REGENERATE,
      null,
      {
        params: {
          academic_year_id:
            params.academic_year_id,
          semester_id:
            params.semester_id,
        },
      },
    );

    return response.data;
  },

 getAdminSchedule: async (
  params: GenerateScheduleParams,
) => {
  const response = await axiosClient.get(
    API_ENDPOINTS.SCHEDULING.ADMIN_VIEW(
      params.academic_year_id,
      params.semester_id,
    ),
  );

  return response.data.data;
},

 getTeachersSchedule: async (
    params: GenerateScheduleParams,
  ) => {
    const response = await axiosClient.get(
      API_ENDPOINTS.SCHEDULING.TEACHER_VIEW(
        params.academic_year_id,
        params.semester_id,
      ),
    );

    return response.data.data;
  },

  updateEntry: async (
    entryId: number | string,
    payload: UpdateScheduleEntryPayload,
  ) => {
    const response = await axiosClient.put(
      API_ENDPOINTS.SCHEDULING.UPDATE_ENTRY(
        entryId,
      ),
      payload,
    );

    return response.data;
  },
};