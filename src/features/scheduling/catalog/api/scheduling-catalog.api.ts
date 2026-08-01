import { schedulingCatalogMock } from "@/features/scheduling/catalog/mocks/scheduling-catalog.mock";
import type { SchedulingCatalog } from "@/features/scheduling/catalog/types/scheduling-catalog.types";

const USE_MOCK_API = true;

function wait(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getSchedulingCatalog(): Promise<SchedulingCatalog> {
  if (USE_MOCK_API) {
    await wait();
    return schedulingCatalogMock;
  }

  /*
   * Replace this endpoint with the backend aggregate endpoint when available.
   * The endpoint should return current grades, classrooms, subjects, teachers,
   * and the active academic year using the SchedulingCatalog shape.
   */
  const response = await fetch("/api/admin/scheduling/catalog", {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to load scheduling catalog");
  }

  const payload = await response.json();
  return payload.data ?? payload;
}
