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
  EyeOff
} from "lucide-react";

import { 
  useReportCards, 
  useGenerateReportCards, 
  useTogglePublishReportCards,
  reportCardKeys 
} from "../hooks/useReportCards";
import { PromoteStudentsDialog } from "../components/PromoteStudentsDialog";
import { StudentReportCardModal } from "../components/StudentReportCardModal";

// استيراد هوكات الإعدادات (الفصول، الصفوف، والشعب)
import { useAcademicTerms } from "../../settings/academic/hooks/useAcademicSettings.ts"; 
import { useGrades } from "../../academics/grades/hooks/useGrades.ts"; 
import { useClassrooms } from "../../academics/classrooms/hooks/useClassrooms.ts"; 

export function ReportCardsPage() {
  const queryClient = useQueryClient();

  const [semesterId, setSemesterId] = useState<string>("");
  const [gradeId, setGradeId] = useState<string>(""); // فلتر الصف
  const [classRoomId, setClassRoomId] = useState<string>("");
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  
  // تمرير كامل كائن الطالب للمودال مباشرة
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<any | null>(null);

  const { data: terms, isLoading: isTermsLoading } = useAcademicTerms();
  const { data: grades, isLoading: isGradesLoading } = useGrades();
  const { data: classrooms, isLoading: isClassroomsLoading } = useClassrooms();

  // تعيين الفصل الافتراضي
  useEffect(() => {
    if (terms && terms.length > 0 && !semesterId) {
      setSemesterId(String(terms[0].id));
    }
  }, [terms, semesterId]);

  // تصفير الشعبة تلقائياً عند تغيير الصف المختار
  useEffect(() => {
    setClassRoomId("");
  }, [gradeId]);

  // فلترة الشعب لتتبع الصف المختار فقط (لمنع تكرار الشعب)
  const filteredClassrooms = useMemo(() => {
    if (!classrooms) return [];
    if (!gradeId) return classrooms;
    return classrooms.filter((room: any) => String(room.gradeId) === String(gradeId));
  }, [classrooms, gradeId]);

  const effectiveClassRoomId = classRoomId === "" ? undefined : classRoomId;

  // جلب الجلاءات
  const { data: reportCards, isLoading: isReportCardsLoading, isFetching } = useReportCards(
    semesterId, 
    effectiveClassRoomId
  );

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
      { semester_id: semesterId, class_room_id: effectiveClassRoomId, is_published: isPublished },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: reportCardKeys.all });
        }
      }
    );
  };

  const renderAcademicResult = (result: string) => {
    switch (result) {
      case 'passed': return <span className="bg-success/10 text-success rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold">Passed</span>;
      case 'failed': return <span className="bg-destructive/10 text-destructive rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold">Failed</span>;
      case 'graduated': return <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold">Graduated</span>;
      default: return <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-[10.5px] font-medium">N/A</span>;
    }
  };

  const renderFinancialStatus = (status: string) => {
    const isCleared = status === 'cleared';
    return (
      <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${isCleared ? 'text-success' : 'text-warning'}`}>
        {isCleared ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
        {isCleared ? 'Cleared' : 'Blocked'}
      </span>
    );
  };

  const isLoading = isReportCardsLoading || isFetching || isTermsLoading || isClassroomsLoading || isGradesLoading;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[22px] border border-border/60 bg-card p-5 shadow-[0_8px_28px_rgba(30,20,70,0.035)]">
        <div className="flex items-center gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-primary/10 bg-primary/[0.07] text-primary">
            <FileCheck size={20} strokeWidth={1.8} />
          </span>
          <div>
            <h1 className="text-[17px] font-semibold tracking-[-0.015em] text-foreground">Report Cards & Results</h1>
            <p className="mt-1 text-[11.5px] text-muted-foreground">Generate, publish, and manage annual student promotions.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !semesterId}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-[12px] border border-border/65 bg-background px-4 text-[11.5px] font-semibold text-foreground transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            {generateMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Settings size={15} />}
            Generate Cards
          </button>

          <div className="flex items-center overflow-hidden rounded-[12px] border border-primary/20 bg-primary/5 p-0.5">
            <button
              onClick={() => handlePublish(true)}
              disabled={publishMutation.isPending || !semesterId}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-[10px] bg-primary px-4 text-[11px] font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
            >
              {publishMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Publish
            </button>
            <button
              onClick={() => handlePublish(false)}
              disabled={publishMutation.isPending || !semesterId}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-[10px] px-3 text-[11px] font-semibold text-primary transition hover:bg-primary/15 disabled:opacity-50"
              title="Unpublish (Hide)"
            >
              <EyeOff size={14} />
            </button>
          </div>

          <button
            onClick={() => setIsPromoteModalOpen(true)}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-[12px] bg-warning/10 px-4 text-[11.5px] font-semibold text-warning transition hover:bg-warning/20"
          >
            <GraduationCap size={15} />
            Annual Promotion
          </button>
        </div>
      </header>

      {/* Filters */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-[16px] border border-border/50 bg-card p-4 shadow-sm">
        <label className="flex flex-col">
          <span className="text-[11px] font-medium text-muted-foreground mb-1.5 block">Semester</span>
          <select 
            value={semesterId} 
            onChange={(e) => setSemesterId(e.target.value)}
            disabled={isTermsLoading}
            className="block h-9 w-full rounded-[10px] border border-border/65 bg-background/50 px-3 text-[12px] font-medium outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/5 disabled:opacity-50"
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
          <span className="text-[11px] font-medium text-muted-foreground mb-1.5 block">Grade (Optional)</span>
          <select 
            value={gradeId} 
            onChange={(e) => setGradeId(e.target.value)}
            disabled={isGradesLoading}
            className="block h-9 w-full rounded-[10px] border border-border/65 bg-background/50 px-3 text-[12px] font-medium outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/5 disabled:opacity-50"
          >
            <option value="">All Grades</option>
            {grades?.map((grade: any) => (
              <option key={grade.id} value={String(grade.id)}>{grade.name}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          <span className="text-[11px] font-medium text-muted-foreground mb-1.5 block">Classroom (Optional)</span>
          <select 
            value={classRoomId} 
            onChange={(e) => setClassRoomId(e.target.value)}
            disabled={isClassroomsLoading || (gradeId === "" && filteredClassrooms.length === 0)}
            className="block h-9 w-full rounded-[10px] border border-border/65 bg-background/50 px-3 text-[12px] font-medium outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/5 disabled:opacity-50"
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

      <section className="overflow-hidden rounded-[22px] border border-border/60 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.035)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-start">
            <thead>
              <tr className="border-b border-border/45 bg-muted/20">
                <th className="px-5 py-3.5 text-start text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider">Student Name</th>
                <th className="px-5 py-3.5 text-start text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider">Total Marks</th>
                <th className="px-5 py-3.5 text-start text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider">GPA</th>
                <th className="px-5 py-3.5 text-start text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider">Result</th>
                <th className="px-5 py-3.5 text-start text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider">Financial Status</th>
                <th className="px-5 py-3.5 text-start text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider">Publish Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading || generateMutation.isPending ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[13px] text-muted-foreground">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin mb-3 text-primary/60" />
                    {generateMutation.isPending ? "Generating..." : "Loading data..."}
                  </td>
                </tr>
              ) : !Array.isArray(reportCards) || reportCards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[13px] text-muted-foreground">
                    <FileCheck className="mx-auto h-8 w-8 mb-3 text-muted-foreground/50" />
                    No report cards available for the selected filters.
                  </td>
                </tr>
              ) : (
                reportCards.map((student: any) => (
                  <tr 
                    key={student.student_id} 
                    onClick={() => setSelectedStudentForModal(student)}
                    className="cursor-pointer transition-colors hover:bg-muted/15"
                  >
                    <td className="px-5 py-3.5 text-[12px] font-bold text-primary">{student.student_name}</td>
                    
                    <td className="px-5 py-3.5 text-[12px] text-muted-foreground">
                      {student.summary?.total_marks ?? student.total_marks ?? '0.00'}
                    </td>
                    
                    <td className="px-5 py-3.5 text-[12px] font-bold text-foreground">
                      {typeof student.gpa === 'number' 
                        ? `${student.gpa.toFixed(1)}%` 
                        : student.summary?.total_marks && student.summary?.max_total_marks
                          ? `${((Number(student.summary.total_marks) / Number(student.summary.max_total_marks)) * 100).toFixed(1)}%`
                          : '0.0%'}
                    </td>
                    
                    <td className="px-5 py-3.5">
                      {renderAcademicResult(student.summary?.final_result ?? student.academic_result)}
                    </td>

                    <td className="px-5 py-3.5">
                      {renderFinancialStatus(student.financial_status ?? 'cleared')}
                    </td>

                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                        student.is_published ? 'text-primary' : 'text-muted-foreground'
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
      </section>

      {isPromoteModalOpen && (
        <PromoteStudentsDialog onClose={() => setIsPromoteModalOpen(false)} />
      )}

      {/* المودال يتلقى بيانات الطالب مباشرة بدون أي API إضافي */}
      <StudentReportCardModal 
        student={selectedStudentForModal}
        isOpen={!!selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
      />
    </div>
  );
}