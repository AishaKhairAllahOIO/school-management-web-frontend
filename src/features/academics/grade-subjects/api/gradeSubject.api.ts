import {
  axiosClient,
} from "@/services/axios/axiosClient";

import type {
  ApiId,
  ApiResponse,
} from "../../shared/types/api.types";

import type {
  CreateGradeSubjectPayload,
  GradeSubject,
  GradeSubjectApiItem,
  UpdateGradeSubjectPayload,
} from "../types/grade-subject.types";

import {
  gradeSubjectEndpoints,
} from "./gradeSubject.endpoints";

type GradeSubjectRequestPayload = {
  academic_year_id?: number;
  semester_id?: number;
  grade_level_id?: number;
  subject_id?: number;

  weekly_periods?: number;
  difficulty?:
    CreateGradeSubjectPayload["difficulty"];

  max_mark?: number;
  passing_mark?: number;

  is_failing_subject?: boolean;
  weight_in_total?: number;

  max_periods_per_day?: number;
  avoid_first_period?: boolean;
  avoid_last_period?: boolean;

  preferred_period_indexes?: number[];
};

function unwrapResponse<T>(
  response: ApiResponse<T> | T,
): T {
  if (
    typeof response === "object" &&
    response !== null &&
    "data" in response
  ) {
    return (
      response as ApiResponse<T>
    ).data;
  }

  return response as T;
}

function toBoolean(
  value: boolean | number,
): boolean {
  return (
    value === true ||
    value === 1
  );
}

function mapGradeSubject(
  item: GradeSubjectApiItem,
): GradeSubject {
  return {
    id:
      String(item.id),

    academicYearId:
      String(
        item.academicYearId,
      ),

    
    academicTermId:
      String(item.semesterId),

    gradeId:
      String(item.gradeId),

    subjectId:
      String(item.subjectId),

    subjectName:
      item.subjectName ?? "",

    weeklyPeriods:
      Number(item.weeklyPeriods),

    difficulty:
      item.difficulty,

    maxMark:
      Number(item.maxMark),

    passingMark:
      Number(item.passingMark),

    isFailingSubject:
      toBoolean(
        item.isFailingSubject,
      ),

    weightInTotal:
      Number(item.weightInTotal),

    maxPeriodsPerDay:
      Number(
        item.maxPeriodsPerDay,
      ),

    avoidFirstPeriod:
      toBoolean(
        item.avoidFirstPeriod,
      ),

    avoidLastPeriod:
      toBoolean(
        item.avoidLastPeriod,
      ),

    preferredPeriodIndexes:
      (
        item.preferredPeriodIndexes ??
        []
      ).map(Number),

    createdAt:
      item.createdAt ?? "",

    updatedAt:
      item.updatedAt ?? "",
  };
}

function createRequestPayload(
  values:
    CreateGradeSubjectPayload,
): GradeSubjectRequestPayload {
  return {
    academic_year_id:
      Number(
        values.academicYearId,
      ),

    semester_id:
      Number(
        values.academicTermId,
      ),

    grade_level_id:
      Number(values.gradeId),

    subject_id:
      Number(values.subjectId),

    weekly_periods:
      values.weeklyPeriods,

    difficulty:
      values.difficulty,

    max_mark:
      values.maxMark,

    passing_mark:
      values.passingMark,

    is_failing_subject:
      values.isFailingSubject,

    weight_in_total:
      values.weightInTotal,

    max_periods_per_day:
      values.maxPeriodsPerDay,

    avoid_first_period:
      values.avoidFirstPeriod,

    avoid_last_period:
      values.avoidLastPeriod,

    preferred_period_indexes:
      values.preferredPeriodIndexes ??
      [],
  };
}

