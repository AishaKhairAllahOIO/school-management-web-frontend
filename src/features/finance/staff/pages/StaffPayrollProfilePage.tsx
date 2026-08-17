import {
  useMemo,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";

import {
  ArrowLeft,
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
        space-y-4
        pb-8
        pt-2
        sm:pt-3
        lg:pt-4
      "
      aria-busy="true"
      aria-label="Loading employee payroll"
    >
      {/* HEADER */}

      <header
        className="
          flex
          items-center
          gap-1.5
        "
      >
        <Skeleton
          className="
            size-7
            shrink-0
            rounded-lg
          "
        />

        <div
          className="
            min-w-0
            space-y-1.5
          "
        >
          <Skeleton
            className="
              h-4
              w-32
              rounded-md
            "
          />

          <Skeleton
            className="
              h-2.5
              w-56
              rounded-md
            "
          />
        </div>
      </header>

      {/* CONTRACT SKELETON */}

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
            <Skeleton
              className="h-3.5 w-28"
            />

            <Skeleton
              className="h-2.5 w-40"
            />
          </div>

          <Skeleton
            className="
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
          {Array.from({
            length: 4,
          }).map((_, index) => (
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
              <Skeleton
                className="h-2.5 w-20"
              />

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

      {/* PAYROLL SKELETON */}

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
            <Skeleton
              className="h-3.5 w-24"
            />

            <Skeleton
              className="h-2.5 w-44"
            />
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
            {Array.from({
              length: 5,
            }).map((_, index) => (
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
            {Array.from({
              length: 4,
            }).map((_, rowIndex) => (
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
                {Array.from({
                  length: 5,
                }).map(
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

  /*
   * Route params are strings.
   *
   * We keep the route value separate from the validated
   * ApiId used by the API.
   */
  const staffId: ApiId | undefined =
    routeStaffId;

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

    enabled: Boolean(staffId),

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
     STAFF LOADING
     ============================================================ */

  if (
    staffQuery.isLoading
  ) {
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
          mt-6
          max-w-xl
          rounded-[24px]
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
  if (staffId === undefined) {
    return;
  }

  const now = new Date();

  const result =
    await previewMutation.mutateAsync({
      staff_id: staffId,

      year: now.getFullYear(),

      month: now.getMonth() + 1,
    });

  setPreview(result.data);
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
        space-y-4
        pb-8
        pt-2
        sm:pt-3
        lg:pt-4
      "
    >
      {/* PROFILE HEADER */}

      <header
        className="
          flex
          items-center
          gap-1.5
        "
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="
            size-7
            shrink-0
            rounded-lg
            p-0
            text-muted-foreground
            hover:bg-muted/60
            hover:text-foreground
          "
          onClick={() =>
            navigate(
              "/finance/staff",
            )
          }
        >
          <ArrowLeft
            className="
              size-3.5
              rtl:rotate-180
            "
          />
        </Button>

        <div
          className="
            min-w-0
            -translate-y-px
          "
        >
          <h1
            className="
              text-[14px]
              font-semibold
              leading-5
              text-foreground
            "
          >
            Employee payroll
          </h1>

          <p
            className="
              text-[10px]
              leading-4
              text-muted-foreground
            "
          >
            Financial contract and payroll history
          </p>
        </div>
      </header>

      {/* FINANCIAL CONTRACT */}

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
      />

      {/* PAYROLL */}

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

      {/* CONTRACT DIALOG */}

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

      {/* DELETE CONTRACT */}

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

      {/* PAYROLL PREVIEW */}

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

      {/* PAYROLL DETAIL */}

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