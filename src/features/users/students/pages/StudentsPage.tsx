import { useMemo, useState } from "react";

import { UserFormModal } from "@/features/users/shared/components/forms/UserFormModal";
import { UsersToolbar } from "@/features/users/shared/components/UsersToolbar";
import { UsersTable } from "@/features/users/shared/components/UsersTable";
import { studentCsvColumns } from "@/features/users/shared/config/userCsvColumns";
import type {
  UserFormMode,
  UserFormValues,
} from "@/features/users/shared/types/user-form.types";
import {
  exportDataToCsv,
  parseCsvFile,
} from "@/features/users/shared/utils/usersCsv.utils";
import { studentsMock } from "@/features/users/students/mocks/students.mock";
import type { StudentUser } from "@/features/users/students/types/student.types";

export function StudentsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<UserFormMode>("create");
  const [selectedStudent, setSelectedStudent] = useState<StudentUser | null>(
    null
  );

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

  function openCreateForm() {
    setFormMode("create");
    setSelectedStudent(null);
    setIsFormOpen(true);
  }

  function openViewForm(student: StudentUser) {
    setFormMode("view");
    setSelectedStudent(student);
    setIsFormOpen(true);
  }

  function openEditForm(student: StudentUser) {
    setFormMode("edit");
    setSelectedStudent(student);
    setIsFormOpen(true);
  }

  function handleExportStudents() {
    exportDataToCsv(filteredStudents, studentCsvColumns, "students.csv");
  }

  async function handleImportStudents(file: File) {
    const rows = await parseCsvFile(file);
    console.log("Students CSV rows ready for API:", rows);
  }

  function handleSubmitStudent(values: UserFormValues) {
    console.log("Student form values ready for API:", values);
    setIsFormOpen(false);
  }

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
        onAdd={openCreateForm}
        onImport={handleImportStudents}
        onExport={handleExportStudents}
      />

      <UsersTable<StudentUser>
        users={filteredStudents}
        nameTitle="Student Name"
        onView={openViewForm}
        onEdit={openEditForm}
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

      <UserFormModal
        open={isFormOpen}
        mode={formMode}
        category="student"
        user={selectedStudent}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitStudent}
      />
    </div>
  );
}