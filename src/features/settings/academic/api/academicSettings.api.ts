import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

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

function requireResponseData<T>(
  data: T | undefined,
  errorMessage: string,
): T {
  if (data === undefined) {
    throw new Error(errorMessage);
  }

  return data;
}

export const academicSettingsApi = {
  async getSettings(): Promise<AcademicSettings> {
    const response =
      await axiosClient.get<
        ApiResponse<AcademicSettings>
      >(API_ENDPOINTS.SETTINGS.ACADEMIC);

    return requireResponseData(
      response.data.data,
      "Academic settings were not returned by the server.",
    );
  },

  async getViewData(): Promise<AcademicSettingsViewData> {
    const [
      settings,
      academicYears,
      academicTerms,
      academicStages,
    ] = await Promise.all([
      academicSettingsApi.getSettings(),
      academicSettingsApi.getAcademicYears(),
      academicSettingsApi.getAcademicTerms(),
      academicSettingsApi.getAcademicStages(),
    ]);

    return {
      settings,
      academicYears,
      academicTerms,
      academicStages,
    };
  },

  async updateSettings(
    payload: UpdateAcademicSettingsPayload,
  ): Promise<AcademicSettings> {
    const response =
      await axiosClient.put<
        ApiResponse<AcademicSettings>
      >(
        API_ENDPOINTS.SETTINGS.ACADEMIC,
        payload,
      );

    return requireResponseData(
      response.data.data,
      "Updated academic settings were not returned by the server.",
    );
  },

  async deleteSettings(): Promise<void> {
    await axiosClient.delete(
      API_ENDPOINTS.SETTINGS.ACADEMIC,
    );
  },

  async getAcademicYears(): Promise<AcademicYear[]> {
    const response =
      await axiosClient.get<
        ApiResponse<AcademicYear[]>
      >(
        API_ENDPOINTS.SETTINGS.ACADEMIC_YEARS,
      );

    return requireResponseData(
      response.data.data,
      "Academic years were not returned by the server.",
    );
  },

  async getAcademicYear(
    id: string,
  ): Promise<AcademicYear> {
    const response =
      await axiosClient.get<
        ApiResponse<AcademicYear>
      >(
        API_ENDPOINTS.SETTINGS.ACADEMIC_YEAR(
          id,
        ),
      );

    return requireResponseData(
      response.data.data,
      "Academic year was not returned by the server.",
    );
  },

  async createAcademicYear(
    payload: CreateAcademicYearPayload,
  ): Promise<AcademicYear> {
    const response =
      await axiosClient.post<
        ApiResponse<AcademicYear>
      >(
        API_ENDPOINTS.SETTINGS.ACADEMIC_YEARS,
        payload,
      );

    return requireResponseData(
      response.data.data,
      "Created academic year was not returned by the server.",
    );
  },

  async updateAcademicYear(
    id: string,
    payload: UpdateAcademicYearPayload,
  ): Promise<AcademicYear> {
    const response =
      await axiosClient.put<
        ApiResponse<AcademicYear>
      >(
        API_ENDPOINTS.SETTINGS.ACADEMIC_YEAR(
          id,
        ),
        payload,
      );

    return requireResponseData(
      response.data.data,
      "Updated academic year was not returned by the server.",
    );
  },

  async deleteAcademicYear(
    id: string,
  ): Promise<void> {
    await axiosClient.delete(
      API_ENDPOINTS.SETTINGS.ACADEMIC_YEAR(id),
    );
  },

  async getAcademicTerms(): Promise<AcademicTerm[]> {
    const response =
      await axiosClient.get<
        ApiResponse<AcademicTerm[]>
      >(
        API_ENDPOINTS.SETTINGS.ACADEMIC_TERMS,
      );

    return requireResponseData(
      response.data.data,
      "Academic terms were not returned by the server.",
    );
  },

  async getAcademicTerm(
    id: string,
  ): Promise<AcademicTerm> {
    const response =
      await axiosClient.get<
        ApiResponse<AcademicTerm>
      >(
        API_ENDPOINTS.SETTINGS.ACADEMIC_TERM(
          id,
        ),
      );

    return requireResponseData(
      response.data.data,
      "Academic term was not returned by the server.",
    );
  },

  async createAcademicTerm(
    payload: CreateAcademicTermPayload,
  ): Promise<AcademicTerm> {
    const response =
      await axiosClient.post<
        ApiResponse<AcademicTerm>
      >(
        API_ENDPOINTS.SETTINGS.ACADEMIC_TERMS,
        payload,
      );

    return requireResponseData(
      response.data.data,
      "Created academic term was not returned by the server.",
    );
  },

  async updateAcademicTerm(
    id: string,
    payload: UpdateAcademicTermPayload,
  ): Promise<AcademicTerm> {
    const response =
      await axiosClient.put<
        ApiResponse<AcademicTerm>
      >(
        API_ENDPOINTS.SETTINGS.ACADEMIC_TERM(
          id,
        ),
        payload,
      );

    return requireResponseData(
      response.data.data,
      "Updated academic term was not returned by the server.",
    );
  },

  async deleteAcademicTerm(
    id: string,
  ): Promise<void> {
    await axiosClient.delete(
      API_ENDPOINTS.SETTINGS.ACADEMIC_TERM(id),
    );
  },

  async getAcademicStages(): Promise<AcademicStage[]> {
    const response =
      await axiosClient.get<
        ApiResponse<AcademicStage[]>
      >(
        API_ENDPOINTS.SETTINGS.ACADEMIC_STAGES,
      );

    return requireResponseData(
      response.data.data,
      "Academic stages were not returned by the server.",
    );
  },

  async getAcademicStage(
    id: string,
  ): Promise<AcademicStage> {
    const response =
      await axiosClient.get<
        ApiResponse<AcademicStage>
      >(
        API_ENDPOINTS.SETTINGS.ACADEMIC_STAGE(
          id,
        ),
      );

    return requireResponseData(
      response.data.data,
      "Academic stage was not returned by the server.",
    );
  },

  async createAcademicStage(
    payload: CreateAcademicStagePayload,
  ): Promise<AcademicStage> {
    const response =
      await axiosClient.post<
        ApiResponse<AcademicStage>
      >(
        API_ENDPOINTS.SETTINGS.ACADEMIC_STAGES,
        payload,
      );

    return requireResponseData(
      response.data.data,
      "Created academic stage was not returned by the server.",
    );
  },

  async updateAcademicStage(
    id: string,
    payload: UpdateAcademicStagePayload,
  ): Promise<AcademicStage> {
    const response =
      await axiosClient.post<
        ApiResponse<AcademicStage>
      >(
        API_ENDPOINTS.SETTINGS.ACADEMIC_STAGE(
          id,
        ),
        payload,
      );

    return requireResponseData(
      response.data.data,
      "Updated academic stage was not returned by the server.",
    );
  },

  async deleteAcademicStage(
    id: string,
  ): Promise<void> {
    await axiosClient.delete(
      API_ENDPOINTS.SETTINGS.ACADEMIC_STAGE(id),
    );
  },
};