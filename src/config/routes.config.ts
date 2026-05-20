export const routesConfig = {
  auth: {
    login: "/login",
  },

  dashboard: "/",

  users: {
    root: "/users",
    students: "/users/students",
    teachers: "/users/teachers",
    parents: "/users/parents",
    advisors: "/users/advisors",
    secretaries: "/users/secretaries",
    serviceStaff: "/users/service-staff",
    educationalStaff: "/users/educational-staff",
  },

  academics: {
    root: "/academics",
    classes: "/academics/classes",
    sections: "/academics/sections",
    subjects: "/academics/subjects",
    grades: "/academics/grades",
    exams: "/academics/exams",
  },

  attendance: {
    root: "/attendance",
    students: "/attendance/students",
    staff: "/attendance/staff",
  },

  finance: {
    root: "/finance",
    tuitionFees: "/finance/tuition-fees",
    installments: "/finance/installments",
    payments: "/finance/payments",
    salaries: "/finance/salaries",
  },

  scheduling: {
    root: "/scheduling",
    studentSchedule: "/scheduling/students",
    teacherSchedule: "/scheduling/teachers",
    examSchedule: "/scheduling/exams",
    holidays: "/scheduling/holidays",
  },

  communications: {
    root: "/communications",
    announcements: "/communications/announcements",
    notifications: "/communications/notifications",
    complaints: "/communications/complaints",
  },

  reports: {
    root: "/reports",
  },

  settings: {
    root: "/settings",
    roles: "/settings/roles",
    permissions: "/settings/permissions",
    schoolRules: "/settings/school-rules",
  },
};