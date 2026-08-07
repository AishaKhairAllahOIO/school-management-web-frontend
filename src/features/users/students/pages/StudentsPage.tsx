import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import {
  ArrowUpAZ,
  BookOpen,
  Building2,
  Download,
  Filter,
  GraduationCap,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { ApiId } from "../../shared/types/api.types";
import { ConfirmActionDialog } from "../../shared/components/ConfirmActionDialog";
import { UsersOverviewBackLink } from "../../shared/components/UsersOverviewBackLink";
import { exportStudentsToExcel } from "../../shared/utils/export-users-xlsx";
import { studentApi } from "../api/student.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import { useClassrooms } from "@/features/academics/classrooms/hooks/useClassrooms";
import { useGrades } from "@/features/academics/grades/hooks/useGrades";

import { StudentCard } from "../components/list/StudentCard";
import { StudentsEmptyState } from "../components/list/StudentsEmptyState";
import { StudentsLoadingGrid } from "../components/list/StudentsLoadingGrid";
import { StudentsPagination } from "../components/list/StudentsPagination";

import {
  useDeleteStudent,
  useRestoreStudent,
  useStudents,
  useToggleStudentAccount,
} from "../hooks/useStudents";

import type {
  EnrollmentStatus,
  StudentListFilters,
  StudentListItem,
} from "../types/student.types";

const defaultFilters: StudentListFilters = {
  page: 1,
  per_page: 12,
  sort: "asc",
};

const statusOptions: Array<{
  value: EnrollmentStatus;
  label: string;
}> = [
 
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "suspended",
    label: "Suspended",
  },
  {
    value: "withdrawn",
    label: "Withdrawn",
  },
  {
    value: "confirmed",
    label: "Confirmed",
  },
];

