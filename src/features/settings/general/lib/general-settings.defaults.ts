import type { GeneralSettings } from "../types/general-settings.types";

export function createEmptyGeneralSettings(): GeneralSettings {
  return {
    id: 0,

    schoolName: "",
    shortName: "",
    description: "",

    phoneNumber: "",
    emergencyPhoneNumber: "",

    email: "",
    website: "",

    address: "",
    city: "",
    country: "",

    location: {
      latitude: 0,
      longitude: 0,
    },

    logoUrl: null,
    images: [],

    createdAt: "",
    updatedAt: "",
  };
}