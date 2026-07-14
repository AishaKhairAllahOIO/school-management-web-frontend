import type {
  StudentFilterApiPayload,
  StudentImportHistoryItem,
  StudentImportHistoryResult,
  StudentListResult,
} from "../types/student-api.types";

export function mapStudentListPayload(
  payload: StudentFilterApiPayload,
): StudentListResult {
  return {
    items: payload.data,
    meta: {
      currentPage: payload.meta.current_page,
      lastPage: payload.meta.last_page,
      perPage: payload.meta.per_page,
      total: payload.meta.total,
    },
  };
}

export function mapImportHistoryPayload(
  payload:
    | StudentImportHistoryItem[]
    | {
        data: StudentImportHistoryItem[];
        meta?: {
          current_page: number;
          last_page: number;
          per_page?: number;
          total?: number;
        };
      },
): StudentImportHistoryResult {
  if (Array.isArray(payload)) {
    return { items: payload };
  }

  return {
    items: payload.data,
    meta: payload.meta
      ? {
          currentPage: payload.meta.current_page,
          lastPage: payload.meta.last_page,
          perPage: payload.meta.per_page,
          total: payload.meta.total,
        }
      : undefined,
  };
}