export function StudentsPage() {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] =
    useState("");

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [filters, setFilters] =
    useState<StudentListFilters>(
      defaultFilters,
    );

  const [isExporting, setIsExporting] =
    useState(false);

  const [dialogAction, setDialogAction] = useState<
    | { type: "delete" | "restore" | "toggle"; student: StudentListItem }
    | null
  >(null);

  const [
    pendingDeleteId,
    setPendingDeleteId,
  ] = useState<ApiId>();

  const [
    pendingRestoreId,
    setPendingRestoreId,
  ] = useState<ApiId>();

  const [
    pendingToggleId,
    setPendingToggleId,
  ] = useState<ApiId>();

  const gradesQuery = useGrades();
  const classroomsQuery = useClassrooms();

  const normalizedSearch =
    searchValue.trim();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(normalizedSearch);
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [normalizedSearch]);

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      page: 1,
      search: debouncedSearch || undefined,
    }));
  }, [debouncedSearch]);

  const grades = useMemo(
    () =>
      [...(gradesQuery.data ?? [])].sort(
        (first, second) =>
          first.level - second.level ||
          first.name.localeCompare(second.name),
      ),
    [gradesQuery.data],
  );

  const classrooms = useMemo(() => {
    if (!filters.grade_level_id) {
      return [];
    }

    return (classroomsQuery.data ?? [])
      .filter(
        (classroom) =>
          String(classroom.gradeId) ===
          String(filters.grade_level_id),
      )
      .sort((first, second) =>
        first.name.localeCompare(second.name),
      );
  }, [
    classroomsQuery.data,
    filters.grade_level_id,
  ]);

  const selectedGrade = grades.find(
    (grade) =>
      String(grade.id) ===
      String(filters.grade_level_id),
  );

  const selectedClassroom = classrooms.find(
    (classroom) =>
      String(classroom.id) ===
      String(filters.class_room_id),
  );

  const activeQuery = useStudents(filters);

  const deleteMutation =
    useDeleteStudent();

  const toggleMutation =
    useToggleStudentAccount();

  const restoreMutation =
    useRestoreStudent();

  const students =
    activeQuery.data?.data ?? [];

  const pagination =
    activeQuery.data?.meta;

  const totalStudents =
    pagination?.total ??
    students.length;

  const hasFilters =
    Boolean(normalizedSearch) ||
    Boolean(filters.grade_level_id) ||
    Boolean(filters.class_room_id) ||
    Boolean(filters.status) ||
    filters.sort === "desc";

  function changeSearch(
    value: string,
  ) {
    setSearchValue(value);
  }

  function changeGrade(
    value: string,
  ) {
    setFilters((current) => ({
      ...current,
      page: 1,
      grade_level_id:
        value === "all"
          ? undefined
          : value,
      class_room_id: undefined,
    }));
  }

  function changeClassroom(
    value: string,
  ) {
    setFilters((current) => ({
      ...current,
      page: 1,
      class_room_id:
        value === "all"
          ? undefined
          : value,
    }));
  }

  function changeStatus(
    value: string,
  ) {
    setFilters((current) => ({
      ...current,
      page: 1,
      status: value
        ? (value as EnrollmentStatus)
        : undefined,
    }));
  }

  function toggleSortDirection() {
    setFilters((current) => ({
      ...current,
      page: 1,
      sort:
        current.sort === "asc"
          ? "desc"
          : "asc",
    }));
  }

  function resetFilters() {
    setSearchValue("");
    setDebouncedSearch("");
    setFilters(defaultFilters);
  }

  async function handleExport() {
    try {
      setIsExporting(true);

      const perPage = 100;
      const firstPage = await studentApi.list({
        ...filters,
        search: debouncedSearch || undefined,
        page: 1,
        per_page: perPage,
      });

      const allStudents = [...firstPage.data];
      const lastPage = firstPage.meta?.last_page ?? 1;

      for (let page = 2; page <= lastPage; page += 1) {
        const response = await studentApi.list({
          ...filters,
          search: debouncedSearch || undefined,
          page,
          per_page: perPage,
        });

        allStudents.push(...response.data);
      }

      exportStudentsToExcel(
        allStudents,
        hasFilters ? "filtered-students.xlsx" : "students.xlsx",
      );

      toast.success(`${allStudents.length} students exported.`);
    } catch {
      toast.error("Students could not be exported.");
    } finally {
      setIsExporting(false);
    }
  }

  function openStudent(
    student: StudentListItem,
  ) {
    navigate(
      `/users/students/${student.enrollmentId}`,
    );
  }

  function editStudent(
    student: StudentListItem,
  ) {
    navigate(
      `/users/students/${student.enrollmentId}/edit`,
    );
  }

  function deleteStudent(student: StudentListItem) {
    setDialogAction({ type: "delete", student });
  }

  function restoreStudent(student: StudentListItem) {
    setDialogAction({ type: "restore", student });
  }

  function toggleStudent(student: StudentListItem) {
    setDialogAction({ type: "toggle", student });
  }

  async function confirmStudentAction() {
    if (!dialogAction) {
      return;
    }

    const { type, student } = dialogAction;

    try {
      if (type === "delete") {
        setPendingDeleteId(student.enrollmentId);
        await deleteMutation.mutateAsync(student.enrollmentId);
      } else if (type === "restore") {
        setPendingRestoreId(student.enrollmentId);
        await restoreMutation.mutateAsync(student.enrollmentId);
      } else {
        setPendingToggleId(student.enrollmentId);
        await toggleMutation.mutateAsync(student.enrollmentId);
      }

      setDialogAction(null);
    } finally {
      setPendingDeleteId(undefined);
      setPendingRestoreId(undefined);
      setPendingToggleId(undefined);
    }
  }

  return (
    <section className="-mt-6 space-y-4">
      <UsersOverviewBackLink />

      {activeQuery.isPending ? (
        <DirectoryStatsSkeleton />
      ) : !activeQuery.isError ? (
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={[
              "inline-flex items-center gap-2",
              "rounded-full border",
              "border-primary/20",
              "bg-primary/[0.07]",
              "px-3 py-1.5",
              "text-xs font-medium",
              "text-primary",
            ].join(" ")}
          >
            <GraduationCap className="h-3.5 w-3.5" />

            {totalStudents}{" "}
            {totalStudents === 1
              ? "student"
              : "students"}
          </span>

          <span
            className={[
              "inline-flex items-center gap-2",
              "rounded-full border",
              "border-primary/20",
              "bg-primary/[0.07]",
              "px-3 py-1.5",
              "text-xs font-medium",
              "text-primary",
            ].join(" ")}
          >
            <Sparkles className="h-3.5 w-3.5" />

            Updated directory
          </span>

          {selectedGrade ? (
            <span
              className={[
                "inline-flex items-center gap-1.5",
                "rounded-full border",
                "border-primary/20",
                "bg-primary/[0.07]",
                "px-3 py-1.5",
                "text-xs font-medium text-primary",
              ].join(" ")}
            >
              <BookOpen className="h-3.5 w-3.5" />
              {selectedGrade.name}
            </span>
          ) : null}

          {selectedClassroom ? (
            <span
              className={[
                "inline-flex items-center gap-1.5",
                "rounded-full border",
                "border-primary/20",
                "bg-primary/[0.07]",
                "px-3 py-1.5",
                "text-xs font-medium text-primary",
              ].join(" ")}
            >
              <Building2 className="h-3.5 w-3.5" />
              {selectedClassroom.name}
            </span>
          ) : null}

          {filters.status ? (
            <span
              className={[
                "inline-flex items-center",
                "rounded-full border",
                "border-primary/20",
                "bg-primary/[0.07]",
                "px-3 py-1.5",
                "text-xs font-medium",
                "capitalize text-primary",
              ].join(" ")}
            >
              {filters.status}
            </span>
          ) : null}

          {debouncedSearch ? (
            <span
              className={[
                "inline-flex max-w-56",
                "items-center truncate",
                "rounded-full border",
                "border-border/60",
                "bg-muted/50",
                "px-3 py-1.5",
                "text-xs font-medium",
                "text-muted-foreground",
              ].join(" ")}
            >
              Search:{" "}
              {debouncedSearch}
            </span>
          ) : null}
        </div>
      ) : null}

      <header
        className={[
          "relative overflow-hidden rounded-[26px]",
          "border border-primary/20 bg-card",
          "px-5 py-5 sm:px-6",
          "shadow-[var(--shadow-card)]",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 bg-primary opacity-[0.045]" />

        <div
          className={[
            "pointer-events-none absolute -right-10 -top-16",
            "h-40 w-40 rounded-full",
            "bg-primary opacity-15 blur-3xl",
          ].join(" ")}
        />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
       <div className="relative min-w-0">
  <div className="min-w-0">
    {/* Student directory — يبدأ على نفس محاذاة Students */}
    <p className="ml-[60px] text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
      Student directory
    </p>

    {/* Icon + Students */}
    <div className="mt-1 flex items-center gap-3">
      <span
        className={[
          "flex h-10 w-12 shrink-0",
          "items-center justify-center",
          "rounded-[17px]",
          "bg-primary/[0.08]",
          "text-primary",
        ].join(" ")}
      >
        <GraduationCap
          className="h-5 w-5"
          strokeWidth={1.8}
        />
      </span>

      <h1 className="text-[24px] font-semibold tracking-[-0.04em] text-foreground">
        Students
      </h1>
    </div>

    {/* Description — يبدأ أيضًا على نفس محاذاة Students */}
    <p className="mt-1.5 ml-[60px] max-w-2xl text-sm font-normal leading-6 text-muted-foreground">
      Review profiles for students.
    </p>
  </div>
</div>

          <div className="grid w-full gap-2.5 xl:w-[860px]">
            <div
              className={[
                "grid w-full gap-2",
                "sm:grid-cols-2",
                "xl:grid-cols-[minmax(180px,1.35fr)_145px_145px_150px_82px_40px]",
              ].join(" ")}
            >
              <div className="relative min-w-0">
                <Search
                  className={[
                    "pointer-events-none absolute left-3.5 top-1/2",
                    "h-4 w-4 -translate-y-1/2",
                    normalizedSearch
                      ? "text-primary"
                      : "text-muted-foreground",
                  ].join(" ")}
                  strokeWidth={1.8}
                />

                <input
                  type="search"
                  value={searchValue}
                  onChange={(event) =>
                    changeSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search students..."
                  className={[
                    "h-10 w-full rounded-xl",
                    "border border-primary/20",
                    "bg-card/80",
                    "pl-10 pr-10",
                    "text-xs font-medium",
                    "text-foreground",
                    "outline-none",
                    "transition-colors",
                    "placeholder:text-muted-foreground",
                    "focus:ring-2",
                    "focus:ring-primary/10",
                  ].join(" ")}
                />

                {activeQuery.isFetching ? (
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute right-3.5 top-1/2",
                      "h-4 w-4 -translate-y-1/2",
                      "animate-spin rounded-full",
                      "border-2 border-primary",
                      "border-t-transparent",
                    ].join(" ")}
                  />
                ) : null}
              </div>

              <Select
                value={
                  filters.grade_level_id
                    ? String(filters.grade_level_id)
                    : "all"
                }
                onValueChange={changeGrade}
                disabled={gradesQuery.isLoading}
              >
                <SelectTrigger
                  aria-label="Grade level"
                  className={[
                    "h-10 w-full rounded-xl border",
                    "border-primary/20 bg-card/80",
                    "px-3 text-xs font-medium",
                    filters.grade_level_id
                      ? "text-primary"
                      : "text-muted-foreground",
                    "focus:ring-2 focus:ring-primary/10",
                  ].join(" ")}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <BookOpen className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                    <SelectValue placeholder="All grades" />
                  </div>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All grades</SelectItem>
                  {grades.map((grade) => (
                    <SelectItem key={grade.id} value={String(grade.id)}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={
                  filters.class_room_id
                    ? String(filters.class_room_id)
                    : "all"
                }
                onValueChange={changeClassroom}
                disabled={
                  !filters.grade_level_id ||
                  classroomsQuery.isLoading
                }
              >
                <SelectTrigger
                  aria-label="Classroom"
                  className={[
                    "h-10 w-full rounded-xl border",
                    "border-primary/20 bg-card/80",
                    "px-3 text-xs font-medium",
                    filters.class_room_id
                      ? "text-primary"
                      : "text-muted-foreground",
                    "focus:ring-2 focus:ring-primary/10",
                    "disabled:cursor-not-allowed disabled:opacity-55",
                  ].join(" ")}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Building2 className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                    <SelectValue
                      placeholder={
                        filters.grade_level_id
                          ? "All classrooms"
                          : "Select grade first"
                      }
                    />
                  </div>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All classrooms</SelectItem>
                  {classrooms.map((classroom) => (
                    <SelectItem
                      key={classroom.id}
                      value={String(classroom.id)}
                    >
                      {classroom.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.status ?? "all"}
                onValueChange={(value) =>
                  changeStatus(value === "all" ? "" : value)
                }
              >
                <SelectTrigger
                  aria-label="Enrollment status"
                  className={[
                    "h-10 w-full rounded-xl border",
                    "border-primary/20 bg-card/80",
                    "px-3 text-xs font-medium",
                    filters.status
                      ? "text-primary"
                      : "text-muted-foreground",
                    "focus:ring-2 focus:ring-primary/10",
                  ].join(" ")}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Filter className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                    <SelectValue placeholder="All statuses" />
                  </div>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <button
                type="button"
                onClick={
                  toggleSortDirection
                }
                title={
                  filters.sort ===
                  "asc"
                    ? "Sort Z to A"
                    : "Sort A to Z"
                }
                className={[
                  "inline-flex h-10",
                  "items-center justify-center gap-2",
                  "rounded-xl border",
                  "border-primary/20",
                  "bg-card/80 px-3",
                  "text-xs font-semibold",
                  "text-primary",
                  "transition-colors",
                  "hover:bg-primary/[0.07]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-4",
                  "focus-visible:ring-primary/10",
                ].join(" ")}
              >
                <ArrowUpAZ
                  className={[
                    "h-4 w-4",
                    "transition-transform",
                    filters.sort ===
                    "desc"
                      ? "rotate-180"
                      : "",
                  ].join(" ")}
                  strokeWidth={1.8}
                />

                <span>
                  {filters.sort ===
                  "asc"
                    ? "A–Z"
                    : "Z–A"}
                </span>
              </button>

              <button
                type="button"
                aria-label="Reset student filters"
                title="Reset filters"
                disabled={!hasFilters}
                onClick={resetFilters}
                className={[
                  "inline-flex h-10 w-10",
                  "items-center justify-center",
                  "rounded-xl border",
                  "border-primary/20",
                  "bg-card/80",
                  "text-primary",
                  "transition-colors",
                  "hover:bg-primary/[0.07]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-4",
                  "focus-visible:ring-primary/10",
                  "disabled:cursor-not-allowed",
                  "disabled:text-muted-foreground",
                  "disabled:opacity-35",
                ].join(" ")}
              >
                <RotateCcw
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </button>
            </div>

            <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
              <button
                type="button"
                disabled={isExporting}
                onClick={handleExport}
                className={[
                  "inline-flex h-10",
                  "items-center justify-center gap-2",
                  "rounded-xl border",
                  "border-primary/20",
                  "bg-card/80 px-3",
                  "text-xs font-semibold",
                  "text-primary",
                  "transition-colors",
                  "hover:bg-primary/[0.07]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-4",
                  "focus-visible:ring-primary/10",
                  "disabled:cursor-not-allowed",
                  "disabled:opacity-50",
                ].join(" ")}
              >
                <Download
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />

                <span>
                  {isExporting
                    ? "Exporting..."
                    : "Export"}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/users/students/import",
                  )
                }
                className={[
                  "inline-flex h-10",
                  "items-center justify-center gap-2",
                  "rounded-xl border",
                  "border-primary/20",
                  "bg-card/80 px-3",
                  "text-xs font-semibold",
                  "text-primary",
                  "transition-colors",
                  "hover:bg-primary/[0.07]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-4",
                  "focus-visible:ring-primary/10",
                ].join(" ")}
              >
                <Upload
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />

                <span>
                  Import
                </span>
              </button>

              <button
                type="button"
                disabled={
                  activeQuery.isFetching
                }
                onClick={() => {
                  void activeQuery.refetch();
                }}
                className={[
                  "inline-flex h-10",
                  "items-center justify-center gap-2",
                  "rounded-xl bg-primary px-3",
                  "text-xs font-semibold",
                  "text-primary-foreground",
                  "shadow-[var(--shadow-auth-button)]",
                  "transition-transform",
                  "hover:-translate-y-0.5",
                  "hover:bg-primary/90",
                  "focus-visible:outline-none",
                  "focus-visible:ring-4",
                  "focus-visible:ring-primary/10",
                  "disabled:cursor-not-allowed",
                  "disabled:opacity-60",
                ].join(" ")}
              >
                <RefreshCcw
                  className={[
                    "h-4 w-4",
                    activeQuery.isFetching
                      ? "animate-spin"
                      : "",
                  ].join(" ")}
                  strokeWidth={1.8}
                />

                <span>
                  Refresh
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/users/students/new",
                  )
                }
                className={[
                  "inline-flex h-10",
                  "items-center justify-center gap-2",
                  "rounded-xl bg-primary px-3",
                  "text-xs font-semibold",
                  "text-primary-foreground",
                  "shadow-[var(--shadow-auth-button)]",
                  "transition-transform",
                  "hover:-translate-y-0.5",
                  "hover:bg-primary/90",
                  "focus-visible:outline-none",
                  "focus-visible:ring-4",
                  "focus-visible:ring-primary/10",
                ].join(" ")}
              >
                <Plus
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />

                <span>
                  Add
                </span>
              </button>
            </div>

          </div>
        </div>
      </header>



      {activeQuery.isPending ? (
        <StudentsLoadingGrid />
      ) : activeQuery.isError ? (
        <StudentsErrorState
          onRetry={() =>
            void activeQuery.refetch()
          }
        />
      ) : students.length ===
        0 ? (
        <StudentsEmptyState
          hasSearch={Boolean(
            normalizedSearch ||
              filters.grade_level_id ||
              filters.class_room_id ||
              filters.status,
          )}
          onReset={resetFilters}
          onAddStudent={() =>
            navigate(
              "/users/students/new",
            )
          }
        />
      ) : (
        <section
          aria-label="Student cards"
          className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3"
        >
          {students.map(
            (
              student,
              index,
            ) => (
              <StudentCard
                key={
                  student.enrollmentId
                }
                student={student}
                index={index}
                isDeleting={
                  pendingDeleteId ===
                  student.enrollmentId
                }
                isRestoring={
                  pendingRestoreId ===
                  student.enrollmentId
                }
                isToggling={
                  pendingToggleId ===
                  student.enrollmentId
                }
                onView={
                  openStudent
                }
                onEdit={
                  editStudent
                }
                onDelete={
                  deleteStudent
                }
                onToggleStatus={
                  toggleStudent
                }
                onRestore={
                  restoreStudent
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
          total={
            pagination.total
          }
          from={
            pagination.from
          }
          to={pagination.to}
          disabled={
            activeQuery.isFetching
          }
          onPageChange={(
            page,
          ) => {
            setFilters(
              (current) => ({
                ...current,
                page,
              }),
            );

            window.scrollTo({
              top: 0,
              behavior:
                "smooth",
            });
          }}
        />
      ) : null}

      <ConfirmActionDialog
        open={Boolean(dialogAction)}
        title={
          dialogAction?.type === "delete"
            ? "Withdraw Student?"
            : dialogAction?.type === "restore"
              ? "Restore Student?"
              : "Change Account Status?"
        }
        description={
          dialogAction?.type === "delete"
            ? "The enrollment will be withdrawn and the account will be disabled."
            : dialogAction?.type === "restore"
              ? "The enrollment and account will become active again."
              : "This changes whether the student can access the school system."
        }
        confirmLabel={
          dialogAction?.type === "delete"
            ? "Withdraw"
            : dialogAction?.type === "restore"
              ? "Restore"
              : "Confirm"
        }
        pendingLabel={
          dialogAction?.type === "delete"
            ? "Withdrawing..."
            : dialogAction?.type === "restore"
              ? "Restoring..."
              : "Updating..."
        }
        tone={dialogAction?.type === "restore" ? "restore" : dialogAction?.type === "delete" ? "danger" : "neutral"}
        isPending={
          deleteMutation.isPending ||
          restoreMutation.isPending ||
          toggleMutation.isPending
        }
        details={
          dialogAction ? (
            <span>
              <span className="font-medium text-foreground">
                {dialogAction.student.fullName}
              </span>
              {" · "}
              {dialogAction.student.grade?.name ?? "No grade assigned"}
            </span>
          ) : null
        }
        onClose={() => setDialogAction(null)}
        onConfirm={() => {
          void confirmStudentAction();
        }}
      />
    </section>
  );
}

function StudentsErrorState({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <section className="rounded-[26px] border border-destructive/20 bg-card px-6 py-14 text-center shadow-[var(--shadow-card)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-destructive/[0.08] text-destructive">
        <GraduationCap className="h-6 w-6" />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-foreground">
        Students could not be
        loaded
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Check your connection
        and permissions, then
        try loading the student
        directory again.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className={[
          "mt-5 inline-flex h-10",
          "items-center gap-2",
          "rounded-xl",
          "border border-border",
          "bg-card px-4",
          "text-xs font-semibold",
          "text-foreground",
          "transition-colors",
          "hover:bg-muted",
        ].join(" ")}
      >
        <RefreshCcw className="h-4 w-4" />

        Try again
      </button>
    </section>
  );
}
function DirectoryStatsSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex animate-pulse flex-wrap items-center gap-2"
    >
      <span className="h-7 w-24 rounded-full border border-primary/15 bg-primary/[0.06]" />
      <span className="h-7 w-36 rounded-full border border-primary/15 bg-primary/[0.06]" />
    </div>
  );
}

