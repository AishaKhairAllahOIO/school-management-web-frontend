import { Edit3, Eye, Mail, Phone, Trash2 } from "lucide-react";

import { teachersMock } from "@/features/users/teachers/mocks/teachers.mock";
import { TeacherStatusBadge } from "@/features/users/teachers/components/TeacherStatusBadge";

function formatDegree(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function TeachersTable() {
  return (
    <div className="soft-card overflow-hidden rounded-3xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse">
          <thead>
            <tr className="border-b border-border/70 bg-muted/35 text-left">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Teacher
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Contact
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Subject
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Degree
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Hire Date
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {teachersMock.map((teacher) => (
              <tr
                key={teacher.id}
                className="border-b border-border/60 transition hover:bg-muted/25 last:border-b-0"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={teacher.photoUrl}
                      alt={`${teacher.firstName} ${teacher.lastName}`}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-background"
                    />

                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {teacher.firstName} {teacher.lastName}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {teacher.teacherCode}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-1.5 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Mail size={15} className="text-primary" />
                      {teacher.teacherEmail}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Phone size={15} className="text-success" />
                      {teacher.phoneNumber}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-info/10 px-3 py-1 text-xs font-semibold text-info">
                    {teacher.specialization}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {formatDegree(teacher.degree)}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {teacher.hireDate}
                </td>

                <td className="px-6 py-4">
                  <TeacherStatusBadge status={teacher.recordStatus} />
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-background text-info transition hover:bg-info/10">
                      <Eye size={16} />
                    </button>

                    <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-background text-primary transition hover:bg-primary/10">
                      <Edit3 size={16} />
                    </button>

                    <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-background text-destructive transition hover:bg-destructive/10">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}