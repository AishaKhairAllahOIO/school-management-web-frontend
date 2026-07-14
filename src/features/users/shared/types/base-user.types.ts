import type {
  AccountStatus,
  RecordStatus,
  UserGender,
  UserNationality,
} from "./user.enums";

export type BaseUser = {
  id: string;

  firstName: string;
  lastName: string;

  fatherName: string;
  motherName: string;

  birthDate: string;
  birthPlace: string;

  gender: UserGender;
  nationality: UserNationality;

  address: string;

  phoneNumber: string;

  photoUrl: string;

  recordStatus: RecordStatus;
  accountStatus: AccountStatus;

  createdAt: string;
  updatedAt: string;

  deletedAt?: string | null;
};