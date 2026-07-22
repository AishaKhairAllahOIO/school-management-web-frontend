import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Camera,
  Check,
  GraduationCap,
  Save,
  ShieldCheck,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  fieldClassName,
  FormField,
  FormSection,
} from "../components/form/StudentFormPrimitives";
import { StudentAcademicFields } from "../components/form/StudentAcademicFields";
import { StudentPageHeader } from "../components/shared/StudentPageHeader";
import { useRegisterStudent } from "../hooks/useStudents";
import type {
  RegisterStudentPayload,
  UserGender,
} from "../types/student.types";

type PersonState = {
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
  url_photo: File | null;
};

type FormState = {
  student: PersonState;
  guardian: PersonState;

  enrollment: {
    academic_year_id: string;
    grade_level_id: string;
    class_room_id: string;
  };
};

const emptyPerson: PersonState = {
  first_name: "",
  last_name: "",
  father_name: "",
  mother_name: "",
  birth_date: "",
  birth_place: "",
  gender: "male",
  nationality: "syrian",
  address: "",
  phone_number: "",
  url_photo: null,
};

const initialState: FormState = {
  student: { ...emptyPerson },
  guardian: { ...emptyPerson },

  enrollment: {
    academic_year_id: "",
    grade_level_id: "",
    class_room_id: "",
  },
};

