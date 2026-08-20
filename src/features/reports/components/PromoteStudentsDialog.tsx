import { useState, useEffect } from "react";
import {
  GraduationCap,
  Loader2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import { usePromoteStudents } from "../hooks/useReportCards";
import { useAcademicYears } from "../../settings/academic/hooks/useAcademicSettings.ts";

export function PromoteStudentsDialog({ onClose }: { onClose: () => void }) {
  const { data: academicYears = [], isLoading } = useAcademicYears();

  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");

  const promoteMutation = usePromoteStudents();

  useEffect(() => {
    if (academicYears.length > 0) {
      const currentYear =
        academicYears.find((y: any) => y.isCurrent) || academicYears[0];

      setFromYear(String(currentYear.id));

      const nextYear =
        academicYears.find(
          (y: any) => Number(y.id) > Number(currentYear.id),
        ) || academicYears[1];

      if (nextYear) {
        setToYear(String(nextYear.id));
      }
    }
  }, [academicYears]);

  const handlePromote = () => {
    if (!fromYear || !toYear || fromYear === toYear) return;

    promoteMutation.mutate(
      {
        from_academic_year_id: fromYear,
        to_academic_year_id: toYear,
      },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      dir="ltr"
    >
      <div className="w-full max-w-[500px] overflow-hidden rounded-[24px] border border-border/60 bg-card text-card-foreground shadow-[0_28px_80px_rgba(0,0,0,0.22)] animate-in zoom-in-95 fade-in duration-200 text-left">
        {/* Header */}
        <header className="border-b border-border/45 bg-warning/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-warning/30 bg-warning/20 text-warning">
              <GraduationCap size={20} strokeWidth={2} />
            </span>

            <div>
              <h2 className="text-[16px] font-semibold text-foreground">
                Annual Student Promotion
              </h2>

              <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                Passed students will be moved to the new academic year, and
                final grade students will graduate.
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="space-y-5 p-6">
          {/* Warning */}
          <div className="flex items-start gap-3 rounded-[12px] border border-warning/20 bg-warning/10 p-3 text-warning">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />

            <p className="text-[11.5px] font-semibold leading-relaxed">
              This action cannot be undone. Please ensure all marks are
              entered and final report cards are generated for all students
              before initiating the promotion process.
            </p>
          </div>

          {/* Academic Years */}
          <div className="relative flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* From Year */}
            <label className="block w-full flex-1">
              <span className="text-[11px] font-semibold text-foreground">
                From Academic Year (Current)
              </span>

              <Select
                value={fromYear}
                onValueChange={setFromYear}
                disabled={isLoading}
              >
                <SelectTrigger className="mt-2 h-11 rounded-[12px] px-3 text-[12.5px]">
                  <SelectValue
                    placeholder={
                      isLoading
                        ? "Loading..."
                        : "Select current academic year"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {academicYears.map((year: any) => (
                    <SelectItem
                      key={year.id}
                      value={String(year.id)}
                    >
                      {year.name}
                      {year.isCurrent ? " (Current)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            {/* Arrow */}
            <ArrowRight
              className="mt-6 hidden shrink-0 text-muted-foreground opacity-50 sm:block"
              size={16}
            />

            {/* To Year */}
            <label className="block w-full flex-1">
              <span className="text-[11px] font-semibold text-foreground">
                To Academic Year (New)
              </span>

              <Select
                value={toYear}
                onValueChange={setToYear}
                disabled={isLoading}
              >
                <SelectTrigger className="mt-2 h-11 rounded-[12px] px-3 text-[12.5px]">
                  <SelectValue placeholder="Select next year" />
                </SelectTrigger>

                <SelectContent>
                  {academicYears.map((year: any) => (
                    <SelectItem
                      key={year.id}
                      value={String(year.id)}
                    >
                      {year.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          {/* Same Year Validation */}
          {fromYear && toYear && fromYear === toYear && (
            <p className="text-center text-[11.5px] font-semibold text-destructive">
              Please select a different academic year. You cannot promote to
              the same year.
            </p>
          )}
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-end gap-3 border-t border-border/45 bg-muted/20 px-6 py-4">
          <button
            onClick={onClose}
            disabled={promoteMutation.isPending}
            className="h-10 rounded-[12px] border border-transparent px-5 text-[12.5px] font-semibold text-muted-foreground transition hover:border-border/60 hover:bg-background"
          >
            Cancel
          </button>

          <button
            onClick={handlePromote}
            disabled={
              promoteMutation.isPending ||
              isLoading ||
              fromYear === toYear ||
              !toYear
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[12px] bg-warning px-6 text-[12.5px] font-semibold text-white shadow-sm transition hover:bg-warning/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {promoteMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <GraduationCap size={16} />
            )}

            Confirm Promotion
          </button>
        </footer>
      </div>
    </div>
  );
}