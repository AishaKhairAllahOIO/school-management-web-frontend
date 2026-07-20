import {
  BookOpen,
  Eye,
  GraduationCap,
  MoreHorizontal,
  Phone,
  Power,
  Trash2,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";

import type { StudentListItem } from "../../types/student.types";
import { StudentStatusBadge } from "../shared/StudentStatusBadge";

type StudentCardProps = {
  student: StudentListItem;
  index: number;
  isDeleting?: boolean;
  isToggling?: boolean;

  onView: (student: StudentListItem) => void;
  onDelete: (student: StudentListItem) => void;
  onToggleStatus: (
    student: StudentListItem,
  ) => void;
};

const cardThemes = [
  {
    background:
      "from-rose-50 via-white to-orange-50",
    avatar: "bg-rose-100 text-rose-600",
    accent: "bg-rose-400",
  },
  {
    background:
      "from-blue-50 via-white to-indigo-50",
    avatar: "bg-blue-100 text-blue-600",
    accent: "bg-blue-500",
  },
  {
    background:
      "from-emerald-50 via-white to-teal-50",
    avatar:
      "bg-emerald-100 text-emerald-600",
    accent: "bg-emerald-500",
  },
  {
    background:
      "from-violet-50 via-white to-fuchsia-50",
    avatar:
      "bg-violet-100 text-violet-600",
    accent: "bg-violet-500",
  },
  {
    background:
      "from-amber-50 via-white to-yellow-50",
    avatar: "bg-amber-100 text-amber-700",
    accent: "bg-amber-400",
  },
];

export function StudentCard({
  student,
  index,
  isDeleting = false,
  isToggling = false,
  onView,
  onDelete,
  onToggleStatus,
}: StudentCardProps) {
  const theme =
    cardThemes[index % cardThemes.length];

  const isTallCard = index % 4 === 0;
  const isMediumCard = index % 3 === 0;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.035, 0.25),
      }}
      className="mb-5 break-inside-avoid"
    >
      <div
        className={[
          "group relative overflow-hidden rounded-[28px] border border-white",
          "bg-gradient-to-br shadow-[0_14px_44px_rgba(15,23,42,0.08)]",
          "transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.13)]",
          theme.background,
          isTallCard
            ? "min-h-[390px]"
            : isMediumCard
              ? "min-h-[340px]"
              : "min-h-[305px]",
        ].join(" ")}
      >
        <div
          className={[
            "absolute inset-x-0 top-0 h-1.5",
            theme.accent,
          ].join(" ")}
        />

        <div className="absolute left-5 top-5">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow-sm backdrop-blur transition hover:bg-white hover:text-slate-900"
            aria-label="المزيد"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-full flex-col p-5 pt-7">
          <div className="flex flex-col items-center text-center">
            <button
              type="button"
              onClick={() => onView(student)}
              className="relative"
            >
              {student.photoUrl ? (
                <img
                  src={student.photoUrl}
                  alt={student.fullName}
                  className={[
                    "rounded-[26px] object-cover shadow-lg ring-4 ring-white",
                    isTallCard
                      ? "h-36 w-36"
                      : "h-28 w-28",
                  ].join(" ")}
                />
              ) : (
                <div
                  className={[
                    "flex items-center justify-center rounded-[26px] shadow-sm ring-4 ring-white",
                    theme.avatar,
                    isTallCard
                      ? "h-36 w-36"
                      : "h-28 w-28",
                  ].join(" ")}
                >
                  <UserRound
                    className={
                      isTallCard
                        ? "h-14 w-14"
                        : "h-11 w-11"
                    }
                  />
                </div>
              )}

              <span className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-800 shadow-md">
                <GraduationCap className="h-4 w-4" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => onView(student)}
              className="mt-5 text-lg font-black text-slate-950 transition hover:text-rose-600"
            >
              {student.fullName}
            </button>

            <p className="mt-1 text-xs font-medium text-slate-400">
              رقم الطالب: {student.studentId}
            </p>

            <div className="mt-3">
              <StudentStatusBadge
                status={student.status}
              />
            </div>
          </div>

          <div className="mt-5 space-y-2.5">
            <div className="flex items-center gap-3 rounded-2xl bg-white/65 px-3 py-2.5 backdrop-blur">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                <BookOpen className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] text-slate-400">
                  الصف الدراسي
                </p>

                <p className="truncate text-sm font-bold text-slate-700">
                  {student.grade?.name ??
                    "غير محدد"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/65 px-3 py-2.5 backdrop-blur">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                <GraduationCap className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] text-slate-400">
                  الشعبة
                </p>

                <p className="truncate text-sm font-bold text-slate-700">
                  {student.classroom?.name ??
                    "غير محددة"}
                </p>
              </div>
            </div>

            {student.phoneNumber ? (
              <div className="flex items-center gap-3 rounded-2xl bg-white/65 px-3 py-2.5 backdrop-blur">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                  <Phone className="h-4 w-4" />
                </div>

                <p
                  dir="ltr"
                  className="truncate text-sm font-semibold text-slate-700"
                >
                  {student.phoneNumber}
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-auto flex items-center gap-2 pt-5">
            <button
              type="button"
              onClick={() => onView(student)}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <Eye className="h-4 w-4" />
              عرض الملف
            </button>

            <button
              type="button"
              disabled={isToggling}
              onClick={() =>
                onToggleStatus(student)
              }
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm transition hover:bg-amber-50 disabled:opacity-50"
              aria-label="تغيير حالة الحساب"
            >
              {isToggling ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              ) : (
                <Power className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              disabled={isDeleting}
              onClick={() => onDelete(student)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-sm transition hover:bg-rose-50 disabled:opacity-50"
              aria-label="حذف الطالب"
            >
              {isDeleting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}