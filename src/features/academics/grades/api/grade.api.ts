import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import type {
  AcademicStageWithGrades,
  AvailableGradeOption,
  CreateGradePayload,
  Grade,
  UpdateGradePayload,
} from "../types/grade.types";

const ACADEMIC_STAGES_WITH_GRADES_ENDPOINT =
  "/admin/settings/academic-stages/with-grades";

const STAGE_LABELS: Record<string, string> = {
  primary: "Primary",
  middle: "Middle",
  secondary: "Secondary",
};

type RecordValue = Record<string, unknown>;

function asRecord(value: unknown): RecordValue | null {
  return value && typeof value === "object"
    ? (value as RecordValue)
    : null;
}

function normalizeStageKey(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function normalizeConfiguredStages(value: unknown): Array<{
  id: string;
  stage: string;
}> {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    const item = asRecord(entry);
    if (!item) return [];

    const id = String(item.id ?? "");
    const stage = String(
      item.type ??
        item.stage ??
        item.stageType ??
        item.stage_type ??
        item.name ??
        "",
    );

    if (!id || !stage) return [];

    return [{
      id,
      stage,
    }];
  });
}

function normalizeAvailableGrades(value: unknown): Array<{
  stage: string;
  grades: AvailableGradeOption[];
}> {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    const item = asRecord(entry);
    if (!item) return [];

    const stage = String(
      item.stage ?? item.type ?? item.name ?? "",
    );
    if (!stage) return [];

    const rawGrades = Array.isArray(item.grades)
      ? item.grades
      : [];

    const grades = rawGrades.flatMap((entryGrade) => {
      const grade = asRecord(entryGrade);
      if (!grade) return [];

      const key = String(
        grade.key ?? grade.value ?? grade.name ?? "",
      );
      if (!key) return [];

      return [{ key }];
    });

    return [{
      stage,
      grades,
    }];
  });
}

function requireGrade(
  grade: Grade | undefined,
  errorMessage: string,
): Grade {
  if (!grade) throw new Error(errorMessage);
  return grade;
}

export const gradeApi = {
  async listStagesWithGrades(): Promise<AcademicStageWithGrades[]> {
    const [configuredResponse, availableResponse] = await Promise.all([
      axiosClient.get<ApiResponse<unknown>>(
        API_ENDPOINTS.SETTINGS.ACADEMIC_STAGES,
      ),
      axiosClient.get<ApiResponse<unknown>>(
        ACADEMIC_STAGES_WITH_GRADES_ENDPOINT,
      ),
    ]);

    const configuredStages = normalizeConfiguredStages(
      configuredResponse.data.data,
    );
    const availableGroups = normalizeAvailableGrades(
      availableResponse.data.data,
    );

    const availableByStage = new Map(
      availableGroups.map((group) => [
        normalizeStageKey(group.stage),
        group,
      ]),
    );

    return configuredStages.flatMap((configuredStage) => {
      const group = availableByStage.get(
        normalizeStageKey(configuredStage.stage),
      );

      if (!group) return [];

      const normalizedStage = normalizeStageKey(group.stage);

      return [{
        id: configuredStage.id,
        stage: group.stage,
        displayLabel:
          STAGE_LABELS[normalizedStage] ??
          group.stage,
        grades: group.grades,
      }];
    });
  },

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

  async update(id: string, payload: UpdateGradePayload): Promise<Grade> {
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
