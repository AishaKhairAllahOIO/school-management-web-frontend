import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import type {
  Classroom,
  CreateClassroomPayload,
  UpdateClassroomPayload,
} from "../types/classroom.types";

type ClassroomApiItem = {
  id: string | number;

  academicYearId?: string | number;
  academic_year_id?: string | number;

  gradeId?: string | number;
  gradeLevelId?: string | number;
  grade_level_id?: string | number;

  name: string;

  capacity: number;

  currentStudentsCount?: number;
  current_students_count?: number;

  availableSeats?: number;
  available_seats?: number;

  createdAt?: string;
  created_at?: string;

  updatedAt?: string;
  updated_at?: string;
};

type CreateClassroomRequest = {
  academicYearId: number;
  grade_level_id: number;
  capacity: number;
};

type UpdateClassroomRequest = {
  capacity: number;
};

function mapClassroom(
  item: ClassroomApiItem,
): Classroom {
  return {
    id: String(item.id),

    academicYearId: String(
      item.academicYearId ??
        item.academic_year_id ??
        "",
    ),

    gradeId: String(
      item.gradeId ??
        item.gradeLevelId ??
        item.grade_level_id ??
        "",
    ),

    name: item.name,

    capacity: Number(
      item.capacity ?? 0,
    ),

    currentStudentsCount: Number(
      item.currentStudentsCount ??
        item.current_students_count ??
        0,
    ),

    availableSeats: Number(
      item.availableSeats ??
        item.available_seats ??
        0,
    ),

    createdAt:
      item.createdAt ??
      item.created_at,

    updatedAt:
      item.updatedAt ??
      item.updated_at,
  };
}

function requireClassroom(
  value: ClassroomApiItem | undefined,
  message: string,
): Classroom {
  if (!value) {
    throw new Error(message);
  }

  return mapClassroom(value);
}

function buildCreateRequest(
  payload: CreateClassroomPayload,
): CreateClassroomRequest {
  return {
    /*
     * حسب Validation الحالي في الباك.
     */
    academicYearId:
      payload.academicYearId,

    grade_level_id:
      payload.gradeId,

    capacity:
      payload.capacity,
  };
}

function buildUpdateRequest(
  payload: UpdateClassroomPayload,
): UpdateClassroomRequest {
  if (payload.capacity === undefined) {
    throw new Error(
      "Classroom capacity is required.",
    );
  }

  return {
    capacity:
      payload.capacity,
  };
}

export const classroomApi = {
  async list(): Promise<Classroom[]> {
    const response =
      await axiosClient.get<
        ApiResponse<ClassroomApiItem[]>
      >(
        API_ENDPOINTS.SETTINGS
          .ACADEMIC_CLASSROOMS,
      );

    return (
      response.data.data ?? []
    ).map(mapClassroom);
  },

  async getById(
    id: string,
  ): Promise<Classroom> {
    const response =
      await axiosClient.get<
        ApiResponse<ClassroomApiItem>
      >(
        API_ENDPOINTS.SETTINGS
          .ACADEMIC_CLASSROOM(id),
      );

    return requireClassroom(
      response.data.data,
      "The selected classroom was not returned by the server.",
    );
  },

  async create(
    payload: CreateClassroomPayload,
  ): Promise<Classroom> {
    const response =
      await axiosClient.post<
        ApiResponse<ClassroomApiItem>
      >(
        API_ENDPOINTS.SETTINGS
          .ACADEMIC_CLASSROOMS,

        buildCreateRequest(payload),
      );

    return requireClassroom(
      response.data.data,
      "The created classroom was not returned by the server.",
    );
  },

  async update(
    id: string,
    payload: UpdateClassroomPayload,
  ): Promise<Classroom> {
    const response =
      await axiosClient.post<
        ApiResponse<ClassroomApiItem>
      >(
        API_ENDPOINTS.SETTINGS
          .ACADEMIC_CLASSROOM(id),

        buildUpdateRequest(payload),
      );

    return requireClassroom(
      response.data.data,
      "The updated classroom was not returned by the server.",
    );
  },

  async delete(
    id: string,
  ): Promise<void> {
    await axiosClient.delete(
      API_ENDPOINTS.SETTINGS
        .ACADEMIC_CLASSROOM(id),
    );
  },
};