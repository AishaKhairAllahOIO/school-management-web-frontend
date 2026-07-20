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

    GENERAL_IMAGES: "/admin/settings/general/images",
    GENERAL_IMAGE: (imageId: string) =>
      `/admin/settings/general/images/${imageId}`,

    ACADEMIC: "/admin/settings",

    ACADEMIC_YEARS: "/admin/settings/years",
    ACADEMIC_YEAR: (yearId: string) =>
      `/admin/settings/years/${yearId}`,

    ACADEMIC_TERMS: "/admin/settings/terms",
    ACADEMIC_TERM: (termId: string) =>
      `/admin/settings/terms/${termId}`,

    ACADEMIC_STAGES: "/admin/settings/stages",
    ACADEMIC_STAGE: (stageId: string) =>
      `/admin/settings/stages/${stageId}`,

    ACADEMIC_GRADES: "/admin/settings/grades",
    ACADEMIC_GRADE: (gradeId: string) =>
      `/admin/settings/grades/${gradeId}`,

    ACADEMIC_CONFIGURATIONS: "/admin/settings/configurations",
    ACADEMIC_CONFIGURATION: (configurationId: string) =>
      `/admin/settings/configurations/${configurationId}`,

    ACADEMIC_CLASSROOMS: "/admin/settings/classrooms",
    ACADEMIC_CLASSROOM: (classroomId: string) =>
      `/admin/settings/classrooms/${classroomId}`,
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

    DELETE: (enrollmentId: ApiId) =>
      `/admin/students/${enrollmentId}`,
  },

  STAFF: {
    REGISTER: "/admin/staff/register",

    IMPORT: "/admin/staff/import",

    IMPORT_STATUS: (batchId: ApiId) =>
      `/admin/staff/import-batches/${batchId}/status`,

    IMPORT_ERRORS: (batchId: ApiId) =>
      `/admin/staff/import-batches/${batchId}/errors/export`,

    LIST: "/admin/staff/showAllStaff",

    SEARCH: "/admin/staff/search",

    ALPHABETICAL: "/admin/staff/alphabetical",

    DETAILS: (staffId: ApiId) =>
      `/admin/staff/showStaff/${staffId}`,

    PERSONAL: (staffId: ApiId) =>
      `/admin/staff/${staffId}/personal`,

    EMPLOYMENT: (staffId: ApiId) =>
      `/admin/staff/${staffId}/employment`,

    TOGGLE_STATUS: (staffId: ApiId) =>
      `/admin/staff/${staffId}/toggle-status`,

    DELETE: (staffId: ApiId) =>
      `/admin/staff/${staffId}`,
  },

  FINANCIAL: {
    BASE: "/admin/finance/settings",

    POLICIES: "/admin/finance/settings/policies",

    FEE_PLANS: "/admin/finance/settings/fee-plans",

    POLICY_ITEMS: "/admin/finance/settings/policy-items",

    EXTRA_SERVICES: "/admin/finance/settings/extra-services",
<<<<<<< HEAD
  },
} as const;
=======
},
FINANCE_OPERATIONS: {
    ACCOUNTS: "/admin/finance/contracts/accounts", // [cite: 11, 15]
    ACCOUNT: (studentId: string | number) =>
      `/admin/finance/contracts/accounts/${studentId}`, // [cite: 61, 65]
    
    FINALIZE_CONTRACT: "/admin/finance/contracts/finalize", // [cite: 113, 117]
    UPDATE_CONTRACT: (studentId: string | number) =>
      `/admin/finance/contracts/${studentId}`, // [cite: 210, 214]
    
    INSTALLMENTS: "/admin/finance/contracts/installments", // [cite: 260, 262]
    INSTALLMENT: (id: string | number) =>
      `/admin/finance/contracts/installments/${id}`, // [cite: 293, 295]
    
    PAYMENTS: "/admin/finance/contracts/payments", // [cite: 324, 326, 385, 387]
    PAYMENT: (id: string | number) =>
      `/admin/finance/contracts/payments/${id}`, // [cite: 355, 358, 451, 456, 497, 500]
  },
} as const;
>>>>>>> 4c33aa0bb0599ed41df0717b21f604f764adeb0c
