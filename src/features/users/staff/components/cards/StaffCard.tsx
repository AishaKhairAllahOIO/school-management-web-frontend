import type {
  ReactNode,
} from "react";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Power,
  Trash2,
} from "lucide-react";

import type {
  StaffProfile,
  StaffSectionColor,
} from "../../types/staff.types";

type StaffCardProps = {
  staff: StaffProfile;
  color: StaffSectionColor;

  pendingToggle?: boolean;
  pendingDelete?: boolean;

  onView: (
    staff: StaffProfile,
  ) => void;

  onEdit: (
    staff: StaffProfile,
  ) => void;

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

function formatDate(
  value:
    | string
    | null
    | undefined,
): string {
  if (!value) {
    return "Not recorded";
  }

  const dateOnlyMatch =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      value,
    );

  const date = dateOnlyMatch
    ? new Date(
        Number(
          dateOnlyMatch[1],
        ),
        Number(
          dateOnlyMatch[2],
        ) - 1,
        Number(
          dateOnlyMatch[3],
        ),
      )
    : new Date(value);

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
  fallback = "Not provided",
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

function formatExperience(
  value:
    | number
    | null
    | undefined,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "Not recorded";
  }

  if (value === 1) {
    return "1 year";
  }

  return `${value} years`;
}

export function StaffCard({
  staff,
  color,
  pendingToggle = false,
  pendingDelete = false,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}: StaffCardProps) {
  const fullName =
    staff.fullName?.trim() ||
    "Unnamed staff member";

  const isDeleted =
    Boolean(
      staff.isDeleted,
    );

  const normalizedStatus =
    String(
      staff.accountStatus ??
        "",
    ).toLowerCase();

  const isEnabled =
    normalizedStatus ===
      "enabled" ||
    normalizedStatus ===
      "active";

  const isBusy =
    pendingToggle ||
    pendingDelete;

  const roleDescription =
    staff.specialization ??
    staff.serviceType ??
    staff.degree;

  return (
    <article
      aria-busy={isBusy}
      className={[
        "group relative flex min-h-[365px] flex-col overflow-hidden",
        "rounded-[24px] border bg-card",
        color.border,
        "shadow-[var(--shadow-card)]",
        "transition-[transform,border-color,box-shadow] duration-300",
        "hover:-translate-y-1",
        "hover:shadow-[var(--shadow-floating)]",
        "motion-reduce:transform-none",
        "motion-reduce:transition-none",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "absolute inset-x-0 top-0 h-[3px]",
          color.background,
        ].join(" ")}
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <button
            type="button"
            onClick={() =>
              onView(staff)
            }
            className={[
              "min-w-0 flex-1 rounded-xl text-left",
              "focus-visible:outline-none",
              "focus-visible:ring-4",
              color.ring,
            ].join(" ")}
          >
            <div className="flex items-center gap-3.5">
              {staff.photoUrl ? (
                <img
                  src={
                    staff.photoUrl
                  }
                  alt={fullName}
                  className={[
                    "h-14 w-14 shrink-0 rounded-[18px] object-cover",
                    "border",
                    color.border,
                    "shadow-[var(--shadow-soft)]",
                  ].join(" ")}
                />
              ) : (
                <div
                  aria-hidden="true"
                  className={[
                    "flex h-14 w-14 shrink-0 items-center justify-center",
                    "rounded-[18px]",
                    color.light,
                    color.text,
                    "text-base font-semibold",
                  ].join(" ")}
                >
                  {getInitials(
                    fullName,
                  )}
                </div>
              )}

              <div className="min-w-0">
                <h2 className="truncate text-[17px] font-semibold tracking-[-0.025em] text-foreground">
                  {fullName}
                </h2>

                <p className="mt-1 truncate text-[13px] font-normal text-muted-foreground">
                  {formatText(
                    roleDescription,
                    "Staff member",
                  )}
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              onView(staff)
            }
            aria-label={`Open ${fullName}`}
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center",
              "rounded-full text-muted-foreground",
              "transition-colors",
              color.hover,
              "focus-visible:outline-none",
              "focus-visible:ring-4",
              color.ring,
            ].join(" ")}
          >
            <ArrowUpRight className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <StatusBadge
            isDeleted={isDeleted}
            isEnabled={isEnabled}
          />

          <span
            className={[
              "max-w-[50%] truncate rounded-full",
              "border bg-muted/55",
              color.border,
              "px-2.5 py-1",
              "text-[10px] font-medium uppercase",
              "tracking-[0.08em]",
              "text-muted-foreground",
            ].join(" ")}
          >
            Staff #{staff.id}
          </span>
        </div>

        <div className="mt-5 grid gap-2.5">
          <InfoRow
            icon={
              <Phone className="h-4 w-4" />
            }
            label="Phone"
            value={
              staff.phoneNumber ||
              "No phone number"
            }
            direction="ltr"
            color={color}
          />

          <InfoRow
            icon={
              <Mail className="h-4 w-4" />
            }
            label="Email"
            value={
              staff.email ||
              "No email address"
            }
            direction="ltr"
            color={color}
          />

          <InfoRow
            icon={
              <BriefcaseBusiness className="h-4 w-4" />
            }
            label="Hired"
            value={formatDate(
              staff.hireDate,
            )}
            color={color}
          />

          <InfoRow
            icon={
              <CalendarDays className="h-4 w-4" />
            }
            label="Experience"
            value={formatExperience(
              staff.experienceYears,
            )}
            color={color}
          />

          <InfoRow
            icon={
              <MapPin className="h-4 w-4" />
            }
            label="Location"
            value={
              staff.address ||
              "No address"
            }
            color={color}
          />
        </div>
      </div>

      <div
        className={[
          "grid grid-cols-[1fr_auto_auto_auto] items-center gap-2",
          "border-t px-4 py-3",
          color.border,
          color.footer,
          "transition-colors",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() =>
            onView(staff)
          }
          className={[
            "inline-flex h-10 min-w-0 items-center justify-center gap-2",
            "rounded-xl px-3",
            "text-xs font-semibold text-foreground",
            "transition-colors",
            color.hover,
            "focus-visible:outline-none",
            "focus-visible:ring-4",
            color.ring,
          ].join(" ")}
        >
          <span className="truncate">
            View profile
          </span>

          <ArrowUpRight className="h-4 w-4 shrink-0" />
        </button>

        <ActionButton
          label="Edit profile"
          onClick={() =>
            onEdit(staff)
          }
          disabled={
            isBusy ||
            isDeleted
          }
          color={color}
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
              staff,
            )
          }
          disabled={
            isBusy ||
            isDeleted
          }
          color={color}
          className="text-warning hover:border-warning/20 hover:bg-warning/10 hover:text-warning"
        >
          {pendingToggle ? (
            <Spinner />
          ) : (
            <Power className="h-4 w-4" />
          )}
        </ActionButton>

        <ActionButton
          label="Delete staff member"
          onClick={() =>
            onDelete(staff)
          }
          disabled={
            isBusy ||
            isDeleted
          }
          color={color}
          className="text-destructive hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
        >
          {pendingDelete ? (
            <Spinner />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </ActionButton>
      </div>
    </article>
  );
}

