import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Home,
  IdCard,
  MapPin,
  Pencil,
  Phone,
  RefreshCw,
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
  NamedEntity,
  StudentEnrollment,
} from "../types/student.types";

function displayValue(
  value:
    | string
    | number
    | null
    | undefined,
  fallback = "Not specified",
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return String(value);
}

function referenceValue(
  reference: NamedEntity | null | undefined,
) {
  return reference?.name ?? "Not assigned";
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

  const { enrollmentId } =
    useParams<{
      enrollmentId: string;
    }>();

  const profileQuery =
    useStudentFullProfile(enrollmentId);

  if (!enrollmentId) {
    return (
      <ProfileErrorState
        title="Invalid student profile"
        description="The enrollment identifier is missing from the page URL."
        onBack={() =>
          navigate("/users/students")
        }
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
        onBack={() =>
          navigate("/users/students")
        }
        onRetry={() =>
          void profileQuery.refetch()
        }
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
          description="Review personal information, guardian details and the current academic placement."
          showBackButton
          icon={
            <UserRound
              size={23}
              strokeWidth={1.7}
            />
          }
          actions={
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/users/students/${enrollmentId}/edit`,
                )
              }
              className={[
                "inline-flex h-11 items-center gap-2",
                "rounded-xl bg-primary px-5",
                "text-sm font-medium",
                "text-primary-foreground",
                "shadow-sm transition",
                "hover:bg-primary/90",
                "focus-visible:outline-none",
                "focus-visible:ring-4",
                "focus-visible:ring-primary/10",
              ].join(" ")}
            >
              <Pencil
                size={16}
                strokeWidth={1.8}
              />

              Edit profile
            </button>
          }
        />

        <StudentProfileHero
          student={student}
          enrollment={enrollment}
        />

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,.85fr)]">
          <StudentProfileSection
            title="Student information"
            description="Identity, birth and contact information."
            icon={
              <UserRound
                size={18}
                strokeWidth={1.7}
              />
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <ProfileInfoCard
                icon={
                  <UserRound
                    size={18}
                    strokeWidth={1.7}
                  />
                }
                label="Full name"
                value={student.fullName}
              />

              <ProfileInfoCard
                icon={
                  <IdCard
                    size={18}
                    strokeWidth={1.7}
                  />
                }
                label="Student reference"
                value={displayValue(
                  student.id,
                )}
              />

              <ProfileInfoCard
                icon={
                  <UsersRound
                    size={18}
                    strokeWidth={1.7}
                  />
                }
                label="Father name"
                value={displayValue(
                  student.fatherName,
                )}
              />

              <ProfileInfoCard
                icon={
                  <UsersRound
                    size={18}
                    strokeWidth={1.7}
                  />
                }
                label="Mother name"
                value={displayValue(
                  student.motherName,
                )}
              />

              <ProfileInfoCard
                icon={
                  <CalendarDays
                    size={18}
                    strokeWidth={1.7}
                  />
                }
                label="Birth date"
                value={displayValue(
                  student.birthDate,
                )}
              />

              <ProfileInfoCard
                icon={
                  <MapPin
                    size={18}
                    strokeWidth={1.7}
                  />
                }
                label="Birth place"
                value={displayValue(
                  student.birthPlace,
                )}
              />

              <ProfileInfoCard
                icon={
                  <IdCard
                    size={18}
                    strokeWidth={1.7}
                  />
                }
                label="Gender"
                value={displayValue(
                  student.gender,
                )}
              />

              <ProfileInfoCard
                icon={
                  <IdCard
                    size={18}
                    strokeWidth={1.7}
                  />
                }
                label="Nationality"
                value={displayValue(
                  student.nationality,
                )}
              />

              <ProfileInfoCard
                icon={
                  <Phone
                    size={18}
                    strokeWidth={1.7}
                  />
                }
                label="Phone number"
                value={
                  <span dir="ltr">
                    {displayValue(
                      student.phoneNumber,
                    )}
                  </span>
                }
              />

              <ProfileInfoCard
                icon={
                  <Home
                    size={18}
                    strokeWidth={1.7}
                  />
                }
                label="Address"
                value={displayValue(
                  student.address,
                )}
                className="sm:col-span-2"
              />
            </div>
          </StudentProfileSection>

          <StudentProfileSection
            title="Guardian information"
            description="Primary family and emergency contact."
            icon={
              <UsersRound
                size={18}
                strokeWidth={1.7}
              />
            }
          >
            {guardian ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <ProfileInfoCard
                  icon={
                    <UsersRound
                      size={18}
                      strokeWidth={1.7}
                    />
                  }
                  label="Full name"
                  value={guardian.fullName}
                />

                <ProfileInfoCard
                  icon={
                    <Phone
                      size={18}
                      strokeWidth={1.7}
                    />
                  }
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
                  icon={
                    <MapPin
                      size={18}
                      strokeWidth={1.7}
                    />
                  }
                  label="Birth place"
                  value={displayValue(
                    guardian.birthPlace,
                  )}
                />

                <ProfileInfoCard
                  icon={
                    <Home
                      size={18}
                      strokeWidth={1.7}
                    />
                  }
                  label="Address"
                  value={displayValue(
                    guardian.address,
                  )}
                />
              </div>
            ) : (
              <div className="rounded-[18px] border border-dashed border-amber-500/25 bg-amber-500/[0.045] p-6 text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] bg-amber-500/[0.1] text-amber-600">
                  <UsersRound
                    size={20}
                    strokeWidth={1.7}
                  />
                </span>

                <p className="mt-4 text-sm font-medium text-foreground">
                  No guardian linked
                </p>

                <p className="mt-1 text-xs font-normal leading-5 text-muted-foreground">
                  This student does not currently
                  have a guardian record.
                </p>
              </div>
            )}
          </StudentProfileSection>
        </div>

        <StudentProfileSection
          title="Academic enrollment"
          description="Current academic year, grade, classroom and enrollment state."
          icon={
            <GraduationCap
              size={18}
              strokeWidth={1.7}
            />
          }
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ProfileInfoCard
              icon={
                <CalendarDays
                  size={18}
                  strokeWidth={1.7}
                />
              }
              label="Academic year"
              value={referenceValue(
                enrollment.academicYear,
              )}
            />

            <ProfileInfoCard
              icon={
                <BookOpen
                  size={18}
                  strokeWidth={1.7}
                />
              }
              label="Grade"
              value={referenceValue(
                enrollment.grade,
              )}
            />

            <ProfileInfoCard
              icon={
                <GraduationCap
                  size={18}
                  strokeWidth={1.7}
                />
              }
              label="Classroom"
              value={referenceValue(
                enrollment.classroom,
              )}
            />

            <ProfileInfoCard
              icon={
                <CalendarDays
                  size={18}
                  strokeWidth={1.7}
                />
              }
              label="Enrollment date"
              value={enrollmentDateValue(
                enrollment,
              )}
            />

            <ProfileInfoCard
              icon={
                <CalendarDays
                  size={18}
                  strokeWidth={1.7}
                />
              }
              label="Completed at"
              value={displayValue(
                enrollment.completedAt,
                "Not completed",
              )}
            />

            <ProfileInfoCard
              icon={
                <ShieldCheck
                  size={18}
                  strokeWidth={1.7}
                />
              }
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
          <StatusSummaryCard
            icon={
              <ShieldCheck
                size={19}
                strokeWidth={1.7}
              />
            }
            label="Account status"
          >
            <span className="text-lg font-semibold capitalize text-foreground">
              {displayValue(
                student.accountStatus,
              )}
            </span>
          </StatusSummaryCard>

          <StatusSummaryCard
            icon={
              <GraduationCap
                size={19}
                strokeWidth={1.7}
              />
            }
            label="Enrollment status"
          >
            <StudentStatusBadge
              status={
                enrollment.enrollmentStatus
              }
            />
          </StatusSummaryCard>
        </section>
      </div>
    </main>
  );
}

function StatusSummaryCard({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={[
        "rounded-[20px]",
        "border border-border/60",
        "bg-card p-5",
        "shadow-[0_10px_30px_rgba(30,20,70,0.045)]",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-primary/[0.07] text-primary">
          {icon}
        </span>

        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {label}
          </p>

          <div className="mt-1.5">
            {children}
          </div>
        </div>
      </div>
    </article>
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

function ProfileErrorState({
  title,
  description,
  onBack,
  onRetry,
}: ProfileErrorStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-[24px] border border-destructive/15 bg-card p-8 text-center shadow-[0_18px_55px_rgba(30,20,70,0.08)]">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-destructive/[0.08] text-destructive">
          <UserRound
            size={26}
            strokeWidth={1.7}
          />
        </span>

        <h1 className="mt-5 text-xl font-semibold text-foreground">
          {title}
        </h1>

        <p className="mt-2 text-sm font-normal leading-6 text-muted-foreground">
          {description}
        </p>

        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border/70 bg-card px-5 text-sm font-medium text-foreground transition hover:bg-muted/40"
          >
            Back to students
          </button>

          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              <RefreshCw
                size={15}
                strokeWidth={1.8}
              />

              Try again
            </button>
          ) : null}
        </div>
      </section>
    </main>
  );
}