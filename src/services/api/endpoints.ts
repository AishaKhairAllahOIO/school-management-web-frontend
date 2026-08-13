type ApiId = string | number;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    VERIFY_LOGIN_OTP: "/auth/verify-otp",

    FORGOT_PASSWORD: "/auth/password/forgot",
    VERIFY_PASSWORD_OTP: "/auth/password/verify-otp",
    RESEND_PASSWORD_OTP: "/auth/password/resend-otp",
    RESET_PASSWORD: "/auth/password/reset",

    LOGOUT: "/auth/logout",

    DEVICE_TOKENS: "/auth/device-tokens",
  },

  SETTINGS: {
    GENERAL: "/admin/settings/general",

    GENERAL_BASIC: "/admin/settings/general/basic",

    GENERAL_IMAGES: "/admin/settings/general/images",

    GENERAL_IMAGE: (imageId: ApiId) =>
      `/admin/settings/general/images/${imageId}`,

    ACADEMIC: "/admin/settings",

    ACADEMIC_STATISTICS:
      "/admin/settings/academic/statistics",

    ACADEMIC_YEARS: "/admin/settings/years",

    ACADEMIC_YEAR: (yearId: ApiId) =>
      `/admin/settings/years/${yearId}`,

    ACADEMIC_TERMS: "/admin/settings/terms",

    ACADEMIC_TERM: (termId: ApiId) =>
      `/admin/settings/terms/${termId}`,

    ACADEMIC_STAGES: "/admin/settings/stages",

    ACADEMIC_STAGE: (stageId: ApiId) =>
      `/admin/settings/stages/${stageId}`,

    ACADEMIC_GRADES: "/admin/settings/grades",

    ACADEMIC_GRADE: (gradeId: ApiId) =>
      `/admin/settings/grades/${gradeId}`,

    ACADEMIC_CONFIGURATIONS:
      "/admin/settings/configurations",

    ACADEMIC_CONFIGURATION: (
      configurationId: ApiId,
    ) =>
      `/admin/settings/configurations/${configurationId}`,

    ACADEMIC_CLASSROOMS:
      "/admin/settings/classrooms",

    ACADEMIC_CLASSROOM: (classroomId: ApiId) =>
      `/admin/settings/classrooms/${classroomId}`,

    ATTENDANCE: {
      STUDENT_SETTINGS: {
        LIST: "/attendance-settings",

        CREATE: "/attendance-settings",

        BY_SEMESTER: (semesterId: ApiId) =>
          `/attendance-settings/semester/${semesterId}`,

        UPDATE: (settingId: ApiId) =>
          `/attendance-settings/${settingId}`,

        DELETE: (settingId: ApiId) =>
          `/attendance-settings/${settingId}`,
      },

      STAFF_SETTINGS: {
        LIST: "/staff-attendance-settings",

        CREATE: "/staff-attendance-settings",

        UPDATE: (settingId: ApiId) =>
          `/staff-attendance-settings/${settingId}`,

        DELETE: (settingId: ApiId) =>
          `/staff-attendance-settings/${settingId}`,
      },
    },
  },

  STUDENTS: {
    REGISTER: "/admin/student/register",

    IMPORT: "/admin/student/import",

    IMPORT_STATUS: (batchId: ApiId) =>
      `/admin/student/import-batches/${batchId}/status`,

    IMPORT_ERRORS: (batchId: ApiId) =>
      `/admin/student/import-batches/${batchId}/errors/export`,

    IMPORT_HISTORY:
      "/admin/student/import-batches/history",

    FILTER: "/admin/students/filter",

    SEARCH: "/admin/students/search",

    DETAILS: (studentId: ApiId) =>
      `/admin/students/${studentId}`,

    FULL_PROFILE: (enrollmentId: ApiId) =>
      `/admin/students/${enrollmentId}/full-profile`,

    PERSONAL: (studentId: ApiId) =>
      `/admin/students/${studentId}/personal`,

    GUARDIAN_PERSONAL: (guardianId: ApiId) =>
      `/admin/students/guardians/${guardianId}/personal`,

    ENROLLMENT: (enrollmentId: ApiId) =>
      `/admin/students/enrollments/${enrollmentId}`,

    TOGGLE_ACCOUNT_STATUS: (enrollmentId: ApiId) =>
      `/admin/students/${enrollmentId}/toggle-account-status`,

    DELETE: (studentId: ApiId) =>
      `/admin/students/${studentId}`,

    RESTORE: (enrollmentId: ApiId) =>
      `/admin/students/${enrollmentId}/student/restore`,
  },

  STAFF: {
    REGISTER: "/admin/staff/register",

    IMPORT: (role: string) =>
      `/admin/staff/import/${encodeURIComponent(role)}`,

    IMPORT_STATUS: (batchId: ApiId) =>
      `/admin/staff/import-batches/${batchId}/status`,

    IMPORT_ERRORS: (batchId: ApiId) =>
      `/admin/staff/import-batches/${batchId}/errors/export`,

    ALPHABETICAL: "/admin/staff/alphabetical",

    DETAILS: (staffId: ApiId) =>
      `/admin/staff/showStaff/${staffId}`,

    PERSONAL: (staffId: ApiId) =>
      `/admin/staff/${staffId}/personal`,

    ROLE_COUNTS: "/admin/staff/counts/roles",

    BY_ROLE: (role: string) =>
      `/admin/staff/role/${encodeURIComponent(role)}`,

    ROLE_SEARCH: (role: string) =>
      `/admin/staff/role/${encodeURIComponent(role)}/search`,

    PROFILE: "/admin/staff/profile",

    TOGGLE_STATUS: (staffId: ApiId) =>
      `/admin/staff/${staffId}/toggle-status`,

    DELETE: (staffId: ApiId) =>
      `/admin/staff/${staffId}`,

    LIST: "/admin/staff/showAllStaff",

    RESTORE: (staffId: ApiId) =>
      `/admin/staff/${staffId}/restore`,

    ASSIGNMENTS: (staffId: ApiId) =>
      `/admin/staff/${staffId}/assignments`,

    ASSIGNMENT: (
      staffId: ApiId,
      assignmentId: ApiId,
    ) =>
      `/admin/staff/${staffId}/assignments/${assignmentId}`,

    WORKLOADS: (staffId: ApiId) =>
      `/admin/staff/${staffId}/workloads`,

    WORKLOAD: (
      staffId: ApiId,
      workloadId: ApiId,
    ) =>
      `/admin/staff/${staffId}/workloads/${workloadId}`,
  },

  ACADEMICS: {
    SUBJECTS: {
      LIST: "/subject/setting/subjects/show",

      CREATE: "/subject/setting/subject/store",

      UPDATE: (subjectId: ApiId) =>
        `/subject/setting/subjects/update/${subjectId}`,

      DELETE: (subjectId: ApiId) =>
        `/subject/setting/subject/delete/${subjectId}`,
    },

    GRADE_SUBJECTS: {
      LIST:
        "/subject/setting/grade/subjects/show",

      DETAILS: (gradeSubjectId: ApiId) =>
        `/subject/setting/grade/subjects/show/${gradeSubjectId}`,

      CREATE:
        "/subject/setting/grade/subject/store",

      UPDATE: (gradeSubjectId: ApiId) =>
        `/subject/setting/grade/subjects/update/${gradeSubjectId}`,

      DELETE: (gradeSubjectId: ApiId) =>
        `/subject/setting/grade/subject/delete/${gradeSubjectId}`,
    },

    ASSESSMENTS: {
      LIST:
        "/subject/setting/assessment/subjects/show",

      GROUPED:
        "/subject/setting/assessment/subjects/grouped",

      DETAILS: (assessmentId: ApiId) =>
        `/subject/setting/assessment/subject/show/${assessmentId}`,

      CREATE:
        "/subject/setting/assessment/subject/store",

      UPDATE: (assessmentId: ApiId) =>
        `/subject/setting/assessment/subject/update/${assessmentId}`,

      DELETE: (assessmentId: ApiId) =>
        `/subject/setting/assessment/subject/delete/${assessmentId}`,
    },
  },

  FINANCIAL: {
    POLICIES:
      "/admin/finance/settings/policies",

    POLICY: (policyId: ApiId) =>
      `/admin/finance/settings/policies/${policyId}`,

    FEE_PLANS:
      "/admin/finance/settings/fee-plans",

    FEE_PLAN: (feePlanId: ApiId) =>
      `/admin/finance/settings/fee-plans/${feePlanId}`,

    POLICY_ITEM: (policyItemId: ApiId) =>
      `/admin/finance/settings/policy-items/${policyItemId}`,

    EXTRA_SERVICES:
      "/admin/finance/settings/extra-services",

    EXTRA_SERVICE: (extraServiceId: ApiId) =>
      `/admin/finance/settings/extra-services/${extraServiceId}`,
  },

  FINANCE_OPERATIONS: {
    ACCOUNTS:
      "/admin/finance/contracts/accounts",

    ACCOUNT: (studentId: ApiId) =>
      `/admin/finance/contracts/accounts/${studentId}`,

    FINALIZE_CONTRACT:
      "/admin/finance/contracts/finalize",

    UPDATE_CONTRACT: (accountId: ApiId) =>
      `/admin/finance/contracts/${accountId}`,

    INSTALLMENTS:
      "/admin/finance/contracts/installments",

    INSTALLMENT: (installmentId: ApiId) =>
      `/admin/finance/contracts/installments/${installmentId}`,

    PAYMENTS:
      "/admin/finance/contracts/payments",

    PAYMENT: (paymentId: ApiId) =>
      `/admin/finance/contracts/payments/${paymentId}`,
  },

  COMMUNICATIONS: {
    BELL_UNREAD_COUNT: "/auth/bell/count/unread",
    BELL_MARK_ALL_READ: "/auth/bell/mark/all/read",

    CREATE_ACTIVITY: "/auth/activity/create",

    UPDATE_ACTIVITY: (activityId: ApiId) =>
      `/auth/activity/update/${activityId}`,

    DELETE_ACTIVITY: (activityId: ApiId) =>
      `/auth/activity/delete/${activityId}`,

    ACTIVITY: (activityId: ApiId) =>
      `/auth/activity/show/one/${activityId}`,

    ALL_ACTIVITIES:
      "/auth/activity/show/all",

    CREATE_ANNOUNCEMENT:
      "/auth/announcements",

    UPDATE_ANNOUNCEMENT: (
      announcementId: ApiId,
    ) =>
      `/auth/announcement/update/${announcementId}`,

    DELETE_ANNOUNCEMENT: (
      announcementId: ApiId,
    ) =>
      `/auth/announcements/${announcementId}`,

    STAFF_ANNOUNCEMENTS:
      "/auth/staff-announcements",

    CREATOR_ANNOUNCEMENTS:
      "/auth/creater/show/announcements",

    MY_ANNOUNCEMENTS:
      "/user/my-announcements",

    CHILD_ANNOUNCEMENTS:
      "/user/child-announcements",

    ANNOUNCEMENTS_UNREAD_COUNT:
      "/auth/announcements/unread-count",

    MARK_ALL_ANNOUNCEMENTS_READ:
      "/auth/announcements/mark-all-read",

    USER_ANNOUNCEMENTS_UNREAD_COUNT:
      "/user/announcements/unread-count",

    MARK_ALL_USER_ANNOUNCEMENTS_READ:
      "/user/announcements/mark-all-read",

    ALERTS: "/auth/alerts",

    STAFF_ALERTS:
      "/auth/alerts/show/general/staff",

    PAYMENT_ALERTS:
      "/auth/alerts/show/payments/staff",

    ALERTS_UNREAD_COUNT:
      "/auth/alerts/unread-count",

    MARK_ALL_ALERTS_READ:
      "/auth/alerts/mark-all-read",

    DELETE_ALERT: (alertId: ApiId) =>
      `/auth/delete/alert/${alertId}`,

    ADVISOR_ALERTS:
      "/auth/alerts/for-student/send",

    TEACHER_ALERTS:
      "/auth/teacher/teacher-alerts",

    MY_ALERTS:
      "/user/my-alerts",

    CHILD_ALERTS: (studentId: ApiId) =>
      `/user/child-alerts/${studentId}`,

    CHILD_PAYMENT_ALERTS: (studentId: ApiId) =>
      `/user/payment-alerts/${studentId}`,

    USER_ALERTS_UNREAD_COUNT:
      "/user/alerts/unread-count",

    MARK_ALL_USER_ALERTS_READ:
      "/user/alerts/mark-all-read",

    CREATED_ALERTS:
      "/auth/created/alerts/show/by/role",

    UPDATE_CREATED_ALERT: (id: ApiId) =>
      `/auth/created/alerts/update/${id}`,

    DELETE_CREATED_ALERT: (id: ApiId) =>
      `/auth/created/alerts/delete/group/${id}`,
  },

  SYSTEM_NOTICES: {
    LIST:
      "/auth/system-notices/show/alerts",

    UNREAD_COUNT:
      "/auth/system-notices/unread-count",

    MARK_ALL_READ:
      "/auth/system-notices/mark-all-read",
  },

  SCHOOL_LAWS: {
    GET_ALL: "/auth/school/laws/all/show",

    GET_ONE: (lawId: ApiId) =>
      `/auth/school/law/one/show/${lawId}`,

    CREATE: "/auth/school/law/create",

    UPDATE: (lawId: ApiId) =>
      `/auth/school/law/update/${lawId}`,

    DELETE: (lawId: ApiId) =>
      `/auth/school/law/delete/${lawId}`,
  },

  ATTENDANCE: {
    STUDENT_RECORDS: {
      CREATE: "/admin/attendance/bulk",
      FILTER: "/admin/attendance/filter", 
      DETAILS: (recordId: ApiId) => `/admin/attendance/getRecord/${recordId}`,
      UPDATE: (recordId: ApiId) => `/admin/attendance/record/${recordId}`,
      DELETE: (recordId: ApiId) => `/admin/attendance/record/${recordId}`,
    },

    STUDENT_SETTINGS: {
      LIST: "/attendance-settings",
      CREATE: "/attendance-settings",
      BY_SEMESTER: (semesterId: ApiId) =>
        `/attendance-settings/semester/${semesterId}`,
      UPDATE: (settingId: ApiId) =>
        `/attendance-settings/${settingId}`,
      DELETE: (settingId: ApiId) =>
        `/attendance-settings/${settingId}`,
    },

    STAFF_RECORDS: {
      CREATE: "/admin/staff-attendances",
      DETAILS: (id: ApiId) => `/admin/staff-attendances/${id}`,
      UPDATE: (id: ApiId) => `/admin/staff-attendances/${id}`,
      DELETE: (id: ApiId) => `/admin/staff-attendances/${id}`,
      HISTORY: (staffId: ApiId) => `/admin/staff-attendances/staff/${staffId}`,
    },

    STAFF_LEAVES: {
      CREATE: "/admin/staff-leaves",
      LIST_BY_STAFF: (staffId: ApiId) => `/admin/staff-leaves/${staffId}`,
      DETAILS: (leaveId: ApiId) => `/admin/staff-leaves/${leaveId}/staff`,
      UPDATE: (id: ApiId) => `/admin/staff-leaves/${id}`,
      DELETE: (id: ApiId) => `/admin/staff-leaves/${id}`,
    },
  },
   SCHEDULING: {
    GENERATE: "/scheduale/generate",
    REGENERATE: "/scheduale/regenerate",
    ADMIN_VIEW: "/scheduale/show/all",
    TEACHER_VIEW: "/scheduale/teacher/show",

    UPDATE_ENTRY: (
      entryId: number | string,
    ) => `/scheduale/update/${entryId}`,
  },
} as const;