import {
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  CalendarDays,
  GraduationCap,
  IdCard,
  Image,
  Loader2,
  Save,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

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

type UnknownRecord = Record<string, unknown>;

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
  const allowedStatuses: EnrollmentStatus[] = [
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

function getNameParts(
  person: unknown,
): {
  firstName: string;
  lastName: string;
} {
  const directFirstName = getString(
    person,
    ["firstName", "first_name"],
  );

  const directLastName = getString(
    person,
    ["lastName", "last_name"],
  );

  if (
    directFirstName ||
    directLastName
  ) {
    return {
      firstName: directFirstName,
      lastName: directLastName,
    };
  }

  const fullName = getString(
    person,
    ["fullName", "full_name"],
  ).trim();

  if (!fullName) {
    return {
      firstName: "",
      lastName: "",
    };
  }

  const fatherName = getString(
    person,
    ["fatherName", "father_name"],
  ).trim();

  const parts = fullName
    .split(/\s+/)
    .filter(Boolean);

  const firstName = parts.shift() ?? "";

  const remainingParts = parts.filter(
    (part, index) =>
      !(
        index === 0 &&
        fatherName &&
        part.toLowerCase() ===
          fatherName.toLowerCase()
      ),
  );

  return {
    firstName,
    lastName: remainingParts.join(" "),
  };
}

function mapPersonToForm(
  person: unknown,
): EditablePerson {
  const { firstName, lastName } =
    getNameParts(person);

  return {
    first_name: firstName,
    last_name: lastName,

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

  const nestedData = getValue(
    profile,
    ["data"],
  );

  return getValue(nestedData, keys);
}

function displayValue(
  value: unknown,
  fallback = "Not specified",
): string {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  return String(value);
}

function formatDateTime(
  value: unknown,
  fallback = "Not recorded",
): string {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return String(value);
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

    setGuardian(
      guardianData
        ? mapPersonToForm(guardianData)
        : emptyPerson,
    );

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
      [
        "id",
        "studentId",
        "student_id",
      ],
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
            guardianId as
              | string
              | number,
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

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
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

  const studentData =
    getProfileSection(
      profileQuery.data,
      ["student"],
    );

  const guardianData =
    getProfileSection(
      profileQuery.data,
      ["guardian"],
    );

  const enrollmentData =
    getProfileSection(
      profileQuery.data,
      ["enrollment"],
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
        photoUrl={getString(
          studentData,
          ["photoUrl", "photo_url"],
        )}
        photoAlt={getString(
          studentData,
          ["fullName", "full_name"],
        )}
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

      <FormSection
        eyebrow="System records"
        title="Student metadata"
        description="Identifiers and account information returned by the server."
        icon={
          <IdCard
            size={18}
            strokeWidth={1.7}
          />
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ReadOnlyInfo
            label="Student ID"
            value={displayValue(
              getValue(studentData, ["id"]),
            )}
          />

          <ReadOnlyInfo
            label="Student user ID"
            value={displayValue(
              getValue(studentData, [
                "userId",
                "user_id",
              ]),
            )}
          />

          <ReadOnlyInfo
            label="Account status"
            value={displayValue(
              getValue(studentData, [
                "accountStatus",
                "account_status",
              ]),
            )}
          />

          <ReadOnlyInfo
            label="Record status"
            value={displayValue(
              getValue(studentData, [
                "recordStatus",
                "record_status",
              ]),
            )}
          />

          <ReadOnlyInfo
            label="Current full name"
            value={displayValue(
              getValue(studentData, [
                "fullName",
                "full_name",
              ]),
            )}
            className="sm:col-span-2"
          />

          <ReadOnlyInfo
            label="Photo URL"
            value={displayValue(
              getValue(studentData, [
                "photoUrl",
                "photo_url",
              ]),
            )}
            className="sm:col-span-2"
          />
        </div>
      </FormSection>

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
        <>
          <FormSection
            eyebrow="System records"
            title="Guardian metadata"
            description="Guardian identifiers and account information."
            icon={
              <UsersRound
                size={18}
                strokeWidth={1.7}
              />
            }
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <ReadOnlyInfo
                label="Guardian ID"
                value={displayValue(
                  getValue(
                    guardianData,
                    ["id"],
                  ),
                )}
              />

              <ReadOnlyInfo
                label="Guardian user ID"
                value={displayValue(
                  getValue(
                    guardianData,
                    ["userId", "user_id"],
                  ),
                )}
              />

              <ReadOnlyInfo
                label="Account status"
                value={displayValue(
                  getValue(
                    guardianData,
                    [
                      "accountStatus",
                      "account_status",
                    ],
                  ),
                )}
              />

              <ReadOnlyInfo
                label="Record status"
                value={displayValue(
                  getValue(
                    guardianData,
                    [
                      "recordStatus",
                      "record_status",
                    ],
                  ),
                )}
              />

              <ReadOnlyInfo
                label="Current full name"
                value={displayValue(
                  getValue(
                    guardianData,
                    [
                      "fullName",
                      "full_name",
                    ],
                  ),
                )}
                className="sm:col-span-2"
              />

              <ReadOnlyInfo
                label="Photo URL"
                value={displayValue(
                  getValue(
                    guardianData,
                    [
                      "photoUrl",
                      "photo_url",
                    ],
                  ),
                )}
                className="sm:col-span-2"
              />
            </div>
          </FormSection>

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
        </>
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
        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ReadOnlyInfo
            label="Enrollment ID"
            value={displayValue(
              getValue(enrollmentData, [
                "id",
              ]),
            )}
          />

          <ReadOnlyInfo
            label="Linked student ID"
            value={displayValue(
              getValue(enrollmentData, [
                "studentId",
                "student_id",
              ]),
            )}
          />

          <ReadOnlyInfo
            label="Created at"
            value={formatDateTime(
              getValue(enrollmentData, [
                "createdAt",
                "created_at",
              ]),
            )}
          />

          <ReadOnlyInfo
            label="Updated at"
            value={formatDateTime(
              getValue(enrollmentData, [
                "updatedAt",
                "updated_at",
              ]),
            )}
          />

          <ReadOnlyInfo
            label="Enrollment date"
            value={formatDateTime(
              getValue(enrollmentData, [
                "enrollmentDate",
                "enrollment_date",
              ]),
            )}
          />

          <ReadOnlyInfo
            label="Completed at"
            value={formatDateTime(
              getValue(enrollmentData, [
                "completedAt",
                "completed_at",
              ]),
              "Not completed",
            )}
          />

          <ReadOnlyInfo
            label="Deleted"
            value={
              getValue(enrollmentData, [
                "isDeleted",
                "is_deleted",
              ])
                ? "Yes"
                : "No"
            }
          />

          <ReadOnlyInfo
            label="Deleted at"
            value={formatDateTime(
              getValue(enrollmentData, [
                "deletedAt",
                "deleted_at",
              ]),
              "Not deleted",
            )}
          />
        </div>

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
                academic_year_id: value,
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
            <Select
              value={enrollment.enrollment_status}
              disabled={isSaving}
              onValueChange={(value) =>
                setEnrollment((current) => ({
                  ...current,
                  enrollment_status: value as EnrollmentStatus,
                }))
              }
            >
              <SelectTrigger className="h-12 rounded-[15px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="enrolled">Enrolled</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
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
            ["first_name", "First name"],
            ["last_name", "Last name"],
            ["father_name", "Father name"],
            ["mother_name", "Mother name"],
            ["birth_place", "Birth place"],
            ["nationality", "Nationality"],
            ["phone_number", "Phone number"],
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
          <DatePicker
            value={value.birth_date}
            onChange={(nextValue) =>
              update("birth_date", nextValue)
            }
            placeholder="Select birth date"
          />
        </FormField>

        <FormField label="Gender">
          <Select
            value={value.gender}
            onValueChange={(nextValue) =>
              update("gender", nextValue)
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

function ReadOnlyInfo({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <article
      className={[
        "rounded-[16px]",
        "border border-border/60",
        "bg-muted/[0.22]",
        "px-4 py-3.5",
        className,
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-primary/[0.07] text-primary">
          {label.toLowerCase().includes("date") ||
          label.toLowerCase().includes("at") ? (
            <CalendarDays
              size={15}
              strokeWidth={1.7}
            />
          ) : label
              .toLowerCase()
              .includes("status") ||
            label
              .toLowerCase()
              .includes("deleted") ? (
            <ShieldCheck
              size={15}
              strokeWidth={1.7}
            />
          ) : label
              .toLowerCase()
              .includes("photo") ? (
            <Image
              size={15}
              strokeWidth={1.7}
            />
          ) : (
            <IdCard
              size={15}
              strokeWidth={1.7}
            />
          )}
        </span>

        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-medium text-foreground">
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}