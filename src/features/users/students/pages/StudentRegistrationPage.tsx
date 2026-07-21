import {
  type ChangeEvent,
  type FormEvent,
  useMemo,
  useState,
} from "react";
import {
  Camera,
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
  const registerMutation = useRegisterStudent();

  const [form, setForm] = useState<FormState>(initialState);
  const [studentPreview, setStudentPreview] = useState<string | null>(null);

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
        form.enrollment.academic_year_id &&
          form.enrollment.grade_level_id,
      ),
    [form.enrollment],
  );

  function updateStudent(
    key: keyof PersonState,
    value: string | UserGender | File | null,
  ) {
    setForm((current) => ({
      ...current,
      student: { ...current.student, [key]: value },
    }));
  }

  function updateGuardian(
    key: keyof PersonState,
    value: string | UserGender | File | null,
  ) {
    setForm((current) => ({
      ...current,
      guardian: { ...current.guardian, [key]: value },
    }));
  }

  function updateEnrollment(
    key: keyof FormState["enrollment"],
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      enrollment: { ...current.enrollment, [key]: value },
    }));
  }

  function selectStudentPhoto(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0] ?? null;
    updateStudent("url_photo", file);

    if (studentPreview) {
      URL.revokeObjectURL(studentPreview);
    }

    setStudentPreview(file ? URL.createObjectURL(file) : null);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    const payload: RegisterStudentPayload = {
      student: { ...form.student },
      guardian: { ...form.guardian },
      enrollment: {
        academic_year_id: form.enrollment.academic_year_id,
        grade_level_id: form.enrollment.grade_level_id,
        class_room_id: form.enrollment.class_room_id || null,
      },
    };

    const result = await registerMutation.mutateAsync(payload);
    const enrollmentId = result.enrollment?.id;

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
          description="Create the student, guardian, and academic enrollment in one connected workflow."
          showBackButton
          icon={<UserPlus className="h-7 w-7" />}
          actions={
            <>
              <button
                type="button"
                onClick={() => navigate("/users/students")}
                className="inline-flex h-11 items-center rounded-2xl border border-border bg-card px-5 text-sm font-bold text-foreground transition hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="primary-gradient inline-flex h-11 items-center gap-2 rounded-2xl px-5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-auth-button)] disabled:opacity-60"
              >
                {registerMutation.isPending ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Create student
              </button>
            </>
          }
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <FormSection
              eyebrow="Step 1"
              title="Student photo"
              description="Use a clear portrait that will appear on cards and the profile page."
              icon={<Camera className="h-5 w-5" />}
              completed={Boolean(form.student.url_photo)}
            >
              <div className="flex flex-col items-center gap-5 sm:flex-row">
                <div className="soft-purple-gradient flex h-44 w-36 shrink-0 items-center justify-center overflow-hidden rounded-[28px] border border-primary/15">
                  {studentPreview ? (
                    <img
                      src={studentPreview}
                      alt="Student preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Camera className="h-10 w-10 text-primary" />
                  )}
                </div>

                <div>
                  <label className="primary-gradient inline-flex h-11 cursor-pointer items-center gap-2 rounded-2xl px-5 text-sm font-bold text-primary-foreground">
                    <Camera className="h-4 w-4" />
                    Choose photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={selectStudentPhoto}
                    />
                  </label>
                  <p className="mt-3 text-sm font-medium text-muted-foreground">
                    Recommended: portrait image, JPG or PNG.
                  </p>
                </div>
              </div>
            </FormSection>

            <PersonFormSection
              eyebrow="Step 2"
              title="Student information"
              description="Personal, identity, and contact details for the student."
              icon={<UserPlus className="h-5 w-5" />}
              value={form.student}
              completed={studentCompleted}
              onChange={updateStudent}
            />

            <PersonFormSection
              eyebrow="Step 3"
              title="Guardian information"
              description="The primary guardian responsible for the student."
              icon={<UsersRound className="h-5 w-5" />}
              value={form.guardian}
              completed={guardianCompleted}
              onChange={updateGuardian}
            />

            <FormSection
              eyebrow="Step 4"
              title="Academic enrollment"
              description="Assign the academic year, grade, and optional classroom."
              icon={<GraduationCap className="h-5 w-5" />}
              completed={enrollmentCompleted}
            >
              <div className="grid gap-4 md:grid-cols-3">
                <FormField label="Academic year ID" required>
                  <input
                    required
                    value={form.enrollment.academic_year_id}
                    onChange={(event) =>
                      updateEnrollment(
                        "academic_year_id",
                        event.target.value,
                      )
                    }
                    className={fieldClassName}
                    placeholder="Academic year"
                  />
                </FormField>

                <FormField label="Grade level ID" required>
                  <input
                    required
                    value={form.enrollment.grade_level_id}
                    onChange={(event) =>
                      updateEnrollment(
                        "grade_level_id",
                        event.target.value,
                      )
                    }
                    className={fieldClassName}
                    placeholder="Grade level"
                  />
                </FormField>

                <FormField label="Classroom ID">
                  <input
                    value={form.enrollment.class_room_id}
                    onChange={(event) =>
                      updateEnrollment(
                        "class_room_id",
                        event.target.value,
                      )
                    }
                    className={fieldClassName}
                    placeholder="Optional classroom"
                  />
                </FormField>
              </div>
            </FormSection>
          </div>

          <aside className="xl:sticky xl:top-5 xl:self-start">
            <section className="primary-gradient overflow-hidden rounded-[32px] p-6 text-primary-foreground shadow-[var(--shadow-floating)]">
              <ShieldCheck className="h-9 w-9" />
              <h2 className="mt-5 text-2xl font-black">
                Review before saving
              </h2>
              <p className="mt-2 text-sm font-medium leading-6 text-primary-foreground/80">
                One submission creates the student, guardian, and enrollment together.
              </p>

              <div className="mt-6 space-y-3">
                <ReviewRow
                  label="Student information"
                  completed={studentCompleted}
                />
                <ReviewRow
                  label="Guardian information"
                  completed={guardianCompleted}
                />
                <ReviewRow
                  label="Academic enrollment"
                  completed={enrollmentCompleted}
                />
              </div>

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-card px-5 text-sm font-black text-primary shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                Create student
              </button>
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
    value: string | UserGender | File | null,
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
        <FormField label="First name" required>
          <input
            required
            value={value.first_name}
            onChange={(event) =>
              onChange("first_name", event.target.value)
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField label="Last name" required>
          <input
            required
            value={value.last_name}
            onChange={(event) =>
              onChange("last_name", event.target.value)
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField label="Father name" required>
          <input
            required
            value={value.father_name}
            onChange={(event) =>
              onChange("father_name", event.target.value)
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField label="Mother name" required>
          <input
            required
            value={value.mother_name}
            onChange={(event) =>
              onChange("mother_name", event.target.value)
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField label="Birth date" required>
          <input
            required
            type="date"
            value={value.birth_date}
            onChange={(event) =>
              onChange("birth_date", event.target.value)
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField label="Birth place" required>
          <input
            required
            value={value.birth_place}
            onChange={(event) =>
              onChange("birth_place", event.target.value)
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField label="Gender" required>
          <select
            value={value.gender}
            onChange={(event) =>
              onChange(
                "gender",
                event.target.value as UserGender,
              )
            }
            className={fieldClassName}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </FormField>

        <FormField label="Nationality" required>
          <input
            required
            value={value.nationality}
            onChange={(event) =>
              onChange("nationality", event.target.value)
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField label="Phone number" required>
          <input
            required
            dir="ltr"
            value={value.phone_number}
            onChange={(event) =>
              onChange("phone_number", event.target.value)
            }
            className={fieldClassName}
          />
        </FormField>

        <FormField label="Address" required className="md:col-span-2">
          <textarea
            required
            value={value.address}
            onChange={(event) =>
              onChange("address", event.target.value)
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
    <div className="flex items-center justify-between rounded-2xl bg-card/10 px-4 py-3 text-sm font-bold">
      <span>{label}</span>
      <span
        className={[
          "rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.08em]",
          completed
            ? "bg-card text-primary"
            : "bg-primary-foreground/10 text-primary-foreground/70",
        ].join(" ")}
      >
        {completed ? "Ready" : "Incomplete"}
      </span>
    </div>
  );
}
