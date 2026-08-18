import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  FileCheck, 
  Settings, 
  Send, 
  GraduationCap, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  EyeOff,
  Trophy,
  ChevronLeft,
  ChevronRight,
  GraduationCap as CapIcon
} from "lucide-react";

import { 
  useReportCards, 
  useGenerateReportCards, 
  useTogglePublishReportCards,
  reportCardKeys 
} from "../hooks/useReportCards";
import { PromoteStudentsDialog } from "../components/PromoteStudentsDialog";
import { StudentReportCardModal } from "../components/StudentReportCardModal";
import { TopStudentsModal } from "../components/TopStudentsModal";

import { useAcademicTerms } from "../../settings/academic/hooks/useAcademicSettings.ts"; 
import { useGrades } from "../../academics/grades/hooks/useGrades.ts"; 
import { useClassrooms } from "../../academics/classrooms/hooks/useClassrooms.ts"; 

export function ReportCardsPage() {
  const queryClient = useQueryClient();

  const [isTopModalOpen, setIsTopModalOpen] = useState(false);
  const [semesterId, setSemesterId] = useState<string>("");
  const [gradeId, setGradeId] = useState<string>(""); 
  const [classRoomId, setClassRoomId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<any | null>(null);

  const { data: terms, isLoading: isTermsLoading } = useAcademicTerms();
  const { data: grades, isLoading: isGradesLoading } = useGrades();
  const { data: classrooms, isLoading: isClassroomsLoading } = useClassrooms();

  useEffect(() => {
    if (terms && terms.length > 0 && !semesterId) {
      setSemesterId(String(terms[0].id));
    }
  }, [terms, semesterId]);

  useEffect(() => {
    setClassRoomId("");
    setPage(1);
  }, [gradeId, semesterId]);

  const filteredClassrooms = useMemo(() => {
    if (!classrooms) return [];
    if (!gradeId) return classrooms;
    return classrooms.filter((room: any) => String(room.grade_id || room.gradeId) === String(gradeId));
  }, [classrooms, gradeId]);

  const effectiveGradeId = gradeId === "" ? undefined : gradeId;
  const effectiveClassRoomId = classRoomId === "" ? undefined : classRoomId;

  const { data: reportCardsData, isLoading: isReportCardsLoading, isFetching } = useReportCards(
    semesterId, 
    effectiveGradeId,
    effectiveClassRoomId,
    page
  );

  const reportCards = Array.isArray(reportCardsData) ? reportCardsData : (reportCardsData?.data || []);
  const meta = reportCardsData?.meta || reportCardsData || {};
  const from = meta.from || (reportCards.length > 0 ? 1 : 0);
  const to = meta.to || reportCards.length;
  const total = meta.total || reportCards.length;
  const lastPage = meta.last_page || 1;

  const generateMutation = useGenerateReportCards();
  const publishMutation = useTogglePublishReportCards();

  const handleGenerate = () => {
    generateMutation.mutate(
      { semester_id: semesterId, class_room_id: effectiveClassRoomId },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: reportCardKeys.all });
        }
      }
    );
  };

  const handlePublish = (isPublished: boolean) => {
    publishMutation.mutate(
      { semester_id: semesterId, grade_id: effectiveGradeId, class_room_id: effectiveClassRoomId, is_published: isPublished },
      {
        onSuccess: () => {
          queryClient.setQueryData(reportCardKeys.list(semesterId, effectiveGradeId, effectiveClassRoomId, page), (oldData: any) => {
            if (!oldData) return oldData;
            const updateList = (list: any[]) => list.map((s: any) => ({ ...s, is_published: isPublished }));
            if (Array.isArray(oldData)) return updateList(oldData);
            return {
              ...oldData,
              data: oldData.data ? updateList(oldData.data) : []
            };
          });
          queryClient.invalidateQueries({ queryKey: reportCardKeys.all });
        }
      }
    );
  };

  const renderAcademicResult = (result: string) => {
    switch (result) {
      case 'passed': 
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[11.5px] font-semibold bg-success/10 text-success border border-success/20 shadow-2xs">Passed</span>;
      case 'failed': 
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[11.5px] font-semibold bg-destructive/10 text-destructive border border-destructive/20 shadow-2xs">Failed</span>;
      case 'graduated': 
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[11.5px] font-semibold bg-primary/10 text-primary border border-primary/20 shadow-2xs">Graduated</span>;
      default: 
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[11.5px] font-semibold bg-muted text-muted-foreground border border-border shadow-2xs">N/A</span>;
    }
  };

  const renderFinancialStatus = (status: string) => {
    const isCleared = status === 'cleared';
    return (
      <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${isCleared ? 'text-warning dark:text-warning' : 'text-destructive dark:text-destructive'}`}>
        {isCleared ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
        {isCleared ? 'Cleared' : 'Blocked'}
      </span>
    );
  };

  const isLoading = isReportCardsLoading || isFetching || isTermsLoading || isClassroomsLoading || isGradesLoading;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header Section */}
      <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between rounded-[24px] border border-border/70 bg-card p-6 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-primary/20 bg-primary/10 text-primary shadow-xs">
            <FileCheck size={22} strokeWidth={2} />
          </span>
          <div>
            <h1 className="text-[18px] font-extrabold tracking-tight text-foreground">Report Cards & Results</h1>
            <p className="mt-0.5 text-[12px] text-muted-foreground font-medium">Generate, publish, and manage annual student promotions seamlessly.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !semesterId}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[14px] border border-border/80 bg-background px-4 text-[12px] font-semibold text-foreground transition-all hover:bg-muted/60 disabled:opacity-50 shadow-2xs"
          >
            {generateMutation.isPending ? <Loader2 size={16} className="animate-spin text-primary" /> : <Settings size={16} className="text-muted-foreground" />}
            Generate Cards
          </button>

          <button
            onClick={() => setIsPromoteModalOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[14px] border border-border/80 bg-background px-4 text-[12px] font-semibold text-foreground transition-all hover:bg-muted/60 shadow-2xs"
          >
            <GraduationCap size={16} className="text-muted-foreground" />
            Annual Promotion
          </button>

          <div className="flex items-center overflow-hidden rounded-[14px] border border-primary/20 bg-primary/5 p-0.5 shadow-2xs">
            <button
              onClick={() => handlePublish(true)}
              disabled={publishMutation.isPending || !semesterId}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[12px] bg-primary px-4 text-[11.5px] font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50 shadow-xs"
            >
              {publishMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              Publish
            </button>
            <button
              onClick={() => handlePublish(false)}
              disabled={publishMutation.isPending || !semesterId}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[12px] px-3 text-[11.5px] font-semibold text-primary transition hover:bg-primary/15 disabled:opacity-50"
              title="Unpublish (Hide)"
            >
              <EyeOff size={15} />
            </button>
          </div>

          <button 
           onClick={() => setIsTopModalOpen(true)}
           className="inline-flex h-10 items-center justify-center gap-2 rounded-[14px] bg-primary px-5 text-[12px] font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
          >
           <Trophy size={16} />
            Top 10 Students
          </button>
        </div>
      </header>

      {/* Filters Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-[20px] border border-border/70 bg-card p-5 shadow-2xs">
        <label className="flex flex-col">
          <span className="text-[11.5px] font-bold text-muted-foreground mb-2 block">Semester</span>
          <select 
            value={semesterId} 
            onChange={(e) => setSemesterId(e.target.value)}
            disabled={isTermsLoading}
            className="block h-11 w-full rounded-[14px] border border-border/80 bg-background px-4 text-[13px] font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            {isTermsLoading ? (
              <option value="">Loading...</option>
            ) : terms?.length ? (
              terms.map((term: any) => (
                <option key={term.id} value={String(term.id)}>{term.semesterName}</option>
              ))
            ) : (
              <option value="">No Semesters</option>
            )}
          </select>
        </label>
        
        <label className="flex flex-col">
          <span className="text-[11.5px] font-bold text-muted-foreground mb-2 block">Grade (Optional)</span>
          <select 
            value={gradeId} 
            onChange={(e) => setGradeId(e.target.value)}
            disabled={isGradesLoading}
            className="block h-11 w-full rounded-[14px] border border-border/80 bg-background px-4 text-[13px] font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <option value="">All Grades</option>
            {grades?.map((grade: any) => (
              <option key={grade.id} value={String(grade.id)}>{grade.name}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          <span className="text-[11.5px] font-bold text-muted-foreground mb-2 block">Classroom (Optional)</span>
          <select 
            value={classRoomId} 
            onChange={(e) => setClassRoomId(e.target.value)}
            disabled={isClassroomsLoading || (gradeId !== "" && filteredClassrooms.length === 0)}
            className="block h-11 w-full rounded-[14px] border border-border/80 bg-background px-4 text-[13px] font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <option value="">All Classrooms</option>
            {filteredClassrooms?.map((room: any) => (
              <option key={room.id} value={String(room.id)}>
                {room.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      {/* Table Section */}
      <section className="overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40">
                <th className="px-6 py-4 text-[11.5px] font-extrabold text-muted-foreground uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-[11.5px] font-extrabold text-muted-foreground uppercase tracking-wider">Total Marks</th>
                <th className="px-6 py-4 text-[11.5px] font-extrabold text-muted-foreground uppercase tracking-wider">GPA</th>
                <th className="px-6 py-4 text-[11.5px] font-extrabold text-muted-foreground uppercase tracking-wider">Result</th>
                <th className="px-6 py-4 text-[11.5px] font-extrabold text-muted-foreground uppercase tracking-wider">Financial Status</th>
                <th className="px-6 py-4 text-[11.5px] font-extrabold text-muted-foreground uppercase tracking-wider">Publish Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading || generateMutation.isPending ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-[13px] text-muted-foreground font-medium">
                    <Loader2 className="mx-auto h-7 w-7 animate-spin mb-3 text-primary" />
                    {generateMutation.isPending ? "Generating report cards in background..." : "Loading report cards..."}
                  </td>
                </tr>
              ) : !Array.isArray(reportCards) || reportCards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-[13px] text-muted-foreground font-medium">
                    <FileCheck className="mx-auto h-9 w-9 mb-3 text-muted-foreground/40" />
                    No report cards available for the selected filters.
                  </td>
                </tr>
              ) : (
                reportCards.map((student: any) => (
                  <tr 
                    key={student.student_id} 
                    onClick={() => setSelectedStudentForModal(student)}
                    className="cursor-pointer transition-colors hover:bg-muted/30 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 shadow-2xs">
                          <CapIcon size={16} />
                        </span>
                        <div>
                          <div className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors">
                            {student.student_name}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-medium">
                            Active enrollment
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-[13px] font-semibold text-muted-foreground">
                      {student.summary?.total_marks ?? student.total_marks ?? '0.00'}
                    </td>
                    
                    <td className="px-6 py-4 text-[13px] font-bold text-foreground">
                      {typeof student.gpa === 'number' 
                        ? `${student.gpa.toFixed(1)}%` 
                        : student.summary?.total_marks && student.summary?.max_total_marks
                          ? `${((Number(student.summary.total_marks) / Number(student.summary.max_total_marks)) * 100).toFixed(1)}%`
                          : '0.0%'}
                    </td>
                    
                    <td className="px-6 py-4">
                      {renderAcademicResult(student.summary?.final_result ?? student.academic_result)}
                    </td>

                    <td className="px-6 py-4">
                      {renderFinancialStatus(student.financial_status ?? 'cleared')}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${
                        student.is_published ? 'text-success' : 'text-muted-foreground'
                      }`}>
                        {student.is_published ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {student.is_published ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/70 bg-card text-[12.5px] text-muted-foreground">
          <div className="font-medium">
            Showing <span className="font-bold text-foreground">{from}-{to}</span> of <span className="font-bold text-foreground">{total}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-background hover:bg-muted/60 disabled:opacity-40 transition-colors shadow-2xs"
            >
              <ChevronLeft size={16} />
            </button>

            {/* تم تعديل لون الصفحة النشطة لتتوافق مع الـ Primary بدلاً من الوردي */}
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/90 text-primary-foreground font-bold shadow-xs text-[12px]">
              {page}
            </span>

            <button
              onClick={() => setPage(p => (p < lastPage ? p + 1 : p))}
              disabled={page >= lastPage}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-background hover:bg-muted/60 disabled:opacity-40 transition-colors shadow-2xs"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {isPromoteModalOpen && (
        <PromoteStudentsDialog onClose={() => setIsPromoteModalOpen(false)} />
      )}

      <TopStudentsModal 
        reportCards={Array.isArray(reportCards) ? reportCards : []} 
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