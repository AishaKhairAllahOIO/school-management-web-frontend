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

    ACADEMIC_CONFIGURATIONS:
      "/admin/settings/configurations",

    ACADEMIC_CONFIGURATION: (
      configurationId: string,
    ) =>
      `/admin/settings/configurations/${configurationId}`,

    ACADEMIC_CLASSROOMS:
      "/admin/settings/classrooms",

    ACADEMIC_CLASSROOM: (classroomId: string) =>
      `/admin/settings/classrooms/${classroomId}`,
  },

  STUDENTS: {
    REGISTER: "/admin/student/register",

    IMPORT: "/admin/student/import",

    IMPORT_STATUS: (batchId: number | string) =>
      `/admin/student/import-batches/${batchId}/status`,

    IMPORT_ERRORS: (batchId: number | string) =>
      `/admin/student/import-batches/${batchId}/errors/export`,

    LIST: "/admin/students",

    DETAILS: (studentId: number | string) =>
      `/admin/students/${studentId}`,

    FULL_PROFILE: (enrollmentId: number | string) =>
      `/admin/students/${enrollmentId}/full-profile`,

    PERSONAL: (studentId: number | string) =>
      `/admin/students/${studentId}/personal`,

    ENROLLMENT: (enrollmentId: number | string) =>
      `/admin/students/enrollments/${enrollmentId}`,

    GUARDIAN_PERSONAL: (
      guardianId: number | string,
    ) =>
      `/admin/students/guardians/${guardianId}/personal`,

    DELETE: (studentId: number | string) =>
      `/admin/students/${studentId}`,

    TOGGLE_ACCOUNT_STATUS: (
      studentId: number | string,
    ) =>
      `/admin/students/${studentId}/toggle-account-status`,
  },
} as const;