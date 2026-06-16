import type { ReactNode } from "react";
import { Edit3, Eye, Phone, Trash2 } from "lucide-react";

import type { BaseUser } from "@/features/users/shared/types/base-user.types";

type UsersTableColumn<TUser extends BaseUser> = {
  key: string;
  title: string;
  render: (user: TUser) => ReactNode;
};

type UsersTableProps<TUser extends BaseUser> = {
  users: TUser[];
  nameTitle?: string;
  extraColumns?: UsersTableColumn<TUser>[];
  onView?: (user: TUser) => void;
  onEdit?: (user: TUser) => void;
  onDelete?: (user: TUser) => void;
};

function formatValue(value?: string | null) {
  return value ? value : "-";
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function UserStatusBadge({ status }: { status: string }) {
  const statusClasses: Record<string, string> = {
    active: "bg-success/10 text-success",
    draft: "bg-warning/10 text-warning",
    archived: "bg-muted text-muted-foreground",
    deleted: "bg-destructive/10 text-destructive",
    enabled: "bg-success/10 text-success",
    disabled: "bg-destructive/10 text-destructive",
  };

  return (
    <span
      className={[
        "inline-flex min-w-[76px] items-center justify-center rounded-full px-3 py-1 text-[11px] font-bold",
        statusClasses[status] ?? "bg-muted text-muted-foreground",
      ].join(" ")}
    >
      {formatStatus(status)}
    </span>
  );
}

export function UsersTable<TUser extends BaseUser>({
  users,
  nameTitle = "Name",
  extraColumns = [],
  onView,
  onEdit,
  onDelete,
}: UsersTableProps<TUser>) {
  return (
    <div className="overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border/70">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse">
          <thead>
            <tr className="border-b border-border/70 bg-muted/35 text-start">
              <th className="px-5 py-4 text-start text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Photo
              </th>

              <th className="px-5 py-4 text-start text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {nameTitle}
              </th>

              <th className="px-5 py-4 text-start text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Mobile
              </th>

              <th className="px-5 py-4 text-start text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Birth Date
              </th>

              <th className="px-5 py-4 text-start text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Nationality
              </th>

              {extraColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-5 py-4 text-start text-[11px] font-bold uppercase tracking-wide text-muted-foreground"
                >
                  {column.title}
                </th>
              ))}

              <th className="px-5 py-4 text-start text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Status
              </th>

              <th className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Operation
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const fullName = `${user.firstName} ${user.lastName}`;

              return (
                <tr
                  key={user.id}
                  className="group border-b border-border/60 transition duration-200 hover:bg-muted/30 last:border-b-0"
                >
                  <td className="px-5 py-3">
                    <img
                      src={user.photoUrl}
                      alt={fullName}
                      className="h-10 w-10 rounded-xl object-cover ring-2 ring-background transition duration-200 group-hover:scale-105"
                    />
                  </td>

                  <td className="px-5 py-3">
                    <div>
                      <p className="text-[13px] font-bold text-foreground">
                        {fullName}
                      </p>

                      <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                        {formatValue(user.gender)} ·{" "}
                        {formatValue(user.fatherName)}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-3">
                    <p className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
                      <Phone size={14} className="text-success" />
                      {formatValue(user.phoneNumber)}
                    </p>
                  </td>

                  <td className="px-5 py-3 text-[12px] font-semibold text-muted-foreground">
                    {formatValue(user.birthDate)}
                  </td>

                  <td className="px-5 py-3 text-[12px] font-semibold text-muted-foreground">
                    {formatValue(user.nationality)}
                  </td>

                  {extraColumns.map((column) => (
                    <td
                      key={column.key}
                      className="px-5 py-3 text-[12px] font-semibold text-muted-foreground"
                    >
                      {column.render(user)}
                    </td>
                  ))}

                  <td className="px-5 py-3">
                    <UserStatusBadge status={user.recordStatus} />
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onView?.(user)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-background text-info transition hover:-translate-y-0.5 hover:bg-info/10"
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit?.(user)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-background text-primary transition hover:-translate-y-0.5 hover:bg-primary/10"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete?.(user)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-background text-destructive transition hover:-translate-y-0.5 hover:bg-destructive/10"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}