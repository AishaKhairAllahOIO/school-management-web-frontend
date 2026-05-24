import { useState } from "react";

import { UserCrudPage } from "../../shared/components/UserCrudPage";
import type { AccountStatus, RecordStatus } from "../../shared/types/user.enums";
import { teacherCrudConfig } from "../config/teacherCrud.config";
import type { TeacherUser } from "../types/teacher.types";

const teachersMock: TeacherUser[] = [
  {
    id: "teacher-001",
    category: "teacher",
    firstName: "Sarah",
    lastName: "Miller",
    fatherName: "John",
    motherName: "Anna",
    birthDate: "1988-04-12",
    birthPlace: "Amsterdam",
    gender: "female",
    nationality: "other",
    address: "45 School Street",
    phoneNumber: "+31 612 345 678",
    photoUrl: "https://randomuser.me/api/portraits/women/32.jpg",
    recordStatus: "active",
    accountStatus: "enabled",
    createdAt: "2026-01-01",
    updatedAt: "2026-05-01",
    deletedAt: null,
    teacherCode: "TCH-001",
    teacherEmail: "sarah.miller@school.com",
    hireDate: "2016-09-01",
    degree: "master",
    specialization: "Mathematics",
    yearsOfExperience: 10,
    university: "University of Amsterdam",
    graduationYear: "2011",
    subjects: ["arabic"]
  },
  {
    id: "teacher-002",
    category: "teacher",
    firstName: "Daniel",
    lastName: "Johnson",
    fatherName: "Robert",
    motherName: "Maria",
    birthDate: "1985-11-03",
    birthPlace: "Rotterdam",
    gender: "male",
    nationality: "other",
    address: "18 Main Avenue",
    phoneNumber: "+31 623 456 789",
    photoUrl: "https://randomuser.me/api/portraits/men/41.jpg",
    recordStatus: "active",
    accountStatus: "enabled",
    createdAt: "2026-01-01",
    updatedAt: "2026-05-01",
    deletedAt: null,
    teacherCode: "TCH-002",
    teacherEmail: "daniel.johnson@school.com",
    hireDate: "2018-02-15",
    degree: "bachelor",
    specialization: "English Literature",
    yearsOfExperience: 12,
    university: "Leiden University",
    graduationYear: "2007",
        subjects: ["arabic"]

  },
];

export function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherUser[]>(teachersMock);

  function handleAdd() {
    console.log("Add teacher");
  }

  function handleView(teacher: TeacherUser) {
    console.log("View teacher", teacher);
  }

  function handleEdit(teacher: TeacherUser) {
    console.log("Edit teacher", teacher);
  }

  function handleDelete(teacher: TeacherUser) {
    setTeachers((current) =>
      current.filter((item) => item.id !== teacher.id)
    );
  }

  function handleChangeRecordStatus(
    teacher: TeacherUser,
    status: RecordStatus
  ) {
    setTeachers((current) =>
      current.map((item) =>
        item.id === teacher.id ? { ...item, recordStatus: status } : item
      )
    );
  }

  function handleChangeAccountStatus(
    teacher: TeacherUser,
    status: AccountStatus
  ) {
    setTeachers((current) =>
      current.map((item) =>
        item.id === teacher.id ? { ...item, accountStatus: status } : item
      )
    );
  }

  return (
    <UserCrudPage
      config={teacherCrudConfig}
      items={teachers}
      getId={(teacher) => teacher.id}
      getName={(teacher) => `${teacher.firstName} ${teacher.lastName}`}
      onAdd={handleAdd}
      onView={handleView}
      onEdit={handleEdit}
      onDeleteConfirm={handleDelete}
      onChangeRecordStatus={handleChangeRecordStatus}
      onChangeAccountStatus={handleChangeAccountStatus}
    />
  );
}