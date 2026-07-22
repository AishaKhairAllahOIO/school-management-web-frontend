import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import type {
  CreateGradeConfigurationPayload,
  GradeConfiguration,
  UpdateGradeConfigurationPayload,
} from "../types/grade-configuration.types";

type GradeConfigurationApiItem = {
  id: string | number;

  academicYearId?: string | number;
  academic_year_id?: string | number;

  gradeId?: string | number;
  gradeLevelId?: string | number;
  grade_level_id?: string | number;

  supervisorId?: string | number;
  supervisor_id?: string | number;

  plannedClassroomsCount?: number;
  planned_classrooms_count?: number;

  plannedStudentsCapacity?: number;
  planned_students_capacity?: number;

  actualClassroomsCount?: number;
  actual_classrooms_count?: number;

  actualStudentsCount?: number;
  actual_students_count?: number;

  createdAt?: string;
  created_at?: string;

  updatedAt?: string;
  updated_at?: string;
};

type CreateGradeConfigurationRequest = {
  academicYearId: number;
  grade_level_id: number;
  supervisor_id: number;
  planned_classrooms_count: number;
};

type UpdateGradeConfigurationRequest = {
  supervisor_id?: number;
  planned_classrooms_count?: number;
};

function mapConfiguration(
  item: GradeConfigurationApiItem,
): GradeConfiguration {
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

    supervisorId: String(
      item.supervisorId ??
        item.supervisor_id ??
        "",
    ),

    plannedClassroomsCount: Number(
      item.plannedClassroomsCount ??
        item.planned_classrooms_count ??
        0,
    ),

    plannedStudentsCapacity: Number(
      item.plannedStudentsCapacity ??
        item.planned_students_capacity ??
        0,
    ),

    actualClassroomsCount: Number(
      item.actualClassroomsCount ??
        item.actual_classrooms_count ??
        0,
    ),

    actualStudentsCount: Number(
      item.actualStudentsCount ??
        item.actual_students_count ??
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

function requireConfiguration(
  value: GradeConfigurationApiItem | undefined,
  message: string,
): GradeConfiguration {
  if (!value) {
    throw new Error(message);
  }

  return mapConfiguration(value);
}

function buildCreateRequest(
  payload: CreateGradeConfigurationPayload,
): CreateGradeConfigurationRequest {
  return {
   
    academicYearId:
      payload.academicYearId,

    
    grade_level_id:
      payload.gradeId,

    supervisor_id:
      payload.supervisorId,

    planned_classrooms_count:
      payload.plannedClassroomsCount,
  };
}

function buildUpdateRequest(
  payload: UpdateGradeConfigurationPayload,
): UpdateGradeConfigurationRequest {
  const request: UpdateGradeConfigurationRequest =
    {};

  if (
    payload.supervisorId !== undefined
  ) {
    request.supervisor_id =
      payload.supervisorId;
  }

  if (
    payload.plannedClassroomsCount !==
    undefined
  ) {
    request.planned_classrooms_count =
      payload.plannedClassroomsCount;
  }

  return request;
}

export const gradeConfigurationApi = {
  async list(): Promise<
    GradeConfiguration[]
  > {
    const response =
      await axiosClient.get<
        ApiResponse<
          GradeConfigurationApiItem[]
        >
      >(
        API_ENDPOINTS.SETTINGS
          .ACADEMIC_CONFIGURATIONS,
      );

    return (
      response.data.data ?? []
    ).map(mapConfiguration);
  },

  async getById(
    id: string,
  ): Promise<GradeConfiguration> {
    const response =
      await axiosClient.get<
        ApiResponse<GradeConfigurationApiItem>
      >(
        API_ENDPOINTS.SETTINGS
          .ACADEMIC_CONFIGURATION(id),
      );

    return requireConfiguration(
      response.data.data,
      "The selected configuration was not returned by the server.",
    );
  },

  async create(
    payload:
      CreateGradeConfigurationPayload,
  ): Promise<GradeConfiguration> {
    const response =
      await axiosClient.post<
        ApiResponse<GradeConfigurationApiItem>
      >(
        API_ENDPOINTS.SETTINGS
          .ACADEMIC_CONFIGURATIONS,

        buildCreateRequest(payload),
      );

    return requireConfiguration(
      response.data.data,
      "The created configuration was not returned by the server.",
    );
  },

  async update(
    id: string,
    payload:
      UpdateGradeConfigurationPayload,
  ): Promise<GradeConfiguration> {
    const response =
      await axiosClient.post<
        ApiResponse<GradeConfigurationApiItem>
      >(
        API_ENDPOINTS.SETTINGS
          .ACADEMIC_CONFIGURATION(id),

        buildUpdateRequest(payload),
      );

    return requireConfiguration(
      response.data.data,
      "The updated configuration was not returned by the server.",
    );
  },

  async delete(
    id: string,
  ): Promise<void> {
    await axiosClient.delete(
      API_ENDPOINTS.SETTINGS
        .ACADEMIC_CONFIGURATION(id),
    );
  },
};