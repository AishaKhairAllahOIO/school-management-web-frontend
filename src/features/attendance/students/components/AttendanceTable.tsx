import { Eye, Info, ShieldAlert, CheckCircle2, ChevronLeft, ChevronRight, GraduationCap, Clock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import type { AbsenceType, AttendanceStatus, StudentAttendance, PaginatedData } from "../types/attendance.types";

type Props = {
  data: StudentAttendance[];
  isLoading?: boolean;
  onUpdate: (student: StudentAttendance, patch: { status: AttendanceStatus; absence_type: AbsenceType | null; }) => void;
  pagination?: PaginatedData<StudentAttendance>;
  currentPage: number;
  onPageChange: (page: number) => void;
  gradeName: string;
  className: string;
};

const inlineControlClass = "h-9 rounded-[12px] border-border/60 bg-background/80 text-[12px] shadow-none outline-none focus:ring-1 focus:ring-violet-500/30 transition-all";

export function AttendanceTable({ data, isLoading = false, onUpdate, pagination, currentPage, onPageChange, gradeName, className }: Props) {
  const [selectedStudent, setSelectedStudent] = useState<StudentAttendance | null>(null);
  const totalPages = pagination?.per_page ? Math.ceil((pagination.total || 0) / pagination.per_page) : 1;

  return (
    <>
      <div className="overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-6 py-4">
          <div>
            <h3 className="text-[15px] font-bold tracking-tight text-foreground">Student attendance</h3>
            <p className="mt-0.5 text-[12px] font-medium text-muted-foreground">
              {isLoading ? "Loading records..." : `Showing ${data.length} of ${pagination?.total || 0} students`}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] table-fixed">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[25%]" />
              <col className="w-[20%]" />
              <col className="w-[15%]" />
            </colgroup>
            <thead className="bg-muted/40">
              <tr className="text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <th className="h-12 px-6 text-start">Student</th>
                <th className="h-12 px-6 text-start">Attendance</th>
                <th className="h-12 px-6 text-start">Absence Details</th>
                <th className="h-12 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-border/50"><td colSpan={4} className="px-6 py-4"><div className="h-10 animate-pulse rounded-[12px] bg-muted/50" /></td></tr>
                  ))
                : data.map((student) => {
                    const isRecordExists = !!student.attendance?.id;
                    const currentStatus: AttendanceStatus = student.attendance?.status || (isRecordExists ? "absent" : "present");
                    const currentAbsenceType = student.attendance?.absence_type ?? "excused";

                    return (
                      <tr key={student.enrollment_id} className="border-t border-border/50 text-[13px] transition-colors hover:bg-muted/30 group">
                        <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedStudent(student)}>
                          <div className="flex items-center gap-3">
                            {student.photo_url ? (
                              <img src={student.photo_url} alt={student.full_name} className="h-10 w-10 rounded-[14px] object-cover shadow-sm" />
                            ) : (
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-violet-600/10 text-[13.5px] font-bold text-violet-700 border border-violet-600/20">{student.full_name.charAt(0)}</span>
                            )}
                            <div className="min-w-0">
                              <p className="truncate font-bold text-slate-800 dark:text-slate-200 group-hover:text-violet-600 transition-colors">{student.full_name}</p>
                              {/* 🌟 تم إزالة الـ ID من هنا بناءً على طلبك 🌟 */}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Select value={currentStatus} onValueChange={(value) => onUpdate(student, { status: value as AttendanceStatus, absence_type: value === "present" ? null : currentAbsenceType })}>
                            <SelectTrigger className={`${inlineControlClass} ${currentStatus === 'present' ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}`}>
                              <SelectValue placeholder="Mark attendance" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="present" className="font-medium text-emerald-600 focus:text-emerald-700">Present</SelectItem>
                              <SelectItem value="absent" className="font-medium text-rose-600 focus:text-rose-700">Absent</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-6 py-4">
                          {currentStatus === "absent" ? (
                            <Select value={currentAbsenceType} onValueChange={(value) => onUpdate(student, { status: currentStatus as AttendanceStatus, absence_type: value as AbsenceType })}>
                              <SelectTrigger className={`${inlineControlClass} font-medium ${currentAbsenceType === 'excused' ? 'text-sky-600' : 'text-amber-600'}`}>
                                <SelectValue placeholder="Absence type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="excused" className="font-medium text-sky-600 focus:text-sky-700">Excused</SelectItem>
                                <SelectItem value="unexcused" className="font-medium text-amber-600 focus:text-amber-700">Unexcused</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : <span className="text-muted-foreground font-medium">—</span>}
                        </td>
                        <td className="px-6 py-4">
                          {/* 🌟 إضافة زرين: الأول للتفاصيل (المودال) والثاني لصفحة الـ History 🌟 */}
                          <div className="flex items-center justify-center gap-1.5">
                            <Button type="button" variant="outline" size="icon" onClick={() => setSelectedStudent(student)} className="h-9 w-9 rounded-[12px] border-violet-200 text-violet-600 hover:bg-violet-50 transition-colors" title="Quick Summary">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-[12px] border-slate-200 text-slate-500 hover:text-foreground hover:bg-slate-100 transition-colors" title="View Full History">
                              <Link to={`/attendance/students/${student.enrollment_id}`}>
                                <Clock className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              {!isLoading && data.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-16 text-center text-[13.5px] font-medium text-muted-foreground">No records match the selected filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages >= 1 && (
          <div className="flex items-center justify-between border-t border-border/60 px-6 py-4">
            <p className="text-[12px] font-medium text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1 || isLoading} className="h-8 rounded-[10px] text-[12px]">
                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
              </Button>
              <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages || isLoading} className="h-8 rounded-[10px] text-[12px]">
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-[24px]">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold">Student Details</DialogTitle>
            <DialogDescription className="text-[13px]">Current absence summary and remaining balances.</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="mt-4 flex flex-col gap-5">
              <div className="flex flex-col gap-3 rounded-[18px] border border-border/50 bg-muted/20 p-4">
                <div className="flex items-center gap-4">
                  {selectedStudent.photo_url ? (
                    <img src={selectedStudent.photo_url} alt={selectedStudent.full_name} className="h-14 w-14 rounded-[16px] object-cover shadow-sm" />
                  ) : (
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] bg-violet-600/10 text-[18px] font-bold text-violet-700 border border-violet-600/20">{selectedStudent.full_name.charAt(0)}</span>
                  )}
                  <div>
                    <h4 className="font-bold text-foreground text-[15px]">{selectedStudent.full_name}</h4>
                    {/* يمكنك إخفاء الـ ID من هنا أيضاً إذا رغبت، أو تركه لأنه داخل التفاصيل */}
                    <p className="text-[12px] text-muted-foreground font-medium mt-0.5">Enrollment ID: {selectedStudent.enrollment_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 bg-background/60 rounded-[12px] p-2.5 border border-border/40">
                  <GraduationCap className="h-4 w-4 text-violet-600" />
                  <span className="text-[12px] font-semibold text-foreground">{gradeName}</span>
                  <span className="text-muted-foreground mx-1 text-[10px]">/</span>
                  <span className="text-[12px] font-semibold text-muted-foreground">{className}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center justify-center rounded-[16px] border border-success/15 bg-success/[0.08] p-3 text-center">
                  <CheckCircle2 className="h-5 w-5 text-success mb-1.5" />
                  <span className="text-[20px] font-bold text-success leading-none">{selectedStudent.allowed_absence_days}</span>
                  <span className="text-[10.5px] font-semibold text-success mt-1">Allowed</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-[16px] border border-destructive/15 bg-destructive/[0.08] p-3 text-center">
                  <ShieldAlert className="h-5 w-5 text-destructive mb-1.5" />
                  <span className="text-[20px] font-bold text-destructive leading-none">{selectedStudent.total_unexcused_absent}</span>
                  <span className="text-[10.5px] font-semibold text-destructive mt-1">Unexcused</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-[16px] border border-violet-200 bg-violet-50 p-3 text-center">
                  <Info className="h-5 w-5 text-violet-600 mb-1.5" />
                  <span className="text-[20px] font-bold text-violet-700 leading-none">{selectedStudent.remaining_absence_days}</span>
                  <span className="text-[10.5px] font-semibold text-violet-700 mt-1">Remaining</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}