function createUpdateRequestPayload(
  values:
    UpdateGradeSubjectPayload,
): GradeSubjectRequestPayload {
  const payload:
    GradeSubjectRequestPayload = {};

  if (
    values.academicYearId !==
    undefined
  ) {
    payload.academic_year_id =
      Number(
        values.academicYearId,
      );
  }

  if (
    values.academicTermId !==
    undefined
  ) {
    payload.semester_id =
      Number(
        values.academicTermId,
      );
  }

  if (
    values.gradeId !==
    undefined
  ) {
    payload.grade_level_id =
      Number(values.gradeId);
  }

  if (
    values.subjectId !==
    undefined
  ) {
    payload.subject_id =
      Number(values.subjectId);
  }

  if (
    values.weeklyPeriods !==
    undefined
  ) {
    payload.weekly_periods =
      values.weeklyPeriods;
  }

  if (
    values.difficulty !==
    undefined
  ) {
    payload.difficulty =
      values.difficulty;
  }

  if (
    values.maxMark !==
    undefined
  ) {
    payload.max_mark =
      values.maxMark;
  }

  if (
    values.passingMark !==
    undefined
  ) {
    payload.passing_mark =
      values.passingMark;
  }

  if (
    values.isFailingSubject !==
    undefined
  ) {
    payload.is_failing_subject =
      values.isFailingSubject;
  }

  if (
    values.weightInTotal !==
    undefined
  ) {
    payload.weight_in_total =
      values.weightInTotal;
  }

  if (
    values.maxPeriodsPerDay !==
    undefined
  ) {
    payload.max_periods_per_day =
      values.maxPeriodsPerDay;
  }

  if (
    values.avoidFirstPeriod !==
    undefined
  ) {
    payload.avoid_first_period =
      values.avoidFirstPeriod;
  }

  if (
    values.avoidLastPeriod !==
    undefined
  ) {
    payload.avoid_last_period =
      values.avoidLastPeriod;
  }

  if (
    values.preferredPeriodIndexes !==
    undefined
  ) {
    payload.preferred_period_indexes =
      values.preferredPeriodIndexes;
  }

  return payload;
}

export const gradeSubjectApi = {
  async list():
    Promise<GradeSubject[]> {
    const response =
      await axiosClient.get<
        | ApiResponse<
            GradeSubjectApiItem[]
          >
        | GradeSubjectApiItem[]
      >(
        gradeSubjectEndpoints.list,
      );

    const data =
      unwrapResponse(
        response.data,
      );

    return data.map(
      mapGradeSubject,
    );
  },

  async getDetails(
    gradeSubjectId: ApiId,
  ): Promise<GradeSubject> {
    const response =
      await axiosClient.get<
        | ApiResponse<
            GradeSubjectApiItem
          >
        | GradeSubjectApiItem
      >(
        gradeSubjectEndpoints.details(
          gradeSubjectId,
        ),
      );

    return mapGradeSubject(
      unwrapResponse(
        response.data,
      ),
    );
  },

  async create(
    values:
      CreateGradeSubjectPayload,
  ): Promise<GradeSubject> {
    const response =
      await axiosClient.post<
        | ApiResponse<
            GradeSubjectApiItem
          >
        | GradeSubjectApiItem
      >(
        gradeSubjectEndpoints.create,
        createRequestPayload(
          values,
        ),
      );

    return mapGradeSubject(
      unwrapResponse(
        response.data,
      ),
    );
  },

  async update(
    gradeSubjectId: ApiId,
    values:
      UpdateGradeSubjectPayload,
  ): Promise<GradeSubject> {
    const response =
      await axiosClient.post<
        | ApiResponse<
            GradeSubjectApiItem
          >
        | GradeSubjectApiItem
      >(
        gradeSubjectEndpoints.update(
          gradeSubjectId,
        ),
        createUpdateRequestPayload(
          values,
        ),
      );

    return mapGradeSubject(
      unwrapResponse(
        response.data,
      ),
    );
  },

  async remove(
    gradeSubjectId: ApiId,
  ): Promise<void> {
    await axiosClient.delete(
      gradeSubjectEndpoints.remove(
        gradeSubjectId,
      ),
    );
  },
};