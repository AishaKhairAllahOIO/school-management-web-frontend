import type { SupervisorUser } from "@/features/users/supervisors/types/supervisor.types";

export const supervisorsMock: SupervisorUser[] = [
  {
    id: "supervisor-1",

    category: "supervisor",

    supervisorCode: "SUP-001",
    supervisorEmail: "ahmed.supervisor@school.com",

    firstName: "Ahmed",
    lastName: "Khaled",

    fatherName: "Mohammed",
    motherName: "Fatima",

    birthDate: "1985-04-18",
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
    updatedAt: "2024-02-12",

    hireDate: "2015-09-01",

    degree: "master",
    specialization: "Educational Leadership",

    yearsOfExperience: 10,

    university: "Damascus University",
    graduationYear: "2014",
  },

  {
    id: "supervisor-2",

    category: "supervisor",

    supervisorCode: "SUP-002",
    supervisorEmail: "sara.supervisor@school.com",

    firstName: "Sara",
    lastName: "Hassan",

    fatherName: "Ali",
    motherName: "Nour",

    birthDate: "1988-08-09",
    birthPlace: "Aleppo",

    gender: "female",
    nationality: "syrian",

    address: "Aleppo, Syria",
    phoneNumber: "+963 955 333 444",

    photoUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",

    recordStatus: "active",
    accountStatus: "enabled",

    createdAt: "2024-01-15",
    updatedAt: "2024-02-18",

    hireDate: "2017-02-01",

    degree: "bachelor",
    specialization: "School Administration",

    yearsOfExperience: 8,

    university: "Aleppo University",
    graduationYear: "2016",
  },
];