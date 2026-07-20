import {
  type ChangeEvent,
  useState,
} from "react";
import {
  LayoutGrid,
  Plus,
  RefreshCcw,
  Upload,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { ApiId } from "../../shared/types/api.types";

import { StudentCard } from "../components/list/StudentCard";
import { StudentsEmptyState } from "../components/list/StudentsEmptyState";
import { StudentsFiltersBar } from "../components/list/StudentFiltersBar";
import { StudentsLoadingGrid } from "../components/list/StudentsLoadingGrid";
import { StudentsPagination } from "../components/list/StudentsPagination";
import { StudentPageHeader } from "../components/shared/StudentPageHeader";

import {
  useDeleteStudent,
  useStudentSearch,
  useStudents,
  useToggleStudentAccount,
} from "../hooks/useStudents";

import {
  getStudentImportBatchId,
  useImportStudents,
} from "../hooks/useStudentImport";

import type {
  StudentListFilters,
  StudentListItem,
} from "../types/student.types";

const defaultFilters: StudentListFilters = {
  page: 1,
  per_page: 12,
  sort: "asc",
};

export function StudentsPage() {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] =
    useState("");

  const [filters, setFilters] =
    useState<StudentListFilters>(
      defaultFilters,
    );

  const [
    pendingDeleteId,
    setPendingDeleteId,
  ] = useState<ApiId>();

  const [
    pendingToggleId,
    setPendingToggleId,
  ] = useState<ApiId>();

  const normalizedSearch =
    searchValue.trim();

  const isSearchMode =
    normalizedSearch.length >= 2;

  const listQuery = useStudents(filters);

  const searchQuery = useStudentSearch({
    q: normalizedSearch,
    page: filters.page,
    per_page: filters.per_page,
  });

  const activeQuery = isSearchMode
    ? searchQuery
    : listQuery;

  const deleteMutation =
    useDeleteStudent();

  const toggleMutation =
    useToggleStudentAccount();

  const importMutation =
    useImportStudents();

  const students =
    activeQuery.data?.data ?? [];

  const pagination =
    activeQuery.data?.meta;

  function changeSearch(value: string) {
    setSearchValue(value);

    setFilters((current) => ({
      ...current,
      page: 1,
    }));
  }

  function resetFilters() {
    setSearchValue("");
    setFilters(defaultFilters);
  }

  function openStudent(
    student: StudentListItem,
  ) {
    navigate(
      `/users/students/${student.enrollmentId}`,
    );
  }

  async function deleteStudent(
    student: StudentListItem,
  ) {
    const confirmed = window.confirm(
      `هل أنت متأكدة من حذف الطالب "${student.fullName}"؟`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setPendingDeleteId(
        student.studentId,
      );

      await deleteMutation.mutateAsync(
        student.studentId,
      );
    } finally {
      setPendingDeleteId(undefined);
    }
  }

  async function toggleStudent(
    student: StudentListItem,
  ) {
    const confirmed = window.confirm(
      `هل تريدين تغيير حالة حساب "${student.fullName}"؟`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setPendingToggleId(
        student.enrollmentId,
      );

      await toggleMutation.mutateAsync(
        student.enrollmentId,
      );
    } finally {
      setPendingToggleId(undefined);
    }
  }

  async function importFile(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    const isExcelFile =
      /\.(xlsx|xls|csv)$/i.test(
        file.name,
      );

    if (!isExcelFile) {
      toast.error(
        "يرجى اختيار ملف Excel أو CSV.",
      );

      return;
    }

    try {
      const response =
        await importMutation.mutateAsync(
          file,
        );

      const batchId =
        getStudentImportBatchId(
          response,
        );

      toast.success(
        `بدأ الاستيراد. رقم العملية: ${batchId}`,
      );
    } catch {
      // الخطأ يعالج داخل hook.
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f7f7f5] px-4 py-5 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-[1650px] flex-col gap-6">
        <StudentPageHeader
          title="لوحة الطلاب"
          description="استعرضي الطلاب بطريقة بصرية، وابحثي عن ملفاتهم، وأديري القيد والحساب من مكان واحد."
          icon={
            <UsersRound className="h-7 w-7" />
          }
          actions={
            <>
              <button
                type="button"
                onClick={() =>
                  void activeQuery.refetch()
                }
                disabled={
                  activeQuery.isFetching
                }
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCcw
                  className={[
                    "h-4 w-4",
                    activeQuery.isFetching
                      ? "animate-spin"
                      : "",
                  ].join(" ")}
                />
                تحديث
              </button>

              <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-2xl bg-rose-50 px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-100">
                <Upload className="h-4 w-4" />

                {importMutation.isPending
                  ? "جارٍ الرفع..."
                  : "استيراد"}

                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  disabled={
                    importMutation.isPending
                  }
                  onChange={importFile}
                />
              </label>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/users/students/new",
                  )
                }
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
                إضافة طالب
              </button>
            </>
          }
        />

        <div className="flex items-center justify-between px-2">
          <div>
            <p className="text-sm font-semibold text-slate-400">
              إجمالي الطلاب
            </p>

            <p className="mt-1 text-3xl font-black text-slate-950">
              {pagination?.total ?? 0}
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-white text-slate-700 shadow-sm">
            <LayoutGrid className="h-5 w-5" />
          </div>
        </div>

        <StudentsFiltersBar
          searchValue={searchValue}
          filters={filters}
          isFetching={
            activeQuery.isFetching
          }
          onSearchChange={changeSearch}
          onFiltersChange={setFilters}
          onReset={resetFilters}
        />

        {activeQuery.isPending ? (
          <StudentsLoadingGrid />
        ) : activeQuery.isError ? (
          <div className="rounded-[32px] border border-rose-100 bg-white px-6 py-20 text-center">
            <h2 className="text-lg font-black text-rose-600">
              تعذر تحميل الطلاب
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              تحققي من الاتصال وصلاحيات الحساب ثم أعيدي المحاولة.
            </p>

            <button
              type="button"
              onClick={() =>
                void activeQuery.refetch()
              }
              className="mt-5 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : students.length === 0 ? (
          <StudentsEmptyState
            hasSearch={
              Boolean(
                normalizedSearch ||
                  filters.status,
              )
            }
            onReset={resetFilters}
            onAddStudent={() =>
              navigate(
                "/users/students/new",
              )
            }
          />
        ) : (
          <section className="columns-1 gap-5 sm:columns-2 xl:columns-3 2xl:columns-4">
            {students.map(
              (student, index) => (
                <StudentCard
                  key={
                    student.enrollmentId
                  }
                  student={student}
                  index={index}
                  isDeleting={
                    pendingDeleteId ===
                    student.studentId
                  }
                  isToggling={
                    pendingToggleId ===
                    student.enrollmentId
                  }
                  onView={openStudent}
                  onDelete={deleteStudent}
                  onToggleStatus={
                    toggleStudent
                  }
                />
              ),
            )}
          </section>
        )}

        {pagination ? (
          <StudentsPagination
            currentPage={
              pagination.current_page
            }
            lastPage={
              pagination.last_page
            }
            total={pagination.total}
            from={pagination.from}
            to={pagination.to}
            disabled={
              activeQuery.isFetching
            }
            onPageChange={(page) => {
              setFilters((current) => ({
                ...current,
                page,
              }));

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          />
        ) : null}
      </div>
    </main>
  );
}