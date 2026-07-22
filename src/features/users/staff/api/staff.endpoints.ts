import type {
  ApiId,
  StaffRole,
} from "../types/staff.types";

const STAFF_BASE =
  "/admin/staff";

export const staffEndpoints = {
  byRole: (
    role: StaffRole,
  ) =>
    `${STAFF_BASE}/role/${encodeURIComponent(role)}`,

  details: (
    staffId: ApiId,
  ) =>
    `${STAFF_BASE}/showStaff/${staffId}`,

  register:
    `${STAFF_BASE}/register`,

  personal: (
    staffId: ApiId,
  ) =>
    `${STAFF_BASE}/${staffId}/personal`,

  employment: (
    staffId: ApiId,
  ) =>
    `${STAFF_BASE}/${staffId}/employment`,

  toggleStatus: (
    staffId: ApiId,
  ) =>
    `${STAFF_BASE}/${staffId}/toggle-status`,

  remove: (
    staffId: ApiId,
  ) =>
    `${STAFF_BASE}/${staffId}`,

  import:
    `${STAFF_BASE}/import`,

  importStatus: (
    batchId: ApiId,
  ) =>
    `${STAFF_BASE}/import-batches/${batchId}/status`,

  importErrors: (
    batchId: ApiId,
  ) =>
    `${STAFF_BASE}/import-batches/${batchId}/errors/export`,
} as const;