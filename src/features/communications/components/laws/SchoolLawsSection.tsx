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

  const handleSubmit = (values: LawPayload) => {
    if (selectedLaw) {
      updateLaw.mutate({ id: selectedLaw.id, payload: values }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createLaw.mutate(values, { onSuccess: () => setDialogOpen(false) });
    }
  };

  if (isLoading) {
    return (
      <div className="soft-card flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-border p-12 text-center bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-3 text-sm font-medium text-muted-foreground">Loading school laws...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="soft-card rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border bg-card shadow-sm">
        <div className="flex items-center gap-4">
           <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Scale className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">School Laws & Regulations</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage the rules and policies visible to students and parents.
              </p>
            </div>
        </div>
        <Button 
          onClick={handleOpenCreate} 
          className="primary-gradient h-11 rounded-xl px-5 font-semibold text-primary-foreground shadow-md transition-all hover:opacity-95 active:scale-[0.98]"
        >
          <Plus className="mr-2 h-5 w-5" /> Add New Law
        </Button>
      </div>

      <LawsTable 
        laws={laws} 
        onEdit={(law) => { setSelectedLaw(law); setDialogOpen(true); }} 
        onDelete={(id) => {
          if (confirm("Are you sure you want to permanently delete this law?")) {
             deleteLaw.mutate(id);
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