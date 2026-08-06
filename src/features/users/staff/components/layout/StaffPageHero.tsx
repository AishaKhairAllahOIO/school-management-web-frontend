import { AuthenticatedUserImage } from "../../../shared/components/AuthenticatedUserImage";

import type {
  ReactNode,
} from "react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  ArrowLeft,
  IdCard,
  Pencil,
  Save,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";

type StaffPageHeroMode =
  | "view"
  | "edit"
  | "create";

type StaffPageHeroColor = {
  background: string;
  light: string;
  text: string;
  border: string;
  hover: string;
  ring: string;
  button: string;
  footer: string;
};

type StaffPageHeroProps = {
  mode: StaffPageHeroMode;

  title: string;
  description: string;

  backLabel: string;
  onBack: () => void;
  showBackButton?: boolean;

  photoUrl?: string | null;
  photoAlt?: string;

  staffId?: string | number;

  accountStatus?:
    | "active"
    | "disabled";

  roleLabel?: string;

  icon?: LucideIcon;
  color?: StaffPageHeroColor;

  onEdit?: () => void;

  badgeLabel?: string;

  showFormActions?: boolean;
  loading?: boolean;

  submitLabel?: string;
  cancelLabel?: string;

  onCancel?: () => void;

  children?: ReactNode;
};

const defaultColor: StaffPageHeroColor = {
  background: "bg-primary",
  light: "bg-primary/[0.08]",
  text: "text-primary",
  border: "border-primary/20",
  hover:
    "hover:border-primary/30 hover:bg-primary/[0.07] hover:text-primary",
  ring:
    "focus-visible:ring-primary/15",
  button:
    "bg-primary text-primary-foreground hover:bg-primary/90",
  footer:
    "bg-primary/[0.035] hover:bg-primary/[0.07]",
};

function getInitials(
  value: string,
): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0),
    )
    .join("")
    .toUpperCase();
}

