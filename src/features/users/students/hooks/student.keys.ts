import type { ApiId } from "../../shared/types/api.types";

import type {
  StudentListFilters,
  StudentSearchParams,
} from "../types/student.types";

export const studentKeys = {
  all: [
    "users",
    "students",
  ] as const,

  lists: () =>
    [
      ...studentKeys.all,
      "list",
    ] as const,

  list: (
    filters: StudentListFilters,
  ) =>
    [
      ...studentKeys.lists(),
      filters,
    ] as const,

  searches: () =>
    [
      ...studentKeys.all,
      "search",
    ] as const,

  search: (
    params: StudentSearchParams,
  ) =>
    [
      ...studentKeys.searches(),
      params,
    ] as const,

  details: () =>
    [
      ...studentKeys.all,
      "details",
    ] as const,

  detail: (
    studentId: ApiId,
  ) =>
    [
      ...studentKeys.details(),
      studentId,
    ] as const,

  profiles: () =>
    [
      ...studentKeys.all,
      "full-profile",
    ] as const,

  fullProfile: (
    enrollmentId: ApiId,
  ) =>
    [
      ...studentKeys.profiles(),
      enrollmentId,
    ] as const,

  imports: () =>
    [
      ...studentKeys.all,
      "imports",
    ] as const,

  importStatuses: () =>
    [
      ...studentKeys.imports(),
      "status",
    ] as const,

  importStatus: (
    batchId: ApiId,
  ) =>
    [
      ...studentKeys.importStatuses(),
      batchId,
    ] as const,

  importHistory: (
    page: number,
  ) =>
    [
      ...studentKeys.imports(),
      "history",
      page,
    ] as const,
};