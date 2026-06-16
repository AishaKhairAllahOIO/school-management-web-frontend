import { useMemo, useState } from "react";

import { UsersToolbar } from "@/features/users/shared/components/UsersToolbar";
import { UsersTable } from "@/features/users/shared/components/UsersTable";
import { teachersMock } from "@/features/users/teachers/mocks/teachers.mock";
import type { TeacherUser } from "@/features/users/teachers/types/teacher.types";

export function TeachersPage() {
  const [searchValue, setSearchValue] = useState("");

  const filteredTeachers = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    if (!search) return teachersMock;

    return teachersMock.filter((teacher) => {
      const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();

      return (
        fullName.includes(search) ||
        teacher.phoneNumber.toLowerCase().includes(search) ||
        teacher.teacherCode.toLowerCase().includes(search) ||
        teacher.teacherEmail.toLowerCase().includes(search) ||
        teacher.subject.toLowerCase().includes(search) ||
        teacher.department.toLowerCase().includes(search)
      );
    });
  }, [searchValue]);

  return (
    <div className="space-y-4">
      <UsersToolbar
        searchValue={searchValue}
        searchPlaceholder="Search teachers..."
        addLabel="Add Teacher"
        importLabel="Import Teachers"
        exportLabel="Export Teachers"
        filterLabel="Filter"
        onSearchChange={setSearchValue}
        onImport={() => {}}
        onExport={() => {}}
      />

      <UsersTable<TeacherUser>
        users={filteredTeachers}
        nameTitle="Teacher Name"
        extraColumns={[
          {
            key: "teacherCode",
            title: "Teacher Code",
            render: (teacher) => teacher.teacherCode,
          },
          {
            key: "subject",
            title: "Subject",
            render: (teacher) => teacher.subject,
          },
          {
            key: "department",
            title: "Department",
            render: (teacher) => teacher.department,
          },
          {
            key: "employmentType",
            title: "Employment",
            render: (teacher) => teacher.employmentType,
          },
        ]}
      />
    </div>
  );
}