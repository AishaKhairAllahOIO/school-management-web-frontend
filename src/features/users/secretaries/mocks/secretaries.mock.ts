import type { SecretaryUser } from "@/features/users/secretaries/types/secretary.types";

export const secretariesMock: SecretaryUser[] = [
  {
    id: "secretary-1",

    category: "secretary",

    secretaryCode: "SEC-001",
    secretaryEmail: "linda.wilson@school.com",

    firstName: "Linda",
    lastName: "Wilson",

    fatherName: "Michael",
    motherName: "Sophia",

    birthDate: "1991-08-14",
    birthPlace: "Amsterdam",

    gender: "female",
    nationality: "palestinian",

    address: "Amsterdam, Netherlands",
    phoneNumber: "+31 612 555 111",

    photoUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400",

    recordStatus: "active",
    accountStatus: "enabled",

    createdAt: "2024-01-12",
    updatedAt: "2024-02-18",

    hireDate: "2019-09-01",

    degree: "bachelor",
    specialization: "Business Administration",

    yearsOfExperience: 5,

    university: "University of Amsterdam",
    graduationYear: "2018",
  },

  {
    id: "secretary-2",

    category: "secretary",

    secretaryCode: "SEC-002",
    secretaryEmail: "james.clark@school.com",

    firstName: "James",
    lastName: "Clark",

    fatherName: "Robert",
    motherName: "Emma",

    birthDate: "1988-03-22",
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

    hireDate: "2017-02-10",

    degree: "master",
    specialization: "Educational Management",

    yearsOfExperience: 8,

    university: "Leiden University",
    graduationYear: "2016",
  },
];