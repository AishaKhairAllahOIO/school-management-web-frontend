import type { TranslationDictionary } from "./types";

export const en: TranslationDictionary = {
  common: {
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    search: "Search",
    loading: "Loading...",
    noData: "No data available",
    back: "Back",
    close: "Close",
    confirm: "Confirm",
  },

  navigation: {
    dashboard: "Dashboard",
    users: "Users",
    academics: "Academics",
    attendance: "Attendance",
    scheduling: "Scheduling",
    finance: "Finance",
    communications: "Communications",
    reports: "Reports",
    settings: "Settings",
    profile: "Profile",
  },

  auth: {
    login: "Login",
    logout: "Logout",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    rememberMe: "Remember Me",
  },

  validation: {
    required: "This field is required",
    invalidEmail: "Please enter a valid email address",
    minLength: "The value is too short",
    maxLength: "The value is too long",
  },

  errors: {
    somethingWentWrong: "Something went wrong",
    unauthorized: "Unauthorized",
    forbidden: "Access denied",
    notFound: "Resource not found",
  },
};