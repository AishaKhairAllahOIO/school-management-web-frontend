import {
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Power,
  Trash2,
} from "lucide-react";

import type {
  StaffProfile,
} from "../types/staff.types";

type StaffCardProps = {
  staff: StaffProfile;

  pendingToggle?: boolean;
  pendingDelete?: boolean;

  onToggleStatus: (
    staff: StaffProfile,
  ) => void;

  onDelete: (
    staff: StaffProfile,
  ) => void;
};

function getInitials(
  fullName: string,
): string {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part.charAt(0),
    )
    .join("")
    .toUpperCase();
}

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "Not provided";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  ).format(date);
}

function formatText(
  value:
    | string
    | number
    | null
    | undefined,
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not provided";
  }

  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (
      letter,
    ) => letter.toUpperCase());
}

export function StaffCard({
  staff,
  pendingToggle = false,
  pendingDelete = false,
  onToggleStatus,
  onDelete,
}: StaffCardProps) {
  const isEnabled =
    staff.accountStatus ===
      "enabled" ||
    staff.accountStatus ===
      "active";

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-primary/20 hover:shadow-[var(--shadow-card)]">
      <div className="h-1.5 primary-gradient" />

      <div className="space-y-5 p-5">
        <div className="flex items-start gap-4">
          {staff.photoUrl ? (
            <img
              src={staff.photoUrl}
              alt={staff.fullName}
              className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-4 ring-primary/5"
            />
          ) : (
            <div className="primary-gradient flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-black text-primary-foreground ring-4 ring-primary/5">
              {getInitials(
                staff.fullName,
              )}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-black text-foreground">
                  {staff.fullName ||
                    "Unnamed staff member"}
                </h2>

                <p className="mt-1 truncate text-sm font-medium text-muted-foreground">
                  {formatText(
                    staff.specialization ??
                      staff.serviceType ??
                      staff.degree,
                  )}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  staff.isDeleted
                    ? "bg-destructive/10 text-destructive"
                    : isEnabled
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                }`}
              >
                {staff.isDeleted
                  ? "Deleted"
                  : isEnabled
                    ? "Enabled"
                    : "Disabled"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0 text-primary" />

            <span className="truncate">
              {staff.phoneNumber ||
                "No phone number"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0 text-primary" />

            <span className="truncate">
              {staff.email ??
                "No email address"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <BriefcaseBusiness className="h-4 w-4 shrink-0 text-primary" />

            <span className="truncate">
              Hired:{" "}
              {formatDate(
                staff.hireDate,
              )}
            </span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <GraduationCap className="h-4 w-4 shrink-0 text-primary" />

            <span className="truncate">
              {formatText(
                staff.degree,
              )}

              {staff.university
                ? ` · ${staff.university}`
                : ""}
            </span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <CalendarDays className="h-4 w-4 shrink-0 text-primary" />

            <span className="truncate">
              Experience:{" "}
              {staff.experienceYears ??
                0}{" "}
              years
            </span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />

            <span className="truncate">
              {staff.address ??
                "No address"}
            </span>
          </div>
        </div>

        <div className="flex gap-3 border-t border-border pt-4">
          <button
            type="button"
            disabled={
              pendingToggle ||
              pendingDelete ||
              staff.isDeleted
            }
            onClick={() =>
              onToggleStatus(
                staff,
              )
            }
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-secondary px-4 text-sm font-bold text-foreground transition hover:border-primary/20 hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Power className="h-4 w-4" />

            {pendingToggle
              ? "Updating..."
              : isEnabled
                ? "Disable"
                : "Enable"}
          </button>

          <button
            type="button"
            disabled={
              pendingDelete ||
              pendingToggle ||
              staff.isDeleted
            }
            onClick={() =>
              onDelete(
                staff,
              )
            }
            className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 text-sm font-bold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />

            {pendingDelete
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}