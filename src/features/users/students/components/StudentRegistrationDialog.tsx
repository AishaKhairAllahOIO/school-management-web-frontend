import {
  ImagePlus,
  Loader2,
  Save,
  X,
} from "lucide-react";
import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { useRegisterStudent } from "../hooks/useStudents";
import type {
  PersonRegistrationInput,
  RegisterStudentPayload,
} from "../types/student-api.types";
import type {
  UserGender,
  UserNationality,
} from "@/features/users/shared/types/user.enums";

type StudentRegistrationDialogProps = {
  open: boolean;
  onClose: () => void;
};

type PersonFormValues = {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  birthDate: string;
  birthPlace: string;
  address: string;
  gender: UserGender;
  nationality: UserNationality | "";
  photo: File | null;
};

type EnrollmentFormValues = {
  academicYearId: string;
  gradeLevelId: string;
  classroomId: string;
};

function createEmptyPerson(): PersonFormValues {
  return {
    phoneNumber: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    birthDate: "",
    birthPlace: "",
    address: "",
    gender: "male",
    nationality: "",
    photo: null,
  };
}

function createEmptyEnrollment(): EnrollmentFormValues {
  return {
    academicYearId: "",
    gradeLevelId: "",
    classroomId: "",
  };
}

function toPersonRequest(
  values: PersonFormValues,
): PersonRegistrationInput {
  if (!values.nationality) {
    throw new Error("Nationality is required.");
  }

  return {
    phoneNumber: values.phoneNumber.trim(),
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    fatherName: values.fatherName.trim(),
    motherName: values.motherName.trim(),
    birthDate: values.birthDate,
    birthPlace: values.birthPlace.trim(),
    address: values.address.trim(),
    gender: values.gender,
    nationality: values.nationality,
    photo: values.photo,
  };
}

