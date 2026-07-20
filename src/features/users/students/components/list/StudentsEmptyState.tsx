import {
  SearchX,
  UserPlus,
} from "lucide-react";

type StudentsEmptyStateProps = {
  hasSearch: boolean;
  onAddStudent: () => void;
  onReset: () => void;
};

export function StudentsEmptyState({
  hasSearch,
  onAddStudent,
  onReset,
}: StudentsEmptyStateProps) {
  return (
    <div className="rounded-[34px] border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-rose-50 text-rose-500">
        <SearchX className="h-9 w-9" />
      </div>

      <h2 className="mt-6 text-xl font-black text-slate-950">
        {hasSearch
          ? "لم نعثر على نتائج"
          : "لا يوجد طلاب بعد"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
        {hasSearch
          ? "جرّبي تغيير كلمات البحث أو إعادة تعيين الفلاتر المستخدمة."
          : "ابدئي بإضافة أول طالب وربطه بولي الأمر والقيد الدراسي."}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {hasSearch ? (
          <button
            type="button"
            onClick={onReset}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            إعادة تعيين البحث
          </button>
        ) : null}

        <button
          type="button"
          onClick={onAddStudent}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          <UserPlus className="h-4 w-4" />
          إضافة طالب
        </button>
      </div>
    </div>
  );
}