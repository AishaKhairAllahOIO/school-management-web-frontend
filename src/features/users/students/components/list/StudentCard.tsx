import type { ReactNode } from "react";

import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Pencil,
  Power,
  RotateCcw,
  Trash2,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";

import { AuthenticatedUserImage } from "../../../shared/components/AuthenticatedUserImage";
import type { StudentListItem } from "../../types/student.types";
import { StudentStatusBadge } from "../shared/StudentStatusBadge";

type StudentCardProps = {
  student: StudentListItem;
  index: number;
  isDeleting?: boolean;
  isToggling?: boolean;
  isRestoring?: boolean;
  onView: (student: StudentListItem) => void;
  onEdit: (student: StudentListItem) => void;
  onDelete: (student: StudentListItem) => void;
  onToggleStatus: (student: StudentListItem) => void;
  onRestore: (student: StudentListItem) => void;
};

function getInitials(fullName: string): string {
  return fullName.trim().split(/\s+/).filter(Boolean).slice(0, 2)
    .map((part) => part.charAt(0)).join("").toUpperCase() || "ST";
}

function formatText(value: string | number | null | undefined, fallback = "Not assigned"): string {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value).replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function StudentCard({
  student,
  index,
  isDeleting = false,
  isToggling = false,
  isRestoring = false,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onRestore,
}: StudentCardProps) {
  const fullName = student.fullName?.trim() || "Unnamed student";
  const normalizedAccountStatus = String(student.accountStatus ?? "").toLowerCase();
  const isEnabled = normalizedAccountStatus === "enabled" || normalizedAccountStatus === "active";
  const isDeleted = Boolean(student.isDeleted || student.deletedAt);
  const isBusy = isDeleting || isToggling || isRestoring;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.025, 0.18) }}
      aria-busy={isBusy}
      className="group relative flex h-[280px] flex-col overflow-hidden rounded-[20px] border border-primary/20 bg-card shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-floating)] motion-reduce:transform-none motion-reduce:transition-none"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-primary" />

      <div className="flex min-h-0 flex-1 flex-col p-3.5">
        <div className="flex items-start justify-between gap-3">
          <button type="button" onClick={() => onView(student)} className="min-w-0 flex-1 rounded-xl text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10">
            <div className="flex items-center gap-3">
              {student.photoUrl ? (
                <AuthenticatedUserImage
                  src={student.photoUrl}
                  alt={fullName}
                  className="h-12 w-12 shrink-0 rounded-[15px] border border-primary/20 object-cover shadow-[var(--shadow-soft)]"
                  fallback={<AvatarFallback fullName={fullName} />}
                />
              ) : <AvatarFallback fullName={fullName} />}
              <div className="min-w-0">
                <h2 className="truncate text-[15px] font-semibold tracking-[-0.015em] text-foreground">{fullName}</h2>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {student.grade?.name ? `${student.grade.name} student` : "Student profile"}
                </p>
              </div>
            </div>
          </button>

          <button type="button" onClick={() => onView(student)} aria-label={`Open ${fullName}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-primary/[0.08] hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10">
            <ArrowUpRight className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="mt-3"><StudentStatusBadge status={student.status} /></div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <InfoRow icon={<BookOpen className="h-4 w-4" />} label="Grade" value={formatText(student.grade?.name)} />
          <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Classroom" value={formatText(student.classroom?.name)} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-primary/15 bg-primary/[0.025] px-3.5 py-2.5">
        {isDeleted ? (
          <button type="button" onClick={() => onRestore(student)} disabled={isBusy} className="col-span-3 inline-flex h-10 items-center justify-center gap-2 rounded-xl border !border-[#00b84a] !bg-transparent px-4 text-xs font-semibold !text-[#00b84a] transition-colors hover:!bg-[#00b84a]/[0.08] disabled:cursor-not-allowed disabled:opacity-50">
            {isRestoring ? <Spinner /> : <RotateCcw className="h-4 w-4" />}
            <span>{isRestoring ? "Restoring..." : "Restore student"}</span>
          </button>
        ) : (
          <>
            <ActionButton label="Edit" ariaLabel={`Edit ${fullName}`} onClick={() => onEdit(student)} disabled={isBusy}><Pencil className="h-4 w-4" /></ActionButton>
            <ActionButton label="Delete" ariaLabel={`Delete ${fullName}`} onClick={() => onDelete(student)} disabled={isBusy} className="!border-[#ff2020] !bg-transparent !text-[#ff2020] hover:!border-[#ff2020] hover:!bg-[#ff2020]/[0.08] hover:!text-[#ff2020]">{isDeleting ? <Spinner /> : <Trash2 className="h-4 w-4" />}</ActionButton>
            <ActionButton label={isEnabled ? "Disable" : "Enable"} ariaLabel={isEnabled ? "Disable account" : "Enable account"} onClick={() => onToggleStatus(student)} disabled={isBusy} className="!border-[#00b84a] !bg-transparent !text-[#00b84a] hover:!border-[#00b84a] hover:!bg-[#00b84a]/[0.08] hover:!text-[#00b84a]">{isToggling ? <Spinner /> : <Power className="h-4 w-4" />}</ActionButton>
          </>
        )}
      </div>
    </motion.article>
  );
}

function AvatarFallback({ fullName }: { fullName: string }) {
  return <div aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-primary/[0.08] text-primary"><span className="text-sm font-medium">{getInitials(fullName)}</span><UserRound className="hidden h-6 w-6" /></div>;
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-border/55 bg-muted/30 px-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08] text-primary shadow-[var(--shadow-soft)]">{icon}</span>
      <div className="min-w-0 flex-1">
        <span className="block text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</span>
        <span title={value} className="mt-0.5 block truncate text-[12px] font-medium text-foreground">{value}</span>
      </div>
    </div>
  );
}

function ActionButton({ label, ariaLabel, onClick, disabled = false, className = "", children }: { label: string; ariaLabel: string; onClick: () => void; disabled?: boolean; className?: string; children: ReactNode }) {
  return (
    <button type="button" aria-label={ariaLabel} title={ariaLabel} onClick={onClick} disabled={disabled} className={["inline-flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-xl border border-border bg-card/80 px-2 text-[11px] font-semibold text-primary transition-colors hover:border-primary/20 hover:bg-primary/[0.08] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-40", className].join(" ")}>
      {children}<span className="truncate">{label}</span>
    </button>
  );
}

function Spinner() { return <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />; }
