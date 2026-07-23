import type {
  ReactNode,
} from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  IdCard,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  staffSectionConfigs,
} from "../config/staff.config";

import {
  useStaffDetails,
} from "../hooks/useStaff";

import type {
  StaffRole,
} from "../types/staff.types";

type StaffProfilePageProps = {
  role: StaffRole;
};

function displayValue(
  value:
    | string
    | number
    | null
    | undefined,
  fallback = "Not specified",
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
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function getInitials(
  fullName: string,
) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0),
    )
    .join("")
    .toUpperCase();
}

export function StaffProfilePage({
  role,
}: StaffProfilePageProps) {
  const navigate = useNavigate();

  const { staffId } = useParams<{
    staffId: string;
  }>();

  const config =
    staffSectionConfigs[role];

  const staffQuery =
    useStaffDetails(staffId);

  if (!staffId) {
    return (
      <ErrorState
        message="The staff identifier is missing from the page address."
        onBack={() =>
          navigate(config.listPath)
        }
      />
    );
  }

  if (staffQuery.isPending) {
    return <ProfileSkeleton />;
  }

  if (
    staffQuery.isError ||
    !staffQuery.data
  ) {
    return (
      <ErrorState
        message={`The ${config.singularLabel.toLowerCase()} profile could not be loaded.`}
        onBack={() =>
          navigate(config.listPath)
        }
        onRetry={() =>
          void staffQuery.refetch()
        }
      />
    );
  }

  const staff = staffQuery.data;

  const isEnabled =
    staff.accountStatus ===
      "enabled" ||
    staff.accountStatus ===
      "active";

  return (
    <section className="space-y-5">
      <section
        className={[
          "relative overflow-hidden rounded-[28px]",
          "border border-border/70 bg-card",
          "shadow-[var(--shadow-floating)]",
        ].join(" ")}
      >
        <div className="soft-purple-gradient absolute inset-0 opacity-75" />

        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              {staff.photoUrl ? (
                <img
                  src={staff.photoUrl}
                  alt={staff.fullName}
                  className="h-24 w-24 shrink-0 rounded-[24px] border border-card/80 object-cover shadow-[var(--shadow-floating)]"
                />
              ) : (
                <div className="primary-gradient flex h-24 w-24 shrink-0 items-center justify-center rounded-[24px] text-xl font-semibold text-primary-foreground shadow-[var(--shadow-auth-button)]">
                  {getInitials(
                    staff.fullName,
                  )}
                </div>
              )}

              <div className="min-w-0">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      config.listPath,
                    )
                  }
                  className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to{" "}
                  {config.pluralLabel}
                </button>

                <h1 className="mt-3 truncate text-3xl font-semibold tracking-[-0.045em] text-foreground">
                  {staff.fullName}
                </h1>

                <p className="mt-1.5 text-sm text-muted-foreground">
                  {config.singularLabel} profile and employment record
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/[0.07] px-3 py-1.5 text-xs font-medium text-primary">
                    <IdCard className="h-3.5 w-3.5" />
                    Staff #{staff.id}
                  </span>

                  <span
                    className={[
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
                      "text-xs font-medium",
                      isEnabled
                        ? "border-success/15 bg-success/[0.08] text-success"
                        : "border-warning/15 bg-warning/[0.08] text-warning",
                    ].join(" ")}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {isEnabled
                      ? "Active account"
                      : "Disabled account"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `${config.listPath}/${staffId}/edit`,
                )
              }
              className="primary-gradient inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-auth-button)] transition hover:-translate-y-0.5"
            >
              <Pencil className="h-4 w-4" />
              Edit profile
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <ProfileSection
          eyebrow="Identity"
          title="Personal information"
          description="Legal identity and personal details."
          icon={
            <UserRound className="h-5 w-5" />
          }
        >
          <InfoItem
            label="First name"
            value={staff.firstName}
          />

          <InfoItem
            label="Last name"
            value={staff.lastName}
          />

          <InfoItem
            label="Father name"
            value={staff.fatherName}
          />

          <InfoItem
            label="Mother name"
            value={staff.motherName}
          />

          <InfoItem
            label="Birth date"
            value={displayValue(
              staff.birthDate,
            )}
          />

          <InfoItem
            label="Birth place"
            value={staff.birthPlace}
          />

          <InfoItem
            label="Gender"
            value={displayValue(
              staff.gender,
            )}
          />

          <InfoItem
            label="Nationality"
            value={displayValue(
              staff.nationality,
            )}
          />
        </ProfileSection>

        <ProfileSection
          eyebrow="Contact"
          title="Contact information"
          description="Primary communication details."
          icon={
            <Phone className="h-5 w-5" />
          }
        >
          <InfoItem
            label="Phone number"
            value={staff.phoneNumber}
            icon={
              <Phone className="h-4 w-4" />
            }
            direction="ltr"
            className="sm:col-span-2 xl:col-span-1"
          />

          <InfoItem
            label="Email address"
            value={staff.email}
            icon={
              <Mail className="h-4 w-4" />
            }
            direction="ltr"
            className="sm:col-span-2 xl:col-span-1"
          />

          <InfoItem
            label="Address"
            value={staff.address}
            icon={
              <MapPin className="h-4 w-4" />
            }
            className="sm:col-span-2"
          />
        </ProfileSection>
      </div>

      <ProfileSection
        eyebrow="Professional record"
        title="Employment information"
        description="Qualifications, experience and school employment details."
        icon={
          <BriefcaseBusiness className="h-5 w-5" />
        }
      >
        <InfoItem
          label="Degree"
          value={displayValue(
            staff.degree,
          )}
          icon={
            <GraduationCap className="h-4 w-4" />
          }
        />

        <InfoItem
          label="Specialization"
          value={
            staff.specialization
          }
        />

        <InfoItem
          label="University"
          value={staff.university}
        />

        <InfoItem
          label="Graduation year"
          value={
            staff.graduationYear
          }
        />

        <InfoItem
          label="Hire date"
          value={staff.hireDate}
          icon={
            <CalendarDays className="h-4 w-4" />
          }
        />

        <InfoItem
          label="Experience"
          value={
            staff.experienceYears ===
              null ||
            staff.experienceYears ===
              undefined
              ? "Not specified"
              : `${staff.experienceYears} years`
          }
        />

        {role ===
        "service_staff" ? (
          <InfoItem
            label="Service type"
            value={displayValue(
              staff.serviceType,
            )}
          />
        ) : null}

        <InfoItem
          label="Account status"
          value={displayValue(
            staff.accountStatus,
          )}
          icon={
            <ShieldCheck className="h-4 w-4" />
          }
        />
      </ProfileSection>
    </section>
  );
}

