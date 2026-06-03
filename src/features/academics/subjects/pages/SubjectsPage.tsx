import { BookOpen, Edit3, Plus, Search, Trash2 } from "lucide-react";

import { useState } from "react";

import {
  useDeleteSubject,
  useSubjects,
} from "@/features/academics/subjects/hooks/useSubjects";

export function SubjectsPage() {
  const { data = [], isLoading, isError } = useSubjects();
  const deleteMutation = useDeleteSubject();
  const [search, setSearch] = useState("");

  const filteredSubjects = data.filter((subject) =>
    `${subject.name} ${subject.code}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div className="soft-card rounded-3xl p-5">Loading subjects...</div>;
  }

  if (isError) {
    return <div className="soft-card rounded-3xl p-5">Failed to load subjects.</div>;
  }

  return (
    <div className="soft-card rounded-3xl p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen size={22} />
          </span>

          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.04em] text-foreground">
              Subjects
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage academic subjects and core curriculum items.
            </p>
          </div>
        </div>

        <button className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-soft">
          <Plus size={15} />
          Add Subject
        </button>
      </div>

      <div className="mb-4 flex h-11 items-center gap-3 rounded-2xl border border-border/70 bg-card px-4">
        <Search size={16} className="text-muted-foreground" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search subjects..."
          className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/70 text-[11px] font-bold text-muted-foreground">
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSubjects.map((subject) => (
              <tr key={subject.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 text-xs font-bold text-foreground">
                  {subject.name}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {subject.code}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {subject.description ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
                    {subject.isCore ? "Core" : "Optional"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-success/10 px-3 py-1 text-[10px] font-bold text-success">
                    {subject.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/70 text-muted-foreground hover:bg-muted">
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(subject.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/70 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredSubjects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No subjects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}