import { API_ENDPOINTS } from "@/services/api/endpoints";

import type {
  ApiId,
} from "../../shared/types/api.types";

export const staffEndpoints = {
  /**
   * تسجيل موظف جديد.
   */
  register:
    API_ENDPOINTS.STAFF.REGISTER,

  /**
   * استيراد الموظفين من Excel.
   */
  import:
    API_ENDPOINTS.STAFF.IMPORT,

  /**
   * متابعة حالة دفعة الاستيراد.
   */
  importStatus: (
    batchId: ApiId,
  ) =>
    API_ENDPOINTS.STAFF.IMPORT_STATUS(
      batchId,
    ),

  /**
   * تنزيل ملف أخطاء الاستيراد.
   */
  importErrors: (
    batchId: ApiId,
  ) =>
    API_ENDPOINTS.STAFF.IMPORT_ERRORS(
      batchId,
    ),

  /**
   * جميع الموظفين دون فصلهم حسب النوع.
   */
  list:
    API_ENDPOINTS.STAFF.LIST,

  /**
   * البحث في الموظفين.
   */
  search:
    API_ENDPOINTS.STAFF.SEARCH,

  /**
   * الترتيب الأبجدي.
   */
  alphabetical:
    API_ENDPOINTS.STAFF.ALPHABETICAL,

  /**
   * تفاصيل موظف محدد.
   */
  details: (
    staffId: ApiId,
  ) =>
    API_ENDPOINTS.STAFF.DETAILS(
      staffId,
    ),

  /**
   * تعديل البيانات الشخصية.
   */
  personal: (
    staffId: ApiId,
  ) =>
    API_ENDPOINTS.STAFF.PERSONAL(
      staffId,
    ),

  /**
   * تعديل بيانات التوظيف.
   */
  employment: (
    staffId: ApiId,
  ) =>
    API_ENDPOINTS.STAFF.EMPLOYMENT(
      staffId,
    ),

  /**
   * أعداد الموظفين مفصّلة بحسب الدور.
   *
   * GET /admin/staff/counts/roles
   */
  roleCounts:
    API_ENDPOINTS.STAFF.ROLE_COUNTS,

  /**
   * جلب موظفي نوع واحد فقط.
   *
   * أمثلة:
   * teacher
   * supervisor
   * secretary
   * counselor
   * service_staff
   */
  byRole: (
    role: string,
  ) =>
    API_ENDPOINTS.STAFF.BY_ROLE(
      role,
    ),

  /**
   * بروفايل الموظف الحالي المسجل.
   */
  profile:
    API_ENDPOINTS.STAFF.PROFILE,

  /**
   * تفعيل أو تعطيل حساب موظف.
   */
  toggleStatus: (
    staffId: ApiId,
  ) =>
    API_ENDPOINTS.STAFF.TOGGLE_STATUS(
      staffId,
    ),

  /**
   * حذف موظف.
   */
  remove: (
    staffId: ApiId,
  ) =>
    API_ENDPOINTS.STAFF.DELETE(
      staffId,
    ),
} as const;