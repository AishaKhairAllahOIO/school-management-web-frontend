export type SchoolImage = {
  id: string;
  url: string;
  name: string;
};

export type SchoolGeoLocation = {
  latitude: number | null;
  longitude: number | null;
};

export type GeneralSettings = {
  id: string;

  schoolName: string;
  shortName: string;
  description: string;

  phoneNumber: string;
  emergencyPhoneNumber: string;
  email: string;
  website?: string;

  address: string;
  city: string;
  country: string;

  location: SchoolGeoLocation;

  logoUrl?: string | null;
  images: SchoolImage[];

  defaultLanguage: string;
  timezone: string;
  dateFormat: string;
  currency: string;

  workingDays: string[];
  openingTime: string;
  closingTime: string;

  createdAt: string;
  updatedAt: string;
};

export type UpdateGeneralSettingsPayload = Omit<
  GeneralSettings,
  "id" | "logoUrl" | "images" | "createdAt" | "updatedAt"
>;


