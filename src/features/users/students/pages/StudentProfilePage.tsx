import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Home,
  IdCard,
  MapPin,
  Phone,
  RefreshCw,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { UserPhotoCard } from "../../shared/components/UserPhotoCard";
import { formatUserNationality } from "../../shared/constants/user-nationalities";
import { ProfileInfoCard } from "../components/profile/ProfileInfoCard";
import { StudentProfileSection } from "../components/profile/StudentProfileSection";
import { StudentPageHeader } from "../components/shared/StudentPageHeader";
import { UserPageBackButton } from "../../shared/components/UserPageBackButton";
import { StudentStatusBadge } from "../components/shared/StudentStatusBadge";
import { useStudentFullProfile } from "../hooks/useStudents";
import type { NamedEntity } from "../types/student.types";

function displayValue(
  value: string | number | null | undefined,
  fallback = "Not specified",
) {
  return value === null || value === undefined || value === ""
    ? fallback
    : String(value).replaceAll("_", " ");
}

function formatDateOnly(value: string | null | undefined) {
  if (!value) return "Not specified";

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;

  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

function referenceValue(reference: NamedEntity | null | undefined) {
  return reference?.name || "Not assigned";
}

export function StudentProfilePage() {
  const navigate = useNavigate();
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const profileQuery = useStudentFullProfile(enrollmentId);

  if (!enrollmentId) {
    return (
      <ProfileErrorState
        title="Invalid student profile"
        description="The enrollment identifier is missing from the page URL."
        onBack={() => navigate("/users/students")}
      />
    );
  }

  if (profileQuery.isPending) return <StudentProfileSkeleton />;

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <ProfileErrorState
        title="Student profile could not be loaded"
        description="The enrollment may not exist, or your account may not have permission to view it."
        onBack={() => navigate("/users/students")}
        onRetry={() => void profileQuery.refetch()}
      />
    );
  }

  const { student, guardian, enrollment } = profileQuery.data;

  return (
    <div className="-mt-6 space-y-5 pb-8">
      <UserPageBackButton
        label="Back to students"
        onClick={() => navigate("/users/students")}
      />

      <StudentPageHeader
        title={student.fullName}
        description="Review personal, guardian and academic enrollment information."
        backLabel="Back to students"
        onBack={() => navigate("/users/students")}
        icon={<UserRound size={23} strokeWidth={1.7} />}
      />

      <StudentProfileSection
        title="Student information"
        description="Identity, birth and contact information shown in the student form."
        icon={<UserRound size={18} strokeWidth={1.7} />}
      >
        <div className="grid items-start gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
          <UserPhotoCard
            title="Student photo"
            description="Student profile image."
            photoUrl={student.photoUrl}
            alt={student.fullName}
            authenticated
          />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <ProfileInfoCard icon={<UserRound size={18} />} label="Full name" value={student.fullName} />
          <ProfileInfoCard icon={<UsersRound size={18} />} label="Father name" value={displayValue(student.fatherName)} />
          <ProfileInfoCard icon={<UsersRound size={18} />} label="Mother name" value={displayValue(student.motherName)} />
          <ProfileInfoCard icon={<CalendarDays size={18} />} label="Birth date" value={formatDateOnly(student.birthDate)} />
          <ProfileInfoCard icon={<MapPin size={18} />} label="Birth place" value={displayValue(student.birthPlace)} />
          <ProfileInfoCard icon={<IdCard size={18} />} label="Gender" value={displayValue(student.gender)} />
          <ProfileInfoCard icon={<IdCard size={18} />} label="Nationality" value={formatUserNationality(student.nationality)} />
          <ProfileInfoCard icon={<Phone size={18} />} label="Phone number" value={<span dir="ltr">{displayValue(student.phoneNumber)}</span>} />
          <ProfileInfoCard icon={<Home size={18} />} label="Address" value={displayValue(student.address)} className="sm:col-span-2 xl:col-span-2" />
          </div>
        </div>
      </StudentProfileSection>

      <StudentProfileSection
        title="Guardian information"
        description="Guardian identity, photo, birth and contact information shown in the form."
        icon={<UsersRound size={18} strokeWidth={1.7} />}
      >
        {guardian ? (
          <div className="grid items-start gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
            <UserPhotoCard
              title="Guardian photo"
              description="Guardian profile image."
              photoUrl={guardian.photoUrl}
              alt={guardian.fullName}
              authenticated
            />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <ProfileInfoCard icon={<UsersRound size={18} />} label="Full name" value={guardian.fullName} />
            <ProfileInfoCard icon={<UsersRound size={18} />} label="Father name" value={displayValue(guardian.fatherName)} />
            <ProfileInfoCard icon={<UsersRound size={18} />} label="Mother name" value={displayValue(guardian.motherName)} />
            <ProfileInfoCard icon={<CalendarDays size={18} />} label="Birth date" value={formatDateOnly(guardian.birthDate)} />
            <ProfileInfoCard icon={<MapPin size={18} />} label="Birth place" value={displayValue(guardian.birthPlace)} />
            <ProfileInfoCard icon={<IdCard size={18} />} label="Gender" value={displayValue(guardian.gender)} />
            <ProfileInfoCard icon={<IdCard size={18} />} label="Nationality" value={formatUserNationality(guardian.nationality)} />
            <ProfileInfoCard icon={<Phone size={18} />} label="Phone number" value={<span dir="ltr">{displayValue(guardian.phoneNumber)}</span>} />
            <ProfileInfoCard icon={<Home size={18} />} label="Address" value={displayValue(guardian.address)} className="sm:col-span-2 xl:col-span-2" />
            </div>
          </div>
        ) : (
          <div className="rounded-[18px] border border-dashed border-amber-500/25 bg-amber-500/[0.045] p-6 text-center">
            <p className="text-sm font-medium text-foreground">No guardian linked</p>
          </div>
        )}
      </StudentProfileSection>

      <StudentProfileSection
        title="Academic enrollment"
        description="Academic placement and current enrollment status."
        icon={<GraduationCap size={18} strokeWidth={1.7} />}
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <ProfileInfoCard icon={<CalendarDays size={18} />} label="Academic year" value={referenceValue(enrollment.academicYear)} />
          <ProfileInfoCard icon={<BookOpen size={18} />} label="Grade" value={referenceValue(enrollment.grade)} />
          <ProfileInfoCard icon={<GraduationCap size={18} />} label="Classroom" value={referenceValue(enrollment.classroom)} />
          <ProfileInfoCard icon={<IdCard size={18} />} label="Enrollment status" value={<StudentStatusBadge status={enrollment.enrollmentStatus} />} />
          <ProfileInfoCard icon={<CalendarDays size={18} />} label="Enrollment date" value={formatDateOnly(enrollment.enrollmentDate)} />
        </div>
      </StudentProfileSection>
    </div>
  );
}

