import {
  Eye,
  Info,
  ShieldAlert,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/services/axios/axiosClient";

import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";

import type {
  AbsenceType,
  AttendanceStatus,
  StudentAttendance,
  PaginatedData,
} from "../types/attendance.types";

import { API_ENDPOINTS } from "@/services/api/endpoints";

type Props = {
  data: StudentAttendance[];
  isLoading?: boolean;
  onUpdate: (
    student: StudentAttendance,
    patch: {
      status: AttendanceStatus;
      absence_type: AbsenceType | null;
    }
  ) => void;
  pagination?: PaginatedData<StudentAttendance>;
  currentPage: number;
  onPageChange: (page: number) => void;
  gradeName: string;
  className: string;
};

const inlineControlClass =
  "h-9 rounded-[12px] border-border/60 bg-background/80 text-[12px] text-foreground shadow-none outline-none focus:ring-1 focus:ring-primary/30 transition-all";

export function AttendanceTable({
  data,
  isLoading = false,
  onUpdate,
  pagination,
  currentPage,
  onPageChange,
  gradeName,
  className,
}: Props) {
  const [selectedStudent, setSelectedStudent] =
    useState<StudentAttendance | null>(null);

  const totalPages = pagination?.per_page
    ? Math.ceil((pagination.total || 0) / pagination.per_page)
    : 1;

  // جلب بيانات الطالب الكاملة عند فتح الـ Modal فقط
  const {
    data: studentProfile,
    isLoading: isLoadingProfile,
  } = useQuery({
    queryKey: ["student-full-profile", selectedStudent?.enrollment_id],
    queryFn: async () => {
      const response = await axiosClient.get(
        API_ENDPOINTS.STUDENTS.FULL_PROFILE(
          selectedStudent!.enrollment_id
        )
      );

      return response.data?.data;
    },
    enabled: !!selectedStudent?.enrollment_id,
  });

  // تحديد الأسماء الحقيقية لعرضها
  const displayGrade =
    studentProfile?.enrollment?.grade?.name || gradeName;

  const displayClass =
    studentProfile?.enrollment?.classroom?.name || className;

  return (
    <>
      <div className="overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-6 py-4">
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
              Student attendance
            </h3>

            <p className="mt-0.5 text-[12px] font-medium text-muted-foreground">
              {isLoading
                ? "Loading records..."
                : `Showing ${data.length} of ${
                    pagination?.total || 0
                  } students`}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] table-fixed">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[25%]" />
              <col className="w-[20%]" />
              <col className="w-[15%]" />
            </colgroup>

            <thead className="bg-muted/40">
              <tr className="text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="h-12 px-6 text-start">
                  Student
                </th>

                <th className="h-12 px-6 text-start">
                  Attendance
                </th>

                <th className="h-12 px-6 text-start">
                  Absence Details
                </th>

                <th className="h-12 px-6 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-t border-border/50"
                    >
                      <td
                        colSpan={4}
                        className="px-6 py-4"
                      >
                        <div className="h-10 animate-pulse rounded-[12px] bg-muted/50" />
                      </td>
                    </tr>
                  ))
                : data.map((student) => {
                    const isRecordExists =
                      !!student.attendance?.id;

                    const currentStatus: AttendanceStatus =
                      student.attendance?.status ||
                      (isRecordExists
                        ? "absent"
                        : "present");

                    const currentAbsenceType =
                      student.attendance?.absence_type ??
                      "excused";

                    return (
                      <tr
                        key={student.enrollment_id}
                        className="group border-t border-border/50 text-[13px] transition-colors hover:bg-muted/30"
                      >
                        {/* Student */}
                        <td
                          className="cursor-pointer px-6 py-4"
                          onClick={() =>
                            setSelectedStudent(student)
                          }
                        >
                          <div className="flex items-center gap-3">
                            {student.photo_url ? (
                              <img
                                src={student.photo_url}
                                alt={student.full_name}
                                className="h-10 w-10 rounded-[14px] object-cover shadow-sm"
                              />
                            ) : (
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-primary/25 bg-primary/10 text-[13.5px] font-semibold text-primary">
                                {student.full_name.charAt(0)}
                              </span>
                            )}

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
                                {student.full_name}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Attendance */}
                        <td className="px-6 py-4">
                          <Select
                            value={currentStatus}
                            onValueChange={(value) =>
                              onUpdate(student, {
                                status:
                                  value as AttendanceStatus,
                                absence_type:
                                  value === "present"
                                    ? null
                                    : currentAbsenceType,
                              })
                            }
                          >
                            <SelectTrigger
                              className={`${inlineControlClass} ${
                                currentStatus === "present"
                                  ? "font-semibold text-success"
                                  : "font-semibold text-destructive"
                              }`}
                            >
                              <SelectValue placeholder="Mark attendance" />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem
                                value="present"
                                className="font-medium text-success focus:text-success"
                              >
                                Present
                              </SelectItem>

                              <SelectItem
                                value="absent"
                                className="font-medium text-destructive focus:text-destructive"
                              >
                                Absent
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </td>

                        {/* Absence Details */}
                        <td className="px-6 py-4">
                          {currentStatus === "absent" ? (
                            <Select
                              value={currentAbsenceType}
                              onValueChange={(value) =>
                                onUpdate(student, {
                                  status:
                                    currentStatus as AttendanceStatus,
                                  absence_type:
                                    value as AbsenceType,
                                })
                              }
                            >
                              <SelectTrigger
                                className={`${inlineControlClass} font-medium ${
                                  currentAbsenceType === "excused"
                                    ? "text-info"
                                    : "text-warning"
                                }`}
                              >
                                <SelectValue placeholder="Absence type" />
                              </SelectTrigger>

                              <SelectContent>
                                <SelectItem
                                  value="excused"
                                  className="font-medium text-info focus:text-info"
                                >
                                  Excused
                                </SelectItem>

                                <SelectItem
                                  value="unexcused"
                                  className="font-medium text-warning focus:text-warning"
                                >
                                  Unexcused
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="font-medium text-muted-foreground">
                              —
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                setSelectedStudent(student)
                              }
                              className="h-9 w-9 rounded-[12px] border-border/60 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                              title="Quick Summary"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Button
                              asChild
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 rounded-[12px] border-border/60 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                              title="View Full History"
                            >
                              <Link
                                to={`/attendance/students/${student.enrollment_id}`}
                              >
                                <Clock className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

              {!isLoading && data.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-16 text-center text-[13.5px] font-medium text-muted-foreground"
                  >
                    No records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages >= 1 && (
          <div className="flex items-center justify-between border-t border-border/60 px-6 py-4">
            <p className="text-[12px] font-medium text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onPageChange(currentPage - 1)
                }
                disabled={
                  currentPage <= 1 || isLoading
                }
                className="h-8 rounded-[10px] text-[12px]"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Prev
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onPageChange(currentPage + 1)
                }
                disabled={
                  currentPage >= totalPages || isLoading
                }
                className="h-8 rounded-[10px] text-[12px]"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      <Dialog
        open={!!selectedStudent}
        onOpenChange={(open) =>
          !open && setSelectedStudent(null)
        }
      >
        <DialogContent className="rounded-[24px] border-border bg-card text-card-foreground sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold text-foreground">
              Student Details
            </DialogTitle>

            <DialogDescription className="text-[13px] text-muted-foreground">
              Current absence summary and remaining balances.
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="mt-4 flex flex-col gap-5">
              {/* Student Profile */}
              <div className="flex flex-col gap-3 rounded-[18px] border border-border/50 bg-muted/20 p-4">
                <div className="flex items-center gap-4">
                  {selectedStudent.photo_url ? (
                    <img
                      src={selectedStudent.photo_url}
                      alt={selectedStudent.full_name}
                      className="h-14 w-14 rounded-[16px] object-cover shadow-sm"
                    />
                  ) : (
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border border-primary/25 bg-primary/10 text-[18px] font-semibold text-primary">
                      {selectedStudent.full_name.charAt(0)}
                    </span>
                  )}

                  <div>
                    <h4 className="text-[15px] font-semibold text-foreground">
                      {selectedStudent.full_name}
                    </h4>

                   
                  </div>
                </div>

                {/* Grade / Class */}
                <div className="mt-2 flex items-center gap-2 rounded-[12px] border border-border/40 bg-background/60 p-2.5">
                  <GraduationCap className="h-4 w-4 text-primary" />

                  <span className="text-[12px] font-semibold text-foreground">
                    {isLoadingProfile ? (
                      <span className="animate-pulse rounded bg-muted text-transparent">
                        Loading
                      </span>
                    ) : (
                      displayGrade
                    )}
                  </span>

                  <span className="mx-1 text-[10px] text-muted-foreground">
                    /
                  </span>

                  <span className="text-[12px] font-semibold text-muted-foreground">
                    {isLoadingProfile ? (
                      <span className="animate-pulse rounded bg-muted text-transparent">
                        Loading
                      </span>
                    ) : (
                      displayClass
                    )}
                  </span>
                </div>
              </div>

              {/* Absence Summary */}
              <div className="grid grid-cols-3 gap-3">
                {/* Allowed */}
                <div className="flex flex-col items-center justify-center rounded-[16px] border border-success/20 bg-success/[0.08] p-3 text-center">
                  <CheckCircle2 className="mb-1.5 h-5 w-5 text-success" />

                  <span className="text-[20px] font-semibold leading-none text-success">
                    {selectedStudent.allowed_absence_days}
                  </span>

                  <span className="mt-1 text-[10.5px] font-semibold text-success">
                    Allowed
                  </span>
                </div>

                {/* Unexcused */}
                <div className="flex flex-col items-center justify-center rounded-[16px] border border-destructive/20 bg-destructive/[0.08] p-3 text-center">
                  <ShieldAlert className="mb-1.5 h-5 w-5 text-destructive" />

                  <span className="text-[20px] font-semibold leading-none text-destructive">
                    {selectedStudent.total_unexcused_absent}
                  </span>

                  <span className="mt-1 text-[10.5px] font-semibold text-destructive">
                    Unexcused
                  </span>
                </div>

                {/* Remaining */}
                <div className="flex flex-col items-center justify-center rounded-[16px] border border-primary/20 bg-primary/[0.08] p-3 text-center">
                  <Info className="mb-1.5 h-5 w-5 text-primary" />

                  <span className="text-[20px] font-semibold leading-none text-primary">
                    {selectedStudent.remaining_absence_days}
                  </span>

                  <span className="mt-1 text-[10.5px] font-semibold text-primary">
                    Remaining
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}