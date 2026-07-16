import type { ApiId } from "../../shared/types/api.types";

export const staffEndpoints = {
  register: "/admin/staff/register",
  import: "/admin/staff/import",
  importStatus: (batchId: ApiId) => `/admin/staff/import-batches/${batchId}/status`,
  importErrors: (batchId: ApiId) => `/admin/staff/import-batches/${batchId}/errors/export`,
  list: "/admin/staff/showAllStaff",
  search: "/admin/staff/search",
  alphabetical: "/admin/staff/alphabetical",
  details: (staffId: ApiId) => `/admin/staff/showStaff/${staffId}`,
  personal: (staffId: ApiId) => `/admin/staff/${staffId}/personal`,
  employment: (staffId: ApiId) => `/admin/staff/${staffId}/employment`,
  toggleStatus: (staffId: ApiId) => `/admin/staff/${staffId}/toggle-status`,
  remove: (staffId: ApiId) => `/admin/staff/${staffId}`,
} as const;
