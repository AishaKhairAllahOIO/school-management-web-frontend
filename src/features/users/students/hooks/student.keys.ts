import type {
  EntityId,
  StudentListFilters,
} from "../types/student-api.types";

export const studentKeys = {
  all: ["users", "students"] as const,

  lists: () =>
    [...studentKeys.all, "list"] as const,

  list: (filters: StudentListFilters) =>
    [...studentKeys.lists(), filters] as const,

  details: () =>
    [...studentKeys.all, "details"] as const,

  detail: (studentId: EntityId) =>
    [...studentKeys.details(), studentId] as const,

  profiles: () =>
    [...studentKeys.all, "full-profile"] as const,

  fullProfile: (enrollmentId: EntityId) =>
    [
      ...studentKeys.profiles(),
      enrollmentId,
    ] as const,

  imports: () =>
    [...studentKeys.all, "imports"] as const,

  importStatus: (batchId: EntityId) =>
    [
      ...studentKeys.imports(),
      "status",
      batchId,
    ] as const,

  importHistory: () =>
    [
      ...studentKeys.imports(),
      "history",
    ] as const,
};
