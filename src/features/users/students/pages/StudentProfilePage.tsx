import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Home,
  IdCard,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { ProfileInfoCard } from "../components/profile/ProfileInfoCard";
import { StudentProfileHero } from "../components/profile/StudentProfileHero";
import { StudentProfileSection } from "../components/profile/StudentProfileSection";
import { StudentPageHeader } from "../components/shared/StudentPageHeader";
import { StudentStatusBadge } from "../components/shared/StudentStatusBadge";
import { useStudentFullProfile } from "../hooks/useStudents";
import type {
  ApiId,
} from "../../shared/types/api.types";
import type {
  NamedEntity,
  StudentEnrollment,
} from "../types/student.types";

function displayValue(
  value: string | number | null | undefined,
  fallback = "Not specified",
) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
}

function referenceValue(
  reference: NamedEntity | null | undefined,
  id: ApiId | null | undefined,
  fallback: string,
) {
  if (reference?.name) {
    return reference.name;
  }

  if (id !== null && id !== undefined && id !== "") {
    return `${fallback} #${id}`;
  }

  return "Not assigned";
}

function enrollmentDateValue(
  enrollment: StudentEnrollment,
) {
  return displayValue(
    enrollment.enrollmentDate,
    "Not recorded",
  );
}

export function StudentProfilePage() {
  const navigate = useNavigate();
  const { enrollmentId } = useParams<{
    enrollmentId: string;
  }>();

  const profileQuery =
    useStudentFullProfile(enrollmentId);

  if (!enrollmentId) {
    return (
      <ProfileErrorState
        title="Invalid student profile"
        description="The enrollment identifier is missing from the page URL."
        onBack={() => navigate("/users/students")}
      />
    );
  }

  if (profileQuery.isPending) {
    return <StudentProfileSkeleton />;
  }

  if (
    profileQuery.isError ||
    !profileQuery.data
  ) {
    return (
      <ProfileErrorState
        title="Student profile could not be loaded"
        description="The enrollment may not exist, or your account may not have permission to view it."
        onBack={() => navigate("/users/students")}
        onRetry={() => void profileQuery.refetch()}
      />
    );
  }

  const {
    student,
    guardian,
    enrollment,
  } = profileQuery.data;

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1450px] flex-col gap-6">
        <StudentPageHeader
          title="Student profile"
          description="Review the student's personal information, guardian details, academic placement, and account state."
          showBackButton
          icon={<UserRound className="h-7 w-7" />}
          actions={
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/users/students/${enrollmentId}/edit`,
                )
              }
              className="primary-gradient inline-flex h-11 items-center gap-2 rounded-2xl px-5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-auth-button)] transition hover:-translate-y-0.5"
            >
              <Pencil className="h-4 w-4" />
              Edit profile
            </button>
          }
        />

        <StudentProfileHero
          student={student}
          enrollment={enrollment}
        />

        <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
          <StudentProfileSection
            title="Student information"
            description="Identity and contact information"
            icon={<UserRound className="h-5 w-5" />}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <ProfileInfoCard
                icon={<UserRound className="h-5 w-5" />}
                label="Full name"
                value={student.fullName}
              />

              <ProfileInfoCard
                icon={<IdCard className="h-5 w-5" />}
                label="Student ID"
                value={displayValue(student.id)}
              />

              <ProfileInfoCard
                icon={<UsersRound className="h-5 w-5" />}
                label="Father name"
                value={displayValue(student.fatherName)}
              />

              <ProfileInfoCard
                icon={<UsersRound className="h-5 w-5" />}
                label="Mother name"
                value={displayValue(student.motherName)}
              />

              <ProfileInfoCard
                icon={<CalendarDays className="h-5 w-5" />}
                label="Birth date"
                value={displayValue(student.birthDate)}
              />

              <ProfileInfoCard
                icon={<MapPin className="h-5 w-5" />}
                label="Birth place"
                value={displayValue(student.birthPlace)}
              />

              <ProfileInfoCard
                icon={<IdCard className="h-5 w-5" />}
                label="Gender"
                value={displayValue(student.gender)}
              />

              <ProfileInfoCard
                icon={<IdCard className="h-5 w-5" />}
                label="Nationality"
                value={displayValue(student.nationality)}
              />

              <ProfileInfoCard
                icon={<Phone className="h-5 w-5" />}
                label="Phone number"
                value={
                  <span dir="ltr">
                    {displayValue(student.phoneNumber)}
                  </span>
                }
              />

              <ProfileInfoCard
                icon={<Home className="h-5 w-5" />}
                label="Address"
                value={displayValue(student.address)}
                className="sm:col-span-2"
              />
            </div>
          </StudentProfileSection>

          <StudentProfileSection
            title="Guardian information"
            description="Primary family contact"
            icon={<UsersRound className="h-5 w-5" />}
          >
            {guardian ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <ProfileInfoCard
                  icon={<UsersRound className="h-5 w-5" />}
                  label="Full name"
                  value={guardian.fullName}
                />

                <ProfileInfoCard
                  icon={<IdCard className="h-5 w-5" />}
                  label="Guardian ID"
                  value={displayValue(guardian.id)}
                />

                <ProfileInfoCard
                  icon={<Phone className="h-5 w-5" />}
                  label="Phone number"
                  value={
                    <span dir="ltr">
                      {displayValue(
                        guardian.phoneNumber,
                      )}
                    </span>
                  }
                />

                <ProfileInfoCard
                  icon={<MapPin className="h-5 w-5" />}
                  label="Birth place"
                  value={displayValue(
                    guardian.birthPlace,
                  )}
                />

                <ProfileInfoCard
                  icon={<Home className="h-5 w-5" />}
                  label="Address"
                  value={displayValue(
                    guardian.address,
                  )}
                />
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-warning/30 bg-warning/10 p-6">
                <p className="font-bold text-warning">
                  No guardian is linked to this student.
                </p>
              </div>
            )}
          </StudentProfileSection>
        </div>

        <StudentProfileSection
          title="Academic enrollment"
          description="Current academic placement and enrollment record"
          icon={<GraduationCap className="h-5 w-5" />}
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ProfileInfoCard
              icon={<IdCard className="h-5 w-5" />}
              label="Enrollment ID"
              value={displayValue(enrollment.id)}
            />

            <ProfileInfoCard
              icon={<CalendarDays className="h-5 w-5" />}
              label="Academic year"
              value={referenceValue(
                enrollment.academicYear,
                enrollment.academicYearId,
                "Academic year",
              )}
            />

            <ProfileInfoCard
              icon={<BookOpen className="h-5 w-5" />}
              label="Grade"
              value={referenceValue(
                enrollment.grade,
                enrollment.gradeId,
                "Grade",
              )}
            />

            <ProfileInfoCard
              icon={<GraduationCap className="h-5 w-5" />}
              label="Classroom"
              value={referenceValue(
                enrollment.classroom,
                enrollment.classroomId,
                "Classroom",
              )}
            />

            <ProfileInfoCard
              icon={<CalendarDays className="h-5 w-5" />}
              label="Enrollment date"
              value={enrollmentDateValue(enrollment)}
            />

            <ProfileInfoCard
              icon={<CalendarDays className="h-5 w-5" />}
              label="Completed at"
              value={displayValue(
                enrollment.completedAt,
                "Not completed",
              )}
            />

            <ProfileInfoCard
              icon={<ShieldCheck className="h-5 w-5" />}
              label="Record state"
              value={
                enrollment.isDeleted
                  ? "Withdrawn / deleted"
                  : "Active record"
              }
            />
          </div>
        </StudentProfileSection>

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-[28px] border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.1em] text-muted-foreground">
                  Account status
                </p>
                <p className="mt-1 text-lg font-black capitalize text-foreground">
                  {displayValue(
                    student.accountStatus,
                  )}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.1em] text-muted-foreground">
              Enrollment status
            </p>

            <StudentStatusBadge
              status={enrollment.enrollmentStatus}
            />
          </article>
        </section>
      </div>
    </main>
  );
}

function StudentProfileSkeleton() {
  return (
    <main className="min-h-screen bg-background px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1450px] space-y-6">
        <div className="h-36 animate-pulse rounded-[34px] bg-muted" />
        <div className="h-[390px] animate-pulse rounded-[34px] bg-muted" />

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-96 animate-pulse rounded-[30px] bg-muted" />
          <div className="h-96 animate-pulse rounded-[30px] bg-muted" />
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

function ProfileErrorState({
  title,
  description,
  onBack,
  onRetry,
}: ProfileErrorStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="soft-purple-gradient w-full max-w-lg rounded-[34px] border border-destructive/20 p-8 text-center shadow-[var(--shadow-floating)]">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-destructive/10 text-destructive">
          <UserRound className="h-9 w-9" />
        </div>

        <h1 className="mt-5 text-2xl font-black text-foreground">
          {title}
        </h1>

        <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
          {description}
        </p>

        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-border bg-card px-5 text-sm font-bold text-foreground hover:bg-secondary"
          >
            Back to students
          </button>

          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="primary-gradient inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-bold text-primary-foreground"
            >
              Try again
            </button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
