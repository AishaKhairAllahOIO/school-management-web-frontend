import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "../../shared/types/api.types";
import type {
  CreateTeacherAssignmentPayload,
  TeacherAssignment,
  TeacherAssignmentApiItem,
  UpdateTeacherAssignmentPayload,
} from "../types/teacher-assignment.types";

function unwrap<T>(value: ApiResponse<T> | T): T {
  if (value && typeof value === "object" && "data" in value) {
    return (value as ApiResponse<T>).data;
  }
  return value as T;
}

function mapItem(item: TeacherAssignmentApiItem): TeacherAssignment {
  return {
    id: String(item.id),
    academicYearId: String(item.academicYearId ?? item.academic_year_id ?? ""),
    academicTermId: String(item.academicTermId ?? item.semesterId ?? item.semester_id ?? ""),
    teacherId: String(item.teacherId ?? item.teacher_id ?? ""),
    gradeSubjectId: String(item.gradeSubjectId ?? item.grade_subject_id ?? ""),
    classroomId: String(item.classroomId ?? item.classRoomId ?? item.class_room_id ?? ""),
    createdAt: item.createdAt ?? item.created_at ?? "",
    updatedAt: item.updatedAt ?? item.updated_at ?? "",
  };
}

export const teacherAssignmentApi = {
  async list(teacherId: string): Promise<TeacherAssignment[]> {
    const response = await axiosClient.get<ApiResponse<TeacherAssignmentApiItem[]>>(
      `/admin/staff/${teacherId}/assignments`,
    );
    return (unwrap(response.data) ?? []).map(mapItem);
  },

  async create(payload: CreateTeacherAssignmentPayload): Promise<TeacherAssignment[]> {
    const response = await axiosClient.post<ApiResponse<TeacherAssignmentApiItem[]>>(
      `/admin/staff/${payload.teacherId}/assignments`,
      {
        academic_year_id: Number(payload.academicYearId),
        semester_id: Number(payload.academicTermId),
        teacher_id: Number(payload.teacherId),
        grade_subject_id: Number(payload.gradeSubjectId),
        class_room_ids: payload.classroomIds.map(Number),
      },
    );
    return (unwrap(response.data) ?? []).map(mapItem);
  },

  async update(id: string, payload: UpdateTeacherAssignmentPayload): Promise<TeacherAssignment> {
    if (!payload.teacherId) throw new Error("Teacher is required to update an assignment.");
    const response = await axiosClient.post<ApiResponse<TeacherAssignmentApiItem>>(
      `/admin/staff/${payload.teacherId}/assignments/${id}`,
      {
        ...(payload.academicYearId !== undefined ? { academic_year_id: Number(payload.academicYearId) } : {}),
        ...(payload.academicTermId !== undefined
          ? { academic_term_id: Number(payload.academicTermId), semester_id: Number(payload.academicTermId) }
          : {}),
        ...(payload.teacherId !== undefined ? { teacher_id: Number(payload.teacherId) } : {}),
        ...(payload.gradeSubjectId !== undefined ? { grade_subject_id: Number(payload.gradeSubjectId) } : {}),
        ...(payload.classroomId !== undefined
          ? { classroom_id: Number(payload.classroomId), class_room_id: Number(payload.classroomId) }
          : {}),
      },
    );
    return mapItem(unwrap(response.data));
  },

  async remove(id: string, teacherId: string): Promise<void> {
    await axiosClient.delete(`/admin/staff/${teacherId}/assignments/${id}`);
  },
};
