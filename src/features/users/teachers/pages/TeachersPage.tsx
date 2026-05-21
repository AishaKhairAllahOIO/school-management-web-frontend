import { Plus, Search } from "lucide-react";
import { useState } from "react";

import { TeacherDeleteDialog } from "../components/TeacherDeleteDialog";
import { TeacherFormModal } from "../components/TeacherFormModal";
import { TeachersTable } from "../components/TeachersTable";
import { useTeachers } from "../hooks/useTeachers";
import type { Teacher, TeacherFormData } from "../types/teacher.types";

export function TeachersPage() {
  const {
    teachers,
    searchQuery,
    setSearchQuery,
    addTeacher,
    updateTeacher,
    deleteTeacher,
  } = useTeachers();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  function openAddModal() {
    setSelectedTeacher(null);
    setIsFormOpen(true);
  }

  function openEditModal(teacher: Teacher) {
    setSelectedTeacher(teacher);
    setIsFormOpen(true);
  }

  function handleSubmit(data: TeacherFormData) {
    if (selectedTeacher) {
      updateTeacher(selectedTeacher.id, data);
    } else {
      addTeacher(data);
    }
  }

  function confirmDelete() {
    if (!teacherToDelete) return;

    deleteTeacher(teacherToDelete.id);
    setTeacherToDelete(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex h-12 w-full items-center gap-3 rounded-2xl bg-card px-4 shadow-soft ring-1 ring-border/60 md:max-w-md">
          <Search size={18} className="text-muted-foreground" />

          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search teachers..."
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="interactive flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-bold text-white shadow-soft transition hover:bg-primary-dark"
        >
          <Plus size={18} />
          Add Teacher
        </button>
      </div>

      <TeachersTable
        teachers={teachers}
        onEdit={openEditModal}
        onDelete={setTeacherToDelete}
      />

      <TeacherFormModal
        isOpen={isFormOpen}
        teacher={selectedTeacher}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <TeacherDeleteDialog
        teacher={teacherToDelete}
        onCancel={() => setTeacherToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}