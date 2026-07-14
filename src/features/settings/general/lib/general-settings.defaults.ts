import type { GeneralSettings } from "../types/general-settings.types";

export function createEmptyGeneralSettings(): GeneralSettings {
  return {
    id: "",

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
      latitude: null,
      longitude: null,
    },

    logoUrl: null,
    images: [],

    createdAt: null,
    updatedAt: null,
  };
}
