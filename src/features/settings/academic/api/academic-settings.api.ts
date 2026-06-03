import { academicSettingsMock } from "@/features/settings/academic/mocks/academic-settings.mock";

import type {
  AcademicSettings,
  UpdateAcademicSettingsPayload,
} from "@/features/settings/academic/types/academic-settings.types";

const USE_MOCK_API = true;

let mockDatabase: AcademicSettings = academicSettingsMock;

function wait(ms = 450) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAcademicSettings(): Promise<AcademicSettings> {
  if (USE_MOCK_API) {
    await wait();
    return mockDatabase;
  }

  const response = await fetch("/api/settings/academic");

  if (!response.ok) {
    throw new Error("Failed to fetch academic settings");
  }

  return response.json();
}

export async function updateAcademicSettings(
  payload: UpdateAcademicSettingsPayload
): Promise<AcademicSettings> {
  if (USE_MOCK_API) {
    await wait();

    mockDatabase = {
      ...mockDatabase,
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    return mockDatabase;
  }

  const response = await fetch("/api/settings/academic", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update academic settings");
  }

  return response.json();
}