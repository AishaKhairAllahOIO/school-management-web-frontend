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
  website: string;

  address: string;
  city: string;
  country: string;

  location: SchoolGeoLocation;

  logoUrl: string | null;
  images: SchoolImage[];

  createdAt: string | null;
  updatedAt: string | null;
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

  location: {
    latitude: number;
    longitude: number;
  };

  logo?: File;
};

export type SchoolImageUploadItem = {
  file: File;
  name: string;
};

export type CreateSchoolImagesPayload = {
  images: SchoolImageUploadItem[];
};

export type UpdateSchoolImagePayload = {
  imageId: string;
  name?: string;
  file?: File;
};
