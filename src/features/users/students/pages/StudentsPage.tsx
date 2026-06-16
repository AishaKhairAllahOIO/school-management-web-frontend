import { useMemo, useState } from "react";

import { UsersToolbar } from "@/features/users/shared/components/UsersToolbar";
import { UsersTable } from "@/features/users/shared/components/UsersTable";
import { studentsMock } from "@/features/users/students/mocks/students.mock";
import type { StudentUser } from "@/features/users/students/types/student.types";

export function StudentsPage() {
  const [searchValue, setSearchValue] = useState("");

  const filteredStudents = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    if (!search) return studentsMock;

    return studentsMock.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();

      return (
        fullName.includes(search) ||
        student.phoneNumber.toLowerCase().includes(search) ||
        student.studentCode.toLowerCase().includes(search)
      );
    });
  }, [searchValue]);

  return (
    <div className="space-y-4">
      <UsersToolbar
        searchValue={searchValue}
        searchPlaceholder="Search students..."
        addLabel="Add Student"
        importLabel="Import Students"
        exportLabel="Export Students"
        filterLabel="Filter"
        onSearchChange={setSearchValue}
        onImport={() => {}}
        onExport={() => {}}
      />

      <UsersTable<StudentUser>
        users={filteredStudents}
        nameTitle="Student Name"
        extraColumns={[
          {
            key: "studentCode",
            title: "Student Code",
            render: (student) => student.studentCode,
          },
          {
            key: "gradeId",
            title: "Grade",
            render: (student) => student.gradeId,
          },
          {
            key: "classroomId",
            title: "Classroom",
            render: (student) => student.classroomId,
          },
        ]}
      />
    </div>
  );
}