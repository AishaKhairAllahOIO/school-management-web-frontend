import { Edit3, Eye, Mail, MapPin, Phone, Trash2 } from "lucide-react";

import type { Teacher } from "../types/teacher.types";
import { TeacherStatusBadge } from "./TeacherStatusBadge";

type TeachersTableProps = {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
};

const subjectColors = [
  "bg-maths/10 text-maths",
  "bg-english/10 text-english",
  "bg-hindi/10 text-hindi",
  "bg-science/10 text-science",
  "bg-primary/10 text-primary",
];

export function TeachersTable({
  teachers,
  onEdit,
  onDelete,
}: TeachersTableProps) {
  return (
    <div className="overflow-hidden rounded-[30px] border border-border/60 bg-card shadow-soft-lg">
      <div className="overflow-x-auto">
        <table className="min-w-[1050px]">
          <thead>
            <tr className="bg-secondary/60 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-4">Teacher</th>
              <th className="px-5 py-4">Subject</th>
              <th className="px-5 py-4">Contact</th>
              <th className="px-5 py-4">Location</th>
              <th className="px-5 py-4">Degree</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/50">
            {teachers.map((teacher, index) => (
              <tr
                key={teacher.id}
                className="transition hover:bg-secondary/30"
              >
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={teacher.photoUrl}
                      alt={`${teacher.firstName} ${teacher.lastName}`}
                      className="h-12 w-12 rounded-2xl object-cover ring-2 ring-primary/10"
                    />

                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {teacher.firstName} {teacher.lastName}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {teacher.department}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-5">
                  <span
                    className={[
                      "inline-flex rounded-full px-3 py-1 text-xs font-bold",
                      subjectColors[index % subjectColors.length],
                    ].join(" ")}
                  >
                    {teacher.subject}
                  </span>
                </td>

                <td className="px-5 py-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail size={14} className="text-primary" />
                      {teacher.email}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone size={14} className="text-success" />
                      {teacher.phone}
                    </div>
                  </div>
                </td>

                <td className="px-5 py-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={15} className="text-english" />
                    {teacher.city}
                  </div>
                </td>

                <td className="px-5 py-5">
                  <p className="max-w-[180px] text-sm font-medium text-foreground">
                    {teacher.degree}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {teacher.university}
                  </p>
                </td>

                <td className="px-5 py-5">
                  <TeacherStatusBadge status={teacher.status} />
                </td>

                <td className="px-5 py-5">
                  <div className="flex justify-end gap-2">
                    <button className="flex h-9 w-9 items-center justify-center rounded-xl text-info transition hover:bg-info/10">
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => onEdit(teacher)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-primary transition hover:bg-primary/10"
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      onClick={() => onDelete(teacher)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-destructive transition hover:bg-destructive/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {teachers.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-sm text-muted-foreground"
                >
                  No teachers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}