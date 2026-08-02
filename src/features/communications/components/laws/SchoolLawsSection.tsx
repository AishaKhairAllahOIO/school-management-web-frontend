import { useState } from "react";
import { Plus, Loader2, Scale } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useSchoolLaws } from "../../hooks/useSchoolLaws";
import type { SchoolLaw, LawPayload } from "../../types/school-laws.types";

import { LawsTable } from "./LawsTable";
import { LawDialog } from "./LawDialog";

export function SchoolLawsSection() {
  const { laws, isLoading, createLaw, updateLaw, deleteLaw } = useSchoolLaws();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLaw, setSelectedLaw] = useState<SchoolLaw | null>(null);

  const handleOpenCreate = () => {
    setSelectedLaw(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (law: SchoolLaw) => {
    setSelectedLaw(law);
    setDialogOpen(true);
  };

  const handleSubmit = (values: LawPayload) => {
    if (selectedLaw) {
      updateLaw.mutate(
        { id: selectedLaw.id, payload: values },
        { 
          onSuccess: () => {
            alert("✅ تم تعديل القانون بنجاح");
            setDialogOpen(false);
          },
          onError: (err: any) => {
             alert(err?.response?.status === 403 ? "❌ غير مصرح لك بالتعديل." : "❌ فشل تعديل القانون.");
          }
        }
      );
    } else {
      createLaw.mutate(values, { 
        onSuccess: () => {
          alert("✅ تمت إضافة القانون بنجاح");
          setDialogOpen(false);
        },
        onError: (err: any) => {
             alert(err?.response?.status === 403 ? "❌ غير مصرح لك بالإضافة." : "❌ فشل إضافة القانون.");
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="soft-card flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-border p-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-3 text-sm font-medium text-muted-foreground">جاري تحميل القوانين...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300" dir="rtl">
      <div className="soft-card rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border bg-card">
        <div className="flex items-center gap-3">
           <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">القوانين المدرسية</h2>
              <p className="text-sm text-muted-foreground mt-1">
                إدارة اللوائح والقوانين المدرسية التي تظهر للطلاب وأولياء الأمور.
              </p>
            </div>
        </div>
        <Button 
          onClick={handleOpenCreate} 
          className="primary-gradient h-11 rounded-xl px-5 font-semibold text-primary-foreground shadow-md transition-all hover:opacity-95 active:scale-[0.98]"
        >
          <Plus className="ml-2 h-5 w-5" /> إضافة قانون جديد
        </Button>
      </div>

      <LawsTable 
        laws={laws} 
        onEdit={handleOpenEdit} 
        onDelete={(id) => {
          if (confirm("هل أنت متأكد من حذف هذا القانون؟")) {
             deleteLaw.mutate(id, {
                onError: (err: any) => alert(err?.response?.status === 403 ? "❌ غير مصرح لك بالحذف." : "❌ فشل الحذف.")
             });
          }
        }} 
      />

      <LawDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        lawToEdit={selectedLaw}
        isLoading={createLaw.isPending || updateLaw.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}