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
    <div className="space-y-5 pb-8">
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
        <div className="grid items-start gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
          <UserPhotoCard
            title="Student photo"
            description="Student profile image."
            photoUrl={student.photoUrl}
            alt={student.fullName}
            authenticated
          />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ProfileInfoCard icon={<UserRound size={18} />} label="Full name" value={student.fullName} className="sm:col-span-2" />
          <ProfileInfoCard icon={<UsersRound size={18} />} label="Father name" value={displayValue(student.fatherName)} />
          <ProfileInfoCard icon={<UsersRound size={18} />} label="Mother name" value={displayValue(student.motherName)} />
          <ProfileInfoCard icon={<CalendarDays size={18} />} label="Birth date" value={formatDateOnly(student.birthDate)} />
          <ProfileInfoCard icon={<MapPin size={18} />} label="Birth place" value={displayValue(student.birthPlace)} />
          <ProfileInfoCard icon={<IdCard size={18} />} label="Gender" value={displayValue(student.gender)} />
          <ProfileInfoCard icon={<IdCard size={18} />} label="Nationality" value={formatUserNationality(student.nationality)} />
          <ProfileInfoCard icon={<Phone size={18} />} label="Phone number" value={<span dir="ltr">{displayValue(student.phoneNumber)}</span>} />
          <ProfileInfoCard icon={<Home size={18} />} label="Address" value={displayValue(student.address)} className="sm:col-span-2 xl:col-span-4" />
          </div>
        </div>
      </StudentProfileSection>

      <StudentProfileSection
        title="Guardian information"
        description="Guardian identity, photo, birth and contact information shown in the form."
        icon={<UsersRound size={18} strokeWidth={1.7} />}
      >
        {guardian ? (
          <div className="grid items-start gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
            <UserPhotoCard
              title="Guardian photo"
              description="Guardian profile image."
              photoUrl={guardian.photoUrl}
              alt={guardian.fullName}
              authenticated
            />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ProfileInfoCard icon={<UsersRound size={18} />} label="Full name" value={guardian.fullName} className="sm:col-span-2" />
            <ProfileInfoCard icon={<UsersRound size={18} />} label="Father name" value={displayValue(guardian.fatherName)} />
            <ProfileInfoCard icon={<UsersRound size={18} />} label="Mother name" value={displayValue(guardian.motherName)} />
            <ProfileInfoCard icon={<CalendarDays size={18} />} label="Birth date" value={formatDateOnly(guardian.birthDate)} />
            <ProfileInfoCard icon={<MapPin size={18} />} label="Birth place" value={displayValue(guardian.birthPlace)} />
            <ProfileInfoCard icon={<IdCard size={18} />} label="Gender" value={displayValue(guardian.gender)} />
            <ProfileInfoCard icon={<IdCard size={18} />} label="Nationality" value={formatUserNationality(guardian.nationality)} />
            <ProfileInfoCard icon={<Phone size={18} />} label="Phone number" value={<span dir="ltr">{displayValue(guardian.phoneNumber)}</span>} />
            <ProfileInfoCard icon={<Home size={18} />} label="Address" value={displayValue(guardian.address)} className="sm:col-span-2 xl:col-span-4" />
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
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
    <main className="min-h-screen bg-background px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1450px] space-y-6">
        <div className="h-28 animate-pulse rounded-[22px] bg-muted/60" />
        <div className="h-[360px] animate-pulse rounded-[24px] bg-muted/55" />
        <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
          <div className="h-96 animate-pulse rounded-[24px] bg-muted/50" />
          <div className="h-96 animate-pulse rounded-[24px] bg-muted/50" />
        </div>
      </div>
    </main>
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
