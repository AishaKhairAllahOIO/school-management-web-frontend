// features/finance/pages/StaffPayrollProfilePage.tsx

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

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

/* =========================================================
   SKELETON
========================================================= */

function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={[
        "animate-pulse",
        "rounded-md",
        "bg-muted/70",
        className,
      ].join(" ")}
    />
  );
}

/* =========================================================
   PROFILE PAGE SKELETON
========================================================= */

function StaffPayrollProfileSkeleton() {
  return (
    <div
      className="
        space-y-3
        pb-8
        pt-0
        sm:space-y-4
      "
      aria-busy="true"
      aria-label="Loading employee payroll"
    >
      <section
        className="
          overflow-hidden
          rounded-[18px]
          border
          border-border/50
          bg-card
          shadow-[0_8px_28px_rgba(38,24,84,0.035)]
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            border-b
            border-border/40
            px-4
            py-3
            sm:px-5
            sm:py-3.5
          "
        >
          <Skeleton
            className="
              size-8
              shrink-0
              rounded-lg
            "
          />

          <div className="min-w-0 space-y-1.5">
            <Skeleton
              className="
                h-3.5
                w-28
                rounded-md
              "
            />

            <Skeleton
              className="
                h-2.5
                w-40
                rounded-md
              "
            />
          </div>

          <Skeleton
            className="
              ml-auto
              h-8
              w-20
              rounded-xl
            "
          />
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-2
            p-3
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="
                rounded-[14px]
                border
                border-border/35
                bg-muted/[0.12]
                px-3.5
                py-3
              "
            >
              <Skeleton className="h-2.5 w-20" />

              <Skeleton
                className="
                  mt-2
                  h-3.5
                  w-28
                "
              />
            </div>
          ))}
        </div>
      </section>

      <section
        className="
          overflow-hidden
          rounded-[18px]
          border
          border-border/50
          bg-card
          shadow-[0_8px_28px_rgba(38,24,84,0.035)]
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            border-b
            border-border/40
            px-4
            py-3.5
          "
        >
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-24" />

            <Skeleton className="h-2.5 w-44" />
          </div>

          <Skeleton
            className="
              h-8
              w-28
              rounded-xl
            "
          />
        </div>

        <div className="p-3">
          <div
            className="
              hidden
              grid-cols-5
              gap-4
              border-b
              border-border/35
              px-3
              py-2.5
              sm:grid
            "
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="
                  h-2.5
                  w-16
                "
              />
            ))}
          </div>

          <div className="space-y-1">
            {Array.from({ length: 4 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="
                  grid
                  grid-cols-2
                  gap-3
                  rounded-[12px]
                  px-3
                  py-3
                  sm:grid-cols-5
                  sm:items-center
                "
              >
                {Array.from({ length: 5 }).map(
                  (_, columnIndex) => (
                    <Skeleton
                      key={columnIndex}
                      className={[
                        "h-3",
                        columnIndex === 0
                          ? "w-24"
                          : "w-16",
                      ].join(" ")}
                    />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export function StaffPayrollProfilePage() {
  const {
    staffId: routeStaffId,
  } = useParams<{
    staffId: string;
  }>();

  const navigate = useNavigate();

  const staffId: ApiId | undefined =
    routeStaffId;

  /* ============================================================
     CONTRACT STATE
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
     PAYROLL STATE
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
     STAFF
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

    enabled: Boolean(staffId),

    retry: false,
  });

  /* ============================================================
     CONTRACTS
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
     PAYROLL
  ============================================================ */

  const payrollQuery =
    useStaffPayrolls(
      staffId,
    );

  /* ============================================================
     ACADEMIC YEARS
  ============================================================ */

  const academicYearsQuery =
    useAcademicYears();

  /* ============================================================
     MUTATIONS
  ============================================================ */

  const deleteContractMutation =
    useDeleteContract();

  const previewMutation =
    usePayrollPreview();

  /* ============================================================
     ACADEMIC YEAR LOOKUP
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
     VALIDATION
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
     LOADING
  ============================================================ */

  if (staffQuery.isLoading) {
    return (
      <StaffPayrollProfileSkeleton />
    );
  }

  /* ============================================================
     ERROR
  ============================================================ */

  if (
    staffQuery.isError ||
    !staffQuery.data
  ) {
    return (
      <div
        className="
          mx-auto
          mt-2
          max-w-xl
          rounded-[20px]
          border
          border-destructive/15
          bg-card
          p-8
          text-center
        "
      >
        <h2 className="text-sm font-semibold">
          Employee unavailable
        </h2>

        <p
          className="
            mt-2
            text-xs
            text-muted-foreground
          "
        >
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
          <ArrowLeft
            className="
              mr-2
              size-4
              rtl:rotate-180
            "
          />

          Staff accounts
        </Button>
      </div>
    );
  }

  /* ============================================================
     DATA
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

  const activeContract =
    contracts[0] ?? null;

  /* ============================================================
     PAYROLL PREVIEW
  ============================================================ */

  async function handlePreview() {
    if (
      staffId === undefined
    ) {
      return;
    }

    const now = new Date();

    const result =
      await previewMutation.mutateAsync(
        {
          staff_id: staffId,
          year: now.getFullYear(),
          month: now.getMonth() + 1,
        },
      );

    setPreview(
      result.data,
    );
  }

  /* ============================================================
     CONTRACT ACTIONS
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
    if (
      !deleteContract
    ) {
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
     GENERATE PAYROLL
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
     PAYROLL SELECT
  ============================================================ */

  function handleSelectPayroll(
    payroll: Payroll,
  ) {
    setSelectedPayrollId(
      payroll.id,
    );
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div
      className="
        space-y-3
        pb-8
        pt-0
        sm:space-y-4
      "
    >
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
        staff={
          staff
        }
        onBack={() =>
          navigate(
            "/finance/staff",
          )
        }
      />

      <PayrollTable
        payrolls={
          payrolls
        }
        loading={
          payrollQuery.isLoading
        }
        onSelect={
          handleSelectPayroll
        }
        onGenerate={
          handleGeneratePayroll
        }
        generateLoading={
          previewMutation.isPending
        }
        generateDisabled={
          !activeContract
        }
      />

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

      <ConfirmDialog
        open={
          Boolean(
            deleteContract,
          )
        }
        title="Delete contract?"
        description="
          This financial contract will be permanently removed.
        "
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