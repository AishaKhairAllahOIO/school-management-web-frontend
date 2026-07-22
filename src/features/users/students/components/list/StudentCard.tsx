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
import type { ReactNode } from "react";

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
  onDelete: (
    student: StudentListItem,
  ) => void;
  onToggleStatus: (
    student: StudentListItem,
  ) => void;
};

const imageHeights = [
  "h-64",
  "h-72",
  "h-60",
  "h-80",
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
  const imageHeight =
    imageHeights[index % imageHeights.length];

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
      className="mb-5 break-inside-avoid"
    >
      <div
        className={[
          "group overflow-hidden",
          "rounded-[24px]",
          "border border-border/60",
          "bg-card",
          "shadow-[0_10px_35px_rgba(30,20,70,0.055)]",
          "transition-all duration-300",
          "hover:-translate-y-1",
          "hover:border-primary/18",
          "hover:shadow-[0_20px_50px_rgba(30,20,70,0.1)]",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() =>
            onView(student)
          }
          aria-label={`Open ${student.fullName}'s profile`}
          className="block w-full text-left"
        >
          <div
            className={[
              "relative w-full overflow-hidden",
              "bg-muted/45",
              imageHeight,
            ].join(" ")}
          >
            {student.photoUrl ? (
              <img
                src={student.photoUrl}
                alt={student.fullName}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/[0.04]">
                <span className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-card text-primary shadow-sm">
                  <UserRound
                    size={36}
                    strokeWidth={1.45}
                  />
                </span>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0 text-white">
                  <p className="truncate text-lg font-semibold tracking-[-0.02em]">
                    {student.fullName}
                  </p>

                  <p className="mt-1 text-[11px] font-normal text-white/75">
                    Student #{student.studentId}
                  </p>
                </div>

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/90 text-primary shadow-sm backdrop-blur">
                  <GraduationCap
                    size={17}
                    strokeWidth={1.7}
                  />
                </span>
              </div>
            </div>
          </div>
        </button>

        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <StudentStatusBadge
              status={student.status}
            />

            {student.accountStatus ? (
              <span className="rounded-full bg-muted/60 px-2.5 py-1 text-[10px] font-medium capitalize text-muted-foreground">
                {student.accountStatus}
              </span>
            ) : null}
          </div>

          <div className="mt-4 space-y-2">
            <InfoRow
              icon={
                <BookOpen
                  size={15}
                  strokeWidth={1.7}
                />
              }
              label="Grade"
              value={
                student.grade?.name ??
                "Not assigned"
              }
            />

            <InfoRow
              icon={
                <GraduationCap
                  size={15}
                  strokeWidth={1.7}
                />
              }
              label="Classroom"
              value={
                student.classroom?.name ??
                "Not assigned"
              }
            />

            {student.phoneNumber ? (
              <InfoRow
                icon={
                  <Phone
                    size={15}
                    strokeWidth={1.7}
                  />
                }
                label="Phone"
                value={student.phoneNumber}
                valueDirection="ltr"
              />
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-2 border-t border-border/50 pt-4">
            <button
              type="button"
              onClick={() =>
                onView(student)
              }
              className={[
                "inline-flex h-10 items-center",
                "justify-center gap-2",
                "rounded-xl bg-primary",
                "px-4 text-xs font-medium",
                "text-primary-foreground",
                "shadow-sm transition",
                "hover:bg-primary/90",
              ].join(" ")}
            >
              <Eye
                size={15}
                strokeWidth={1.8}
              />

              View profile
            </button>

            <button
              type="button"
              disabled={isToggling}
              onClick={() =>
                onToggleStatus(student)
              }
              aria-label={`Toggle ${student.fullName}'s account status`}
              className={[
                "inline-flex h-10 w-10",
                "items-center justify-center",
                "rounded-xl border",
                "border-amber-500/20",
                "bg-amber-500/[0.07]",
                "text-amber-600",
                "transition-colors",
                "hover:bg-amber-500/[0.12]",
                "disabled:cursor-not-allowed",
                "disabled:opacity-50",
              ].join(" ")}
            >
              {isToggling ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              ) : (
                <Power size={15} />
              )}
            </button>

            <button
              type="button"
              disabled={isDeleting}
              onClick={() =>
                onDelete(student)
              }
              aria-label={`Delete ${student.fullName}`}
              className={[
                "inline-flex h-10 w-10",
                "items-center justify-center",
                "rounded-xl border",
                "border-destructive/15",
                "bg-destructive/[0.06]",
                "text-destructive",
                "transition-colors",
                "hover:bg-destructive/[0.1]",
                "disabled:cursor-not-allowed",
                "disabled:opacity-50",
              ].join(" ")}
            >
              {isDeleting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
              ) : (
                <Trash2 size={15} />
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
  label: string;
  value: string | number;
  valueDirection?: "ltr" | "rtl";
};

function InfoRow({
  icon,
  label,
  value,
  valueDirection,
}: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] bg-muted/[0.28] px-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/[0.07] text-primary">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[10px] font-normal text-muted-foreground">
          {label}
        </p>

        <p
          dir={valueDirection}
          className="mt-0.5 truncate text-xs font-medium text-foreground"
        >
          {value}
        </p>
      </div>
    </div>
  );
}