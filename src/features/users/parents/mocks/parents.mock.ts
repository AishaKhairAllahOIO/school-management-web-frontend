import type { ParentUser } from "@/features/users/parents/types/parent.types";

export const parentsMock: ParentUser[] = [
  {
    id: "parent-1",

    category: "parent",

    parentCode: "PAR-001",

    occupation: "Software Engineer",
    relation: "father",

    firstName: "Michael",
    lastName: "Johnson",

    fatherName: "Robert",
    motherName: "Emily",

    birthDate: "1984-06-12",
    birthPlace: "Amsterdam",

    gender: "male",
    nationality: "palestinian",

    address: "Amsterdam, Netherlands",

    phoneNumber: "+31 612 445 778",

    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",

    recordStatus: "active",
    accountStatus: "enabled",

    createdAt: "2024-01-10",
    updatedAt: "2024-02-12",
  },

  {
    id: "parent-2",

    category: "parent",

    parentCode: "PAR-002",

    occupation: "Doctor",
    relation: "mother",

    firstName: "Sophia",
    lastName: "Brown",

    fatherName: "David",
    motherName: "Laura",

    birthDate: "1987-03-18",
    birthPlace: "Rotterdam",

    gender: "female",
    nationality: "palestinian",

    address: "Rotterdam, Netherlands",

    phoneNumber: "+31 623 778 900",

    photoUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",

    recordStatus: "active",
    accountStatus: "enabled",

    createdAt: "2024-01-15",
    updatedAt: "2024-02-14",
  },
];