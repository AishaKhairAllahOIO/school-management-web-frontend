import { DoorOpen, Edit3, Plus, Search, Trash2 } from "lucide-react";

import { useState } from "react";

import {
  useClassrooms,
  useDeleteClassroom,
} from "@/features/academics/classrooms/hooks/useClassrooms";
import { useGrades } from "@/features/academics/grades/hooks/useGrades";

export function ClassroomsPage() {
  const { data: classrooms = [], isLoading, isError } = useClassrooms();
  const { data: grades = [] } = useGrades();
  const deleteMutation = useDeleteClassroom();
  const [search, setSearch] = useState("");

  const filteredClassrooms = classrooms.filter((classroom) =>
    `${classroom.name} ${classroom.code}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function getGradeName(gradeId: string) {
    return grades.find((grade) => grade.id === gradeId)?.name ?? "—";
  }

  if (isLoading) {
    return <div className="soft-card rounded-3xl p-5">Loading classrooms...</div>;
  }

  if (isError) {
    return <div className="soft-card rounded-3xl p-5">Failed to load classrooms.</div>;
  }

  return (
    <div className="soft-card rounded-3xl p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <DoorOpen size={22} />
          </span>

          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.04em] text-foreground">
              Classrooms
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage classrooms, capacity, and grade assignment.
            </p>
          </div>
        </div>

        <button className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-soft">
          <Plus size={15} />
          Add Classroom
        </button>
      </div>

      <div className="mb-4 flex h-11 items-center gap-3 rounded-2xl border border-border/70 bg-card px-4">
        <Search size={16} className="text-muted-foreground" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search classrooms..."
          className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/70 text-[11px] font-bold text-muted-foreground">
              <th className="px-4 py-3">Classroom</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Capacity</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredClassrooms.map((classroom) => (
              <tr key={classroom.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 text-xs font-bold text-foreground">
                  {classroom.name}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {classroom.code}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {getGradeName(classroom.gradeId)}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {classroom.capacity}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {classroom.roomNumber ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-success/10 px-3 py-1 text-[10px] font-bold text-success">
                    {classroom.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/70 text-muted-foreground hover:bg-muted">
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(classroom.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/70 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredClassrooms.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No classrooms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}