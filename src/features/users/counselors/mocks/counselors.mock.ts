import type { CounselorUser } from "@/features/users/counselors/types/counselor.types";

export const counselorsMock: CounselorUser[] = [
  {
    id: "counselor-1",

    category: "counselor",

    counselorCode: "CNS-001",
    counselorEmail: "mary.johnson@school.com",

    firstName: "Mary",
    lastName: "Johnson",

    fatherName: "David",
    motherName: "Sarah",

    birthDate: "1989-04-15",
    birthPlace: "Amsterdam",

    gender: "female",
    nationality: "palestinian",

    address: "Amsterdam, Netherlands",
    phoneNumber: "+31 612 555 111",

    photoUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",

    recordStatus: "active",
    accountStatus: "enabled",

    createdAt: "2024-01-10",
    updatedAt: "2024-02-12",

    hireDate: "2018-09-01",

    degree: "master",
    specialization: "Psychology",

    yearsOfExperience: 7,

    university: "University of Amsterdam",
    graduationYear: "2017",

    office: "Building A - Room 204",
  },

  {
    id: "counselor-2",

    category: "counselor",

    counselorCode: "CNS-002",
    counselorEmail: "daniel.smith@school.com",

    firstName: "Daniel",
    lastName: "Smith",

    fatherName: "Robert",
    motherName: "Emma",

    birthDate: "1986-08-22",
    birthPlace: "Rotterdam",

    gender: "male",
    nationality: "palestinian",

    address: "Rotterdam, Netherlands",
    phoneNumber: "+31 623 444 222",

    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",

    recordStatus: "active",
    accountStatus: "enabled",

    createdAt: "2024-01-15",
    updatedAt: "2024-02-20",

    hireDate: "2016-02-01",

    degree: "phd",
    specialization: "Educational Counseling",

    yearsOfExperience: 10,

    university: "Leiden University",
    graduationYear: "2015",

    office: "Building B - Room 105",
  },
];