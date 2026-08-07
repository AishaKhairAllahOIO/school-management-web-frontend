import {
  type ChangeEvent,
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
import {
  useStudentFullProfile,
  useUpdateStudentPersonal,
} from "../hooks/useStudents";
import type {
  UpdateStudentPersonalPayload,
  UserGender,
  UserNationality
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
  nationality: UserNationality;
  address: string;
  phone_number: string;
  photo_url: File | null;
};

type EditableEnrollment = {
  academic_year_id: string;
  grade_level_id: string;
  class_room_id: string;
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
  photo_url: null,
};

const emptyEnrollment: EditableEnrollment = {
  academic_year_id: "",
  grade_level_id: "",
  class_room_id: "",
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
function normalizeNationality(
  value: unknown,
): UserNationality {
  const allowedNationalities: UserNationality[] = [
    "syrian",
    "lebanese",
    "palestinian",
    "jordanian",
    "other",
  ];

  if (
    typeof value === "string" &&
    allowedNationalities.includes(
      value as UserNationality,
    )
  ) {
    return value as UserNationality;
  }

  return "";
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

    nationality: normalizeNationality(
      getValue(person, ["nationality"]),
    ),

    address: getString(person, [
      "address",
    ]),

    phone_number: getString(person, [
      "phoneNumber",
      "phone_number",
      "phone",
    ]),

    photo_url: null,
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

  const [studentPhotoUrl, setStudentPhotoUrl] =
    useState<string | null>(null);
  const [guardianPhotoUrl, setGuardianPhotoUrl] =
    useState<string | null>(null);
  const [studentPreview, setStudentPreview] =
    useState<string | null>(null);
  const [guardianPreview, setGuardianPreview] =
    useState<string | null>(null);

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

    setStudentPhotoUrl(
      getString(studentData, ["photoUrl", "photo_url"]) || null,
    );
    setGuardianPhotoUrl(
      guardianData
        ? getString(guardianData, ["photoUrl", "photo_url"]) || null
        : null,
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

    });
  }, [profileQuery.data]);

  useEffect(() => {
    return () => {
      if (studentPreview) URL.revokeObjectURL(studentPreview);
      if (guardianPreview) URL.revokeObjectURL(guardianPreview);
    };
  }, [studentPreview, guardianPreview]);

  function selectPhoto(
    target: "student" | "guardian",
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    const preview = URL.createObjectURL(file);

    if (target === "student") {
      if (studentPreview) URL.revokeObjectURL(studentPreview);
      setStudentPreview(preview);
      setStudent((current) => ({ ...current, photo_url: file }));
    } else {
      if (guardianPreview) URL.revokeObjectURL(guardianPreview);
      setGuardianPreview(preview);
      setGuardian((current) => ({ ...current, photo_url: file }));
    }

    event.target.value = "";
  }

  function removePhoto(target: "student" | "guardian") {
    if (target === "student") {
      if (studentPreview) URL.revokeObjectURL(studentPreview);
      setStudentPreview(null);
      setStudentPhotoUrl(null);
      setStudent((current) => ({ ...current, photo_url: null }));
    } else {
      if (guardianPreview) URL.revokeObjectURL(guardianPreview);
      setGuardianPreview(null);
      setGuardianPhotoUrl(null);
      setGuardian((current) => ({ ...current, photo_url: null }));
    }
  }

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

    if (
      studentId === undefined ||
      studentId === null
    ) {
      return;
    }

    const payload: UpdateStudentPersonalPayload = {
      ...student,
      photo_url: student.photo_url,
      guardian_first_name: guardianData ? guardian.first_name : undefined,
      guardian_last_name: guardianData ? guardian.last_name : undefined,
      guardian_father_name: guardianData ? guardian.father_name : undefined,
      guardian_mother_name: guardianData ? guardian.mother_name : undefined,
      guardian_birth_date: guardianData ? guardian.birth_date : undefined,
      guardian_birth_place: guardianData ? guardian.birth_place : undefined,
      guardian_gender: guardianData ? guardian.gender : undefined,
      guardian_nationality: guardianData ? guardian.nationality : undefined,
      guardian_address: guardianData ? guardian.address : undefined,
      guardian_phone_number: guardianData ? guardian.phone_number : undefined,
      guardian_photo_url: guardianData ? guardian.photo_url : undefined,
      academic_year_id: enrollment.academic_year_id || undefined,
      grade_level_id: enrollment.grade_level_id || undefined,
      class_room_id: enrollment.class_room_id || undefined,
    };

    await studentMutation.mutateAsync({
      studentId: studentId as string | number,
      payload,
    });

    navigate("/users/students");
  }

  if (profileQuery.isPending) {
    return <StudentEditSkeleton />;
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


  const isSaving =
    studentMutation.isPending;

  return (
    <form
      onSubmit={submit}
      className="-mt-6 space-y-5 pb-8"
    >
      <UserPageBackButton
        label="Back to students"
        onClick={() => navigate("/users/students")}
      />

      <StudentPageHeader
        title="Edit student"
        description="Update personal details, guardian information and academic placement."
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
              onClick={() => navigate("/users/students")}
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

      <div className="grid items-start gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        <PersonPhotoSection
          title="Student photo"
          description="Update the student profile photo."
          photoUrl={studentPreview ?? studentPhotoUrl}
          authenticated={!studentPreview}
          disabled={isSaving}
          onChange={(event) => selectPhoto("student", event)}
          onRemove={() => removePhoto("student")}
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

      </div>

      {guardianData ? (
        <div className="grid items-start gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
          <PersonPhotoSection
            title="Guardian photo"
            description="Update the guardian profile photo."
            photoUrl={guardianPreview ?? guardianPhotoUrl}
            authenticated={!guardianPreview}
            disabled={isSaving}
            onChange={(event) => selectPhoto("guardian", event)}
            onRemove={() => removePhoto("guardian")}
          />

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
        </div>
      ) : null}

      <FormSection
        eyebrow="Academic placement"
        title="Enrollment"
        description="Update the student academic placement."
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

      </FormSection>
    </form>
  );
}

