import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "../../shared/types/api.types";
import type {
  CreateTeacherWorkloadPayload,
  TeacherWorkload,
  TeacherWorkloadApiItem,
  UpdateTeacherWorkloadPayload,
} from "../types/teacher-workload.types";

function unwrap<T>(value: ApiResponse<T> | T): T {
  if (value && typeof value === "object" && "data" in value) {
    return (value as ApiResponse<T>).data;
  }
  return value as T;
}

function mapItem(item: TeacherWorkloadApiItem): TeacherWorkload {
  return {
    id: String(item.id),
    academicYearId: String(item.academicYearId ?? item.academic_year_id ?? ""),
    teacherId: String(item.teacherId ?? item.teacher_id ?? ""),
    requiredMonthlyPeriods: Number(item.requiredMonthlyPeriods ?? item.required_monthly_periods ?? 0),
    assignedMonthlyPeriods: Number(item.assignedMonthlyPeriods ?? item.assigned_monthly_periods ?? 0),
    remainingMonthlyPeriods: Number(item.remainingMonthlyPeriods ?? item.remaining_monthly_periods ?? 0),
    createdAt: item.createdAt ?? item.created_at ?? "",
    updatedAt: item.updatedAt ?? item.updated_at ?? "",
  };
}

function createPayload(values: CreateTeacherWorkloadPayload) {
  return {
    academic_year_id: Number(values.academicYearId),
    teacher_id: Number(values.teacherId),
    required_monthly_periods: values.requiredMonthlyPeriods,
  };
}

function updatePayload(values: UpdateTeacherWorkloadPayload) {
  return {
    ...(values.academicYearId !== undefined
      ? { academic_year_id: Number(values.academicYearId) }
      : {}),
    ...(values.teacherId !== undefined
      ? { teacher_id: Number(values.teacherId) }
      : {}),
    ...(values.requiredMonthlyPeriods !== undefined
      ? { required_monthly_periods: values.requiredMonthlyPeriods }
      : {}),
  };
}

export const teacherWorkloadApi = {
  async list(teacherId: string): Promise<TeacherWorkload[]> {
    const response = await axiosClient.get<ApiResponse<TeacherWorkloadApiItem[]>>(
      `/admin/staff/${teacherId}/workloads`,
    );
    return (unwrap(response.data) ?? []).map(mapItem);
  },

  async create(payload: CreateTeacherWorkloadPayload): Promise<TeacherWorkload> {
    const response = await axiosClient.post<ApiResponse<TeacherWorkloadApiItem>>(
      `/admin/staff/${payload.teacherId}/workloads`,
      createPayload(payload),
    );
    return mapItem(unwrap(response.data));
  },

  async update(id: string, payload: UpdateTeacherWorkloadPayload): Promise<TeacherWorkload> {
    if (!payload.teacherId) {
      throw new Error("Teacher is required to update a workload.");
    }
    const response = await axiosClient.post<ApiResponse<TeacherWorkloadApiItem>>(
      `/admin/staff/${payload.teacherId}/workloads/${id}`,
      updatePayload(payload),
    );
    return mapItem(unwrap(response.data));
  },

  async remove(id: string, teacherId: string): Promise<void> {
    await axiosClient.delete(`/admin/staff/${teacherId}/workloads/${id}`);
  },
};
