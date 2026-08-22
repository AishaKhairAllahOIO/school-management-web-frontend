import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  FileCheck,
  Settings,
  Send,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  Loader2,
  EyeOff,
  Eye,
  ArrowLeft,
  Trophy,
  ChevronLeft,
  ChevronRight,
  GraduationCap as CapIcon,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import {
  useReportCards,
  useGenerateReportCards,
  useTogglePublishReportCards,
  reportCardKeys,
} from "../hooks/useReportCards";

import { PromoteStudentsDialog } from "../components/PromoteStudentsDialog";
import { StudentReportCardModal } from "../components/StudentReportCardModal";
import { TopStudentsModal } from "../components/TopStudentsModal";

import { useAcademicTerms } from "../../settings/academic/hooks/useAcademicSettings.ts";
import { useGrades } from "../../academics/grades/hooks/useGrades.ts";
import { useClassrooms } from "../../academics/classrooms/hooks/useClassrooms.ts";

export function ReportCardsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isTopModalOpen, setIsTopModalOpen] = useState(false);
  const [semesterId, setSemesterId] = useState<string>("");
  const [gradeId, setGradeId] = useState<string>("");
  const [classRoomId, setClassRoomId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] =
    useState<any | null>(null);

  const { data: terms, isLoading: isTermsLoading } = useAcademicTerms();
  const { data: grades, isLoading: isGradesLoading } = useGrades();
  const { data: classrooms, isLoading: isClassroomsLoading } =
    useClassrooms();

 

  useEffect(() => {
    setClassRoomId("");
    setPage(1);
  }, [gradeId, semesterId]);

  const filteredClassrooms = useMemo(() => {
    if (!classrooms) return [];
    if (!gradeId) return classrooms;

    return classrooms.filter(
      (room: any) =>
        String(room.grade_id || room.gradeId) === String(gradeId),
    );
  }, [classrooms, gradeId]);

  const effectiveGradeId = gradeId === "" ? undefined : gradeId;
  const effectiveClassRoomId = classRoomId === "" ? undefined : classRoomId;

  const {
    data: reportCardsData,
    isLoading: isReportCardsLoading,
    isFetching,
  } = useReportCards(
    semesterId,
    effectiveGradeId,
    effectiveClassRoomId,
    page,
  );

  const reportCards = Array.isArray(reportCardsData)
    ? reportCardsData
    : reportCardsData?.data || [];

  const meta = reportCardsData?.meta || reportCardsData || {};
  const from = meta.from || (reportCards.length > 0 ? 1 : 0);
  const to = meta.to || reportCards.length;
  const total = meta.total || reportCards.length;
  const lastPage = meta.last_page || 1;

  const generateMutation = useGenerateReportCards();
  const publishMutation = useTogglePublishReportCards();

  const handleGenerate = () => {
    generateMutation.mutate(
      {
        semester_id: semesterId,
        class_room_id: effectiveClassRoomId,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: reportCardKeys.all,
          });
        },
      },
    );
  };

  const handlePublish = (isPublished: boolean) => {
    const payload: any = {
      semester_id: semesterId,
      is_published: isPublished ? 1 : 0,
    };

    if (effectiveGradeId) payload.grade_id = effectiveGradeId;
    if (effectiveClassRoomId) payload.class_room_id = effectiveClassRoomId;

    publishMutation.mutate(payload, {
      onSuccess: () => {
        const exactKey = reportCardKeys.list(
          semesterId,
          effectiveGradeId,
          effectiveClassRoomId,
          page,
        );

        queryClient.setQueryData(exactKey, (oldData: any) => {
          if (!oldData) return oldData;

          const targetValue = isPublished ? 1 : 0;

          const updateList = (list: any[]) =>
            list.map((s: any) => ({
              ...s,
              is_published: targetValue,
            }));

          if (Array.isArray(oldData)) {
            return updateList(oldData);
          }

          if (oldData.data && Array.isArray(oldData.data)) {
            return {
              ...oldData,
              data: updateList(oldData.data),
            };
          }

          if (oldData.data?.data && Array.isArray(oldData.data.data)) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                data: updateList(oldData.data.data),
              },
            };
          }

          return oldData;
        });
      },
    });
  };

  const renderAcademicResult = (result: string) => {
    const base =
      "inline-flex items-center px-3 py-1 rounded-full text-[11.5px] font-semibold border shadow-2xs capitalize";

    switch (result) {
      case "passed":
        return (
          <span
            className={`${base} bg-success/10 text-success border-success/20`}
          >
            Passed
          </span>
        );

      case "failed":
        return (
          <span
            className={`${base} bg-destructive/10 text-destructive border-destructive/20`}
          >
            Failed
          </span>
        );

      case "graduated":
        return (
          <span
            className={`${base} bg-primary/10 text-primary border-primary/20`}
          >
            Graduated
          </span>
        );

      default:
        return (
          <span
            className={`${base} bg-muted text-muted-foreground border-border`}
          >
            N/A
          </span>
        );
    }
  };

  const renderFinancialStatus = (status: string) => {
    const isCleared = status === "cleared";

    return (
      <span
        className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${
          isCleared ? "text-success" : "text-destructive"
        }`}
      >
        {isCleared ? (
          <CheckCircle2 size={14} />
        ) : (
          <AlertCircle size={14} />
        )}

        {isCleared ? "Cleared" : "Blocked"}
      </span>
    );
  };

  const isLoading =
    isReportCardsLoading ||
    isFetching ||
    isTermsLoading ||
    isClassroomsLoading ||
    isGradesLoading;

 return (
  <div className="-mt-5 space-y-4 pb-12 animate-in fade-in duration-300">
    {/* Back navigation */}
    <button
      onClick={() => navigate("/reports")}
      className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-primary"
    >
      <ArrowLeft
        className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5"
        strokeWidth={1.8}
      />

      <span>Back to Reports</span>
    </button>

    {/* Header */}
    <header className="rounded-[24px] border border-border/70 bg-card shadow-sm backdrop-blur-xl">
      <div className="flex flex-col gap-5 p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
        
        {/* Page identity */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-primary/20 bg-primary/10 text-primary shadow-xs sm:h-12 sm:w-12 sm:rounded-[16px]">
            <FileCheck size={21} strokeWidth={2} />
          </span>

          <div className="min-w-0">
            <h1 className="truncate text-[17px] font-semibold tracking-tight text-foreground sm:text-[18px]">
              Report Cards & Results
            </h1>

            <p className="mt-0.5 max-w-[520px] text-[11.5px] font-medium leading-relaxed text-muted-foreground sm:text-[12px]">
              Generate, publish, and manage annual student promotions seamlessly.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          <button
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !semesterId}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[13px] border border-border/80 bg-background px-4 text-[12px] font-semibold text-foreground shadow-2xs transition-all hover:bg-muted/60 disabled:opacity-50"
          >
            {generateMutation.isPending ? (
              <Loader2 size={16} className="animate-spin text-primary" />
            ) : (
              <Settings size={16} className="text-muted-foreground" />
            )}
            Generate Cards
          </button>

          <button
            onClick={() => setIsPromoteModalOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[13px] border border-border/80 bg-background px-4 text-[12px] font-semibold text-foreground shadow-2xs transition-all hover:bg-muted/60"
          >
            <GraduationCap size={16} className="text-muted-foreground" />
            Annual Promotion
          </button>

          <div className="flex items-center overflow-hidden rounded-[13px] border border-primary/20 bg-primary/5 p-0.5 shadow-2xs">
            <button
              onClick={() => handlePublish(true)}
              disabled={publishMutation.isPending || !semesterId}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[11px] bg-primary px-4 text-[11.5px] font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:opacity-50"
            >
              {publishMutation.isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
              Publish
            </button>

            <button
              onClick={() => handlePublish(false)}
              disabled={publishMutation.isPending || !semesterId}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[11px] px-3 text-[11.5px] font-semibold text-primary transition hover:bg-primary/15 disabled:opacity-50"
              title="Unpublish (Hide)"
            >
              <EyeOff size={15} />
            </button>
          </div>

          <button
            onClick={() => setIsTopModalOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[13px] bg-primary px-5 text-[12px] font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <Trophy size={16} />
            Top 10 Students
          </button>
        </div>
      </div>
    </header>

    {/* باقي الصفحة كما هي */}

      {/* Filters */}
      <section className="grid grid-cols-1 gap-4 rounded-[20px] border border-border/70 bg-card p-5 shadow-2xs md:grid-cols-3">
        {/* Semester */}
        <label className="flex flex-col">
          <span className="mb-2 block text-[11.5px] font-semibold text-muted-foreground">
            Semester
          </span>

          <Select
            value={semesterId}
            onValueChange={(value) => setSemesterId(value)}
            disabled={isTermsLoading}
          >
            <SelectTrigger className="h-11 rounded-[14px] px-4 text-[13px]">
              <SelectValue
                placeholder={
                  isTermsLoading ? "Loading..." : "Select semester"
                }
              />
            </SelectTrigger>

            <SelectContent>
              {terms?.length ? (
                terms.map((term: any) => (
                  <SelectItem
                    key={term.id}
                    value={String(term.id)}
                  >
                    {term.semesterName}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-semesters" disabled>
                  No Semesters
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </label>

        {/* Grade */}
        <label className="flex flex-col">
          <span className="mb-2 block text-[11.5px] font-semibold text-muted-foreground">
            Grade (Optional)
          </span>

          <Select
            value={gradeId}
            onValueChange={(value) => setGradeId(value)}
            disabled={isGradesLoading}
          >
            <SelectTrigger className="h-11 rounded-[14px] px-4 text-[13px]">
              <SelectValue placeholder="All Grades" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all-grades">
                All Grades
              </SelectItem>

              {grades?.map((grade: any) => (
                <SelectItem
                  key={grade.id}
                  value={String(grade.id)}
                >
                  {grade.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        {/* Classroom */}
        <label className="flex flex-col">
          <span className="mb-2 block text-[11.5px] font-semibold text-muted-foreground">
            Classroom (Optional)
          </span>

          <Select
            value={classRoomId}
            onValueChange={(value) => setClassRoomId(value)}
            disabled={
              isClassroomsLoading ||
              (gradeId !== "" && filteredClassrooms.length === 0)
            }
          >
            <SelectTrigger className="h-11 rounded-[14px] px-4 text-[13px]">
              <SelectValue placeholder="All Classrooms" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all-classrooms">
                All Classrooms
              </SelectItem>

              {filteredClassrooms?.map((room: any) => (
                <SelectItem
                  key={room.id}
                  value={String(room.id)}
                >
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </section>

      {/* Table */}
      <section className="overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40">
                <th className="px-6 py-4 text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Student Name
                </th>

                <th className="px-6 py-4 text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Marks
                </th>

                <th className="px-6 py-4 text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                  GPA
                </th>

                <th className="px-6 py-4 text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Result
                </th>

                <th className="px-6 py-4 text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Financial Status
                </th>

                <th className="px-6 py-4 text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Publish Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/50">
            {isLoading || generateMutation.isPending ? (
  Array.from({ length: 6 }).map((_, index) => (
    <tr key={`skeleton-${index}`} className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 rounded-full bg-muted/60" />

          <div className="space-y-2">
            <div className="h-3 w-32 rounded-full bg-muted/60" />
            <div className="h-2.5 w-20 rounded-full bg-muted/40" />
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="h-3 w-16 rounded-full bg-muted/60" />
      </td>

      <td className="px-6 py-4">
        <div className="h-3 w-14 rounded-full bg-muted/60" />
      </td>

      <td className="px-6 py-4">
        <div className="h-6 w-20 rounded-full bg-muted/60" />
      </td>

      <td className="px-6 py-4">
        <div className="h-3 w-16 rounded-full bg-muted/60" />
      </td>

      <td className="px-6 py-4">
        <div className="h-3 w-20 rounded-full bg-muted/60" />
      </td>
    </tr>
  ))
) : !Array.isArray(reportCards) ||
                reportCards.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-16 text-center text-[13px] font-medium text-muted-foreground"
                  >
                    <FileCheck className="mx-auto mb-3 h-9 w-9 text-muted-foreground/40" />

                    No report cards available for the selected filters.
                  </td>
                </tr>
              ) : (
                reportCards.map((student: any) => {
                  const isPub =
                    student.is_published === true ||
                    Number(student.is_published) === 1 ||
                    String(student.is_published).toLowerCase() ===
                      "true";

                  return (
                    <tr
                      key={student.student_id}
                      onClick={() =>
                        setSelectedStudentForModal(student)
                      }
                      className="group cursor-pointer transition-colors hover:bg-muted/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary shadow-2xs">
                            <CapIcon size={16} />
                          </span>

                          <div>
                            <div className="text-[13px] font-semibold text-foreground transition-colors group-hover:text-primary">
                              {student.student_name}
                            </div>

                            <div className="text-[11px] font-medium text-muted-foreground">
                              Active enrollment
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-[13px] font-semibold text-muted-foreground">
                        {student.summary?.total_marks ??
                          student.total_marks ??
                          "0.00"}
                      </td>

                      <td className="px-6 py-4 text-[13px] font-semibold text-foreground">
                        {typeof student.gpa === "number"
                          ? `${student.gpa.toFixed(1)}%`
                          : student.summary?.total_marks &&
                              student.summary?.max_total_marks
                            ? `${(
                                (Number(
                                  student.summary.total_marks,
                                ) /
                                  Number(
                                    student.summary
                                      .max_total_marks,
                                  )) *
                                100
                              ).toFixed(1)}%`
                            : "0.0%"}
                      </td>

                      <td className="px-6 py-4">
                        {renderAcademicResult(
                          student.summary?.final_result ??
                            student.academic_result,
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {renderFinancialStatus(
                          student.financial_status ?? "cleared",
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[12px] font-semibold transition-colors ${
                            isPub
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {isPub ? (
                            <Eye size={15} />
                          ) : (
                            <EyeOff size={15} />
                          )}

                          {isPub ? "Published" : "Hidden"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border/70 bg-card px-6 py-4 text-[12.5px] text-muted-foreground">
          <div className="font-medium">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {from}-{to}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {total}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setPage((p) => Math.max(p - 1, 1))
              }
              disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border/80 bg-background shadow-2xs transition-colors hover:bg-muted/60 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary text-[12px] font-semibold text-primary-foreground shadow-xs">
              {page}
            </span>

            <button
              onClick={() =>
                setPage((p) =>
                  p < lastPage ? p + 1 : p,
                )
              }
              disabled={page >= lastPage}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border/80 bg-background shadow-2xs transition-colors hover:bg-muted/60 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {isPromoteModalOpen && (
        <PromoteStudentsDialog
          onClose={() => setIsPromoteModalOpen(false)}
        />
      )}

      <TopStudentsModal
        reportCards={
          Array.isArray(reportCards) ? reportCards : []
        }
        isOpen={isTopModalOpen}
        onClose={() => setIsTopModalOpen(false)}
      />

      <StudentReportCardModal
        student={selectedStudentForModal}
        isOpen={!!selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
      />
    </div>
  );
}