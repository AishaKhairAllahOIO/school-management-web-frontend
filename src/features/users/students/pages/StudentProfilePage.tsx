import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Home,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { ProfileInfoCard } from "../components/profile/ProfileInfoCard";
import { StudentProfileHero } from "../components/profile/StudentProfileHero";
import { StudentProfileSection } from "../components/profile/StudentProfileSection";
import { StudentPageHeader } from "../components/shared/StudentPageHeader";
import { StudentStatusBadge } from "../components/shared/StudentStatusBadge";

import { useStudentFullProfile } from "../hooks/useStudents";

export function StudentProfilePage() {
  const navigate = useNavigate();

  const {
    enrollmentId,
  } = useParams<{
    enrollmentId: string;
  }>();

  const profileQuery =
    useStudentFullProfile(enrollmentId);

  if (profileQuery.isPending) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] p-6">
        <div className="mx-auto max-w-[1450px] animate-pulse space-y-6">
          <div className="h-36 rounded-[34px] bg-white" />
          <div className="h-72 rounded-[34px] bg-white" />

          <div className="columns-1 gap-6 lg:columns-2">
            <div className="mb-6 h-80 rounded-[30px] bg-white" />
            <div className="mb-6 h-64 rounded-[30px] bg-white" />
            <div className="mb-6 h-72 rounded-[30px] bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (
    profileQuery.isError ||
    !profileQuery.data
  ) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#f7f7f5] p-6"
      >
        <div className="max-w-md rounded-[32px] bg-white p-10 text-center shadow-xl">
          <h1 className="text-xl font-black text-rose-600">
            تعذر تحميل ملف الطالب
          </h1>

          <p className="mt-2 text-sm leading-7 text-slate-500">
            قد يكون القيد غير موجود أو لا تملكين الصلاحية اللازمة لعرضه.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/users/students")
            }
            className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
          >
            العودة إلى الطلاب
          </button>
        </div>
      </main>
    );
  }

  const {
    student,
    guardian,
    enrollment,
  } = profileQuery.data;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f7f7f5] px-4 py-5 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-[1450px] flex-col gap-6">
        <StudentPageHeader
          title="ملف الطالب"
          description="البيانات الشخصية وبيانات ولي الأمر والقيد الدراسي وحالة الحساب."
          showBackButton
          icon={
            <UserRound className="h-7 w-7" />
          }
          actions={
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/users/students/${enrollmentId}/edit`,
                )
              }
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-300"
            >
              تعديل الملف
            </button>
          }
        />

        <StudentProfileHero
          student={student}
          enrollment={enrollment}
        />

        <div className="columns-1 gap-6 xl:columns-2">
          <StudentProfileSection
            title="معلومات الطالب"
            description="البيانات الشخصية الأساسية المسجلة في النظام."
            icon={
              <UserRound className="h-5 w-5" />
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <ProfileInfoCard
                icon={
                  <UserRound className="h-4 w-4" />
                }
                label="الاسم الكامل"
                value={student.fullName}
              />

              <ProfileInfoCard
                icon={
                  <CalendarDays className="h-4 w-4" />
                }
                label="تاريخ الميلاد"
                value={student.birthDate}
              />

              <ProfileInfoCard
                icon={
                  <MapPin className="h-4 w-4" />
                }
                label="مكان الميلاد"
                value={student.birthPlace}
              />

              <ProfileInfoCard
                icon={
                  <Phone className="h-4 w-4" />
                }
                label="رقم الهاتف"
                value={
                  <span dir="ltr">
                    {student.phoneNumber ??
                      "غير محدد"}
                  </span>
                }
              />

              <ProfileInfoCard
                icon={
                  <Home className="h-4 w-4" />
                }
                label="العنوان"
                value={student.address}
                className="sm:col-span-2"
              />
            </div>
          </StudentProfileSection>

          <StudentProfileSection
            title="ولي الأمر"
            description="بيانات الشخص المسؤول عن الطالب."
            icon={
              <UsersRound className="h-5 w-5" />
            }
          >
            {guardian ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <ProfileInfoCard
                  icon={
                    <UserRound className="h-4 w-4" />
                  }
                  label="الاسم الكامل"
                  value={guardian.fullName}
                />

                <ProfileInfoCard
                  icon={
                    <Phone className="h-4 w-4" />
                  }
                  label="رقم الهاتف"
                  value={
                    <span dir="ltr">
                      {guardian.phoneNumber ??
                        "غير محدد"}
                    </span>
                  }
                />

                <ProfileInfoCard
                  icon={
                    <MapPin className="h-4 w-4" />
                  }
                  label="مكان الميلاد"
                  value={guardian.birthPlace}
                />

                <ProfileInfoCard
                  icon={
                    <Home className="h-4 w-4" />
                  }
                  label="العنوان"
                  value={guardian.address}
                />
              </div>
            ) : (
              <div className="rounded-[24px] bg-amber-50 p-5 text-sm font-semibold text-amber-700">
                لا توجد بيانات ولي أمر مرتبطة بهذا الطالب.
              </div>
            )}
          </StudentProfileSection>

          <StudentProfileSection
            title="القيد الدراسي"
            description="معلومات الصف والشعبة والسنة الدراسية."
            icon={
              <GraduationCap className="h-5 w-5" />
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <ProfileInfoCard
                icon={
                  <BookOpen className="h-4 w-4" />
                }
                label="السنة الدراسية"
                value={
                  enrollment.academicYear
                    ?.name
                }
              />

              <ProfileInfoCard
                icon={
                  <GraduationCap className="h-4 w-4" />
                }
                label="الصف"
                value={
                  enrollment.grade?.name
                }
              />

              <ProfileInfoCard
                icon={
                  <UsersRound className="h-4 w-4" />
                }
                label="الشعبة"
                value={
                  enrollment.classroom?.name
                }
              />

              <ProfileInfoCard
                icon={
                  <CalendarDays className="h-4 w-4" />
                }
                label="تاريخ التسجيل"
                value={
                  enrollment.enrollmentDate
                }
              />
            </div>
          </StudentProfileSection>

          <StudentProfileSection
            title="الحساب والحالة"
            description="الحالة الحالية لحساب الطالب والقيد الدراسي."
            icon={
              <ShieldCheck className="h-5 w-5" />
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-emerald-50 p-5">
                <p className="text-xs font-semibold text-emerald-600">
                  حالة الحساب
                </p>

                <div className="mt-3">
                  <StudentStatusBadge
                    status={
                      student.accountStatus
                    }
                  />
                </div>
              </div>

              <div className="rounded-[24px] bg-blue-50 p-5">
                <p className="text-xs font-semibold text-blue-600">
                  حالة القيد
                </p>

                <div className="mt-3">
                  <StudentStatusBadge
                    status={
                      enrollment.enrollmentStatus
                    }
                  />
                </div>
              </div>
            </div>
          </StudentProfileSection>
        </div>
      </div>
    </main>
  );
}