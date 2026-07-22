import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import {
  GraduationCap,
  Loader2,
  Save,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  fieldClassName,
  FormField,
  FormSection,
} from "../components/form/StudentFormPrimitives";
import { StudentAcademicFields } from "../components/form/StudentAcademicFields";
import { StudentPageHeader } from "../components/shared/StudentPageHeader";
import {
  useStudentFullProfile,
  useUpdateGuardian,
  useUpdateStudentEnrollment,
  useUpdateStudentPersonal,
} from "../hooks/useStudents";
import type {
  EnrollmentStatus,
  UpdateGuardianPersonalPayload,
  UpdateStudentEnrollmentPayload,
  UpdateStudentPersonalPayload,
  UserGender,
} from "../types/student.types";

type EditablePerson = {
  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  birth_date: string;
  birth_place: string;
  gender: UserGender;
  nationality: string;
  address: string;
  phone_number: string;
};

const emptyPerson: EditablePerson = {
  first_name: "",
  last_name: "",
  father_name: "",
  mother_name: "",
  birth_date: "",
  birth_place: "",
  gender: "male",
  nationality: "",
  address: "",
  phone_number: "",
};

export function StudentEditPage() {
  const navigate = useNavigate();

  const { enrollmentId } =
    useParams<{
      enrollmentId: string;
    }>();

  const profileQuery =
    useStudentFullProfile(enrollmentId);

  const studentMutation =
    useUpdateStudentPersonal(
      enrollmentId,
    );

  const guardianMutation =
    useUpdateGuardian(enrollmentId);

  const enrollmentMutation =
    useUpdateStudentEnrollment();

  const [student, setStudent] =
    useState<EditablePerson>(
      emptyPerson,
    );

  const [guardian, setGuardian] =
    useState<EditablePerson>(
      emptyPerson,
    );

  const [enrollment, setEnrollment] =
    useState({
      academic_year_id: "",
      grade_level_id: "",
      class_room_id: "",

      enrollment_status:
        "enrolled" as EnrollmentStatus,
    });

  useEffect(() => {
    if (!profileQuery.data) {
      return;
    }

    const data = profileQuery.data;

    setStudent({
      first_name:
        data.student.firstName ?? "",

      last_name:
        data.student.lastName ?? "",

      father_name:
        data.student.fatherName ?? "",

      mother_name:
        data.student.motherName ?? "",

      birth_date:
        data.student.birthDate ?? "",

      birth_place:
        data.student.birthPlace ?? "",

      gender:
        data.student.gender ?? "male",

      nationality:
        data.student.nationality ?? "",

      address:
        data.student.address ?? "",

      phone_number:
        data.student.phoneNumber ?? "",
    });

    if (data.guardian) {
      setGuardian({
        first_name:
          data.guardian.firstName ?? "",

        last_name:
          data.guardian.lastName ?? "",

        father_name:
          data.guardian.fatherName ??
          "",

        mother_name:
          data.guardian.motherName ??
          "",

        birth_date:
          data.guardian.birthDate ?? "",

        birth_place:
          data.guardian.birthPlace ??
          "",

        gender:
          data.guardian.gender ?? "male",

        nationality:
          data.guardian.nationality ??
          "",

        address:
          data.guardian.address ?? "",

        phone_number:
          data.guardian.phoneNumber ??
          "",
      });
    }

    setEnrollment({
      academic_year_id: String(
        data.enrollment
          .academicYearId ?? "",
      ),

      grade_level_id: String(
        data.enrollment.gradeId ?? "",
      ),

      class_room_id: String(
        data.enrollment.classroomId ??
          "",
      ),

      enrollment_status:
        data.enrollment
          .enrollmentStatus,
    });
  }, [profileQuery.data]);

  async function submit(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (
      !profileQuery.data ||
      !enrollmentId
    ) {
      return;
    }

    const tasks: Promise<unknown>[] = [
      studentMutation.mutateAsync({
        studentId:
          profileQuery.data.student.id,

        payload:
          student as UpdateStudentPersonalPayload,
      }),

      enrollmentMutation.mutateAsync({
        enrollmentId,

        payload: {
          ...enrollment,

          class_room_id:
            enrollment.class_room_id ||
            null,
        } as UpdateStudentEnrollmentPayload,
      }),
    ];

    if (profileQuery.data.guardian) {
      tasks.push(
        guardianMutation.mutateAsync({
          guardianId:
            profileQuery.data.guardian
              .id,

          payload:
            guardian as UpdateGuardianPersonalPayload,
        }),
      );
    }

    await Promise.all(tasks);

    navigate(
      `/users/students/${enrollmentId}`,
    );
  }

  if (profileQuery.isPending) {
    return (
      <main className="min-h-screen bg-background px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1450px] space-y-6">
          <div className="h-28 animate-pulse rounded-[24px] bg-muted/65" />

          <div className="h-[520px] animate-pulse rounded-[24px] bg-muted/50" />
        </div>
      </main>
    );
  }

  if (
    profileQuery.isError ||
    !profileQuery.data
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-[24px] border border-destructive/15 bg-card p-8 text-center shadow-[0_18px_50px_rgba(30,20,70,0.08)]">
          <UserRound
            size={30}
            className="mx-auto text-destructive"
          />

          <h1 className="mt-4 text-lg font-semibold text-foreground">
            Student data could not be
            loaded
          </h1>

          <p className="mt-2 text-sm font-normal leading-6 text-muted-foreground">
            The profile may be unavailable or
            you may not have permission to
            edit it.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/users/students")
            }
            className="mt-5 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Back to students
          </button>
        </div>
      </main>
    );
  }

  const isSaving =
    studentMutation.isPending ||
    guardianMutation.isPending ||
    enrollmentMutation.isPending;

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 lg:px-8">
      <form
        onSubmit={submit}
        className="mx-auto flex max-w-[1450px] flex-col gap-6"
      >
        <StudentPageHeader
          title="Edit student"
          description="Update personal details, guardian information and academic placement."
          showBackButton
          icon={
            <UserRound
              size={23}
              strokeWidth={1.7}
            />
          }
          actions={
            <>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/users/students/${enrollmentId}`,
                  )
                }
                className="inline-flex h-11 items-center rounded-xl border border-border/70 bg-card px-5 text-sm font-medium text-foreground transition hover:bg-muted/40"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Save
                    size={16}
                    strokeWidth={1.8}
                  />
                )}

                Save changes
              </button>
            </>
          }
        />

        <EditablePersonSection
          eyebrow="Student details"
          title="Personal information"
          description="Update identity, birth and contact details."
          icon={
            <UserRound
              size={18}
              strokeWidth={1.7}
            />
          }
          value={student}
          onChange={setStudent}
        />

        {profileQuery.data.guardian ? (
          <EditablePersonSection
            eyebrow="Family contact"
            title="Guardian information"
            description="Update the linked guardian's personal and contact details."
            icon={
              <UsersRound
                size={18}
                strokeWidth={1.7}
              />
            }
            value={guardian}
            onChange={setGuardian}
          />
        ) : null}

        <FormSection
          eyebrow="Academic placement"
          title="Enrollment"
          description="Change the academic year, grade, classroom or enrollment status."
          icon={
            <GraduationCap
              size={18}
              strokeWidth={1.7}
            />
          }
        >
          <StudentAcademicFields
            academicYearId={
              enrollment.academic_year_id
            }
            gradeId={
              enrollment.grade_level_id
            }
            classroomId={
              enrollment.class_room_id
            }
            disabled={isSaving}
            onAcademicYearChange={(
              value,
            ) =>
              setEnrollment(
                (current) => ({
                  ...current,

                  academic_year_id:
                    value,

                  class_room_id: "",
                }),
              )
            }
            onGradeChange={(value) =>
              setEnrollment(
                (current) => ({
                  ...current,

                  grade_level_id:
                    value,

                  class_room_id: "",
                }),
              )
            }
            onClassroomChange={(
              value,
            ) =>
              setEnrollment(
                (current) => ({
                  ...current,

                  class_room_id: value,
                }),
              )
            }
          />

          <div className="mt-4 max-w-sm">
            <FormField label="Enrollment status">
              <select
                value={
                  enrollment.enrollment_status
                }
                disabled={isSaving}
                onChange={(event) =>
                  setEnrollment(
                    (current) => ({
                      ...current,

                      enrollment_status:
                        event.target
                          .value as EnrollmentStatus,
                    }),
                  )
                }
                className={fieldClassName}
              >
                <option value="pending">
                  Pending
                </option>

                <option value="enrolled">
                  Enrolled
                </option>

                <option value="suspended">
                  Suspended
                </option>

                <option value="withdrawn">
                  Withdrawn
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>
            </FormField>
          </div>
        </FormSection>

        <div className="flex justify-end border-t border-border/55 pt-5">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <Save
                size={16}
                strokeWidth={1.8}
              />
            )}

            {isSaving
              ? "Saving changes..."
              : "Save all changes"}
          </button>
        </div>
      </form>
    </main>
  );
}

function EditablePersonSection({
  eyebrow,
  title,
  description,
  icon,
  value,
  onChange,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  value: EditablePerson;

  onChange: React.Dispatch<
    React.SetStateAction<EditablePerson>
  >;
}) {
  function update(
    key: keyof EditablePerson,
    nextValue: string,
  ) {
    onChange((current) => ({
      ...current,
      [key]: nextValue,
    }));
  }

  return (
    <FormSection
      eyebrow={eyebrow}
      title={title}
      description={description}
      icon={icon}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {(
          [
            [
              "first_name",
              "First name",
            ],

            [
              "last_name",
              "Last name",
            ],

            [
              "father_name",
              "Father name",
            ],

            [
              "mother_name",
              "Mother name",
            ],

            [
              "birth_place",
              "Birth place",
            ],

            [
              "nationality",
              "Nationality",
            ],

            [
              "phone_number",
              "Phone number",
            ],
          ] as const
        ).map(([key, label]) => (
          <FormField
            key={key}
            label={label}
          >
            <input
              value={value[key]}
              onChange={(event) =>
                update(
                  key,
                  event.target.value,
                )
              }
              className={fieldClassName}
              dir={
                key === "phone_number"
                  ? "ltr"
                  : undefined
              }
            />
          </FormField>
        ))}

        <FormField label="Birth date">
          <input
            type="date"
            value={value.birth_date}
            onChange={(event) =>
              update(
                "birth_date",
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField label="Gender">
          <select
            value={value.gender}
            onChange={(event) =>
              update(
                "gender",
                event.target.value,
              )
            }
            className={fieldClassName}
          >
            <option value="male">
              Male
            </option>

            <option value="female">
              Female
            </option>
          </select>
        </FormField>

        <FormField
          label="Address"
          className="md:col-span-2"
        >
          <textarea
            value={value.address}
            onChange={(event) =>
              update(
                "address",
                event.target.value,
              )
            }
            className={`${fieldClassName} min-h-28 resize-y py-3`}
          />
        </FormField>
      </div>
    </FormSection>
  );
}