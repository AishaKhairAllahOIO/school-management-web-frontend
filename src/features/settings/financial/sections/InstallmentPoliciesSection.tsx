import { useState } from "react";
import { CalendarRange, Plus } from "lucide-react";

import { Button } from "@/shared/ui/button";

import { ConfirmationDialog } from "@/shared/ui/confirmation-dialog";
import { InstallmentPoliciesTable } from "../components/installment-policies/InstallmentPoliciesTable";
import { CreateInstallmentPolicyDialog } from "../components/installment-policies/CreateInstallmentPolicyDialog";
import { EditInstallmentPolicyDialog } from "../components/installment-policies/EditInstallmentPolicyDialog";
import { InstallmentPoliciesSkeleton } from "../components/installment-policies/InstallmentPoliciesSkeleton";
import { FinancialSectionHeader } from "../shared/FinancialSectionHeader";
import { useInstallmentPolicies } from "../hooks/useInstallmentPolicies";
import type { InstallmentPolicy } from "../types/installmentPolicy.types";
import type { InstallmentPolicyFormValues } from "../schemas/installmentPolicy.schema";
import {
  mapInstallmentPolicyFormToCreatePayload,
  mapInstallmentPolicyFormToUpdatePayload,
} from "../lib/mappers/installmentPolicy.mapper";

export function InstallmentPoliciesSection() {
  const {
    data: policies = [],
    isLoading,
    createPolicy,
    updatePolicy,
    deletePolicy,
  } = useInstallmentPolicies();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] =
    useState<InstallmentPolicy | null>(null);

  function handleCreate(values: InstallmentPolicyFormValues) {
    createPolicy.mutate(
      mapInstallmentPolicyFormToCreatePayload(values),
      { onSuccess: () => setCreateOpen(false) },
    );
  }

  function handleEdit(values: InstallmentPolicyFormValues) {
    if (!selectedPolicy) return;

    updatePolicy.mutate(
      {
        id: selectedPolicy.id,
        payload: mapInstallmentPolicyFormToUpdatePayload(values),
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          setSelectedPolicy(null);
        },
      },
    );
  }

  function handleDelete() {
    if (!selectedPolicy) return;

    deletePolicy.mutate(selectedPolicy.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedPolicy(null);
      },
    });
  }

  if (isLoading) {
    return <InstallmentPoliciesSkeleton />;
  }

  return (
    <div>
      <FinancialSectionHeader
        title="Installment Policies"
        description="Create payment schedules and distribute tuition across due dates."
        icon={CalendarRange}
      >
        <Button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="h-10 rounded-[14px] px-4 text-[13px] font-medium shadow-none"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Policy
        </Button>
      </FinancialSectionHeader>

      <div className="p-4 sm:p-5">
        <InstallmentPoliciesTable
          policies={policies}
          onEdit={(policy) => {
            setSelectedPolicy(policy);
            setEditOpen(true);
          }}
          onDelete={(policy) => {
            setSelectedPolicy(policy);
            setDeleteOpen(true);
          }}
        />
      </div>

      <CreateInstallmentPolicyDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        isLoading={createPolicy.isPending}
        onSubmit={handleCreate}
      />

      {editOpen && selectedPolicy ? (
        <EditInstallmentPolicyDialog
          open={editOpen}
          onOpenChange={(open) => {
            setEditOpen(open);
            if (!open) setSelectedPolicy(null);
          }}
          defaultValues={{
            name: selectedPolicy.name,
            items:
              selectedPolicy.items?.map((item) => ({ ...item })) ?? [],
          }}
          isLoading={updatePolicy.isPending}
          onSubmit={handleEdit}
        />
      ) : null}

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedPolicy(null);
        }}
        title="Delete installment policy?"
        description="This action cannot be undone."
        itemName={selectedPolicy?.name}
        isPending={deletePolicy.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
