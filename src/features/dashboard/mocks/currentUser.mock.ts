import type { SuperAdminUser } from "@/features/users/super-admin/types/super-admin.types";

export const currentUserMock: SuperAdminUser = {
  id: "super-admin-001",

  category: "super_admin",

  firstName: "Aisha",
  lastName: "Khairallah",

  fatherName: "Mohammad",
  motherName: "Mariam",

  birthDate: "1992-05-14",
  birthPlace: "Damascus",

  gender: "female",
  nationality: "syrian",

  address: "Damascus, Syria",
  phoneNumber: "+963 944 000 000",
  photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",

  recordStatus: "active",
  accountStatus: "enabled",

  createdAt: "2026-01-01",
  updatedAt: "2026-05-01",
  deletedAt: null,

  hireDate: "2020-09-01",
  degree: "master",
  university: "Damascus University",
  graduationYear: 2016,
  yearsOfExperience: 8,

  superAdminCode: "SA-2026-001",
  superAdminEmail: "aisha.khairallah@school.com",
};