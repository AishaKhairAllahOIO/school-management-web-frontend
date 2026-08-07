import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  GraduationCap,
  Save,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DatePicker } from "@/shared/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";


import {
  fieldClassName,
  FormField,
  FormSection,
} from "../components/form/StudentFormPrimitives";
import { StudentAcademicFields } from "../components/form/StudentAcademicFields";
import { StudentPageHeader } from "../components/shared/StudentPageHeader";
import { UserPageBackButton } from "../../shared/components/UserPageBackButton";
import { UserPhotoCard } from "../../shared/components/UserPhotoCard";
import { USER_NATIONALITIES } from "../../shared/constants/user-nationalities";
import { useRegisterStudent } from "../hooks/useStudents";
import type {
  RegisterStudentPayload,
  UserGender,
  UserNationality
} from "../types/student.types";

type PersonState = {
  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  birth_date: string;
  birth_place: string;
  gender: UserGender;
  nationality: UserNationality;
  address: string;
  phone_number: string;
  photo_url: File | null;
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
  gender: "",
  nationality: "",
  address: "",
  phone_number: "",
  photo_url: null,
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

  const [
    guardianPreview,
    setGuardianPreview,
  ] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (studentPreview) {
        URL.revokeObjectURL(studentPreview);
      }

      if (guardianPreview) {
        URL.revokeObjectURL(guardianPreview);
      }
    };
  }, [studentPreview, guardianPreview]);

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
          form.enrollment.grade_level_id &&
          form.enrollment.class_room_id,
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

    updateStudent("photo_url", file);

    setStudentPreview((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }

      return file
        ? URL.createObjectURL(file)
        : null;
    });
  }

  function selectGuardianPhoto(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ?? null;

    updateGuardian("photo_url", file);

    setGuardianPreview((current) => {
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
              .class_room_id,
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
    <form onSubmit={submit} className="-mt-6 space-y-5 pb-8">
        <UserPageBackButton
          label="Back to students"
          onClick={() => navigate("/users/students")}
        />

        <StudentPageHeader
          title="Add student"
          description="Create a student profile, connect a guardian and choose the academic placement."
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

        <div className="space-y-5">
            <div className="grid items-start gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
              <UserPhotoCard
                title="Student photo"
                description="Click the card to choose a clear student portrait."
                photoUrl={studentPreview}
                alt="Student preview"
                editable
                disabled={registerMutation.isPending}
                onChange={selectStudentPhoto}
              />

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

            </div>

            <div className="grid items-start gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
              <UserPhotoCard
                title="Guardian photo"
                description="Click the card to choose a clear guardian portrait."
                photoUrl={guardianPreview}
                alt="Guardian preview"
                editable
                disabled={registerMutation.isPending}
                onChange={selectGuardianPhoto}
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

            </div>

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
                classroomOptional={false}
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
    </form>
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
          <DatePicker
            value={value.birth_date}
            onChange={(nextValue) =>
              onChange("birth_date", nextValue)
            }
            placeholder="Select birth date"
            required
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
          <Select
            value={value.gender}
            onValueChange={(nextValue) =>
              onChange("gender", nextValue as UserGender)
            }
          >
            <SelectTrigger className="h-12 rounded-[15px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Nationality">
          <Select
            value={value.nationality || "syrian"}
            onValueChange={(nextValue) =>
              onChange("nationality", nextValue)
            }
          >
            <SelectTrigger className="h-12 rounded-[15px]">
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent>
              {USER_NATIONALITIES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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