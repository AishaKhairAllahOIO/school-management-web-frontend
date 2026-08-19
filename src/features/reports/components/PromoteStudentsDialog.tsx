import { useState, useEffect } from "react";
import { GraduationCap, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { usePromoteStudents } from "../hooks/useReportCards";
import { useAcademicYears } from "../../settings/academic/hooks/useAcademicSettings.ts";

export function PromoteStudentsDialog({ onClose }: { onClose: () => void }) {
  const { data: academicYears = [], isLoading } = useAcademicYears();
  
  const [fromYear, setFromYear] = useState(""); 
  const [toYear, setToYear] = useState("");

  const promoteMutation = usePromoteStudents();

  useEffect(() => {
    if (academicYears.length > 0) {
      const currentYear = academicYears.find((y: any) => y.isCurrent) || academicYears[0];
      setFromYear(currentYear.id);
      
      const nextYear = academicYears.find((y: any) => Number(y.id) > Number(currentYear.id)) || academicYears[1];
      if (nextYear) setToYear(nextYear.id);
    }
  }, [academicYears]);

  const handlePromote = () => {
    if (!fromYear || !toYear || fromYear === toYear) return;
    promoteMutation.mutate(
      { from_academic_year_id: fromYear, to_academic_year_id: toYear },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" dir="ltr">
      <div className="w-full max-w-[500px] overflow-hidden rounded-[24px] border border-border/60 bg-card text-card-foreground shadow-[0_28px_80px_rgba(0,0,0,0.22)] animate-in zoom-in-95 fade-in duration-200 text-left">
        
        <header className="border-b border-border/45 px-6 py-5 bg-warning/10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-warning/20 text-warning border border-warning/30">
              <GraduationCap size={20} strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-[16px] font-bold text-foreground">Annual Student Promotion</h2>
              <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                Passed students will be moved to the new academic year, and final grade students will graduate.
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-5 p-6">
          <div className="flex items-start gap-3 rounded-[12px] border border-warning/20 bg-warning/10 p-3 text-warning">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <p className="text-[11.5px] leading-relaxed font-semibold">
              This action cannot be undone. Please ensure all marks are entered and final report cards are generated for all students before initiating the promotion process.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative">
            <label className="flex-1 w-full block">
              <span className="text-[11px] font-bold text-foreground">From Academic Year (Current)</span>
              <select 
                value={fromYear} 
                onChange={(e) => setFromYear(e.target.value)}
                disabled={isLoading}
                className="mt-2 block h-11 w-full rounded-[12px] border border-border/65 bg-background px-3 text-[12.5px] font-medium text-foreground outline-none focus:border-warning/50 disabled:opacity-50"
              >
                {isLoading ? <option value="">Loading...</option> : academicYears.map((year: any) => (
                  <option key={year.id} value={year.id}>{year.name} {year.isCurrent ? "(Current)" : ""}</option>
                ))}
              </select>
            </label>

            <ArrowRight className="mt-6 text-muted-foreground opacity-50 shrink-0 hidden sm:block" size={16} />

            <label className="flex-1 w-full block">
              <span className="text-[11px] font-bold text-foreground">To Academic Year (New)</span>
              <select 
                value={toYear} 
                onChange={(e) => setToYear(e.target.value)}
                disabled={isLoading}
                className="mt-2 block h-11 w-full rounded-[12px] border border-border/65 bg-background px-3 text-[12.5px] font-medium text-foreground outline-none focus:border-warning/50 disabled:opacity-50"
              >
                <option value="" disabled>Select next year</option>
                {academicYears.map((year: any) => (
                  <option key={year.id} value={year.id}>{year.name}</option>
                ))}
              </select>
            </label>
          </div>

          {fromYear && toYear && fromYear === toYear && (
             <p className="text-[11.5px] text-destructive text-center font-bold">
               Please select a different academic year. You cannot promote to the same year.
             </p>
          )}
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-border/45 px-6 py-4 bg-muted/20">
          <button
            onClick={onClose}
            disabled={promoteMutation.isPending}
            className="h-10 rounded-[12px] px-5 text-[12.5px] font-semibold text-muted-foreground transition border border-transparent hover:border-border/60 hover:bg-background"
          >
            Cancel
          </button>
          <button
            onClick={handlePromote}
            disabled={promoteMutation.isPending || isLoading || fromYear === toYear || !toYear}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[12px] bg-warning hover:bg-warning/90 px-6 text-[12.5px] font-bold text-white shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {promoteMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <GraduationCap size={16} />}
            Confirm Promotion
          </button>
        </footer>
      </div>
    </div>
  );
}