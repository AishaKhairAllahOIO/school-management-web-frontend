import type { ReactNode } from "react";

import { ArrowUpRight, Mail, Pencil, Phone, Power, RotateCcw, Trash2 } from "lucide-react";
import { AuthenticatedUserImage } from "../../../shared/components/AuthenticatedUserImage";
import type { StaffProfile, StaffSectionColor } from "../../types/staff.types";

type StaffCardProps = {
  staff: StaffProfile;
  color: StaffSectionColor;
  pendingToggle?: boolean;
  pendingDelete?: boolean;
  pendingRestore?: boolean;
  onView: (staff: StaffProfile) => void;
  onEdit: (staff: StaffProfile) => void;
  onToggleStatus: (staff: StaffProfile) => void;
  onDelete: (staff: StaffProfile) => void;
  onRestore: (staff: StaffProfile) => void;
};

function getInitials(fullName: string): string {
  return fullName.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase() || "ST";
}

function formatText(value: string | number | null | undefined, fallback = "Staff member"): string {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value).replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function StaffCard({ staff, color, pendingToggle = false, pendingDelete = false, pendingRestore = false, onView, onEdit, onToggleStatus, onDelete, onRestore }: StaffCardProps) {
  const fullName = staff.fullName?.trim() || "Unnamed staff member";
  const isDeleted = Boolean(staff.isDeleted);
  const normalizedStatus = String(staff.accountStatus ?? "").toLowerCase();
  const isEnabled = normalizedStatus === "enabled" || normalizedStatus === "active";
  const isBusy = pendingToggle || pendingDelete || pendingRestore;
  const roleDescription = staff.specialization ?? staff.serviceType ?? staff.degree;

  return (
    <article aria-busy={isBusy} className={["group relative flex h-[280px] flex-col overflow-hidden rounded-[20px] border bg-card shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1  motion-reduce:transform-none motion-reduce:transition-none", color.border].join(" ")}>
      <div aria-hidden="true" className={["absolute inset-x-0 top-0 h-[3px]", color.background].join(" ")} />

      <div className="flex min-h-0 flex-1 flex-col p-3.5">
        <div className="flex items-start justify-between gap-3">
          <button type="button" onClick={() => onView(staff)} className={["min-w-0 flex-1 rounded-xl text-left focus-visible:outline-none focus-visible:ring-4", color.ring].join(" ")}>
            <div className="flex items-center gap-3">
              {staff.photoUrl ? (
                <AuthenticatedUserImage src={staff.photoUrl} alt={fullName} className={["h-12 w-12 shrink-0 rounded-[15px] border object-cover shadow-[var(--shadow-soft)]", color.border].join(" ")} fallback={<AvatarFallback fullName={fullName} color={color} />} />
              ) : <AvatarFallback fullName={fullName} color={color} />}
              <div className="min-w-0">
                <h2 className="truncate text-[15px] font-semibold tracking-[-0.015em] text-foreground">{fullName}</h2>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{formatText(roleDescription)}</p>
              </div>
            </div>
          </button>

          <button type="button" onClick={() => onView(staff)} aria-label={`Open ${fullName}`} className={["flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-4", color.hover, color.ring].join(" ")}><ArrowUpRight className="h-[18px] w-[18px]" /></button>
        </div>

        <div className="mt-3"><StatusBadge isDeleted={isDeleted} isEnabled={isEnabled} /></div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={staff.phoneNumber || "No phone number"} color={color} direction="ltr" />
          <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={staff.email || "No email address"} color={color} direction="ltr" />
        </div>
      </div>

      <div className={["grid grid-cols-3 gap-2 border-t px-3.5 py-2.5", color.border, color.footer].join(" ")}>
        {isDeleted ? (
          <button type="button" onClick={() => onRestore(staff)} disabled={isBusy} className="col-span-3 inline-flex h-10 items-center justify-center gap-2 rounded-xl border !border-[#00b84a] !bg-transparent px-4 text-xs font-semibold !text-[#00b84a] transition-colors hover:!bg-[#00b84a]/[0.08] disabled:cursor-not-allowed disabled:opacity-50">{pendingRestore ? <Spinner /> : <RotateCcw className="h-4 w-4" />}<span>{pendingRestore ? "Restoring..." : "Restore staff member"}</span></button>
        ) : (
          <>
            <ActionButton label="Edit" ariaLabel="Edit profile" onClick={() => onEdit(staff)} disabled={isBusy} color={color}><Pencil className="h-4 w-4" /></ActionButton>
            <ActionButton label="Delete" ariaLabel="Delete staff member" onClick={() => onDelete(staff)} disabled={isBusy} color={color} className="!border-[#ff2020] !bg-transparent !text-[#ff2020] hover:!border-[#ff2020] hover:!bg-[#ff2020]/[0.08] hover:!text-[#ff2020]">{pendingDelete ? <Spinner /> : <Trash2 className="h-4 w-4" />}</ActionButton>
            <ActionButton label={isEnabled ? "Disable" : "Enable"} ariaLabel={isEnabled ? "Disable account" : "Enable account"} onClick={() => onToggleStatus(staff)} disabled={isBusy} color={color} className="!border-[#00b84a] !bg-transparent !text-[#00b84a] hover:!border-[#00b84a] hover:!bg-[#00b84a]/[0.08] hover:!text-[#00b84a]">{pendingToggle ? <Spinner /> : <Power className="h-4 w-4" />}</ActionButton>
          </>
        )}
      </div>
    </article>
  );
}

function AvatarFallback({ fullName, color }: { fullName: string; color: StaffSectionColor }) {
  return <div aria-hidden="true" className={["flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] text-sm font-medium", color.light, color.text].join(" ")}>{getInitials(fullName)}</div>;
}

function StatusBadge({ isDeleted, isEnabled }: { isDeleted: boolean; isEnabled: boolean }) {
  const classes = isDeleted ? "border-destructive/15 bg-destructive/[0.08] text-destructive" : isEnabled ? "border-success/15 bg-success/[0.08] text-success" : "border-warning/15 bg-warning/[0.08] text-warning";
  const dot = isDeleted ? "bg-destructive" : isEnabled ? "bg-success" : "bg-warning";
  return <span className={["inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold", classes].join(" ")}><span aria-hidden="true" className={["h-1.5 w-1.5 rounded-full", dot].join(" ")} />{isDeleted ? "Deleted" : isEnabled ? "Active" : "Disabled"}</span>;
}

function InfoRow({ icon, label, value, direction, color }: { icon: ReactNode; label: string; value: string; direction?: "ltr" | "rtl"; color: StaffSectionColor }) {
  return <div className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-border/55 bg-muted/30 px-3 py-2.5"><span className={["flex h-8 w-8 shrink-0 items-center justify-center rounded-xl shadow-[var(--shadow-soft)]", color.light, color.text].join(" ")}>{icon}</span><div className="min-w-0 flex-1"><span className="block text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</span><span dir={direction} title={value} className="mt-0.5 block truncate text-[12px] font-medium text-foreground">{value}</span></div></div>;
}

function ActionButton({ label, ariaLabel, onClick, disabled = false, className = "", color, children }: { label: string; ariaLabel: string; onClick: () => void; disabled?: boolean; className?: string; color: StaffSectionColor; children: ReactNode }) {
  return <button type="button" aria-label={ariaLabel} title={ariaLabel} onClick={onClick} disabled={disabled} className={["inline-flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-xl border bg-card/80 px-2 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-40", color.border, color.text, color.hover, color.ring, className].join(" ")}>{children}<span className="truncate">{label}</span></button>;
}

function Spinner() { return <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />; }
