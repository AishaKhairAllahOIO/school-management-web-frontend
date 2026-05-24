import { Mail, Phone } from "lucide-react";

import { UserStatusBadge } from "../../shared/components/UserStatusBadge";
import type { CrudConfig } from "../../shared/types/user-crud.types";
import type { TeacherUser } from "../types/teacher.types";

export const teacherCrudConfig: CrudConfig<TeacherUser> = {
  title: "Teacher",
  searchPlaceholder: "Search teachers...",

  columns: [
    {
      key: "teacher",
      title: "Teacher",
      width: "280px",
      render: (teacher) => (
        <div className="flex items-center gap-3">
          <img
            src={teacher.photoUrl ?? ""}
            alt={`${teacher.firstName} ${teacher.lastName}`}
            className="h-14 w-14 rounded-[18px] object-cover ring-2 ring-primary/15"
          />

          <div>
            <p className="text-sm font-bold text-foreground">
              {teacher.firstName} {teacher.lastName}
            </p>

            <p className="text-xs text-muted-foreground">
              {teacher.teacherCode}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      title: "Contact",
      width: "260px",
      render: (teacher) => (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail size={14} className="text-primary" />
            {teacher.teacherEmail || "—"}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone size={14} className="text-success" />
            {teacher.phoneNumber}
          </div>
        </div>
      ),
    },
    {
      key: "degree",
      title: "Degree",
      render: (teacher) => (
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {teacher.degree}
        </span>
      ),
    },
    {
      key: "university",
      title: "University",
      render: (teacher) => (
        <p className="max-w-[180px] text-sm font-medium text-foreground">
          {teacher.university}
        </p>
      ),
    },
    {
      key: "hireDate",
      title: "Hire Date",
      render: (teacher) => (
        <span className="text-sm text-muted-foreground">
          {teacher.hireDate}
        </span>
      ),
    },
    {
      key: "recordStatus",
      title: "Status",
      render: (teacher) => (
        <UserStatusBadge status={teacher.recordStatus} />
      ),
    },
  ],
};