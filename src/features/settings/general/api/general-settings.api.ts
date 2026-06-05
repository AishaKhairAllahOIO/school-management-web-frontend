import { generalSettingsMock } from "@/features/settings/general/mocks/general-settings.mock";

import type {
  GeneralSettings,
  SchoolImage,
  UpdateGeneralSettingsPayload,
} from "@/features/settings/general/types/general-settings.types";

const USE_MOCK_API = true;

let mockDatabase: GeneralSettings = generalSettingsMock;

function wait(ms = 450) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getGeneralSettings(): Promise<GeneralSettings> {
  if (USE_MOCK_API) {
    await wait();
    return mockDatabase;
  }

  const response = await fetch("/api/settings/general");

  if (!response.ok) {
    throw new Error("Failed to fetch general settings");
  }

  return response.json();
}

export async function updateGeneralSettings(
  payload: UpdateGeneralSettingsPayload
): Promise<GeneralSettings> {
  if (USE_MOCK_API) {
    await wait();

    mockDatabase = {
      ...mockDatabase,
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    return mockDatabase;
  }

  const response = await fetch("/api/settings/general", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update general settings");
  }

  return response.json();
}

export async function uploadSchoolLogo(file: File): Promise<GeneralSettings> {
  if (USE_MOCK_API) {
    await wait();

    mockDatabase = {
      ...mockDatabase,
      logoUrl: URL.createObjectURL(file),
      updatedAt: new Date().toISOString(),
    };

    return mockDatabase;
  }

  const formData = new FormData();
  formData.append("logo", file);

  const response = await fetch("/api/settings/general/logo", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload school logo");
  }

  return response.json();
}

export async function deleteSchoolLogo(): Promise<GeneralSettings> {
  if (USE_MOCK_API) {
    await wait();

    mockDatabase = {
      ...mockDatabase,
      logoUrl: null,
      updatedAt: new Date().toISOString(),
    };

    return mockDatabase;
  }

  const response = await fetch("/api/settings/general/logo", {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete school logo");
  }

  return response.json();
}

export async function uploadSchoolImage(file: File): Promise<GeneralSettings> {
  if (USE_MOCK_API) {
    await wait();

    const image: SchoolImage = {
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      name: file.name,
    };

    mockDatabase = {
      ...mockDatabase,
      images: [...mockDatabase.images, image],
      updatedAt: new Date().toISOString(),
    };

    return mockDatabase;
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/settings/general/images", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload school image");
  }

  return response.json();
}

export async function deleteSchoolImage(
  imageId: string
): Promise<GeneralSettings> {
  if (USE_MOCK_API) {
    await wait();

    mockDatabase = {
      ...mockDatabase,
      images: mockDatabase.images.filter((image) => image.id !== imageId),
      updatedAt: new Date().toISOString(),
    };

    return mockDatabase;
  }

  const response = await fetch(`/api/settings/general/images/${imageId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete school image");
  }

  return response.json();
}