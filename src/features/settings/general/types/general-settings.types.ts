export type SchoolImage = {
  id: string;
  url: string;
  name: string;
};

export type SchoolGeoLocation = {
  latitude: number;
  longitude: number;
};

export type GeneralSettings = {
  id: number;

  schoolName: string;
  shortName: string;
  description: string;

  phoneNumber: string;
  emergencyPhoneNumber: string;

  email: string;
  website: string;

  address: string;
  city: string;
  country: string;

  location: SchoolGeoLocation;

  logoUrl: string | null;
  images: SchoolImage[];

  createdAt: string;
  updatedAt: string;
};

export type UpdateGeneralSettingsPayload = {
  schoolName: string;
  shortName: string;
  description: string;

  phoneNumber: string;
  emergencyPhoneNumber: string;

  email: string;
  website: string;

  address: string;
  city: string;
  country: string;

  location: SchoolGeoLocation;

  logo: string | null;
};

export type CreateSchoolImagePayload = {
  images: Array<{
    url: string;
    name: string;
  }>;
};

export type UpdateSchoolImagePayload = {
  imageId: string;
  data: {
    url: string;
    name: string;
  };
};