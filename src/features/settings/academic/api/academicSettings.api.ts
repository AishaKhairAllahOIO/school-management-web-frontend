import axios from "axios";

import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import { academicSettingsMock } from "../mocks/academic-settings.mock";
import type {
  AcademicSettings,
  AcademicSettingsViewData,
  AcademicStage,
  AcademicTerm,
  AcademicYear,
  CreateAcademicStagePayload,
  CreateAcademicTermPayload,
  CreateAcademicYearPayload,
  UpdateAcademicSettingsPayload,
  UpdateAcademicStagePayload,
  UpdateAcademicTermPayload,
  UpdateAcademicYearPayload,
} from "../types/academic-settings.types";

const cachedViewData: AcademicSettingsViewData =
  structuredClone(academicSettingsMock);

function isAcademicSettingsInitializationError(
  error: unknown,
): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;
  const responseData: unknown = error.response?.data;

  if (
    typeof responseData !== "object" ||
    responseData === null ||
    !("message" in responseData)
  ) {
    return false;
  }

  const message = responseData.message;

  if (typeof message !== "string") {
    return false;
  }

  return (
    (status === 404 &&
      message.includes(
        "Academic settings have not been initialized",
      )) ||
    (status === 500 &&
      message.includes(
        'Attempt to read property "id" on null',
      ))
  );
}

function requireResponseData<T>(
  data: T | undefined,
  message: string,
): T {
  if (!data) {
    throw new Error(message);
  }

  return data;
}

export const academicSettingsApi = {
  async getViewData(): Promise<AcademicSettingsViewData> {
    try {
      const response =
        await axiosClient.get<ApiResponse<AcademicSettings>>(
          API_ENDPOINTS.SETTINGS.ACADEMIC,
        );

      const settings = requireResponseData(
        response.data.data,
        "Academic settings data was not returned by the server.",
      );

      cachedViewData.settings = settings;

      return structuredClone(cachedViewData);
    } catch (error) {
      if (isAcademicSettingsInitializationError(error)) {
        return structuredClone(cachedViewData);
      }

      throw error;
    }
  },

  async updateSettings(
    payload: UpdateAcademicSettingsPayload,
  ): Promise<AcademicSettings> {
    const response =
      await axiosClient.put<ApiResponse<AcademicSettings>>(
        API_ENDPOINTS.SETTINGS.ACADEMIC,
        payload,
      );

    const settings = requireResponseData(
      response.data.data,
      "Updated academic settings were not returned by the server.",
    );

    cachedViewData.settings = settings;

    return settings;
  },

  async createAcademicYear(
    payload: CreateAcademicYearPayload,
  ): Promise<AcademicYear> {
    const response =
      await axiosClient.post<ApiResponse<AcademicYear>>(
        API_ENDPOINTS.SETTINGS.ACADEMIC_YEARS,
        payload,
      );

    const year = requireResponseData(
      response.data.data,
      "Created academic year was not returned by the server.",
    );

    if (year.isCurrent) {
      cachedViewData.academicYears =
        cachedViewData.academicYears.map((item) => ({
          ...item,
          isCurrent: false,
        }));

      cachedViewData.settings.currentAcademicYearId =
        year.id;
    }

    cachedViewData.academicYears = [
      year,
      ...cachedViewData.academicYears.filter(
        (item) => item.id !== year.id,
      ),
    ];

    return year;
  },

  async updateAcademicYear(
    id: string,
    payload: UpdateAcademicYearPayload,
  ): Promise<AcademicYear> {
    const response =
      await axiosClient.put<ApiResponse<AcademicYear>>(
        API_ENDPOINTS.SETTINGS.ACADEMIC_YEAR(id),
        payload,
      );

    const year = requireResponseData(
      response.data.data,
      "Updated academic year was not returned by the server.",
    );

    if (year.isCurrent) {
      cachedViewData.academicYears =
        cachedViewData.academicYears.map((item) => ({
          ...item,
          isCurrent: item.id === year.id,
        }));

      cachedViewData.settings.currentAcademicYearId =
        year.id;
    }

    cachedViewData.academicYears =
      cachedViewData.academicYears.map((item) =>
        item.id === year.id ? year : item,
      );

    return year;
  },

  async createAcademicTerm(
    payload: CreateAcademicTermPayload,
  ): Promise<AcademicTerm> {
    const response =
      await axiosClient.post<ApiResponse<AcademicTerm>>(
        API_ENDPOINTS.SETTINGS.ACADEMIC_TERMS,
        payload,
      );

    const term = requireResponseData(
      response.data.data,
      "Created academic term was not returned by the server.",
    );

    if (term.isCurrent) {
      cachedViewData.academicTerms =
        cachedViewData.academicTerms.map((item) => ({
          ...item,
          isCurrent: false,
        }));

      cachedViewData.settings.currentSemesterId =
        term.id;
    }

    cachedViewData.academicTerms = [
      term,
      ...cachedViewData.academicTerms.filter(
        (item) => item.id !== term.id,
      ),
    ];

    return term;
  },

  async updateAcademicTerm(
    id: string,
    payload: UpdateAcademicTermPayload,
  ): Promise<AcademicTerm> {
    const response =
      await axiosClient.put<ApiResponse<AcademicTerm>>(
        API_ENDPOINTS.SETTINGS.ACADEMIC_TERM(id),
        payload,
      );

    const term = requireResponseData(
      response.data.data,
      "Updated academic term was not returned by the server.",
    );

    if (term.isCurrent) {
      cachedViewData.academicTerms =
        cachedViewData.academicTerms.map((item) => ({
          ...item,
          isCurrent: item.id === term.id,
        }));

      cachedViewData.settings.currentSemesterId =
        term.id;
    }

    cachedViewData.academicTerms =
      cachedViewData.academicTerms.map((item) =>
        item.id === term.id ? term : item,
      );

    return term;
  },

  async createAcademicStage(
    payload: CreateAcademicStagePayload,
  ): Promise<AcademicStage> {
    const response =
      await axiosClient.post<ApiResponse<AcademicStage>>(
        API_ENDPOINTS.SETTINGS.ACADEMIC_STAGES,
        payload,
      );

    const stage = requireResponseData(
      response.data.data,
      "Created academic stage was not returned by the server.",
    );

    cachedViewData.academicStages = [
      stage,
      ...cachedViewData.academicStages.filter(
        (item) => item.id !== stage.id,
      ),
    ];

    return stage;
  },

  async updateAcademicStage(
    id: string,
    payload: UpdateAcademicStagePayload,
  ): Promise<AcademicStage> {
    const response =
      await axiosClient.post<ApiResponse<AcademicStage>>(
        API_ENDPOINTS.SETTINGS.ACADEMIC_STAGE(id),
        payload,
      );

    const stage = requireResponseData(
      response.data.data,
      "Updated academic stage was not returned by the server.",
    );

    cachedViewData.academicStages =
      cachedViewData.academicStages.map((item) =>
        item.id === stage.id ? stage : item,
      );

    return stage;
  },
};