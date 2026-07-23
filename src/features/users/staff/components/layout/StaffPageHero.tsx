import type {
  ReactNode,
} from "react";

import {
  ArrowLeft,
  IdCard,
  Pencil,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UserRound,
} from "lucide-react";

type StaffPageHeroMode =
  | "view"
  | "edit"
  | "create";

type StaffPageHeroProps = {
  mode: StaffPageHeroMode;

  title: string;
  description: string;

  backLabel: string;
  onBack: () => void;

  photoUrl?: string | null;
  photoAlt?: string;

  staffId?:
    | string
    | number;

  accountStatus?:
    | "active"
    | "disabled";

  roleLabel?: string;

  onEdit?: () => void;

  badgeLabel?: string;

  children?: ReactNode;
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
  photoUrl = null,
  photoAlt,
  staffId,
  accountStatus,
  roleLabel,
  onEdit,
  badgeLabel,
  children,
}: StaffPageHeroProps) {
  const isView =
    mode === "view";

//   const isEdit =
//     mode === "edit";

  const isCreate =
    mode === "create";

  const isActive =
    accountStatus === "active";

  const initials =
    getInitials(title);

  return (
    <section
      className={[
        "relative overflow-hidden",
        "rounded-[28px]",
        "border border-border/70",
        "bg-card",
        "shadow-[var(--shadow-floating)]",
      ].join(" ")}
    >
      <div className="soft-purple-gradient absolute inset-0 opacity-80" />

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none",
          "absolute -right-16 -top-20",
          "h-64 w-64 rounded-full",
          "bg-primary/15 blur-3xl",
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none",
          "absolute -bottom-24 left-1/3",
          "h-56 w-56 rounded-full",
          "bg-primary/[0.07] blur-3xl",
        ].join(" ")}
      />

      <div
        className={[
          "relative",
          "flex flex-col gap-6",
          "p-5 sm:p-6",
          "lg:flex-row",
          "lg:items-center",
          "lg:justify-between",
        ].join(" ")}
      >
        <div className="min-w-0">
          <button
            type="button"
            onClick={onBack}
            className={[
              "inline-flex items-center gap-2",
              "text-xs font-medium",
              "text-muted-foreground",
              "transition-colors",
              "hover:text-primary",
              "focus-visible:outline-none",
              "focus-visible:ring-4",
              "focus-visible:ring-primary/10",
            ].join(" ")}
          >
            <ArrowLeft className="h-4 w-4" />

            {backLabel}
          </button>

          <div
            className={[
              "mt-5",
              "flex min-w-0",
              "items-center gap-4",
            ].join(" ")}
          >
            <HeroPhoto
              mode={mode}
              photoUrl={photoUrl}
              photoAlt={
                photoAlt ??
                title
              }
              initials={initials}
            />

            <div className="min-w-0">
              <HeroBadge
                mode={mode}
                label={
                  badgeLabel ??
                  roleLabel
                }
              />

              <h1
                className={[
                  "mt-3 truncate",
                  "text-3xl font-semibold",
                  "tracking-[-0.045em]",
                  "text-foreground",
                ].join(" ")}
              >
                {title}
              </h1>

              <p
                className={[
                  "mt-2 max-w-2xl",
                  "text-sm leading-6",
                  "text-muted-foreground",
                ].join(" ")}
              >
                {description}
              </p>

              {isView ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {staffId !==
                  undefined ? (
                    <span
                      className={[
                        "inline-flex items-center gap-2",
                        "rounded-full",
                        "border border-primary/10",
                        "bg-primary/[0.07]",
                        "px-3 py-1.5",
                        "text-xs font-medium",
                        "text-primary",
                      ].join(" ")}
                    >
                      <IdCard className="h-3.5 w-3.5" />

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
                      <ShieldCheck className="h-3.5 w-3.5" />

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
        </div>

        {isView && onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className={[
              "primary-gradient",
              "inline-flex h-11",
              "shrink-0 items-center",
              "justify-center gap-2",
              "rounded-xl px-5",
              "text-sm font-semibold",
              "text-primary-foreground",
              "shadow-[var(--shadow-auth-button)]",
              "transition-transform",
              "hover:-translate-y-0.5",
              "focus-visible:outline-none",
              "focus-visible:ring-4",
              "focus-visible:ring-primary/15",
            ].join(" ")}
          >
            <Pencil className="h-4 w-4" />

            Edit profile
          </button>
        ) : null}

        {isCreate && roleLabel ? (
          <aside
            className={[
              "rounded-[20px]",
              "border border-card/80",
              "bg-card/65 p-4",
              "shadow-[var(--shadow-card)]",
              "backdrop-blur-sm",
              "lg:w-72",
            ].join(" ")}
          >
            <p
              className={[
                "text-[10px]",
                "font-semibold uppercase",
                "tracking-[0.12em]",
                "text-primary",
              ].join(" ")}
            >
              Assigned role
            </p>

            <div className="mt-3 flex items-center gap-3">
              <span
                className={[
                  "flex h-10 w-10",
                  "items-center justify-center",
                  "rounded-[14px]",
                  "bg-primary/[0.08]",
                  "text-primary",
                ].join(" ")}
              >
                <ShieldCheck className="h-5 w-5" />
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
    </section>
  );
}

function HeroPhoto({
  mode,
  photoUrl,
  photoAlt,
  initials,
}: {
  mode: StaffPageHeroMode;
  photoUrl: string | null;
  photoAlt: string;
  initials: string;
}) {
  const isCreate =
    mode === "create";

  const sizeClassName =
    mode === "view"
      ? "h-24 w-24 rounded-[24px]"
      : "h-16 w-16 rounded-[20px]";

  if (photoUrl) {
    return (
      <div
        className={[
          "shrink-0 overflow-hidden",
          "border border-card/80",
          "bg-card",
          "shadow-[var(--shadow-floating)]",
          sizeClassName,
        ].join(" ")}
      >
        <img
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
          "primary-gradient",
          "flex shrink-0",
          "items-center justify-center",
          "text-primary-foreground",
          "shadow-[var(--shadow-auth-button)]",
          sizeClassName,
        ].join(" ")}
      >
        <UserPlus className="h-6 w-6" />
      </span>
    );
  }

  if (initials) {
    return (
      <span
        className={[
          "primary-gradient",
          "flex shrink-0",
          "items-center justify-center",
          "text-lg font-semibold",
          "text-primary-foreground",
          "shadow-[var(--shadow-auth-button)]",
          sizeClassName,
        ].join(" ")}
      >
        {initials}
      </span>
    );
  }

  return (
    <span
      className={[
        "flex shrink-0",
        "items-center justify-center",
        "bg-primary/[0.08]",
        "text-primary",
        "shadow-[var(--shadow-card)]",
        sizeClassName,
      ].join(" ")}
    >
      <UserRound className="h-7 w-7" />
    </span>
  );
}

function HeroBadge({
  mode,
  label,
}: {
  mode: StaffPageHeroMode;
  label?: string;
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
        "rounded-full",
        "border border-primary/10",
        "bg-primary/[0.07]",
        "px-3 py-1",
        "text-[10px] font-semibold",
        "uppercase tracking-[0.12em]",
        "text-primary",
      ].join(" ")}
    >
      <Sparkles className="h-3 w-3" />

      {content}
    </span>
  );
}