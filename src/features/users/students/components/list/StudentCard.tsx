import type {
  ReactNode,
} from "react";

import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Hash,
  Pencil,
  Phone,
  Power,
  Trash2,
  UserRound,
} from "lucide-react";

import { motion } from "framer-motion";

import type { StudentListItem } from "../../types/student.types";
import { StudentStatusBadge } from "../shared/StudentStatusBadge";

type StudentCardProps = {
  student: StudentListItem;
  index: number;
  isDeleting?: boolean;
  isToggling?: boolean;

  onView: (
    student: StudentListItem,
  ) => void;

  onEdit: (
    student: StudentListItem,
  ) => void;

  onDelete: (
    student: StudentListItem,
  ) => void;

  onToggleStatus: (
    student: StudentListItem,
  ) => void;
};

function getInitials(
  fullName: string,
): string {
  const initials = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0),
    )
    .join("")
    .toUpperCase();

  return initials || "ST";
}

function formatText(
  value:
    | string
    | number
    | null
    | undefined,
  fallback = "Not assigned",
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return String(value)
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

export function StudentCard({
  student,
  index,
  isDeleting = false,
  isToggling = false,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: StudentCardProps) {
  const fullName =
    student.fullName?.trim() ||
    "Unnamed student";

  const normalizedAccountStatus =
    String(
      student.accountStatus ??
        "",
    ).toLowerCase();

  const isEnabled =
    normalizedAccountStatus ===
      "enabled" ||
    normalizedAccountStatus ===
      "active";

  const isBusy =
    isDeleting ||
    isToggling;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.28,
        delay: Math.min(
          index * 0.025,
          0.18,
        ),
      }}
      aria-busy={isBusy}
      className={[
        "group relative flex min-h-[365px]",
        "h-full flex-col overflow-hidden",
        "rounded-[24px] border",
        "border-primary/20 bg-card",
        "shadow-[var(--shadow-card)]",
        "transition-[transform,border-color,box-shadow]",
        "duration-300",
        "hover:-translate-y-1",
        "hover:border-primary/30",
        "hover:shadow-[var(--shadow-floating)]",
        "motion-reduce:transform-none",
        "motion-reduce:transition-none",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] bg-primary"
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <button
            type="button"
            onClick={() =>
              onView(student)
            }
            className={[
              "min-w-0 flex-1",
              "rounded-xl text-left",
              "focus-visible:outline-none",
              "focus-visible:ring-4",
              "focus-visible:ring-primary/10",
            ].join(" ")}
          >
            <div className="flex items-center gap-3.5">
              {student.photoUrl ? (
                <img
                  src={
                    student.photoUrl
                  }
                  alt={fullName}
                  className={[
                    "h-14 w-14 shrink-0",
                    "rounded-[18px]",
                    "border border-primary/20",
                    "object-cover",
                    "shadow-[var(--shadow-soft)]",
                  ].join(" ")}
                />
              ) : (
                <div
                  aria-hidden="true"
                  className={[
                    "flex h-14 w-14 shrink-0",
                    "items-center justify-center",
                    "rounded-[18px]",
                    "bg-primary/[0.08]",
                    "text-primary",
                  ].join(" ")}
                >
                  {fullName ? (
                    <span className="text-base font-semibold">
                      {getInitials(
                        fullName,
                      )}
                    </span>
                  ) : (
                    <UserRound className="h-6 w-6" />
                  )}
                </div>
              )}

              <div className="min-w-0">
                <h2 className="truncate text-[17px] font-semibold tracking-[-0.025em] text-foreground">
                  {fullName}
                </h2>

                <p className="mt-1 truncate text-[13px] font-normal text-muted-foreground">
                  {student.grade
                    ?.name
                    ? `${student.grade.name} student`
                    : "Student profile"}
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              onView(student)
            }
            aria-label={`Open ${fullName}`}
            className={[
              "flex h-9 w-9 shrink-0",
              "items-center justify-center",
              "rounded-full",
              "text-muted-foreground",
              "transition-colors",
              "hover:bg-primary/[0.08]",
              "hover:text-primary",
              "focus-visible:outline-none",
              "focus-visible:ring-4",
              "focus-visible:ring-primary/10",
            ].join(" ")}
          >
            <ArrowUpRight className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <StudentStatusBadge
            status={
              student.status
            }
          />

          <span
            className={[
              "max-w-[52%] truncate",
              "rounded-full border",
              "border-primary/15",
              "bg-primary/[0.055]",
              "px-2.5 py-1",
              "text-[10px] font-medium",
              "uppercase tracking-[0.08em]",
              "text-primary",
            ].join(" ")}
          >
            Student #
            {student.studentId}
          </span>
        </div>

        <div className="mt-5 grid gap-2.5">
          <InfoRow
            icon={
              <Hash className="h-4 w-4" />
            }
            label="Enrollment ID"
            value={formatText(
              student.enrollmentId,
              "Not recorded",
            )}
          />

          <InfoRow
            icon={
              <BookOpen className="h-4 w-4" />
            }
            label="Grade"
            value={formatText(
              student.grade?.name,
            )}
          />

          <InfoRow
            icon={
              <GraduationCap className="h-4 w-4" />
            }
            label="Classroom"
            value={formatText(
              student.classroom
                ?.name,
            )}
          />

          <InfoRow
            icon={
              <Phone className="h-4 w-4" />
            }
            label="Phone"
            value={
              student.phoneNumber ||
              "No phone number"
            }
            direction="ltr"
          />
        </div>
      </div>

      <div
        className={[
          "grid grid-cols-[1fr_auto_auto_auto]",
          "items-center gap-2",
          "border-t border-primary/15",
          "bg-primary/[0.025]",
          "px-4 py-3",
          "transition-colors",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() =>
            onView(student)
          }
          className={[
            "inline-flex h-10 min-w-0",
            "items-center justify-center gap-2",
            "rounded-xl px-3",
            "text-xs font-semibold",
            "text-foreground",
            "transition-colors",
            "hover:bg-primary/[0.08]",
            "hover:text-primary",
            "focus-visible:outline-none",
            "focus-visible:ring-4",
            "focus-visible:ring-primary/10",
          ].join(" ")}
        >
          <span className="truncate">
            View profile
          </span>

          <ArrowUpRight className="h-4 w-4 shrink-0" />
        </button>

        <ActionButton
          label={`Edit ${fullName}`}
          onClick={() =>
            onEdit(student)
          }
          disabled={isBusy}
        >
          <Pencil className="h-4 w-4" />
        </ActionButton>

        <ActionButton
          label={
            isEnabled
              ? "Disable account"
              : "Enable account"
          }
          onClick={() =>
            onToggleStatus(
              student,
            )
          }
          disabled={isBusy}
          className={[
            "text-warning",
            "hover:border-warning/20",
            "hover:bg-warning/10",
            "hover:text-warning",
          ].join(" ")}
        >
          {isToggling ? (
            <Spinner />
          ) : (
            <Power className="h-4 w-4" />
          )}
        </ActionButton>

        <ActionButton
          label={`Delete ${fullName}`}
          onClick={() =>
            onDelete(student)
          }
          disabled={isBusy}
          className={[
            "text-destructive",
            "hover:border-destructive/20",
            "hover:bg-destructive/10",
            "hover:text-destructive",
          ].join(" ")}
        >
          {isDeleting ? (
            <Spinner />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </ActionButton>
      </div>
    </motion.article>
  );
}

function InfoRow({
  icon,
  label,
  value,
  direction,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  direction?:
    | "ltr"
    | "rtl";
}) {
  return (
    <div
      className={[
        "flex min-w-0 items-center gap-3",
        "rounded-2xl border",
        "border-border/55",
        "bg-muted/35",
        "px-3 py-2.5",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-8 w-8 shrink-0",
          "items-center justify-center",
          "rounded-xl",
          "bg-primary/[0.08]",
          "text-primary",
          "shadow-[var(--shadow-soft)]",
        ].join(" ")}
      >
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <span className="block text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </span>

        <span
          dir={direction}
          title={value}
          className="mt-0.5 block truncate text-[13px] font-medium text-foreground"
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled = false,
  className = "",
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex h-10 w-10",
        "items-center justify-center",
        "rounded-xl border",
        "border-primary/15",
        "bg-card/80",
        "text-primary",
        "transition-colors",
        "hover:bg-primary/[0.08]",
        "focus-visible:outline-none",
        "focus-visible:ring-4",
        "focus-visible:ring-primary/10",
        "disabled:cursor-not-allowed",
        "disabled:opacity-40",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}