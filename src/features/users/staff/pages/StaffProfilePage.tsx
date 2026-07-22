import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Phone,
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
        message="The staff identifier is missing."
        onBack={() =>
          navigate(config.listPath)
        }
      />
    );
  }

  if (staffQuery.isPending) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-10 text-center text-muted-foreground">
        Loading staff profile...
      </div>
    );
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

  return (
    <section className="space-y-6">
      <header className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {staff.photoUrl ? (
              <img
                src={staff.photoUrl}
                alt={staff.fullName}
                className="h-20 w-20 rounded-3xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <UserRound className="h-9 w-9" />
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={() =>
                  navigate(config.listPath)
                }
                className="mb-2 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to {config.pluralLabel}
              </button>

              <h1 className="text-2xl font-black text-foreground">
                {staff.fullName}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {config.singularLabel} profile
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                `${config.listPath}/${staffId}/edit`,
              )
            }
            className="primary-gradient inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold text-primary-foreground"
          >
            <Pencil className="h-4 w-4" />
            Edit profile
          </button>
        </div>
      </header>

      <ProfileSection
        title="Personal information"
        icon={<UserRound className="h-5 w-5" />}
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
          value={displayValue(staff.gender)}
        />

        <InfoItem
          label="Nationality"
          value={displayValue(
            staff.nationality,
          )}
        />
      </ProfileSection>

      <ProfileSection
        title="Contact information"
        icon={<Phone className="h-5 w-5" />}
      >
        <InfoItem
          label="Phone number"
          value={staff.phoneNumber}
          icon={<Phone className="h-4 w-4" />}
        />

        <InfoItem
          label="Email"
          value={staff.email}
          icon={<Mail className="h-4 w-4" />}
        />

        <InfoItem
          label="Address"
          value={staff.address}
          icon={<MapPin className="h-4 w-4" />}
          className="md:col-span-2"
        />
      </ProfileSection>

      <ProfileSection
        title="Employment information"
        icon={
          <BriefcaseBusiness className="h-5 w-5" />
        }
      >
        <InfoItem
          label="Degree"
          value={displayValue(staff.degree)}
          icon={
            <GraduationCap className="h-4 w-4" />
          }
        />

        <InfoItem
          label="Specialization"
          value={staff.specialization}
        />

        <InfoItem
          label="University"
          value={staff.university}
        />

        <InfoItem
          label="Graduation year"
          value={staff.graduationYear}
        />

        <InfoItem
          label="Hire date"
          value={staff.hireDate}
          icon={
            <CalendarDays className="h-4 w-4" />
          }
        />

        <InfoItem
          label="Experience years"
          value={staff.experienceYears}
        />

        {role === "service_staff" ? (
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
        />
      </ProfileSection>
    </section>
  );
}

function ProfileSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>

        <h2 className="text-lg font-black text-foreground">
          {title}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function InfoItem({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value:
    | string
    | number
    | null
    | undefined;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-secondary/60 p-4 ${className ?? ""}`}
    >
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2 text-sm font-bold text-foreground">
        {icon}

        <span>
          {value === null ||
          value === undefined ||
          value === ""
            ? "Not specified"
            : value}
        </span>
      </div>
    </div>
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
    <div className="rounded-[2rem] border border-destructive/20 bg-card p-8 text-center">
      <h1 className="text-xl font-black">
        Staff profile unavailable
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        {message}
      </p>

      <div className="mt-5 flex justify-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-border px-5 py-3 text-sm font-bold"
        >
          Back
        </button>

        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="primary-gradient rounded-2xl px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            Try again
          </button>
        ) : null}
      </div>
    </div>
  );
}