function PersonPhotoSection({
  title,
  description,
  photoUrl,
  authenticated,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  photoUrl: string | null;
  authenticated: boolean;
  disabled: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  return (
    <UserPhotoCard
      title={title}
      description={description}
      photoUrl={photoUrl}
      alt={title}
      authenticated={authenticated}
      editable
      disabled={disabled}
      onChange={onChange}
    />
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
function update<K extends keyof EditablePerson>(
  key: K,
  nextValue: EditablePerson[K],
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

        <FormField label="Nationality">
          <Select
  value={value.nationality || "syrian"}
  onValueChange={(nextValue) =>
    update(
      "nationality",
      nextValue as UserNationality,
    )
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
    update(
      "gender",
      nextValue as UserGender,
    )
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



function StudentEditSkeleton() {
  return (
    <div aria-busy="true" className="-mt-6 animate-pulse space-y-5 pb-8">
      <div className="h-10 w-40 rounded-xl bg-muted/65" />

      <section className="rounded-[24px] border border-border/60 bg-card px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="h-12 w-12 shrink-0 rounded-[16px] bg-muted/70" />
            <div className="min-w-0 flex-1">
              <div className="h-3 w-24 rounded bg-muted/70" />
              <div className="mt-3 h-7 w-52 rounded bg-muted" />
              <div className="mt-3 h-3.5 w-full max-w-xl rounded bg-muted/70" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-11 w-24 rounded-xl bg-muted/70" />
            <div className="h-11 w-36 rounded-xl bg-muted" />
          </div>
        </div>
      </section>

      <EditIdentitySkeleton />
      <EditIdentitySkeleton />

      <section className="overflow-hidden rounded-[22px] border border-border/70 bg-card">
        <EditSkeletonHeader />
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <div className="h-2.5 w-24 rounded bg-muted/70" />
              <div className="mt-2 h-12 rounded-[16px] border border-border/60 bg-muted/20" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function EditIdentitySkeleton() {
  return (
    <div className="grid items-start gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
      <section className="rounded-[22px] border border-border/70 bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-[14px] bg-muted/70" />
          <div className="flex-1">
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="mt-2 h-3 w-40 rounded bg-muted/70" />
          </div>
        </div>
        <div className="mt-4 aspect-square rounded-[18px] border border-border/60 bg-muted/20" />
      </section>

      <section className="overflow-hidden rounded-[22px] border border-border/70 bg-card">
        <EditSkeletonHeader />
        <div className="grid gap-4 p-5 md:grid-cols-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className={index === 8 ? "md:col-span-2" : ""}>
              <div className="h-2.5 w-24 rounded bg-muted/70" />
              <div className="mt-2 h-12 rounded-[16px] border border-border/60 bg-muted/20" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function EditSkeletonHeader() {
  return (
    <header className="flex items-start gap-3 border-b border-border/60 px-5 py-4">
      <div className="h-10 w-10 shrink-0 rounded-[14px] bg-muted/70" />
      <div className="flex-1">
        <div className="h-2.5 w-24 rounded bg-muted/70" />
        <div className="mt-2 h-5 w-44 rounded bg-muted" />
        <div className="mt-2 h-3 w-full max-w-md rounded bg-muted/70" />
      </div>
    </header>
  );
}
