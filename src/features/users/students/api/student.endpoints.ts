import type { ApiId } from "../../shared/types/api.types";

export const studentEndpoints = {
  register: "/admin/student/register",
  import: "/admin/student/import",
  importStatus: (batchId: ApiId) => `/admin/student/import-batches/${batchId}/status`,
  importErrors: (batchId: ApiId) => `/admin/student/import-batches/${batchId}/errors/export`,
  importHistory: "/admin/student/import-batches/history",
  filter: "/admin/students/filter",
  search: "/admin/students/search",
  details: (studentId: ApiId) => `/admin/students/${studentId}`,
  fullProfile: (enrollmentId: ApiId) => `/admin/students/${enrollmentId}/full-profile`,
  personal: (studentId: ApiId) => `/admin/students/${studentId}/personal`,
  guardianPersonal: (guardianId: ApiId) => `/admin/students/guardians/${guardianId}/personal`,
  enrollment: (enrollmentId: ApiId) => `/admin/students/enrollments/${enrollmentId}`,
  toggleAccount: (enrollmentId: ApiId) => `/admin/students/${enrollmentId}/toggle-account-status`,
  remove: (enrollmentId: ApiId) => `/admin/students/${enrollmentId}`,
} as const;
