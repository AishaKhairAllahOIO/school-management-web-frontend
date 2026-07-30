import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Home,
  IdCard,
  MapPin,
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
    | boolean
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

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
}

function formatDateTime(
  value:
    | string
    | null
    | undefined,
  fallback = "Not recorded",
) {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}

function referenceValue(
  reference:
    | NamedEntity
    | null
    | undefined,
  fallbackId:
    | string
    | number
    | null
    | undefined,
) {
  if (reference?.name) {
    return reference.name;
  }

  if (
    fallbackId !== null &&
    fallbackId !== undefined &&
    fallbackId !== ""
  ) {
    return `ID: ${fallbackId}`;
  }

  return "Not assigned";
}

function enrollmentDateValue(
  enrollment: StudentEnrollment,
) {
  return formatDateTime(
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
    <div className="space-y-5 pb-8">
      <StudentPageHeader
        title={student.fullName}
        description="Review all personal, guardian, account and academic enrollment information."
        showBackButton
        backLabel="Back to students"
        onBack={() =>
          navigate("/users/students")
        }
        photoUrl={student.photoUrl}
        photoAlt={student.fullName}
        icon={
          <UserRound
            size={23}
            strokeWidth={1.7}
          />
        }
      />

      <StudentProfileSection
        title="Student information"
        description="Complete identity, account, birth and contact information."
        icon={
          <UserRound
            size={18}
            strokeWidth={1.7}
          />
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ProfileInfoCard
            icon={
              <UserRound
                size={18}
                strokeWidth={1.7}
              />
            }
            label="Full name"
            value={student.fullName}
            className="sm:col-span-2"
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
              <ShieldCheck
                size={18}
                strokeWidth={1.7}
              />
            }
            label="Account status"
            value={
              <span className="capitalize">
                {displayValue(
                  student.accountStatus,
                )}
              </span>
            }
          />

          <ProfileInfoCard
            icon={
              <ShieldCheck
                size={18}
                strokeWidth={1.7}
              />
            }
            label="Record status"
            value={
              <span className="capitalize">
                {displayValue(
                  student.recordStatus,
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
            className="sm:col-span-2 xl:col-span-4"
          />
        </div>
      </StudentProfileSection>

      <StudentProfileSection
        title="Guardian information"
        description="Complete guardian identity, account, birth and contact information."
        icon={
          <UsersRound
            size={18}
            strokeWidth={1.7}
          />
        }
      >
        {guardian ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ProfileInfoCard
              icon={
                <UsersRound
                  size={18}
                  strokeWidth={1.7}
                />
              }
              label="Full name"
              value={guardian.fullName}
              className="sm:col-span-2"
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
                guardian.fatherName,
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
                guardian.motherName,
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
                guardian.birthDate,
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
                guardian.birthPlace,
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
                guardian.gender,
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
                guardian.nationality,
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
                    guardian.phoneNumber,
                  )}
                </span>
              }
            />

            <ProfileInfoCard
              icon={
                <ShieldCheck
                  size={18}
                  strokeWidth={1.7}
                />
              }
              label="Account status"
              value={
                <span className="capitalize">
                  {displayValue(
                    guardian.accountStatus,
                  )}
                </span>
              }
            />

            <ProfileInfoCard
              icon={
                <ShieldCheck
                  size={18}
                  strokeWidth={1.7}
                />
              }
              label="Record status"
              value={
                <span className="capitalize">
                  {displayValue(
                    guardian.recordStatus,
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
                guardian.address,
              )}
              className="sm:col-span-2 xl:col-span-4"
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

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              This student does not currently
              have a guardian record.
            </p>
          </div>
        )}
      </StudentProfileSection>

      <StudentProfileSection
        title="Academic enrollment"
        description="Complete enrollment identifiers, placement, status and timeline."
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
              enrollment.academicYearId,
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
              enrollment.gradeId,
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
              enrollment.classroomId,
            )}
          />


          <ProfileInfoCard
            icon={
              <ShieldCheck
                size={18}
                strokeWidth={1.7}
              />
            }
            label="Enrollment status"
            value={
              <StudentStatusBadge
                status={
                  enrollment.enrollmentStatus
                }
              />
            }
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
            value={formatDateTime(
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
            label="Deleted"
            value={displayValue(
              enrollment.isDeleted,
            )}
          />

          <ProfileInfoCard
            icon={
              <CalendarDays
                size={18}
                strokeWidth={1.7}
              />
            }
            label="Deleted at"
            value={formatDateTime(
              enrollment.deletedAt,
              "Not deleted",
            )}
          />

          <ProfileInfoCard
            icon={
              <CalendarDays
                size={18}
                strokeWidth={1.7}
              />
            }
            label="Created at"
            value={formatDateTime(
              enrollment.createdAt,
            )}
          />

          <ProfileInfoCard
            icon={
              <CalendarDays
                size={18}
                strokeWidth={1.7}
              />
            }
            label="Last updated at"
            value={formatDateTime(
              enrollment.updatedAt,
            )}
          />

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

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
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