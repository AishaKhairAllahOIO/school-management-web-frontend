import {
  Plus,
  Printer,
  Scale,
} from "lucide-react";
import {
  useState,
  useCallback,
} from "react";

import {
  Button,
} from "@/shared/ui/button";

import {
  useSchoolLaws,
} from "../../hooks/useSchoolLaws";
import type {
  LawPayload,
  SchoolLaw,
} from "../../types/school-laws.types";
import {
  CommunicationError,
  CommunicationLoading,
} from "../shared/CommunicationState";
import {
  DeleteConfirmationDialog,
} from "../shared/DeleteConfirmationDialog";
import {
  LawDialog,
} from "./LawDialog";
import {
  LawsTable,
} from "./LawsTable";

import { PosterTemplate } from "../../../printing/templates/PosterTemplate"; 

export function SchoolLawsSection() {
  const {
    laws,
    isLoading,
    isError,
    refetch,
    createLaw,
    updateLaw,
    deleteLaw,
  } = useSchoolLaws();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLaw, setSelectedLaw] = useState<SchoolLaw | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SchoolLaw | null>(null);

  function openCreate() {
    setSelectedLaw(null);
    setDialogOpen(true);
  }

  function submit(values: LawPayload) {
    if (selectedLaw) {
      updateLaw.mutate(
        { id: selectedLaw.id, payload: values },
        { onSuccess: () => setDialogOpen(false) },
      );
      return;
    }

    createLaw.mutate(values, {
      onSuccess: () => setDialogOpen(false),
    });
  }

  const handlePrint = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTimeout(() => {
      window.print();
    }, 150);
  }, []);

  const header = (
    <div className="flex flex-col gap-3 rounded-[22px] border border-success/[0.13] bg-card p-3 shadow-[0_10px_30px_rgba(38,24,84,0.045)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-success/[0.10] text-success">
          <Scale className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </span>

        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold text-foreground">
            School laws and regulations
          </h2>
          <p className="mt-0.5 text-[11.5px] leading-5 text-muted-foreground">
            Maintain the official policy library and print a clear poster for classrooms or notice boards.
          </p>
        </div>
      </div>

      <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrint}
          disabled={laws.length === 0}
          className="h-11 min-w-0 rounded-[14px] border-success/20 bg-success/[0.025] px-4 text-[12px] font-semibold text-success hover:bg-success/[0.08] hover:text-success"
        >
          <Printer className="h-4 w-4" />
          Print poster
        </Button>

        <Button
          type="button"
          onClick={openCreate}
          className="h-11 min-w-0 rounded-[14px] bg-success px-5 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(42,157,98,0.17)] hover:bg-success/90"
        >
          <Plus className="h-4 w-4" />
          Add law
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-w-0 space-y-4">
        {header}
        <CommunicationLoading cards={5} variant="rows" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-w-0 space-y-4">
        {header}
        <CommunicationError
          title="School laws could not be loaded"
          description="The regulations library is temporarily unavailable. Check the connection and try again."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <>
      <div className="min-w-0 space-y-4 print:hidden">
        {header}

        <LawsTable
          laws={laws}
          onEdit={(law) => {
            setSelectedLaw(law);
            setDialogOpen(true);
          }}
          onDelete={setPendingDelete}
        />

        <LawDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setSelectedLaw(null);
          }}
          lawToEdit={selectedLaw}
          isLoading={createLaw.isPending || updateLaw.isPending}
          onSubmit={submit}
        />

        <DeleteConfirmationDialog
          open={Boolean(pendingDelete)}
          onOpenChange={(open) => {
            if (!open) setPendingDelete(null);
          }}
          title="Delete school law?"
          description={`“${pendingDelete?.title ?? "This law"}” will be permanently removed from the regulations library.`}
          isPending={deleteLaw.isPending}
          onConfirm={() => {
            if (!pendingDelete) return;
            deleteLaw.mutate(pendingDelete.id, {
              onSuccess: () => setPendingDelete(null),
            });
          }}
        />
      </div>

      <div className="hidden print:block">
        {/* 🌟 السحر هنا: هذا الكود يعالج مشكلة قص الجدول في Chrome، ويضمن مسافات صحيحة */}
        <style>{`
          @media print {
            @page { margin: 10mm; } 
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            
            /* إيقاف Flexbox لضمان عدم تداخل الجدول مع رأس الصفحة الثانية */
            .poster-document {
              display: block !important;
              min-height: auto !important;
              height: auto !important;
            }
            .poster-document main {
              display: block !important;
            }
          }
        `}</style>

        <PosterTemplate>
          {/* تقليل الـ Padding العام لضمان اتساع 10 قوانين في الصفحة */}
          <div className="px-8 py-6">
            
            <div className="mb-6 text-center">
              <h2 className="text-[26px] font-black uppercase tracking-[0.08em] text-[#111827]">
                School Laws & Regulations
              </h2>
              <div className="mx-auto mt-3 h-[2px] w-20 bg-[#111827]"></div>
              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6b7280]">
                Official Policy Guidelines For Students & Staff
              </p>
            </div>

            <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
              <thead className="table-header-group">
                <tr>
                  <th className="w-[8%] border-b-[2px] border-[#111827] pb-3 text-center text-[10px] font-bold uppercase tracking-[0.1em] text-[#111827]">
                    No.
                  </th>
                  <th className="w-[32%] border-b-[2px] border-[#111827] pb-3 px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#111827]" dir="auto">
                    Policy / Regulation
                  </th>
                  <th className="w-[60%] border-b-[2px] border-[#111827] pb-3 px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#111827]" dir="auto">
                    Official Description
                  </th>
                </tr>
              </thead>
              
              <tbody>
                {laws.map((law, index) => (
                  <tr 
                    key={law.id} 
                    className="break-inside-avoid print:break-inside-avoid"
                  >
                    {/* تقليل الـ Padding العمودي (py-3) للأسطر لتوسيع مساحة الصفحة */}
                    <td className="border-b border-[#e5e7eb] py-3.5 align-top">
                      <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#f3f4f6] text-[11px] font-bold text-[#374151]">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </td>
                    
                    <td 
                      className="border-b border-[#e5e7eb] py-3.5 px-3 align-top text-[13px] font-bold leading-snug text-[#111827]" 
                      dir="auto"
                    >
                      {law.title}
                    </td>
                    
                    <td 
                      className="border-b border-[#e5e7eb] py-3.5 px-3 align-top text-[12px] leading-relaxed text-[#4b5563]" 
                      dir="auto"
                    >
                      {law.description || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          </div>
        </PosterTemplate>
      </div>
    </>
  );
}