export function StudentRegistrationPage() {
  const navigate = useNavigate();

  const registerMutation =
    useRegisterStudent();

  const [form, setForm] =
    useState<FormState>(initialState);

  const [
    studentPreview,
    setStudentPreview,
  ] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (studentPreview) {
        URL.revokeObjectURL(
          studentPreview,
        );
      }
    };
  }, [studentPreview]);

  const studentCompleted = useMemo(
    () =>
      Boolean(
        form.student.first_name &&
          form.student.last_name &&
          form.student.birth_date &&
          form.student.phone_number,
      ),
    [form.student],
  );

  const guardianCompleted = useMemo(
    () =>
      Boolean(
        form.guardian.first_name &&
          form.guardian.last_name &&
          form.guardian.phone_number,
      ),
    [form.guardian],
  );

  const enrollmentCompleted = useMemo(
    () =>
      Boolean(
        form.enrollment
          .academic_year_id &&
          form.enrollment.grade_level_id,
      ),
    [form.enrollment],
  );

  function updateStudent(
    key: keyof PersonState,
    value:
      | string
      | UserGender
      | File
      | null,
  ) {
    setForm((current) => ({
      ...current,

      student: {
        ...current.student,
        [key]: value,
      },
    }));
  }

  function updateGuardian(
    key: keyof PersonState,
    value:
      | string
      | UserGender
      | File
      | null,
  ) {
    setForm((current) => ({
      ...current,

      guardian: {
        ...current.guardian,
        [key]: value,
      },
    }));
  }

  function updateEnrollment(
    key: keyof FormState["enrollment"],
    value: string,
  ) {
    setForm((current) => ({
      ...current,

      enrollment: {
        ...current.enrollment,
        [key]: value,
      },
    }));
  }

  function selectStudentPhoto(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ?? null;

    updateStudent("url_photo", file);

    setStudentPreview((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }

      return file
        ? URL.createObjectURL(file)
        : null;
    });
  }

  async function submit(
    event: FormEvent,
  ) {
    event.preventDefault();

    const payload: RegisterStudentPayload =
      {
        student: {
          ...form.student,
        },

        guardian: {
          ...form.guardian,
        },

        enrollment: {
          academic_year_id:
            form.enrollment
              .academic_year_id,

          grade_level_id:
            form.enrollment
              .grade_level_id,

          class_room_id:
            form.enrollment
              .class_room_id || null,
        },
      };

    const result =
      await registerMutation.mutateAsync(
        payload,
      );

    const enrollmentId =
      result.enrollment?.id;

    navigate(
      enrollmentId
        ? `/users/students/${enrollmentId}`
        : "/users/students",
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 lg:px-8">
      <form
        onSubmit={submit}
        className="mx-auto flex max-w-[1450px] flex-col gap-6"
      >
        <StudentPageHeader
          title="Add student"
          description="Create a student profile, connect a guardian and choose the academic placement."
          showBackButton
          icon={
            <UserPlus
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
                    "/users/students",
                  )
                }
                className="inline-flex h-11 items-center rounded-xl border border-border/70 bg-card px-5 text-sm font-medium text-foreground transition hover:bg-muted/40"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  registerMutation.isPending
                }
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {registerMutation.isPending ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Save
                    size={16}
                    strokeWidth={1.8}
                  />
                )}

                Create student
              </button>
            </>
          }
        />

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <FormSection
              eyebrow="Profile image"
              title="Student photo"
              description="Add a clear portrait for the student directory and profile."
              icon={
                <Camera
                  size={18}
                  strokeWidth={1.7}
                />
              }
              completed={Boolean(
                form.student.url_photo,
              )}
            >
              <div className="flex flex-col items-center gap-5 sm:flex-row">
                <div className="flex h-44 w-36 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-border/60 bg-primary/[0.035]">
                  {studentPreview ? (
                    <img
                      src={studentPreview}
                      alt="Student preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Camera
                      size={35}
                      strokeWidth={1.4}
                      className="text-primary"
                    />
                  )}
                </div>

                <div>
                  <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-primary/20 bg-primary/[0.06] px-5 text-sm font-medium text-primary transition hover:bg-primary/[0.1]">
                    <Camera
                      size={16}
                      strokeWidth={1.8}
                    />

                    Choose photo

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={
                        selectStudentPhoto
                      }
                    />
                  </label>

                  <p className="mt-3 text-xs font-normal leading-5 text-muted-foreground">
                    Use a portrait JPG or PNG
                    image with a clear face.
                  </p>
                </div>
              </div>
            </FormSection>

            <PersonFormSection
              eyebrow="Student details"
              title="Personal information"
              description="Identity, birth and contact details for the student."
              icon={
                <UserPlus
                  size={18}
                  strokeWidth={1.7}
                />
              }
              value={form.student}
              completed={studentCompleted}
              onChange={updateStudent}
            />

            <PersonFormSection
              eyebrow="Family contact"
              title="Guardian information"
              description="Information for the guardian responsible for this student."
              icon={
                <UsersRound
                  size={18}
                  strokeWidth={1.7}
                />
              }
              value={form.guardian}
              completed={
                guardianCompleted
              }
              onChange={updateGuardian}
            />

            <FormSection
              eyebrow="Academic placement"
              title="Enrollment"
              description="Choose the academic year, grade and optional classroom."
              icon={
                <GraduationCap
                  size={18}
                  strokeWidth={1.7}
                />
              }
              completed={
                enrollmentCompleted
              }
            >
              <StudentAcademicFields
                academicYearId={
                  form.enrollment
                    .academic_year_id
                }
                gradeId={
                  form.enrollment
                    .grade_level_id
                }
                classroomId={
                  form.enrollment
                    .class_room_id
                }
                onAcademicYearChange={(
                  value,
                ) => {
                  setForm((current) => ({
                    ...current,

                    enrollment: {
                      ...current.enrollment,
                      academic_year_id:
                        value,
                      class_room_id: "",
                    },
                  }));
                }}
                onGradeChange={(value) => {
                  setForm((current) => ({
                    ...current,

                    enrollment: {
                      ...current.enrollment,
                      grade_level_id:
                        value,
                      class_room_id: "",
                    },
                  }));
                }}
                onClassroomChange={(
                  value,
                ) =>
                  updateEnrollment(
                    "class_room_id",
                    value,
                  )
                }
              />
            </FormSection>
          </div>

          <aside className="xl:sticky xl:top-5">
            <section className="overflow-hidden rounded-[24px] border border-primary/15 bg-card shadow-[0_16px_45px_rgba(30,20,70,0.08)]">
              <div className="border-b border-border/50 bg-primary/[0.055] p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-primary/10 text-primary">
                  <ShieldCheck
                    size={19}
                    strokeWidth={1.7}
                  />
                </span>

                <h2 className="mt-4 text-lg font-semibold text-foreground">
                  Ready to create?
                </h2>

                <p className="mt-1 text-xs font-normal leading-5 text-muted-foreground">
                  Review the required sections
                  before submitting the record.
                </p>
              </div>

              <div className="space-y-2.5 p-5">
                <ReviewRow
                  label="Student details"
                  completed={
                    studentCompleted
                  }
                />

                <ReviewRow
                  label="Guardian contact"
                  completed={
                    guardianCompleted
                  }
                />

                <ReviewRow
                  label="Academic placement"
                  completed={
                    enrollmentCompleted
                  }
                />

                <button
                  type="submit"
                  disabled={
                    registerMutation.isPending
                  }
                  className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
                >
                  <Save
                    size={16}
                    strokeWidth={1.8}
                  />

                  {registerMutation.isPending
                    ? "Creating..."
                    : "Create student"}
                </button>
              </div>
            </section>
          </aside>
        </div>
      </form>
    </main>
  );
}

type PersonFormSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  value: PersonState;
  completed: boolean;

  onChange: (
    key: keyof PersonState,
    value:
      | string
      | UserGender
      | File
      | null,
  ) => void;
};

function PersonFormSection({
  eyebrow,
  title,
  description,
  icon,
  value,
  completed,
  onChange,
}: PersonFormSectionProps) {
  return (
    <FormSection
      eyebrow={eyebrow}
      title={title}
      description={description}
      icon={icon}
      completed={completed}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="First name"
          required
        >
          <input
            required
            value={value.first_name}
            onChange={(event) =>
              onChange(
                "first_name",
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField
          label="Last name"
          required
        >
          <input
            required
            value={value.last_name}
            onChange={(event) =>
              onChange(
                "last_name",
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField
          label="Father name"
          required
        >
          <input
            required
            value={value.father_name}
            onChange={(event) =>
              onChange(
                "father_name",
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField
          label="Mother name"
          required
        >
          <input
            required
            value={value.mother_name}
            onChange={(event) =>
              onChange(
                "mother_name",
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField
          label="Birth date"
          required
        >
          <input
            required
            type="date"
            value={value.birth_date}
            onChange={(event) =>
              onChange(
                "birth_date",
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField
          label="Birth place"
          required
        >
          <input
            required
            value={value.birth_place}
            onChange={(event) =>
              onChange(
                "birth_place",
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField
          label="Gender"
          required
        >
          <select
            value={value.gender}
            onChange={(event) =>
              onChange(
                "gender",
                event.target
                  .value as UserGender,
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
          label="Nationality"
          required
        >
          <input
            required
            value={value.nationality}
            onChange={(event) =>
              onChange(
                "nationality",
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField
          label="Phone number"
          required
        >
          <input
            required
            dir="ltr"
            value={value.phone_number}
            onChange={(event) =>
              onChange(
                "phone_number",
                event.target.value,
              )
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField
          label="Address"
          required
          className="md:col-span-2"
        >
          <textarea
            required
            value={value.address}
            onChange={(event) =>
              onChange(
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

function ReviewRow({
  label,
  completed,
}: {
  label: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-[14px] bg-muted/[0.25] px-3.5 py-3">
      <span className="text-xs font-medium text-foreground">
        {label}
      </span>

      <span
        className={[
          "inline-flex items-center gap-1.5",
          "rounded-full px-2.5 py-1",
          "text-[10px] font-medium",
          completed
            ? "bg-emerald-500/[0.09] text-emerald-600"
            : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        {completed ? (
          <Check
            size={11}
            strokeWidth={2}
          />
        ) : null}

        {completed
          ? "Ready"
          : "Incomplete"}
      </span>
    </div>
  );
}