import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  FileText,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useStudents } from "../../../users/students/hooks/useStudents";
import { studentKeys } from "../../../users/students/hooks/student.keys";
import { studentApi } from "../../../users/students/api/student.api";
import type { ContractStudentOption } from "./ContractForm";
import { UpdateContractDialog } from "./UpdateContractDialog";
import { FinalizeContractDialog } from "./FinalizeContractDialog";
import { useFinancialAccounts } from "../../hooks/useFinancialAccounts";
import { AccountDetailsDialog } from "./AccountDetailsDialog";
import { useFeePlans } from "@/features/settings/financial/hooks/useFeePlans";
import { useInstallmentPolicies } from "@/features/settings/financial/hooks/useInstallmentPolicies";
import { FinanceSectionShell } from "../shared/FinanceSectionShell";
import {
  FinanceTableSkeleton,
} from "../shared/FinanceTableSkeleton";
import {
  StudentAccountsTable,
  type StudentFinanceRow,
} from "./StudentAccountsTable";
import type { FinancialAccount } from "../../types/finance.types";

 type ContractsSectionProps = {
  studentId?: string | number;
  title?: string;
  description?: string;
  showCreateAction?: boolean;
  showViewAction?: boolean;
  onOpenStudentAccount?: (studentId: string | number) => void;
};