function ProfileSection({
  eyebrow,
  title,
  description,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-border/70 bg-card shadow-[var(--shadow-card)]">
      <header className="flex items-start gap-3 border-b border-border/60 bg-muted/25 px-5 py-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-primary/[0.08] text-primary">
          {icon}
        </span>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-primary">
            {eyebrow}
          </p>

          <h2 className="mt-0.5 text-[17px] font-semibold tracking-[-0.02em] text-foreground">
            {title}
          </h2>

          <p className="mt-1 text-[13px] font-normal text-muted-foreground">
            {description}
          </p>
        </div>
      </header>

      <div className="grid gap-3 p-5 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function InfoItem({
  label,
  value,
  icon,
  direction,
  className = "",
}: {
  label: string;
  value:
    | string
    | number
    | null
    | undefined;
  icon?: ReactNode;
  direction?: "ltr" | "rtl";
  className?: string;
}) {
  const display =
    value === null ||
    value === undefined ||
    value === ""
      ? "Not specified"
      : value;

  return (
    <article
      className={[
        "group rounded-[18px] border border-border/60",
        "bg-muted/30 p-4",
        "transition-colors hover:border-primary/15 hover:bg-primary/[0.025]",
        className,
      ].join(" ")}
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.09em] text-muted-foreground">
        {label}
      </p>

      <div
        dir={direction}
        className="mt-2 flex items-center gap-2 text-sm font-medium leading-6 text-foreground"
      >
        {icon ? (
          <span className="shrink-0 text-primary">
            {icon}
          </span>
        ) : null}

        <span className="break-words">
          {display}
        </span>
      </div>
    </article>
  );
}

function ProfileSkeleton() {
  return (
    <section className="space-y-5">
      <div className="h-44 animate-pulse rounded-[28px] bg-muted" />

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-[26px] bg-muted" />
        <div className="h-80 animate-pulse rounded-[26px] bg-muted" />
      </div>

      <div className="h-96 animate-pulse rounded-[26px] bg-muted" />
    </section>
  );
}

function ErrorState({
  message,
  onBack,
  onRetry,
}: {
  message: string;
  onBack: () => void;
  onRetry?: () => void;
}) {
  return (
    <section className="soft-purple-gradient mx-auto max-w-xl rounded-[28px] border border-destructive/20 p-8 text-center shadow-[var(--shadow-floating)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-destructive/[0.08] text-destructive">
        <UserRound className="h-7 w-7" />
      </div>

      <h1 className="mt-5 text-xl font-semibold text-foreground">
        Staff profile unavailable
      </h1>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {message}
      </p>

      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-muted"
        >
          Back
        </button>

        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="primary-gradient inline-flex h-10 items-center justify-center rounded-xl px-4 text-xs font-semibold text-primary-foreground"
          >
            Try again
          </button>
        ) : null}
      </div>
    </section>
  );
}