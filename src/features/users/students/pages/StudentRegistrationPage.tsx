import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";
import {
  BookOpen,
  Camera,
  GraduationCap,
  Save,
  ShieldCheck,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { StudentPageHeader } from "../components/shared/StudentPageHeader";
import { useRegisterStudent } from "../hooks/useStudents";

import type {
  RegisterStudentPayload,
  UserGender,
} from "../types/student.types";

type FormState = {
  student: {
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

  guardian: {
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

  enrollment: {
    academic_year_id: string;
    grade_level_id: string;
    class_room_id: string;
  };
};

const initialState: FormState = {
  student: {
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
  },

  guardian: {
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
  },

  enrollment: {
    academic_year_id: "",
    grade_level_id: "",
    class_room_id: "",
  },
};

type InputProps = {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
};

function FormInput({
  label,
  value,
  type = "text",
  required = false,
  placeholder,
  onChange,
}: InputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}

        {required ? (
          <span className="mr-1 text-rose-500">
            *
          </span>
        ) : null}
      </span>

      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
      />
    </label>
  );
}

function FormSelect({
  label,
  value,
  required = false,
  children,
  onChange,
}: {
  label: string;
  value: string;
  required?: boolean;
  children: React.ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}

        {required ? (
          <span className="mr-1 text-rose-500">
            *
          </span>
        ) : null}
      </span>

      <select
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
      >
        {children}
      </select>
    </label>
  );
}

function SectionCard({
  icon,
  title,
  description,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "mb-6 break-inside-avoid rounded-[30px] border border-white bg-white p-5 shadow-[0_16px_52px_rgba(15,23,42,0.07)] sm:p-7",
        className,
      ].join(" ")}
    >
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-slate-950 text-white">
          {icon}
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-950">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

