import { axiosClient } from "@/services/axios/axiosClient";

import { assessmentComponentEndpoints } from "./assessment-component.endpoints";

import type {
  AssessmentComponent,
  AssessmentComponentApiRecord,
  AssessmentGroupedApiRecord,
  AssessmentSubjectGroup,
  CreateAssessmentComponentPayload,
  UpdateAssessmentComponentPayload,
} from "../types/assessment-component.types";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type UnknownApiResponse<T> =
  | T
  | ApiEnvelope<T>
  | {
      data?: ApiEnvelope<T> | T;
    };

function unwrapResponse<T>(
  response: UnknownApiResponse<T>,
): T {
  if (
    response &&
    typeof response === "object" &&
    "data" in response
  ) {
    const firstData = response.data;

    if (
      firstData &&
      typeof firstData === "object" &&
      "data" in firstData
    ) {
      return firstData.data as T;
    }

    return firstData as T;
  }

  return response as T;
}

function toStringId(
  value: string | number | null | undefined,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value);
}

function toNumber(
  value: string | number | null | undefined,
): number {
  const parsedValue = Number(value ?? 0);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : 0;
}

function mapAssessmentComponent(
  record: AssessmentComponentApiRecord,
): AssessmentComponent {
  return {
    id: toStringId(record.id),

    gradeSubjectId: toStringId(
      record.gradeSubjectId ??
        record.grade_subject_id,
    ),

    type: record.type,

    name: record.name ?? "",

    maxMark: toNumber(
      record.maxMark ??
        record.max_mark,
    ),

    weightPercentage: toNumber(
      record.weightPercentage ??
        record.weight_percentage,
    ),

    createdAt:
      record.createdAt ??
      record.created_at ??
      "",

    updatedAt:
      record.updatedAt ??
      record.updated_at ??
      "",
  };
}

function mapGroupedAssessment(
  record: AssessmentGroupedApiRecord,
): AssessmentSubjectGroup {
  const rawComponents =
    record.components ??
    record.assessments ??
    record.assessmentComponents ??
    record.assessment_components ??
    [];

  return {
    gradeSubjectId: toStringId(
      record.gradeSubjectId ??
        record.grade_subject_id,
    ),

    subjectId: toStringId(
      record.subjectId ??
        record.subject_id,
    ),

    subjectName:
      record.subjectName ??
      record.subject_name ??
      "Unknown subject",

    gradeId: toStringId(
      record.gradeId ??
        record.grade_id ??
        record.gradeLevelId ??
        record.grade_level_id,
    ),

    gradeName:
      record.gradeName ??
      record.grade_name ??
      record.gradeLevelName ??
      record.grade_level_name ??
      "",

    components:
      rawComponents.map(
        mapAssessmentComponent,
      ),
  };
}

function buildRequestPayload(
  payload:
    | CreateAssessmentComponentPayload
    | UpdateAssessmentComponentPayload,
) {
  const requestPayload: Record<
    string,
    unknown
  > = {};

  if (
    payload.gradeSubjectId !== undefined
  ) {
    requestPayload.grade_subject_id =
      payload.gradeSubjectId;
  }

  if (payload.type !== undefined) {
    requestPayload.type =
      payload.type;
  }

  if (payload.name !== undefined) {
    requestPayload.name =
      payload.name.trim();
  }

  if (payload.maxMark !== undefined) {
    requestPayload.max_mark =
      payload.maxMark;
  }

  if (
    payload.weightPercentage !==
    undefined
  ) {
    requestPayload.weight_percentage =
      payload.weightPercentage;
  }

  return requestPayload;
}

export const assessmentComponentApi = {
  async getAll(): Promise<
    AssessmentComponent[]
  > {
    const response =
      await axiosClient.get<
        UnknownApiResponse<
          AssessmentComponentApiRecord[]
        >
      >(
        assessmentComponentEndpoints.list,
      );

    const records =
      unwrapResponse<
        AssessmentComponentApiRecord[]
      >(response.data);

    if (!Array.isArray(records)) {
      return [];
    }

    return records.map(
      mapAssessmentComponent,
    );
  },

  async getDetails(
    id: string,
  ): Promise<AssessmentComponent> {
    const response =
      await axiosClient.get<
        UnknownApiResponse<
          AssessmentComponentApiRecord
        >
      >(
        assessmentComponentEndpoints.details(
          id,
        ),
      );

    const record =
      unwrapResponse<
        AssessmentComponentApiRecord
      >(response.data);

    return mapAssessmentComponent(
      record,
    );
  },

  async create(
    payload: CreateAssessmentComponentPayload,
  ): Promise<AssessmentComponent> {
    const response =
      await axiosClient.post<
        UnknownApiResponse<
          AssessmentComponentApiRecord
        >
      >(
        assessmentComponentEndpoints.create,
        buildRequestPayload(payload),
      );

    const record =
      unwrapResponse<
        AssessmentComponentApiRecord
      >(response.data);

    return mapAssessmentComponent(
      record,
    );
  },

  async update(
    id: string,
    payload: UpdateAssessmentComponentPayload,
  ): Promise<AssessmentComponent> {
    const response =
      await axiosClient.post<
        UnknownApiResponse<
          AssessmentComponentApiRecord
        >
      >(
        assessmentComponentEndpoints.update(
          id,
        ),
        buildRequestPayload(payload),
      );

    const record =
      unwrapResponse<
        AssessmentComponentApiRecord
      >(response.data);

    return mapAssessmentComponent(
      record,
    );
  },

  async delete(
    id: string,
  ): Promise<void> {
    await axiosClient.delete(
      assessmentComponentEndpoints.delete(
        id,
      ),
    );
  },

  async getGrouped(): Promise<
    AssessmentSubjectGroup[]
  > {
    const response =
      await axiosClient.get<
        UnknownApiResponse<
          AssessmentGroupedApiRecord[]
        >
      >(
        assessmentComponentEndpoints.grouped,
      );

    const records =
      unwrapResponse<
        AssessmentGroupedApiRecord[]
      >(response.data);

    if (!Array.isArray(records)) {
      return [];
    }

    return records.map(
      mapGroupedAssessment,
    );
  },
};