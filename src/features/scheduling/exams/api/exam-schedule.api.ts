import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";

import type {
  AdminExam,
  ExamFormData,
  ExamSetupSubject,
} from "../types/exam-schedule.types";

interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export async function getAdminExams(
  academicYearId: number | string,
  semesterId: number | string,
) {
  const response = await axiosClient.get<ApiResponse<AdminExam[]>>(
    API_ENDPOINTS.EXAM_SCHEDULE.ADMIN_VIEW(
      academicYearId,
      semesterId,
    ),
  );

  return response.data.data;
}

export async function getExamSetup(
  gradeLevelId: number | string,
) {
  const response = await axiosClient.get<ApiResponse<ExamSetupSubject[]>>(
    API_ENDPOINTS.EXAM_SCHEDULE.FORM_SETUP(gradeLevelId),
  );

  return response.data.data;
}

export async function createExamSchedule(
  data: ExamFormData,
) {
  const response = await axiosClient.post(
    API_ENDPOINTS.EXAM_SCHEDULE.STORE,
    data,
  );

  return response.data;
}

export async function updateExamSchedule(
  examId: number | string,
  data: ExamFormData,
) {
  const response = await axiosClient.put(
    API_ENDPOINTS.EXAM_SCHEDULE.UPDATE(examId),
    data,
  );

  return response.data;
}

export async function deleteExamSchedule(
  examId: number | string,
) {
  const response = await axiosClient.delete(
    API_ENDPOINTS.EXAM_SCHEDULE.DELETE(examId),
  );

  return response.data;
}