function StudentProfileSkeleton() {
  return (
    <div aria-busy="true" className="-mt-6 animate-pulse space-y-5 pb-8">
      <div className="h-10 w-40 rounded-xl bg-muted/65" />

      <section className="rounded-[24px] border border-border/60 bg-card px-5 py-5 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 shrink-0 rounded-[16px] bg-muted/70" />
          <div className="min-w-0 flex-1">
            <div className="h-3 w-24 rounded bg-muted/70" />
            <div className="mt-3 h-7 w-64 max-w-full rounded bg-muted" />
            <div className="mt-3 h-3.5 w-full max-w-xl rounded bg-muted/70" />
          </div>
        </div>
      </section>

      <ProfileSectionSkeleton withPhoto fields={9} />
      <ProfileSectionSkeleton withPhoto fields={9} />
      <ProfileSectionSkeleton fields={5} />
    </div>
  );
}

function ProfileSectionSkeleton({
  withPhoto = false,
  fields,
}: {
  withPhoto?: boolean;
  fields: number;
}) {
  const content = (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: fields }).map((_, index) => (
        <div
          key={index}
          className={[
            "rounded-[16px] border border-border/60 bg-card p-3.5",
            index === fields - 1 && fields >= 8 ? "sm:col-span-2 xl:col-span-2" : "",
          ].join(" ")}
        >
          <div className="h-2.5 w-20 rounded bg-muted/70" />
          <div className="mt-3 h-4 w-32 max-w-full rounded bg-muted" />
        </div>
      ))}
    </div>
  );

  return (
    <section className="overflow-hidden rounded-[22px] border border-border/70 bg-card">
      <header className="flex items-start gap-3 border-b border-border/60 px-5 py-4">
        <div className="h-10 w-10 shrink-0 rounded-[14px] bg-muted/70" />
        <div className="flex-1">
          <div className="h-2.5 w-24 rounded bg-muted/70" />
          <div className="mt-2 h-5 w-44 rounded bg-muted" />
          <div className="mt-2 h-3 w-full max-w-md rounded bg-muted/70" />
        </div>
      </header>
      <div className="p-5">
        {withPhoto ? (
          <div className="grid items-start gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
            <section className="rounded-[20px] border border-border/60 bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-[14px] bg-muted/70" />
                <div className="flex-1">
                  <div className="h-4 w-28 rounded bg-muted" />
                  <div className="mt-2 h-3 w-36 rounded bg-muted/70" />
                </div>
              </div>
              <div className="mt-4 aspect-square rounded-[18px] border border-border/60 bg-muted/20" />
            </section>
            {content}
          </div>
        ) : content}
      </div>
    </section>
  );
}

type ProfileErrorStateProps = {
  title: string;
  description: string;
  onBack: () => void;
  onRetry?: () => void;
};

function ProfileErrorState({ title, description, onBack, onRetry }: ProfileErrorStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-[24px] border border-destructive/15 bg-card p-8 text-center shadow-[0_18px_55px_rgba(30,20,70,0.08)]">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-destructive/[0.08] text-destructive">
          <UserRound size={26} strokeWidth={1.7} />
        </span>
        <h1 className="mt-5 text-xl font-semibold text-foreground">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <button type="button" onClick={onBack} className="inline-flex h-11 items-center justify-center rounded-xl border border-border/70 bg-card px-5 text-sm font-medium text-foreground transition hover:bg-muted/40">
            Back to students
          </button>
          {onRetry ? (
            <button type="button" onClick={onRetry} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
              <RefreshCw size={15} strokeWidth={1.8} /> Try again
            </button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