export function StudentRegistrationDialog({
  open,
  onClose,
}: StudentRegistrationDialogProps) {
  const registerStudentMutation =
    useRegisterStudent();

  const [student, setStudent] =
    useState<PersonFormValues>(
      createEmptyPerson,
    );

  const [guardian, setGuardian] =
    useState<PersonFormValues>(
      createEmptyPerson,
    );

  const [enrollment, setEnrollment] =
    useState<EnrollmentFormValues>(
      createEmptyEnrollment,
    );

  if (!open) {
    return null;
  }

  function resetForm() {
    setStudent(createEmptyPerson());
    setGuardian(createEmptyPerson());
    setEnrollment(createEmptyEnrollment());
    registerStudentMutation.reset();
  }

  function handleClose() {
    if (registerStudentMutation.isPending) {
      return;
    }

    resetForm();
    onClose();
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (registerStudentMutation.isPending) {
      return;
    }

    const academicYearId = Number(
      enrollment.academicYearId,
    );

    const gradeLevelId = Number(
      enrollment.gradeLevelId,
    );

    const classroomId = Number(
      enrollment.classroomId,
    );

    if (
      !Number.isInteger(academicYearId) ||
      academicYearId < 1 ||
      !Number.isInteger(gradeLevelId) ||
      gradeLevelId < 1 ||
      !Number.isInteger(classroomId) ||
      classroomId < 1
    ) {
      return;
    }

    const payload: RegisterStudentPayload = {
      student: toPersonRequest(student),
      guardian: toPersonRequest(guardian),

      enrollment: {
        academicYearId,
        gradeLevelId,
        classroomId,
      },
    };

    registerStudentMutation.mutate(payload, {
      onSuccess: () => {
        resetForm();
        onClose();
      },
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-student-title"
    >
      <div className="max-h-[94vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h2
              id="register-student-title"
              className="text-xl font-bold text-foreground"
            >
              Register New Student
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Add the student, guardian and
              academic enrollment information.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close registration dialog"
            disabled={
              registerStudentMutation.isPending
            }
            onClick={handleClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex max-h-[calc(94vh-90px)] flex-col"
        >
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            <PersonSection
              title="Student Information"
              values={student}
              onChange={setStudent}
            />

            <PersonSection
              title="Guardian Information"
              values={guardian}
              onChange={setGuardian}
            />

            <section className="rounded-3xl border border-border/70 bg-muted/20 p-5">
              <SectionTitle
                title="Enrollment Information"
                description="Select the academic year, grade level and classroom."
              />

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <FormInput
                  label="Academic Year ID"
                  type="number"
                  min={1}
                  required
                  value={
                    enrollment.academicYearId
                  }
                  onChange={(event) =>
                    setEnrollment((current) => ({
                      ...current,
                      academicYearId:
                        event.target.value,
                    }))
                  }
                />

                <FormInput
                  label="Grade Level ID"
                  type="number"
                  min={1}
                  required
                  value={
                    enrollment.gradeLevelId
                  }
                  onChange={(event) =>
                    setEnrollment((current) => ({
                      ...current,
                      gradeLevelId:
                        event.target.value,
                    }))
                  }
                />

                <FormInput
                  label="Classroom ID"
                  type="number"
                  min={1}
                  required
                  value={
                    enrollment.classroomId
                  }
                  onChange={(event) =>
                    setEnrollment((current) => ({
                      ...current,
                      classroomId:
                        event.target.value,
                    }))
                  }
                />
              </div>
            </section>
          </div>

          <footer className="flex justify-end gap-3 border-t border-border bg-card px-6 py-4">
            <button
              type="button"
              disabled={
                registerStudentMutation.isPending
              }
              onClick={handleClose}
              className="h-11 rounded-xl border border-border px-6 text-sm font-bold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                registerStudentMutation.isPending
              }
              className="flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {registerStudentMutation.isPending ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Save size={16} />
              )}

              {registerStudentMutation.isPending
                ? "Registering..."
                : "Register Student"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

type PersonSectionProps = {
  title: string;
  values: PersonFormValues;
  onChange: (
    values: PersonFormValues,
  ) => void;
};

function PersonSection({
  title,
  values,
  onChange,
}: PersonSectionProps) {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  function updateField<
    TKey extends keyof PersonFormValues,
  >(
    key: TKey,
    value: PersonFormValues[TKey],
  ) {
    onChange({
      ...values,
      [key]: value,
    });
  }

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    updateField(
      "photo",
      event.target.files?.[0] ?? null,
    );
  }

  return (
    <section className="rounded-3xl border border-border/70 bg-muted/20 p-5">
      <SectionTitle
        title={title}
        description="Enter the required personal information."
      />

      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <FormInput
          label="First Name"
          required
          value={values.firstName}
          onChange={(event) =>
            updateField(
              "firstName",
              event.target.value,
            )
          }
        />

        <FormInput
          label="Last Name"
          required
          value={values.lastName}
          onChange={(event) =>
            updateField(
              "lastName",
              event.target.value,
            )
          }
        />

        <FormInput
          label="Phone Number"
          required
          inputMode="tel"
          value={values.phoneNumber}
          onChange={(event) =>
            updateField(
              "phoneNumber",
              event.target.value,
            )
          }
        />

        <FormInput
          label="Father Name"
          required
          value={values.fatherName}
          onChange={(event) =>
            updateField(
              "fatherName",
              event.target.value,
            )
          }
        />

        <FormInput
          label="Mother Name"
          required
          value={values.motherName}
          onChange={(event) =>
            updateField(
              "motherName",
              event.target.value,
            )
          }
        />

        <FormInput
          label="Birth Date"
          type="date"
          required
          value={values.birthDate}
          onChange={(event) =>
            updateField(
              "birthDate",
              event.target.value,
            )
          }
        />

        <FormInput
          label="Birth Place"
          required
          value={values.birthPlace}
          onChange={(event) =>
            updateField(
              "birthPlace",
              event.target.value,
            )
          }
        />

        <label className="block">
          <span className="mb-2 block text-xs font-bold text-foreground">
            Nationality
            <span className="text-destructive">
              {" "}
              *
            </span>
          </span>

          <select
            required
            value={values.nationality}
            onChange={(event) =>
              updateField(
                "nationality",
                event.target
                  .value as UserNationality,
              )
            }
            className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm font-semibold text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          >
            <option value="" disabled>
              Select nationality
            </option>

            <option value="syrian">
              Syrian
            </option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold text-foreground">
            Gender
            <span className="text-destructive">
              {" "}
              *
            </span>
          </span>

          <select
            required
            value={values.gender}
            onChange={(event) =>
              updateField(
                "gender",
                event.target
                  .value as UserGender,
              )
            }
            className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm font-semibold text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          >
            <option value="male">
              Male
            </option>

            <option value="female">
              Female
            </option>
          </select>
        </label>

        <FormInput
          label="Address"
          required
          value={values.address}
          onChange={(event) =>
            updateField(
              "address",
              event.target.value,
            )
          }
        />

        <div className="block">
          <span className="mb-2 block text-xs font-bold text-foreground">
            Photo
          </span>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handlePhotoChange}
          />

          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="flex h-11 w-full items-center gap-2 overflow-hidden rounded-xl border border-border bg-card px-3 text-left text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            <ImagePlus
              size={17}
              className="shrink-0 text-primary"
            />

            <span className="truncate">
              {values.photo?.name ??
                "Choose photo"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="text-base font-bold text-foreground">
        {title}
      </h3>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

type FormInputProps = {
  label: string;
  value: string;
  type?: string;
  min?: number;
  required?: boolean;
  inputMode?:
    | "text"
    | "tel"
    | "numeric"
    | "decimal"
    | "email"
    | "url"
    | "search"
    | "none";

  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
};

function FormInput({
  label,
  value,
  type = "text",
  min,
  required = false,
  inputMode,
  onChange,
}: FormInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-foreground">
        {label}

        {required ? (
          <span className="text-destructive">
            {" "}
            *
          </span>
        ) : null}
      </span>

      <input
        type={type}
        min={min}
        required={required}
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm font-semibold text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
      />
    </label>
  );
}
