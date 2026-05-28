import type { StudentUser } from "@/features/users/students/types/student.types";

export const studentsMock: StudentUser[] = [
  {
    id: "student-1",
    category: "student",
    studentCode: "STD-001",
    parentId: "parent-1",
    grade: "grade_9",
    classroomId: "classroom-9a",
    enrollmentDate: "2023-09-01",
    academicStatus: "studying",

    firstName: "Emma",
    lastName: "Johnson",
    fatherName: "John",
    motherName: "Sarah",
    birthDate: "2010-04-12",
    birthPlace: "Amsterdam",
    gender: "female",
    nationality: "dutch",
    address: "Amsterdam, Netherlands",
    phoneNumber: "+31 612 345 678",
    photoUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",

    recordStatus: "active",
    accountStatus: "enabled",
    createdAt: "2024-01-12",
    updatedAt: "2024-02-20",
  },
  {
    id: "student-2",
    category: "student",
    studentCode: "STD-002",
    parentId: "parent-2",
    grade: "grade_10",
    classroomId: "classroom-10b",
    enrollmentDate: "2022-09-01",
    academicStatus: "passed",

    firstName: "Liam",
    lastName: "Brown",
    fatherName: "Michael",
    motherName: "Olivia",
    birthDate: "2009-07-21",
    birthPlace: "Rotterdam",
    gender: "male",
    nationality: "dutch",
    address: "Rotterdam, Netherlands",
    phoneNumber: "+31 623 456 789",
    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",

    recordStatus: "active",
    accountStatus: "enabled",
    createdAt: "2024-01-15",
    updatedAt: "2024-02-21",
  },
];