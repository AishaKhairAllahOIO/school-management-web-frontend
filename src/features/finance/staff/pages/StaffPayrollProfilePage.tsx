import {
  useMemo,
  useState,
} from "react";

import { useQuery } from "@tanstack/react-query";

import {
  ArrowLeft,
  Plus,
  UserRound,
} from "lucide-react";

import {
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import { Button } from "@/shared/ui/button";

import { staffApi } from "../../../users/staff/api/staff.api";

import { useAcademicYears } from "../../../settings/academic/hooks/useAcademicSettings";

import {
  useDeleteContract,
  useStaffContracts,
} from "../hooks/useStaffContracts";

import {
  usePayrollPreview,
  useStaffPayrolls,
} from "../hooks/usePayroll";

import { ContractsTable } from "../components/ContractsTable";
import { PayrollTable } from "../components/PayrollTable";

import { ContractDialog } from "../components/ContractDialog";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { PayrollPreviewDialog } from "../components/PayrollPreviewDialog";
import { PayrollDetailDialog } from "../components/PayrollDetailDialog";

import type {
  ApiId,
  Payroll,
  PayrollPreview,
  StaffFinancialContract,
} from "../types/payroll.types";

export function StaffPayrollProfilePage() {
  const { staffId } = useParams<{
    staffId: string;
  }>();

  const navigate = useNavigate();

  /* ============================================================
     Contract state
     ============================================================ */

  const [
    contractDialogOpen,
    setContractDialogOpen,
  ] = useState(false);

  const [
    editingContract,
    setEditingContract,
  ] = useState<StaffFinancialContract | null>(
    null,
  );

  const [
    deleteContract,
    setDeleteContract,
  ] = useState<StaffFinancialContract | null>(
    null,
  );

  /* ============================================================
     Payroll state
     ============================================================ */

  const [
    selectedPayrollId,
    setSelectedPayrollId,
  ] = useState<ApiId | null>(null);

  const [
    previewOpen,
    setPreviewOpen,
  ] = useState(false);

  const [
    preview,
    setPreview,
  ] = useState<PayrollPreview | null>(
    null,
  );

  /* ============================================================
     Staff
     ============================================================ */

  const staffQuery = useQuery({
    queryKey: [
      "finance",
      "staff",
      "detail",
      staffId,
    ],

    queryFn: () =>
      staffApi.getDetails(
        staffId!,
      ),

    enabled: Boolean(
      staffId,
    ),

    retry: false,
  });

  /* ============================================================
     Contracts
     ============================================================ */

  const contractsQuery =
    useStaffContracts(
      staffId
        ? {
            staff_id: staffId,
          }
        : undefined,
    );

  /* ============================================================
     Payroll
     ============================================================ */

  const payrollQuery =
    useStaffPayrolls(
      staffId,
    );

  /* ============================================================
     Academic years
     ============================================================ */

  const academicYearsQuery =
    useAcademicYears();

  /* ============================================================
     Mutations
     ============================================================ */

  const deleteContractMutation =
    useDeleteContract();

  const previewMutation =
    usePayrollPreview();

  /* ============================================================
     Academic year lookup
     ============================================================ */

  const academicYearsById =
    useMemo(
      () =>
        new Map(
          (
            academicYearsQuery.data ??
            []
          ).map((year) => [
            String(year.id),
            year.name,
          ]),
        ),
      [
        academicYearsQuery.data,
      ],
    );

  /* ============================================================
     Validation
     ============================================================ */

  if (!staffId) {
    return (
      <Navigate
        to="/finance/staff"
        replace
      />
    );
  }

  /* ============================================================
     Loading
     ============================================================ */

  if (
    staffQuery.isLoading
  ) {
    return (
      <div className="p-10 text-center text-xs text-muted-foreground">
        Loading employee...
      </div>
    );
  }

  /* ============================================================
     Error
     ============================================================ */

  if (
    staffQuery.isError ||
    !staffQuery.data
  ) {
    return (
      <div className="mx-auto mt-6 max-w-xl rounded-[24px] border border-destructive/15 bg-card p-8 text-center">
        <h2 className="text-sm font-semibold">
          Employee unavailable
        </h2>

        <p className="mt-2 text-xs text-muted-foreground">
          The employee details could not be loaded.
        </p>

        <Button
          variant="outline"
          className="mt-5 rounded-xl"
          onClick={() =>
            navigate(
              "/finance/staff",
            )
          }
        >
          <ArrowLeft className="mr-2 size-4" />

          Staff accounts
        </Button>
      </div>
    );
  }

  /* ============================================================
     Data
     ============================================================ */

  const staff =
    staffQuery.data;

  const contracts =
    contractsQuery.data?.data ??
    [];

  const payrolls =
    (
      payrollQuery.data?.data ??
      []
    ) as Payroll[];

  /*
   * The employee should have only one active financial contract.
   */
  const activeContract =
    contracts[0] ?? null;

  /* ============================================================
     Payroll preview
     ============================================================ */

  async function handlePreview() {
    const now =
      new Date();

    const result =
      await previewMutation.mutateAsync(
        {
          staff_id: staffId,

          year:
            now.getFullYear(),

          month:
            now.getMonth() + 1,
        },
      );

    setPreview(
      result.data,
    );
  }

  /* ============================================================
     Contract actions
     ============================================================ */

  function openCreateContract() {
    setEditingContract(
      null,
    );

    setContractDialogOpen(
      true,
    );
  }

  function openEditContract(
    contract: StaffFinancialContract,
  ) {
    setEditingContract(
      contract,
    );

    setContractDialogOpen(
      true,
    );
  }

  async function confirmDeleteContract() {
    if (!deleteContract) {
      return;
    }

    await deleteContractMutation.mutateAsync(
      deleteContract.id,
    );

    setDeleteContract(
      null,
    );
  }

  /* ============================================================
     Generate button
     
     IMPORTANT:
     This function is passed to PayrollTable.
     The button itself is rendered INSIDE PayrollTable.
     ============================================================ */

  function handleGeneratePayroll() {
    setPreview(
      null,
    );

    setPreviewOpen(
      true,
    );
  }

  /* ============================================================
     Render
     ============================================================ */

  return (
    <div className="space-y-5 pb-10 pt-4 sm:pt-5 lg:pt-6">

      {/* ========================================================
          PROFILE HEADER
         ======================================================== */}

      <header className="flex items-center gap-3">

        {/* Back */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 rounded-xl"
          onClick={() =>
            navigate(
              "/finance/staff",
            )
          }
        >
          <ArrowLeft className="size-4 rtl:rotate-180" />
        </Button>

        {/* Photo */}
        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-primary/[0.07] text-primary">

          {staff.photoUrl ? (
            <img
              src={
                staff.photoUrl
              }
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <UserRound className="size-[19px]" />
          )}

        </div>

        {/* Employee info */}
        <div className="min-w-0 flex-1">

          <h1 className="truncate text-[17px] font-semibold">
            {staff.fullName}
          </h1>

          <p className="mt-0.5 text-[11px] capitalize text-muted-foreground">
            {staff.role?.replace(
              "_",
              " ",
            ) ?? "Staff"}
          </p>

        </div>

        {/* ====================================================
            Add Contract

            Only visible when employee has NO contract.
           ==================================================== */}

        {!activeContract ? (
          <Button
            type="button"
            className="h-9 rounded-xl"
            onClick={
              openCreateContract
            }
          >
            <Plus className="mr-1.5 size-4" />

            <span className="hidden sm:inline">
              Contract
            </span>

            <span className="sm:hidden">
              Add
            </span>
          </Button>
        ) : null}

      </header>

      {/* ========================================================
          FINANCIAL CONTRACT
         ======================================================== */}

      <ContractsTable
        contracts={
          contracts
        }
        loading={
          contractsQuery.isLoading
        }
        error={
          contractsQuery.isError
        }
        onAdd={
          openCreateContract
        }
        onEdit={
          openEditContract
        }
        onDelete={
          setDeleteContract
        }
        academicYearsById={
          academicYearsById
        }
      />

      {/* ========================================================
          PAYROLL

          Generate button is now INSIDE PayrollTable.
         ======================================================== */}

      <PayrollTable
        payrolls={
          payrolls
        }

        loading={
          payrollQuery.isLoading
        }

        onSelect={(payroll) =>
          setSelectedPayrollId(
            payroll.id,
          )
        }

        /*
         * This causes the Generate button to appear
         * inside the Payroll history header.
         */
        onGenerate={
          handleGeneratePayroll
        }

        /*
         * Loading state for Generate button.
         */
        generateLoading={
          previewMutation.isPending
        }

        /*
         * No contract = Generate disabled.
         */
        generateDisabled={
          !activeContract
        }
      />

      {/* ========================================================
          CONTRACT DIALOG
         ======================================================== */}

      <ContractDialog
        open={
          contractDialogOpen
        }

        staffId={
          staff.id
        }

        contract={
          editingContract
        }

        onClose={() => {
          setContractDialogOpen(
            false,
          );

          setEditingContract(
            null,
          );
        }}
      />

      {/* ========================================================
          DELETE CONTRACT
         ======================================================== */}

      <ConfirmDialog
        open={
          Boolean(
            deleteContract,
          )
        }

        title="Delete contract?"

        description="This financial contract will be permanently removed."

        loading={
          deleteContractMutation.isPending
        }

        onClose={() =>
          setDeleteContract(
            null,
          )
        }

        onConfirm={
          confirmDeleteContract
        }
      />

      {/* ========================================================
          PAYROLL PREVIEW
         ======================================================== */}

      <PayrollPreviewDialog
        open={
          previewOpen
        }

        staffId={
          staff.id
        }

        year={
          new Date().getFullYear()
        }

        month={
          new Date().getMonth() + 1
        }

        preview={
          preview
        }

        previewLoading={
          previewMutation.isPending
        }

        previewError={
          previewMutation.isError
        }

        onPreview={
          handlePreview
        }

        onClose={() => {
          setPreviewOpen(
            false,
          );

          setPreview(
            null,
          );

          previewMutation.reset();
        }}

        onCommitted={() => {
          void payrollQuery.refetch();
        }}
      />

      {/* ========================================================
          PAYROLL DETAIL
         ======================================================== */}

      <PayrollDetailDialog
        payrollId={
          selectedPayrollId
        }

        onClose={() =>
          setSelectedPayrollId(
            null,
          )
        }
      />

    </div>
  );
}