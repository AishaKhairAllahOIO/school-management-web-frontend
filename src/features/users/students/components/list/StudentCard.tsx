import type { ReactNode } from "react";
import {
  BookOpen,
  Eye,
  GraduationCap,
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
  onView: (student: StudentListItem) => void;
  onDelete: (student: StudentListItem) => void;
  onToggleStatus: (student: StudentListItem) => void;
};

const visualVariants = [
  {
    surface: "soft-purple-gradient",
    icon: "bg-primary/10 text-primary",
    media: "h-64",
  },
  {
    surface: "card-gradient",
    icon: "bg-secondary text-secondary-foreground",
    media: "h-52",
  },
  {
    surface: "bg-card",
    icon: "bg-accent text-accent-foreground",
    media: "h-72",
  },
  {
    surface: "bg-secondary/55",
    icon: "bg-card text-primary",
    media: "h-56",
  },
] as const;

export function StudentCard({
  student,
  index,
  isDeleting = false,
  isToggling = false,
  onView,
  onDelete,
  onToggleStatus,
}: StudentCardProps) {
  const variant = visualVariants[index % visualVariants.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.32,
        delay: Math.min(index * 0.035, 0.24),
      }}
      className="mb-5 break-inside-avoid"
    >
      <div
        className={[
          "group relative overflow-hidden rounded-[30px] border border-border/75",
          "shadow-[var(--shadow-card)] transition duration-300",
          "hover:-translate-y-1 hover:border-primary/25 hover:shadow-[var(--shadow-floating)]",
          variant.surface,
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => onView(student)}
          className="block w-full text-left"
          aria-label={`Open ${student.fullName}'s profile`}
        >
          <div
            className={[
              "relative w-full overflow-hidden bg-muted",
              variant.media,
            ].join(" ")}
          >
            {student.photoUrl ? (
              <img
                src={student.photoUrl}
                alt={student.fullName}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
              />
            ) : (
              <div className="soft-purple-gradient flex h-full w-full items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-primary/15 bg-card/80 text-primary shadow-[var(--shadow-soft)] backdrop-blur">
                  <UserRound className="h-11 w-11" />
                </div>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-foreground/55 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div className="min-w-0 text-primary-foreground">
                <p className="truncate text-xl font-black tracking-tight">
                  {student.fullName}
                </p>
                <p className="mt-1 text-xs font-semibold text-primary-foreground/75">
                  Student ID: {student.studentId}
                </p>
              </div>

              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-card/40 bg-card/90 text-primary shadow-lg backdrop-blur">
                <GraduationCap className="h-5 w-5" />
              </span>
            </div>
          </div>
        </button>

        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <StudentStatusBadge status={student.status} />

            {student.accountStatus ? (
              <span className="rounded-full border border-border bg-card/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                {student.accountStatus}
              </span>
            ) : null}
          </div>

          <div className="mt-5 space-y-2.5">
            <InfoRow
              icon={<BookOpen className="h-4 w-4" />}
              iconClass={variant.icon}
              label="Grade"
              value={student.grade?.name ?? "Not assigned"}
            />

            <InfoRow
              icon={<GraduationCap className="h-4 w-4" />}
              iconClass={variant.icon}
              label="Classroom"
              value={student.classroom?.name ?? "Not assigned"}
            />

            {student.phoneNumber ? (
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                iconClass={variant.icon}
                label="Phone"
                value={student.phoneNumber}
                valueDirection="ltr"
              />
            ) : null}
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2 border-t border-border/70 pt-4">
            <button
              type="button"
              onClick={() => onView(student)}
              className="primary-gradient inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold text-primary-foreground shadow-[var(--shadow-auth-button)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
            >
              <Eye className="h-4 w-4" />
              View profile
            </button>

            <button
              type="button"
              disabled={isToggling}
              onClick={() => onToggleStatus(student)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-warning/20 bg-warning/10 text-warning transition hover:bg-warning/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-warning/15 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Toggle ${student.fullName}'s account status`}
            >
              {isToggling ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-warning border-t-transparent" />
              ) : (
                <Power className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              disabled={isDeleting}
              onClick={() => onDelete(student)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive transition hover:bg-destructive/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-destructive/15 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Delete ${student.fullName}`}
            >
              {isDeleting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

type InfoRowProps = {
  icon: ReactNode;
  iconClass: string;
  label: string;
  value: string | number;
  valueDirection?: "ltr" | "rtl";
};

function InfoRow({
  icon,
  iconClass,
  label,
  value,
  valueDirection,
}: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/65 p-3 backdrop-blur">
      <div
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          iconClass,
        ].join(" ")}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </p>
        <p
          dir={valueDirection}
          className="mt-0.5 truncate text-sm font-bold text-foreground"
        >
          {value}
        </p>
      </div>
    </div>
  );
}
