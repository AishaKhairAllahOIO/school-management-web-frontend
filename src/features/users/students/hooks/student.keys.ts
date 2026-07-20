import type {
  StudentFilters,
} from "../types/student.types";

type ApiId = string | number;

export const studentKeys = {
  all: ["students"] as const,

  lists: () =>
    [...studentKeys.all, "list"] as const,

  list: (filters: StudentFilters) =>
    [...studentKeys.lists(), filters] as const,

  searches: () =>
    [...studentKeys.all, "search"] as const,

  search: (query: string) =>
    [...studentKeys.searches(), query] as const,

  details: () =>
    [...studentKeys.all, "detail"] as const,

  detail: (studentId: ApiId) =>
    [...studentKeys.details(), studentId] as const,

  fullProfiles: () =>
    [...studentKeys.all, "full-profile"] as const,

  fullProfile: (enrollmentId: ApiId) =>
    [
      ...studentKeys.fullProfiles(),
      enrollmentId,
    ] as const,

  import: () =>
    [...studentKeys.all, "import"] as const,

  importStatus: (batchId: ApiId) =>
    [
      ...studentKeys.import(),
      "status",
      batchId,
    ] as const,

  importHistory: () =>
    [
      ...studentKeys.import(),
      "history",
    ] as const,
};