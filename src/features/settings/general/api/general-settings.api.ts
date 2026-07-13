import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import type { ApiResponse } from "@/services/types/apiResponse";

import type {
  CreateSchoolImagesPayload,
  GeneralSettings,
  SchoolImage,
  UpdateGeneralSettingsPayload,
  UpdateSchoolImagePayload,
} from "../types/general-settings.types";

type GeneralSettingsApiData = {
  id?: string | number | null;

  schoolName?: string | null;
  shortName?: string | null;
  description?: string | null;

  phoneNumber?: string | null;
  emergencyPhoneNumber?: string | null;

  email?: string | null;
  website?: string | null;

  address?: string | null;
  city?: string | null;
  country?: string | null;

  location?: {
    latitude?: number | string | null;
    longitude?: number | string | null;
  } | null;

  logoUrl?: string | null;

  images?: Array<{
    id: string | number;
    url?: string | null;
    name?: string | null;
  }> | null;

  createdAt?: string | null;
  updatedAt?: string | null;
};

function normalizeString(
  value: string | null | undefined,
): string {
  return value ?? "";
}

function normalizeNumber(
  value: number | string | null | undefined,
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : null;
}

function normalizeImages(
  images: GeneralSettingsApiData["images"],
): SchoolImage[] {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.map((image) => ({
    id: String(image.id),
    url: image.url ?? "",
    name: image.name ?? "",
  }));
}

export function normalizeGeneralSettings(
  data: GeneralSettingsApiData | null | undefined,
): GeneralSettings {
  const source = data ?? {};

  return {
    id:
      source.id === null ||
      source.id === undefined
        ? ""
        : String(source.id),

    schoolName: normalizeString(source.schoolName),
    shortName: normalizeString(source.shortName),
    description: normalizeString(source.description),

    phoneNumber: normalizeString(source.phoneNumber),
    emergencyPhoneNumber: normalizeString(
      source.emergencyPhoneNumber,
    ),

    email: normalizeString(source.email),
    website: normalizeString(source.website),

    address: normalizeString(source.address),
    city: normalizeString(source.city),
    country: normalizeString(source.country),

    location: {
      latitude: normalizeNumber(source.location?.latitude),
      longitude: normalizeNumber(source.location?.longitude),
    },

    logoUrl: source.logoUrl ?? null,
    images: normalizeImages(source.images),

    createdAt: source.createdAt ?? null,
    updatedAt: source.updatedAt ?? null,
  };
}

function buildGeneralSettingsFormData(
  payload: UpdateGeneralSettingsPayload,
): FormData {
  const formData = new FormData();

  formData.append("schoolName", payload.schoolName);
  formData.append("shortName", payload.shortName);
  formData.append("description", payload.description);
  formData.append("phoneNumber", payload.phoneNumber);
  formData.append(
    "emergencyPhoneNumber",
    payload.emergencyPhoneNumber,
  );
  formData.append("email", payload.email);
  formData.append("website", payload.website);
  formData.append("address", payload.address);
  formData.append("city", payload.city);
  formData.append("country", payload.country);
  formData.append(
    "location[latitude]",
    String(payload.location.latitude),
  );
  formData.append(
    "location[longitude]",
    String(payload.location.longitude),
  );

  if (payload.logo) {
    formData.append("logo", payload.logo);
  }

  return formData;
}

function buildImagesFormData(
  payload: CreateSchoolImagesPayload,
): FormData {
  const formData = new FormData();

  payload.images.forEach((image, index) => {
    formData.append(`images[${index}][file]`, image.file);
    formData.append(`images[${index}][name]`, image.name);
  });

  return formData;
}

function buildUpdateImageFormData(
  payload: UpdateSchoolImagePayload,
): FormData {
  const formData = new FormData();

  if (payload.file) {
    formData.append("file", payload.file);
  }

  if (payload.name !== undefined) {
    formData.append("name", payload.name);
  }

  return formData;
}

export const generalSettingsApi = {
  async get(): Promise<GeneralSettings> {
    const response = await axiosClient.get<
      ApiResponse<GeneralSettingsApiData>
    >(API_ENDPOINTS.SETTINGS.GENERAL);

    return normalizeGeneralSettings(response.data.data);
  },

  async update(
    payload: UpdateGeneralSettingsPayload,
  ): Promise<GeneralSettings> {
    const response = await axiosClient.post<
      ApiResponse<GeneralSettingsApiData>
    >(
      API_ENDPOINTS.SETTINGS.GENERAL,
      buildGeneralSettingsFormData(payload),
    );

    return normalizeGeneralSettings(response.data.data);
  },

  async delete(): Promise<void> {
    await axiosClient.delete(
      API_ENDPOINTS.SETTINGS.GENERAL,
    );
  },

  async listImages(): Promise<SchoolImage[]> {
    const response = await axiosClient.get<
      ApiResponse<SchoolImage[]>
    >(API_ENDPOINTS.SETTINGS.GENERAL_IMAGES);

    return response.data.data ?? [];
  },

  async addImages(
    payload: CreateSchoolImagesPayload,
  ): Promise<SchoolImage[]> {
    const response = await axiosClient.post<
      ApiResponse<SchoolImage[]>
    >(
      API_ENDPOINTS.SETTINGS.GENERAL_IMAGES,
      buildImagesFormData(payload),
    );

    return response.data.data ?? [];
  },

  async getImage(
    imageId: string,
  ): Promise<SchoolImage> {
    const response = await axiosClient.get<
      ApiResponse<SchoolImage>
    >(
      API_ENDPOINTS.SETTINGS.GENERAL_IMAGE(imageId),
    );

    const image = response.data.data;

    if (!image) {
      throw new Error(
        "School image was not returned by the server.",
      );
    }

    return image;
  },

  async updateImage(
    payload: UpdateSchoolImagePayload,
  ): Promise<SchoolImage> {
    const response = await axiosClient.post<
      ApiResponse<SchoolImage>
    >(
      API_ENDPOINTS.SETTINGS.GENERAL_IMAGE(
        payload.imageId,
      ),
      buildUpdateImageFormData(payload),
    );

    const image = response.data.data;

    if (!image) {
      throw new Error(
        "Updated school image was not returned by the server.",
      );
    }

    return image;
  },

  async deleteImage(imageId: string): Promise<void> {
    await axiosClient.delete(
      API_ENDPOINTS.SETTINGS.GENERAL_IMAGE(imageId),
    );
  },
};