function StatusBadge({
  isDeleted,
  isEnabled,
}: {
  isDeleted: boolean;
  isEnabled: boolean;
}) {
  if (isDeleted) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-destructive/15 bg-destructive/[0.08] px-3 py-1.5 text-[11px] font-semibold text-destructive">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-destructive"
        />

        Deleted
      </span>
    );
  }

  if (isEnabled) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-success/15 bg-success/[0.08] px-3 py-1.5 text-[11px] font-semibold text-success">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-success"
        />

        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-warning/15 bg-warning/[0.08] px-3 py-1.5 text-[11px] font-semibold text-warning">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-warning"
      />

      Disabled
    </span>
  );
}

function InfoRow({
  icon,
  label,
  value,
  direction,
  color,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  direction?:
    | "ltr"
    | "rtl";
  color: StaffSectionColor;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-border/55 bg-muted/35 px-3 py-2.5">
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center",
          "rounded-xl shadow-[var(--shadow-soft)]",
          color.light,
          color.text,
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
  color,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  color: StaffSectionColor;
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
        "flex h-10 w-10 items-center justify-center rounded-xl",
        "border bg-card/80",
        color.border,
        color.text,
        "transition-colors",
        color.hover,
        "focus-visible:outline-none",
        "focus-visible:ring-4",
        color.ring,
        "disabled:cursor-not-allowed disabled:opacity-40",
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