export type ProfileRole =
  | "super_admin"
  | "secretary"
  | "supervisor"
  | string;


export type DashboardProfileUser = {

  id: string;

  userId: string;

  role: ProfileRole[];

  fullName: string;

  firstName: string;

  lastName: string;


  phoneNumber: string;

  email: string;


  gender: string;

  birthDate: string | null;

  address: string;


  photoUrl: string;


  accountStatus: string;


  degree: string | null;

  specialization: string | null;

  university: string | null;


  graduationYear: number | null;


  hireDate: string | null;


  experienceYears: number | null;


  serviceType: string | null;


  isDeleted: boolean;


  deletedAt: string | null;


  createdAt: string;


};



export type ProfileIdentity = {

  email: string;

  roleLabel: string;

  code?: string;

};



export type ProfilePermissions = {

  canEditPersonalInfo: boolean;

  canChangePassword: boolean;

  canManageUsers: boolean;

};