import {
  Plus,
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

  if (isLoading) {
    return <CommunicationLoading cards={5} variant="rows" />;
  }

  if (isError) {
    return (
      <CommunicationError
        title="School laws could not be loaded"
        description="The regulations library is temporarily unavailable. Check the connection and try again."
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button type="button" onClick={openCreate} className="h-10 rounded-[12px] px-4 text-[12px] font-medium">
          <Plus className="h-4 w-4" />
          Add law
        </Button>
      </div>

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
        onOpenChange={setDialogOpen}
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
