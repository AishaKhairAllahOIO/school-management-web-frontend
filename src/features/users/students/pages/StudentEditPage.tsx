import {
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type SetStateAction,
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

type UnknownRecord = Record<
  string,
  unknown
>;

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

type EditableEnrollment = {
  academic_year_id: string;
  grade_level_id: string;
  class_room_id: string;
  enrollment_status: EnrollmentStatus;
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

const emptyEnrollment: EditableEnrollment = {
  academic_year_id: "",
  grade_level_id: "",
  class_room_id: "",
  enrollment_status: "enrolled",
};

function isRecord(
  value: unknown,
): value is UnknownRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getValue(
  source: unknown,
  keys: string[],
): unknown {
  if (!isRecord(source)) {
    return undefined;
  }

  for (const key of keys) {
    const value = source[key];

    if (
      value !== undefined &&
      value !== null
    ) {
      return value;
    }
  }

  return undefined;
}

function getNestedValue(
  source: unknown,
  paths: string[][],
): unknown {
  for (const path of paths) {
    let current: unknown = source;

    for (const key of path) {
      if (!isRecord(current)) {
        current = undefined;
        break;
      }

      current = current[key];
    }

    if (
      current !== undefined &&
      current !== null
    ) {
      return current;
    }
  }

  return undefined;
}

function getString(
  source: unknown,
  keys: string[],
): string {
  const value = getValue(source, keys);

  if (
    value === undefined ||
    value === null
  ) {
    return "";
  }

  return String(value);
}

function getIdString(
  source: unknown,
  directKeys: string[],
  nestedKeys: string[][] = [],
): string {
  const directValue = getValue(
    source,
    directKeys,
  );

  if (
    directValue !== undefined &&
    directValue !== null
  ) {
    return String(directValue);
  }

  const nestedValue = getNestedValue(
    source,
    nestedKeys,
  );

  if (
    nestedValue !== undefined &&
    nestedValue !== null
  ) {
    return String(nestedValue);
  }

  return "";
}

function normalizeGender(
  value: unknown,
): UserGender {
  return value === "female"
    ? "female"
    : "male";
}

function normalizeEnrollmentStatus(
  value: unknown,
): EnrollmentStatus {
  const allowedStatuses: EnrollmentStatus[] =
    [
      "pending",
      "enrolled",
      "suspended",
      "withdrawn",
      "completed",
    ];

  return allowedStatuses.includes(
    value as EnrollmentStatus,
  )
    ? (value as EnrollmentStatus)
    : "enrolled";
}

function mapPersonToForm(
  person: unknown,
): EditablePerson {
  return {
    first_name: getString(person, [
      "firstName",
      "first_name",
    ]),

    last_name: getString(person, [
      "lastName",
      "last_name",
    ]),

    father_name: getString(person, [
      "fatherName",
      "father_name",
    ]),

    mother_name: getString(person, [
      "motherName",
      "mother_name",
    ]),

    birth_date: getString(person, [
      "birthDate",
      "birth_date",
    ]),

    birth_place: getString(person, [
      "birthPlace",
      "birth_place",
    ]),

    gender: normalizeGender(
      getValue(person, ["gender"]),
    ),

    nationality: getString(person, [
      "nationality",
    ]),

    address: getString(person, [
      "address",
    ]),

    phone_number: getString(person, [
      "phoneNumber",
      "phone_number",
      "phone",
    ]),
  };
}

function getProfileSection(
  profile: unknown,
  keys: string[],
): unknown {
  const directSection = getValue(
    profile,
    keys,
  );

  if (directSection !== undefined) {
    return directSection;
  }

  const nestedData = getValue(profile, [
    "data",
  ]);

  return getValue(nestedData, keys);
}

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
    useState<EditableEnrollment>(
      emptyEnrollment,
    );

  useEffect(() => {
    if (!profileQuery.data) {
      return;
    }

    const profile = profileQuery.data;

    const studentData =
      getProfileSection(profile, [
        "student",
        "student_data",
        "studentData",
      ]);

    const guardianData =
      getProfileSection(profile, [
        "guardian",
        "guardian_data",
        "guardianData",
      ]);

    const enrollmentData =
      getProfileSection(profile, [
        "enrollment",
        "enrollment_data",
        "enrollmentData",
      ]);

    setStudent(
      mapPersonToForm(studentData),
    );

    if (guardianData) {
      setGuardian(
        mapPersonToForm(guardianData),
      );
    } else {
      setGuardian(emptyPerson);
    }

    setEnrollment({
      academic_year_id: getIdString(
        enrollmentData,
        [
          "academicYearId",
          "academic_year_id",
          "yearId",
          "year_id",
        ],
        [
          ["academicYear", "id"],
          ["academic_year", "id"],
          ["year", "id"],
        ],
      ),

      grade_level_id: getIdString(
        enrollmentData,
        [
          "gradeId",
          "grade_id",
          "gradeLevelId",
          "grade_level_id",
        ],
        [
          ["grade", "id"],
          ["gradeLevel", "id"],
          ["grade_level", "id"],
        ],
      ),

      class_room_id: getIdString(
        enrollmentData,
        [
          "classroomId",
          "classroom_id",
          "classRoomId",
          "class_room_id",
        ],
        [
          ["classroom", "id"],
          ["classRoom", "id"],
          ["class_room", "id"],
        ],
      ),

      enrollment_status:
        normalizeEnrollmentStatus(
          getValue(enrollmentData, [
            "enrollmentStatus",
            "enrollment_status",
            "status",
          ]),
        ),
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

    const studentData =
      getProfileSection(
        profileQuery.data,
        [
          "student",
          "student_data",
          "studentData",
        ],
      );

    const guardianData =
      getProfileSection(
        profileQuery.data,
        [
          "guardian",
          "guardian_data",
          "guardianData",
        ],
      );

    const studentId = getValue(
      studentData,
      ["id", "studentId", "student_id"],
    );

    const guardianId = getValue(
      guardianData,
      [
        "id",
        "guardianId",
        "guardian_id",
      ],
    );

    if (
      studentId === undefined ||
      studentId === null
    ) {
      return;
    }

    const tasks: Promise<unknown>[] = [
      studentMutation.mutateAsync({
        studentId:
          studentId as string | number,

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

    if (
      guardianData &&
      guardianId !== undefined &&
      guardianId !== null
    ) {
      tasks.push(
        guardianMutation.mutateAsync({
          guardianId:
            guardianId as string | number,

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

  const guardianData =
    getProfileSection(
      profileQuery.data,
      [
        "guardian",
        "guardian_data",
        "guardianData",
      ],
    );

  const isSaving =
    studentMutation.isPending ||
    guardianMutation.isPending ||
    enrollmentMutation.isPending;

  return (
    <form
      onSubmit={submit}
      className="space-y-5 pb-8"
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

      {guardianData ? (
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
                grade_level_id: value,
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
    </form>
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
  icon: ReactNode;
  value: EditablePerson;
  onChange: Dispatch<
    SetStateAction<EditablePerson>
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