export function StudentRegistrationPage() {
  const navigate = useNavigate();

  const registerMutation =
    useRegisterStudent();

  const [form, setForm] =
    useState<FormState>(initialState);

  const [studentPreview, setStudentPreview] =
    useState<string | null>(null);

  function updateStudent(
    key: keyof FormState["student"],
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
    key: keyof FormState["guardian"],
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

    if (file) {
      setStudentPreview(
        URL.createObjectURL(file),
      );
    }
  }

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const payload: RegisterStudentPayload = {
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

    if (enrollmentId) {
      navigate(
        `/users/students/${enrollmentId}`,
      );

      return;
    }

    navigate("/users/students");
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f7f7f5] px-4 py-5 sm:px-6 lg:px-8"
    >
      <form
        onSubmit={submit}
        className="mx-auto max-w-[1450px]"
      >
        <StudentPageHeader
          title="إضافة طالب جديد"
          description="أضيفي معلومات الطالب وولي الأمر والقيد الدراسي ضمن نموذج منظم وواضح."
          showBackButton
          icon={
            <UserPlus className="h-7 w-7" />
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
                className="h-11 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={
                  registerMutation.isPending
                }
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
              >
                {registerMutation.isPending ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                حفظ الطالب
              </button>
            </>
          }
        />

        <div className="mt-6 columns-1 gap-6 xl:columns-2">
          <SectionCard
            icon={
              <Camera className="h-5 w-5" />
            }
            title="صورة الطالب"
            description="اختاري صورة واضحة للطالب لتظهر في بطاقات القائمة والملف الشخصي."
          >
            <div className="flex flex-col items-center rounded-[26px] bg-gradient-to-br from-rose-50 to-orange-50 p-6">
              {studentPreview ? (
                <img
                  src={studentPreview}
                  alt="معاينة صورة الطالب"
                  className="h-40 w-40 rounded-[32px] object-cover shadow-xl ring-4 ring-white"
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-[32px] bg-white text-rose-400 shadow-lg">
                  <Camera className="h-12 w-12" />
                </div>
              )}

              <label className="mt-5 cursor-pointer rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5">
                اختيار صورة

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    selectStudentPhoto
                  }
                />
              </label>
            </div>
          </SectionCard>

          <SectionCard
            icon={
              <GraduationCap className="h-5 w-5" />
            }
            title="بيانات الطالب"
            description="المعلومات الشخصية والرسمية الأساسية الخاصة بالطالب."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="الاسم الأول"
                value={
                  form.student.first_name
                }
                required
                onChange={(value) =>
                  updateStudent(
                    "first_name",
                    value,
                  )
                }
              />

              <FormInput
                label="اسم العائلة"
                value={
                  form.student.last_name
                }
                required
                onChange={(value) =>
                  updateStudent(
                    "last_name",
                    value,
                  )
                }
              />

              <FormInput
                label="اسم الأب"
                value={
                  form.student.father_name
                }
                required
                onChange={(value) =>
                  updateStudent(
                    "father_name",
                    value,
                  )
                }
              />

              <FormInput
                label="اسم الأم"
                value={
                  form.student.mother_name
                }
                required
                onChange={(value) =>
                  updateStudent(
                    "mother_name",
                    value,
                  )
                }
              />

              <FormInput
                label="تاريخ الميلاد"
                type="date"
                value={
                  form.student.birth_date
                }
                required
                onChange={(value) =>
                  updateStudent(
                    "birth_date",
                    value,
                  )
                }
              />

              <FormInput
                label="مكان الميلاد"
                value={
                  form.student.birth_place
                }
                required
                onChange={(value) =>
                  updateStudent(
                    "birth_place",
                    value,
                  )
                }
              />

              <FormSelect
                label="الجنس"
                value={form.student.gender}
                required
                onChange={(value) =>
                  updateStudent(
                    "gender",
                    value as UserGender,
                  )
                }
              >
                <option value="male">
                  ذكر
                </option>

                <option value="female">
                  أنثى
                </option>
              </FormSelect>

              <FormInput
                label="الجنسية"
                value={
                  form.student.nationality
                }
                required
                onChange={(value) =>
                  updateStudent(
                    "nationality",
                    value,
                  )
                }
              />

              <FormInput
                label="رقم الهاتف"
                value={
                  form.student.phone_number
                }
                onChange={(value) =>
                  updateStudent(
                    "phone_number",
                    value,
                  )
                }
              />

              <div className="sm:col-span-2">
                <FormInput
                  label="العنوان"
                  value={
                    form.student.address
                  }
                  required
                  onChange={(value) =>
                    updateStudent(
                      "address",
                      value,
                    )
                  }
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={
              <UsersRound className="h-5 w-5" />
            }
            title="بيانات ولي الأمر"
            description="بيانات الشخص المسؤول عن الطالب والتواصل معه."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="الاسم الأول"
                value={
                  form.guardian.first_name
                }
                required
                onChange={(value) =>
                  updateGuardian(
                    "first_name",
                    value,
                  )
                }
              />

              <FormInput
                label="اسم العائلة"
                value={
                  form.guardian.last_name
                }
                required
                onChange={(value) =>
                  updateGuardian(
                    "last_name",
                    value,
                  )
                }
              />

              <FormInput
                label="اسم الأب"
                value={
                  form.guardian.father_name
                }
                required
                onChange={(value) =>
                  updateGuardian(
                    "father_name",
                    value,
                  )
                }
              />

              <FormInput
                label="اسم الأم"
                value={
                  form.guardian.mother_name
                }
                required
                onChange={(value) =>
                  updateGuardian(
                    "mother_name",
                    value,
                  )
                }
              />

              <FormInput
                label="تاريخ الميلاد"
                type="date"
                value={
                  form.guardian.birth_date
                }
                required
                onChange={(value) =>
                  updateGuardian(
                    "birth_date",
                    value,
                  )
                }
              />

              <FormInput
                label="مكان الميلاد"
                value={
                  form.guardian.birth_place
                }
                required
                onChange={(value) =>
                  updateGuardian(
                    "birth_place",
                    value,
                  )
                }
              />

              <FormSelect
                label="الجنس"
                value={form.guardian.gender}
                required
                onChange={(value) =>
                  updateGuardian(
                    "gender",
                    value as UserGender,
                  )
                }
              >
                <option value="male">
                  ذكر
                </option>

                <option value="female">
                  أنثى
                </option>
              </FormSelect>

              <FormInput
                label="الجنسية"
                value={
                  form.guardian.nationality
                }
                required
                onChange={(value) =>
                  updateGuardian(
                    "nationality",
                    value,
                  )
                }
              />

              <FormInput
                label="رقم الهاتف"
                value={
                  form.guardian.phone_number
                }
                required
                onChange={(value) =>
                  updateGuardian(
                    "phone_number",
                    value,
                  )
                }
              />

              <div className="sm:col-span-2">
                <FormInput
                  label="العنوان"
                  value={
                    form.guardian.address
                  }
                  required
                  onChange={(value) =>
                    updateGuardian(
                      "address",
                      value,
                    )
                  }
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={
              <BookOpen className="h-5 w-5" />
            }
            title="القيد الدراسي"
            description="اختاري السنة الدراسية والصف والشعبة التي سينضم إليها الطالب."
          >
            <div className="grid gap-4">
              <FormInput
                label="معرّف السنة الدراسية"
                value={
                  form.enrollment
                    .academic_year_id
                }
                required
                placeholder="مثال: 1"
                onChange={(value) =>
                  updateEnrollment(
                    "academic_year_id",
                    value,
                  )
                }
              />

              <FormInput
                label="معرّف الصف"
                value={
                  form.enrollment
                    .grade_level_id
                }
                required
                placeholder="مثال: 3"
                onChange={(value) =>
                  updateEnrollment(
                    "grade_level_id",
                    value,
                  )
                }
              />

              <FormInput
                label="معرّف الشعبة"
                value={
                  form.enrollment
                    .class_room_id
                }
                placeholder="اختياري"
                onChange={(value) =>
                  updateEnrollment(
                    "class_room_id",
                    value,
                  )
                }
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={
              <ShieldCheck className="h-5 w-5" />
            }
            title="قبل الحفظ"
            description="تأكدي من دقة البيانات لأن إنشاء الطالب سيؤدي إلى إنشاء القيد وربط ولي الأمر في العملية نفسها."
            className="bg-gradient-to-br from-slate-950 to-slate-800 text-white"
          >
            <ul className="space-y-3 text-sm leading-6 text-slate-300">
              <li>
                • تحققي من اسم الطالب وتاريخ ميلاده.
              </li>

              <li>
                • تأكدي من رقم هاتف ولي الأمر.
              </li>

              <li>
                • اختاري الصف والسنة الدراسية الصحيحة.
              </li>
            </ul>
          </SectionCard>
        </div>
      </form>
    </main>
  );
}