export function StaffPageHero({
  mode,
  title,
  description,
  backLabel,
  onBack,
  showBackButton = true,
  photoUrl = null,
  photoAlt,
  staffId,
  accountStatus,
  roleLabel,
  icon,
  color = defaultColor,
  onEdit,
  badgeLabel,
  showFormActions = false,
  loading = false,
  submitLabel = "Save changes",
  cancelLabel = "Cancel",
  onCancel,
  children,
}: StaffPageHeroProps) {
  const isView =
    mode === "view";

  const isCreate =
    mode === "create";

  const isActive =
    accountStatus === "active";

  const initials =
    getInitials(title);

  const RoleIcon =
    icon ?? ShieldCheck;

  return (
    <section
      className={[
        "relative overflow-hidden",
        "rounded-[22px]",
        "border",
        color.border,
        "bg-card",
        "shadow-sm",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "absolute inset-0",
          color.light,
          "opacity-70",
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none",
          "absolute -right-16 -top-24",
          "h-52 w-52 rounded-full",
          color.background,
          "opacity-[0.12]",
          "blur-3xl",
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none",
          "absolute -bottom-24 left-1/3",
          "h-44 w-44 rounded-full",
          color.background,
          "opacity-[0.06]",
          "blur-3xl",
        ].join(" ")}
      />

      <div className="relative p-4 sm:px-5 sm:py-4">
        {showBackButton ? (
        <button
          type="button"
          onClick={onBack}
          className={[
            "inline-flex items-center gap-2",
            "rounded-lg px-1 py-1",
            "text-xs font-medium",
            "text-muted-foreground",
            "transition-colors",
            color.hover,
            "focus-visible:outline-none",
            "focus-visible:ring-4",
            color.ring,
          ].join(" ")}
        >
          <ArrowLeft
            className="h-4 w-4"
            strokeWidth={1.8}
          />

          {backLabel}
        </button>
        ) : null}

        <div
          className={[
            showBackButton ? "mt-3" : "",
            "flex flex-col gap-4",
            "lg:flex-row",
            "lg:items-center",
            "lg:justify-between",
          ].join(" ")}
        >
          <div className="flex min-w-0 items-center gap-3.5">
            <HeroPhoto
              mode={mode}
              photoUrl={photoUrl}
              photoAlt={
                photoAlt ??
                title
              }
              initials={initials}
              icon={RoleIcon}
              color={color}
            />

            <div className="min-w-0">
              <HeroBadge
                mode={mode}
                label={
                  badgeLabel ??
                  roleLabel
                }
                icon={RoleIcon}
                color={color}
              />

              <h1
                className={[
                  "mt-1 truncate",
                  "text-2xl font-semibold",
                  "tracking-[-0.035em]",
                  "text-foreground",
                ].join(" ")}
              >
                {title}
              </h1>

              <p
                className={[
                  "mt-1 max-w-2xl",
                  "text-sm leading-5",
                  "text-muted-foreground",
                ].join(" ")}
              >
                {description}
              </p>

              {isView ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {staffId !==
                  undefined ? (
                    <span
                      className={[
                        "inline-flex items-center gap-2",
                        "rounded-full border",
                        color.border,
                        color.light,
                        "px-3 py-1.5",
                        "text-xs font-medium",
                        color.text,
                      ].join(" ")}
                    >
                      <IdCard
                        className="h-3.5 w-3.5"
                        strokeWidth={1.8}
                      />

                      Staff #{staffId}
                    </span>
                  ) : null}

                  {accountStatus ? (
                    <span
                      className={[
                        "inline-flex items-center gap-2",
                        "rounded-full border",
                        "px-3 py-1.5",
                        "text-xs font-medium",

                        isActive
                          ? [
                              "border-success/15",
                              "bg-success/[0.08]",
                              "text-success",
                            ].join(" ")
                          : [
                              "border-warning/15",
                              "bg-warning/[0.08]",
                              "text-warning",
                            ].join(" "),
                      ].join(" ")}
                    >
                      <ShieldCheck
                        className="h-3.5 w-3.5"
                        strokeWidth={1.8}
                      />

                      {isActive
                        ? "Active account"
                        : "Disabled account"}
                    </span>
                  ) : null}
                </div>
              ) : null}

              {children}
            </div>
          </div>

          {isView && onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              className={[
                "inline-flex h-10",
                "shrink-0 items-center",
                "justify-center gap-2",
                "self-start rounded-xl",
                "px-4",
                "text-sm font-semibold",
                "",
                "transition",
                color.button,
                "hover:-translate-y-0.5",
                "focus-visible:outline-none",
                "focus-visible:ring-4",
                color.ring,
                "lg:self-center",
              ].join(" ")}
            >
              <Pencil
                className="h-4 w-4"
                strokeWidth={1.8}
              />

              Edit profile
            </button>
          ) : null}

          {showFormActions ? (
            <div
              className={[
                "flex shrink-0",
                "items-center gap-2",
                "self-start",
                "lg:self-center",
              ].join(" ")}
            >
              {onCancel ? (
                <button
                  type="button"
                  disabled={loading}
                  onClick={onCancel}
                  className={[
                    "inline-flex h-10",
                    "items-center justify-center",
                    "rounded-xl",
                    "border border-border/80",
                    "bg-card/90 px-4",
                    "text-sm font-semibold",
                    "text-foreground",
                    "shadow-sm",
                    "backdrop-blur-sm",
                    "transition-colors",
                    "hover:bg-muted",
                    "disabled:cursor-not-allowed",
                    "disabled:opacity-50",
                    "focus-visible:outline-none",
                    "focus-visible:ring-4",
                    color.ring,
                  ].join(" ")}
                >
                  {cancelLabel}
                </button>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className={[
                  "inline-flex h-10",
                  "items-center justify-center gap-2",
                  "rounded-xl px-4",
                  "text-sm font-semibold",
                  "",
                  "transition",
                  color.button,
                  "hover:-translate-y-0.5",
                  "disabled:translate-y-0",
                  "disabled:cursor-not-allowed",
                  "disabled:opacity-60",
                  "focus-visible:outline-none",
                  "focus-visible:ring-4",
                  color.ring,
                ].join(" ")}
              >
                <Save
                  className={[
                    "h-4 w-4",
                    loading
                      ? "animate-pulse"
                      : "",
                  ].join(" ")}
                  strokeWidth={1.8}
                />

                {loading
                  ? "Saving..."
                  : submitLabel}
              </button>
            </div>
          ) : null}

          {isCreate &&
          roleLabel &&
          !showFormActions ? (
            <aside
              className={[
                "rounded-[18px]",
                "border",
                color.border,
                "bg-card/75 p-3.5",
                "shadow-[var(--shadow-card)]",
                "backdrop-blur-sm",
                "lg:w-64",
              ].join(" ")}
            >
              <p
                className={[
                  "text-[10px]",
                  "font-semibold uppercase",
                  "tracking-[0.12em]",
                  color.text,
                ].join(" ")}
              >
                Assigned role
              </p>

              <div className="mt-2.5 flex items-center gap-3">
                <span
                  className={[
                    "flex h-9 w-9",
                    "items-center justify-center",
                    "rounded-[12px]",
                    color.light,
                    color.text,
                  ].join(" ")}
                >
                  <RoleIcon
                    className="h-[18px] w-[18px]"
                    strokeWidth={1.8}
                  />
                </span>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {roleLabel}
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Assigned automatically
                  </p>
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function HeroPhoto({
  mode,
  photoUrl,
  photoAlt,
  initials,
  icon: Icon,
  color,
}: {
  mode: StaffPageHeroMode;
  photoUrl: string | null;
  photoAlt: string;
  initials: string;
  icon: LucideIcon;
  color: StaffPageHeroColor;
}) {
  const isCreate =
    mode === "create";

  const sizeClassName =
    mode === "view"
      ? "h-16 w-16 rounded-[18px]"
      : "h-12 w-12 rounded-[14px]";

  if (photoUrl) {
    return (
      <div
        className={[
          "shrink-0 overflow-hidden",
          "border",
          color.border,
          "bg-card",
          "shadow-[var(--shadow-card)]",
          sizeClassName,
        ].join(" ")}
      >
        <AuthenticatedUserImage
          src={photoUrl}
          alt={photoAlt}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (isCreate) {
    return (
      <span
        className={[
          "flex shrink-0",
          "items-center justify-center",
          "shadow-[var(--shadow-card)]",
          color.button,
          sizeClassName,
        ].join(" ")}
      >
        <UserPlus
          className="h-5 w-5"
          strokeWidth={1.8}
        />
      </span>
    );
  }

  return (
    <span
      className={[
        "relative flex shrink-0",
        "items-center justify-center",
        "overflow-hidden",
        "border",
        color.border,
        color.light,
        color.text,
        "text-base font-semibold",
        "shadow-[var(--shadow-card)]",
        sizeClassName,
      ].join(" ")}
    >
      <Icon
        aria-hidden="true"
        className="absolute h-10 w-10 opacity-[0.08]"
        strokeWidth={1.5}
      />

      <span className="relative">
        {initials}
      </span>
    </span>
  );
}

function HeroBadge({
  mode,
  label,
  icon: RoleIcon,
  color,
}: {
  mode: StaffPageHeroMode;
  label?: string;
  icon: LucideIcon;
  color: StaffPageHeroColor;
}) {
  const content =
    mode === "create"
      ? "New profile"
      : mode === "edit"
        ? "Edit profile"
        : label;

  if (!content) {
    return null;
  }

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5",
        "rounded-full border",
        color.border,
        color.light,
        "px-2.5 py-1",
        "text-[9px] font-semibold",
        "uppercase tracking-[0.12em]",
        color.text,
      ].join(" ")}
    >
      {mode === "view" ? (
        <RoleIcon
          className="h-3 w-3"
          strokeWidth={1.9}
        />
      ) : (
        <Sparkles
          className="h-3 w-3"
          strokeWidth={1.9}
        />
      )}

      {content}
    </span>
  );
}