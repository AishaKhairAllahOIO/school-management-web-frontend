import type { ServiceStaffUser } from "@/features/users/service-staff/types/service-staff.types";

export const serviceStaffMock: ServiceStaffUser[] = [
  {
    id: "service-staff-1",

    category: "service_staff",

    firstName: "Ahmed",
    lastName: "Hassan",

    fatherName: "Mohammed",
    motherName: "Fatima",

    birthDate: "1987-05-12",
    birthPlace: "Damascus",

    gender: "male",
    nationality: "syrian",

    address: "Damascus, Syria",

    phoneNumber: "+963 944 111 222",

    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",

    recordStatus: "active",
    accountStatus: "enabled",

    createdAt: "2024-01-10",
    updatedAt: "2024-02-15",

    hireDate: "2021-09-01",

    jobType: "security",
  },

  {
    id: "service-staff-2",

    category: "service_staff",

    firstName: "Mariam",
    lastName: "Khaled",

    fatherName: "Khaled",
    motherName: "Amina",

    birthDate: "1992-03-18",
    birthPlace: "Aleppo",

    gender: "female",
    nationality: "syrian",

    address: "Aleppo, Syria",

    phoneNumber: "+963 955 222 333",

    photoUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",

    recordStatus: "active",
    accountStatus: "enabled",

    createdAt: "2024-01-12",
    updatedAt: "2024-02-20",

    hireDate: "2022-02-01",

    jobType: "cleaner",
  },

  {
    id: "service-staff-3",

    category: "service_staff",

    firstName: "Omar",
    lastName: "Saleh",

    fatherName: "Saleh",
    motherName: "Nour",

    birthDate: "1985-11-09",
    birthPlace: "Homs",

    gender: "male",
    nationality: "syrian",

    address: "Homs, Syria",

    phoneNumber: "+963 933 444 555",

    photoUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400",

    recordStatus: "active",
    accountStatus: "enabled",

    createdAt: "2024-01-15",
    updatedAt: "2024-02-22",

    hireDate: "2020-06-10",

    jobType: "maintenance",
  },
];