import type { DashboardProfileUser } from "@/features/profile/types/profile.types";

const currentUserMock: DashboardProfileUser = {
  id: "super-admin-1",

  category: "super_admin",

  firstName: "Sarah",
  lastName: "Johnson",

  fatherName: "Michael",
  motherName: "Olivia",

  birthDate: "1990-05-14",
  birthPlace: "Amsterdam",

  gender: "female",
  nationality: "syrian",

  address: "Amsterdam, Netherlands",
  phoneNumber: "+31 612 345 678",

  photoUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",

  recordStatus: "active",
  accountStatus: "enabled",

  createdAt: "2024-01-10",
  updatedAt: "2024-02-15",

  hireDate: "2021-09-01",

  degree: "master",
  specialization: "School Administration",

  yearsOfExperience: 7,

  university: "University of Amsterdam",
  graduationYear: "2018",

  superAdminCode: "ADM-001",
  superAdminEmail: "sarah.johnson@school.com",
};

export function useCurrentUser() {
  return {
    user: currentUserMock,
  };
}