export function ContractsSection({
  studentId,
  title = "Student Financial Accounts",
  description = "Review every student's financial position and open one profile to manage its contract, installments, and payments.",
  showCreateAction = true,
  showViewAction = true,
  onOpenStudentAccount,
}: ContractsSectionProps = {}) {
  const {
    data: accounts = [],
    isLoading: isLoadingAccounts,
    isError: isAccountsError,
    isFetching: isFetchingAccounts,
    refetch: refetchAccounts,
    finalizeContract,
    updateContract,
  } = useFinancialAccounts();

  const {
    data: studentsResponse,
    isLoading: isLoadingStudents,
    isError: isStudentsError,
    refetch: refetchStudents,
  } = useStudents({ per_page: 100 });

  const studentItems = studentsResponse?.data ?? [];

  const listedStudentById = useMemo(
    () =>
      new Map(
        studentItems.map((student) => [String(student.studentId), student] as const),
      ),
    [studentItems],
  );

  // The finance table must never be driven only by the currently returned
  // student page. A fully-paid account is still a valid financial profile.
  // Build a union of enrolled students and financial accounts so a student
  // remains visible even if one endpoint is paginated or temporarily omits it.
  const unionStudentIds = useMemo(() => {
    const ids = new Set<string>();

    studentItems.forEach((student) => ids.add(String(student.studentId)));
    accounts.forEach((account) => ids.add(String(account.studentId)));

    if (studentId !== undefined) {
      return [...ids].filter((id) => id === String(studentId));
    }

    return [...ids];
  }, [accounts, studentId, studentItems]);

  const studentDetailQueries = useQueries({
    queries: unionStudentIds.map((id) => ({
      queryKey: studentKeys.detail(id),
      queryFn: () => studentApi.getDetails(id),
      enabled: !listedStudentById.has(id),
      staleTime: 5 * 60 * 1000,
      retry: false,
    })),
  });

  const listedProfiles = useQueries({
    queries: studentItems
      .filter((student) => unionStudentIds.includes(String(student.studentId)))
      .map((student) => ({
        queryKey: studentKeys.fullProfile(student.enrollmentId),
        queryFn: () => studentApi.getFullProfile(student.enrollmentId),
        staleTime: 5 * 60 * 1000,
      })),
  });

  const listedProfileByStudentId = useMemo(() => {
    const visibleListedStudents = studentItems.filter((student) =>
      unionStudentIds.includes(String(student.studentId)),
    );

    return new Map(
      visibleListedStudents.map((student, index) => [
        String(student.studentId),
        listedProfiles[index]?.data,
      ] as const),
    );
  }, [listedProfiles, studentItems, unionStudentIds]);

  const detailByStudentId = useMemo(
    () =>
      new Map(
        unionStudentIds.map((id, index) => [id, studentDetailQueries[index]?.data] as const),
      ),
    [studentDetailQueries, unionStudentIds],
  );

  const accountByStudentId = useMemo(
    () =>
      new Map(
        accounts.map((account) => [String(account.studentId), account] as const),
      ),
    [accounts],
  );

  const rows = useMemo<StudentFinanceRow[]>(
    () =>
      unionStudentIds.map((id) => {
        const listedStudent = listedStudentById.get(id);
        const profile = listedProfileByStudentId.get(id);
        const details = detailByStudentId.get(id);
        const account = accountByStudentId.get(id);

        return {
          studentId: listedStudent?.studentId ?? account?.studentId ?? id,
          enrollmentId: listedStudent?.enrollmentId ?? id,
          fullName:
            profile?.student.fullName ??
            details?.student.fullName ??
            listedStudent?.fullName ??
            account?.studentName ??
            "Student",
          academicYearName:
            profile?.enrollment.academicYear?.name ??
            account?.academicYearName ??
            null,
          account,
        };
      }),
    [
      accountByStudentId,
      detailByStudentId,
      listedProfileByStudentId,
      listedStudentById,
      unionStudentIds,
    ],
  );

  const students = useMemo<ContractStudentOption[]>(
    () =>
      rows.map((row) => ({
        id: row.studentId,
        enrollmentId: row.enrollmentId,
        name: row.fullName,
      })),
    [rows],
  );

  
  const [createOpen, setCreateOpen] = useState(false);
  const [createStudent, setCreateStudent] = useState<StudentFinanceRow | null>(
    null,
  );
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAccountToEdit, setSelectedAccountToEdit] =
    useState<FinancialAccount | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<
    string | number | null
  >(null);

  const { data: feePlans = [], isLoading: isLoadingFeePlans } = useFeePlans();
  const {
    data: installmentPolicies = [],
    isLoading: isLoadingPolicies,
  } = useInstallmentPolicies();

  const isLoadingDependencies =
    isLoadingAccounts ||
    isLoadingStudents ||
    isLoadingFeePlans ||
    isLoadingPolicies;

  function openCreate(row?: StudentFinanceRow) {
    setCreateStudent(row ?? null);
    setCreateOpen(true);
  }

  function handleFinalize(values: any) {
    finalizeContract.mutate(
      {
        studentId: Number(values.studentId),
        academicYearId: Number(values.academicYearId),
        feePlanId: Number(values.feePlanId),
        installmentPolicyId: Number(values.installmentPolicyId),
        selectedExtraServiceIds:
          values.selectedExtraServiceIds?.length > 0
            ? values.selectedExtraServiceIds.map(Number)
            : null,
      },
      {
        onSuccess: () => {
          setCreateOpen(false);
          setCreateStudent(null);
        },
      },
    );
  }

  function handleUpdateContract(
    accountId: string | number,
    targetStudentId: string | number,
    values: { feePlanId: number; installmentPolicyId: number },
  ) {
    updateContract.mutate(
      {
        accountId,
        studentId: targetStudentId,
        payload: {
          feePlanId: Number(values.feePlanId),
          installmentPolicyId: Number(values.installmentPolicyId),
        },
      },
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
      <FinanceSectionShell title={title} description={description} icon={FileText}>
        <FinanceTableSkeleton />
      </FinanceSectionShell>
    );
  }

  if (isAccountsError || isStudentsError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[18px] border border-destructive/20 bg-destructive/[0.035] py-12 text-center">
        <RefreshCw
          size={24}
          className={isFetchingAccounts ? "animate-spin text-destructive" : "text-destructive"}
        />
        <h3 className="mt-4 text-[15px] font-medium text-foreground/85">
          Failed to load student finance
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
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const dialogStudents = createStudent
    ? students.filter(
        (student) => String(student.id) === String(createStudent.studentId),
      )
    : students.filter(
        (student) => !accountByStudentId.has(String(student.id)),
      );

  return (
    <FinanceSectionShell title={title} description={description} icon={FileText}>
      <StudentAccountsTable
        rows={rows}
        onView={(row) => {
          if (onOpenStudentAccount) {
            onOpenStudentAccount(row.studentId);
            return;
          }
          if (showViewAction && row.account) {
            setSelectedStudentId(row.studentId);
            setDetailsOpen(true);
          }
        }}
        onCreate={(row) => {
          if (showCreateAction) openCreate(row);
        }}
        onEdit={(row) => {
          if (!row.account) return;
          setSelectedAccountToEdit(row.account);
          setEditOpen(true);
        }}
      />

      <FinalizeContractDialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) setCreateStudent(null);
        }}
        students={dialogStudents}
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
        feePlans={feePlans}
        installmentPolicies={installmentPolicies}
        isLoading={updateContract.isPending}
        onSubmit={handleUpdateContract}
      />
    </FinanceSectionShell>
  );
}
