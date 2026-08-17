import { useState } from "react";
import { GraduationCap, Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { usePromoteStudents } from "../hooks/useReportCards";

export function PromoteStudentsDialog({ onClose }: { onClose: () => void }) {
  const [fromYear, setFromYear] = useState("1"); // يفضل ربطها بـ API الأعوام لاحقاً
  const [toYear, setToYear] = useState("2");
  const promoteMutation = usePromoteStudents();

  const handlePromote = () => {
    promoteMutation.mutate(
      { from_academic_year_id: fromYear, to_academic_year_id: toYear },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-foreground/25 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[500px] overflow-hidden rounded-[24px] border border-border/60 bg-card shadow-[0_28px_80px_rgba(20,15,55,0.22)]">
        <header className="border-b border-border/45 px-6 py-5 bg-warning/[0.03]">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-warning/15 text-warning">
              <GraduationCap size={20} strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-[16px] font-semibold text-foreground">الترفيع السنوي للطلاب</h2>
              <p className="mt-1 text-[11px] text-muted-foreground">
                سيتم ترحيل الطلاب الناجحين للعام الجديد وتخريج طلاب المراحل المنتهية.
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-5 p-6">
          <div className="flex items-center gap-3 rounded-[12px] border border-warning/20 bg-warning/5 p-3 text-warning">
            <AlertTriangle size={16} className="shrink-0" />
            <p className="text-[11px] leading-relaxed font-medium">
              هذه العملية لا يمكن التراجع عنها بسهولة. تأكد من إكمال جميع إدخالات العلامات وتوليد الجلاءات النهائية قبل الترفيع.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="flex-1 block">
              <span className="text-[11px] font-medium text-foreground">من العام الدراسي (الحالي)</span>
              <select 
                value={fromYear} 
                onChange={(e) => setFromYear(e.target.value)}
                className="mt-2 block h-10 w-full rounded-[12px] border border-border/65 bg-background px-3 text-[12px] outline-none focus:border-warning/50"
              >
                <option value="1">2025-2026</option>
              </select>
            </label>

            <ArrowLeft className="mt-6 text-muted-foreground opacity-50 shrink-0" size={16} />

            <label className="flex-1 block">
              <span className="text-[11px] font-medium text-foreground">إلى العام الدراسي (الجديد)</span>
              <select 
                value={toYear} 
                onChange={(e) => setToYear(e.target.value)}
                className="mt-2 block h-10 w-full rounded-[12px] border border-border/65 bg-background px-3 text-[12px] outline-none focus:border-warning/50"
              >
                <option value="2">2026-2027</option>
              </select>
            </label>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-border/45 px-6 py-4">
          <button
            onClick={onClose}
            disabled={promoteMutation.isPending}
            className="h-9 rounded-[10px] px-4 text-[12px] font-medium text-muted-foreground transition hover:bg-muted/50"
          >
            إلغاء
          </button>
          <button
            onClick={handlePromote}
            disabled={promoteMutation.isPending}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-[10px] bg-warning px-5 text-[12px] font-semibold text-warning-foreground shadow-sm transition hover:bg-warning/90 disabled:opacity-50"
          >
            {promoteMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <GraduationCap size={16} />}
            تأكيد الترفيع
          </button>
        </footer>
      </div>
    </div>
  );
}