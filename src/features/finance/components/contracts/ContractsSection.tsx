import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { FileText, Loader2, Plus, RefreshCw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useStudents } from "../../../users/students/hooks/useStudents";
import { studentKeys } from "../../../users/students/hooks/student.keys";
import { studentApi } from "../../../users/students/api/student.api";
import type { ContractStudentOption } from "./ContractForm";
import { UpdateContractDialog } from "./UpdateContractDialog";
import { ContractsTable } from "./ContractsTable";
import { FinalizeContractDialog } from "./FinalizeContractDialog";
import { useFinancialAccounts } from "../../hooks/useFinancialAccounts";
import { AccountDetailsDialog } from "./AccountDetailsDialog";
import { useFeePlans } from "@/features/settings/financial/hooks/useFeePlans";
import { useInstallmentPolicies } from "@/features/settings/financial/hooks/useInstallmentPolicies";
import { FinanceSectionShell } from "../shared/FinanceSectionShell";
import { FinanceTableSkeleton } from "../shared/FinanceTableSkeleton";

export function ContractsSection() {
  const {
    data: accounts = [],
    isLoading: isLoadingAccounts,
    isError: isAccountsError,
    isFetching: isFetchingAccounts,
    refetch: refetchAccounts,
    finalizeContract,
    updateContract,
  } = useFinancialAccounts();

  const [selectedStudentId, setSelectedStudentId] = useState<
    string | number | null
  >(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAccountToEdit, setSelectedAccountToEdit] =
    useState<any>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: feePlans = [], isLoading: isLoadingFeePlans } =
    useFeePlans();
  const {
    data: installmentPolicies = [],
    isLoading: isLoadingPolicies,
  } = useInstallmentPolicies();

  /*
   * Reuses the Students feature query instead of duplicating its endpoint.
   * studentId is used by Finance, while enrollmentId is retained so the
   * contract form can load the student's active academic year on demand.
   */
  const {
    data: studentsResponse,
    isLoading: isLoadingStudents,
    isError: isStudentsError,
    refetch: refetchStudents,
  } = useStudents({
    status: "enrolled",
    per_page: 100,
  });

  const studentItems = studentsResponse?.data ?? [];

  const students = useMemo<ContractStudentOption[]>(
    () =>
      studentItems.map((student) => ({
        id: student.studentId,
        enrollmentId: student.enrollmentId,
        name: student.fullName,
      })),
    [studentItems],
  );

  const contractStudentItems = useMemo(
    () => {
      const accountStudentIds = new Set(
        accounts.map((account) => String(account.studentId)),
      );

      return studentItems.filter((student) =>
        accountStudentIds.has(String(student.studentId)),
      );
    },
    [accounts, studentItems],
  );

  const contractStudentProfiles = useQueries({
    queries: contractStudentItems.map((student) => ({
      queryKey: studentKeys.fullProfile(student.enrollmentId),
      queryFn: () => studentApi.getFullProfile(student.enrollmentId),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const studentsById = useMemo(() => {
    const directory = new Map<
      string,
      { fullName: string; academicYearName?: string | null }
    >();

    studentItems.forEach((student) => {
      directory.set(String(student.studentId), {
        fullName: student.fullName,
      });
    });

    contractStudentItems.forEach((student, index) => {
      const profile = contractStudentProfiles[index]?.data;

      directory.set(String(student.studentId), {
        fullName: profile?.student.fullName ?? student.fullName,
        academicYearName:
          profile?.enrollment.academicYear?.name ?? null,
      });
    });

    return directory;
  }, [contractStudentItems, contractStudentProfiles, studentItems]);

  const isLoadingDependencies =
    isLoadingAccounts ||
    isLoadingFeePlans ||
    isLoadingPolicies ||
    isLoadingStudents;

  function handleFinalize(values: any) {
    const payload = {
      studentId: values.studentId,
      academicYearId: values.academicYearId,
      feePlanId: values.feePlanId,
      installmentPolicyId: values.installmentPolicyId,
      extraServiceIds: values.selectedExtraServiceIds,
      selectedExtraServiceIds: values.selectedExtraServiceIds,
    };

    finalizeContract.mutate(payload as any, {
      onSuccess: () => setCreateOpen(false),
    });
  }

  function handleUpdateContract(
    studentId: string | number,
    values: any,
  ) {
    updateContract.mutate(
      { studentId, payload: values },
      {
        onSuccess: () => {
          setEditOpen(false);
          setSelectedAccountToEdit(null);
        },
      },
    );
  }

  if (isLoadingDependencies) {
    return (
      <FinanceSectionShell
        title="Student Contracts"
        description="Create and manage student financial agreements."
        icon={FileText}
      >
        <FinanceTableSkeleton />
      </FinanceSectionShell>
    );
  }

  if (isAccountsError || isStudentsError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[18px] border border-destructive/20 bg-destructive/[0.035] py-12 text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-3 text-destructive">
          <RefreshCw
            size={24}
            className={isFetchingAccounts ? "animate-spin" : ""}
          />
        </div>
        <h3 className="text-[15px] font-medium text-foreground/85">
          Failed to load contracts
        </h3>
        <Button
          variant="outline"
          className="mt-4 rounded-xl border-destructive/20 bg-white text-destructive hover:bg-destructive/[0.05]"
          onClick={() => {
            void refetchAccounts();
            void refetchStudents();
          }}
          disabled={isFetchingAccounts}
        >
          {isFetchingAccounts ? (
            <Loader2 size={16} className="mr-2 animate-spin" />
          ) : (
            <RefreshCw size={16} className="mr-2" />
          )}
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <FinanceSectionShell
      title="Student Contracts"
      description="Create and manage student financial agreements."
      icon={FileText}
      action={
        <Button
          variant="outline"
          onClick={() => setCreateOpen(true)}
          className="h-10 rounded-xl border-primary/35 bg-white px-4 text-[12.5px] font-medium text-primary shadow-none hover:border-primary/50 hover:bg-primary/[0.045] hover:text-primary"
        >
          <Plus className="mr-2 h-4 w-4" strokeWidth={1.8} />
          New Contract
        </Button>
      }
    >
      <ContractsTable
        accounts={accounts}
        studentsById={studentsById}
        onViewDetails={(account) => {
          setSelectedStudentId(account.studentId);
          setDetailsOpen(true);
        }}
        onEdit={(account) => {
          setSelectedAccountToEdit(account);
          setEditOpen(true);
        }}
      />

      <FinalizeContractDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        students={students}
        feePlans={feePlans}
        installmentPolicies={installmentPolicies}
        isLoading={finalizeContract.isPending}
        onSubmit={handleFinalize}
      />

      <AccountDetailsDialog
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) setSelectedStudentId(null);
        }}
        studentId={selectedStudentId}
      />

      <UpdateContractDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setSelectedAccountToEdit(null);
        }}
        account={selectedAccountToEdit}
        students={students}
        feePlans={feePlans}
        installmentPolicies={installmentPolicies}
        isLoading={updateContract.isPending}
        onSubmit={handleUpdateContract}
      />
    </FinanceSectionShell>
  );
}
