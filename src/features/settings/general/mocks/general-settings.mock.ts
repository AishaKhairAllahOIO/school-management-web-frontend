import type { GeneralSettings } from "@/features/settings/general/types/general-settings.types";

export const generalSettingsMock: GeneralSettings = {
  id: "school-config-001",

  schoolName: "SM Academy",
  shortName: "SMA",
  description:
    "Excellence in Education. Empowering students with knowledge, skills, and values for a better tomorrow.",

  phoneNumber: "+1 (555) 123-4567",
  emergencyPhoneNumber: "+1 (555) 911-0000",
  email: "info@smacademy.edu",
  website: "https://www.smacademy.edu",

  address: "123 Education Lane, Manhattan, New York",
  city: "New York",
  country: "United States",

  location: {
    latitude: 40.7128,
    longitude: -74.006,
  },

  logoUrl: null,

  images: [],

  defaultLanguage: "English",
  timezone: "(UTC-05:00) Eastern Time",
  dateFormat: "MM/DD/YYYY",
  currency: "USD - US Dollar",

  workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  openingTime: "08:00 AM",
  closingTime: "03:00 PM",


  createdAt: "2024-05-15T10:00:00.000Z",
  updatedAt: "2025-05-20T10:45:00.000Z",
};