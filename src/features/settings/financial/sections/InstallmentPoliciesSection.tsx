import { useState } from "react";
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
    <div className="p-0">
      <FinancialSectionHeader
        title="Student Installment Policies"
        description="Define reusable payment schedules so tuition invoices are divided into clear percentages and due dates for families."
        actionLabel="Add Installment Policy"
        onAction={() => setCreateOpen(true)}
      />

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
      description="This payment schedule will no longer be available for new student invoices. Existing invoices may still retain their saved installments. This action cannot be undone."
      itemName={selectedPolicy?.name}
      isPending={deletePolicy.isPending}
      onConfirm={handleDelete}
    />
  </div>
);
}
