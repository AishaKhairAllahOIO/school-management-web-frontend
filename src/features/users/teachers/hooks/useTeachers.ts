import { useMemo, useState } from "react";

import { teachersMock } from "../mocks/teachers.mock";
import type { Teacher, TeacherFormData } from "../types/teacher.types";

export function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>(teachersMock);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeachers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return teachers;

    return teachers.filter((teacher) => {
      const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();

      return (
        fullName.includes(query) ||
        teacher.email.toLowerCase().includes(query) ||
        teacher.subject.toLowerCase().includes(query) ||
        teacher.city.toLowerCase().includes(query)
      );
    });
  }, [teachers, searchQuery]);

  function addTeacher(data: TeacherFormData) {
    const newTeacher: Teacher = {
      id: crypto.randomUUID(),
      category: "teacher",
      teacherCode: `TCH-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
      teacherEmail: data.email,
      recordStatus: "active",
      accountStatus: "enabled",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      ...data,
    };

    setTeachers((current) => [newTeacher, ...current]);
  }

  function updateTeacher(id: string, data: TeacherFormData) {
    setTeachers((current) =>
      current.map((teacher) =>
        teacher.id === id ? { ...teacher, ...data } : teacher
      )
    );
  }

  function deleteTeacher(id: string) {
    setTeachers((current) => current.filter((teacher) => teacher.id !== id));
  }

  return {
    teachers: filteredTeachers,
    searchQuery,
    setSearchQuery,
    addTeacher,
    updateTeacher,
    deleteTeacher,
  };
}