import {
  Plus,
  Printer,
  Scale,
} from "lucide-react";
import {
  useState,
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
        
            disabled={!laws.length}
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
    <div className="min-w-0 space-y-4">
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
  );
}
