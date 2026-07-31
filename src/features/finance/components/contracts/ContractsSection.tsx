import { useState } from "react";
import { FileText, Plus, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { UpdateContractDialog } from "./UpdateContractDialog";
import { Button } from "@/shared/ui/button";
import { FinancePageSkeleton } from "../shared/FinancePageSkeleton";
import { FinanceSectionHeader } from "../shared/FinanceSectionHeader";
import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import { ContractsTable } from "./ContractsTable";
import { FinalizeContractDialog } from "./FinalizeContractDialog";
import { useFinancialAccounts } from "../../hooks/useFinancialAccounts";
import { AccountDetailsDialog } from "./AccountDetailsDialog";
import { useFeePlans } from "@/features/settings/financial/hooks/useFeePlans";
import { useInstallmentPolicies } from "@/features/settings/financial/hooks/useInstallmentPolicies";

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

  const [selectedStudentId, setSelectedStudentId] = useState<string | number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAccountToEdit, setSelectedAccountToEdit] = useState<any>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: feePlans = [], isLoading: isLoadingFeePlans } = useFeePlans();
  const { data: installmentPolicies = [], isLoading: isLoadingPolicies } = useInstallmentPolicies();

  const { data: academicYears = [], isLoading: isLoadingYears } = useQuery({
    queryKey: ["academic-years"],
    queryFn: async () => {
      const response = await axiosClient.get(API_ENDPOINTS.SETTINGS.ACADEMIC_YEARS);
      return response.data?.data ?? response.data ?? [];
    },
  });


 const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students-list"],
    queryFn: async () => {
      try {

        const response = await axiosClient.get(API_ENDPOINTS.STUDENTS.FILTER, {
          params: {

            status: 'enrolled',
            per_page: 100  
          }
        }); 
        
        console.log("Students Fetched Successfully:", response.data);


        const rawData = response.data?.data?.data ?? response.data?.data ?? response.data?.items ?? [];

        return rawData.map((student: any) => ({
          id: student.studentId || student.id,
          name: student.fullName, 
        }));
      } catch (error) {
        console.error("Failed to fetch students:", error);
        return [];
      }
    },
  });

    const isLoadingDependencies = 
      isLoadingAccounts || isLoadingFeePlans || isLoadingPolicies || isLoadingYears || isLoadingStudents;


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
      onSuccess: () => {
        setCreateOpen(false);

        setTimeout(() => alert("تم اعتماد العقد بنجاح!"), 100);
      },
      onError: (error: any) => {
        const backendMessage = error.response?.data?.message;
        const validationErrors = error.response?.data?.errors;
        
        console.error("Backend Rejection Details:", error.response?.data);
        

        setTimeout(() => {
          if (validationErrors) {
            alert("خطأ في البيانات: \n" + JSON.stringify(validationErrors, null, 2));
          } else {
            alert("سبب الفشل: \n" + (backendMessage || "حدث خطأ غير معروف"));
          }
        }, 100);
      }
    });
  }


  function handleUpdateContract(studentId: string | number, values: any) {
    updateContract.mutate({ studentId, payload: values }, {
      onSuccess: () => {
        setEditOpen(false);
        setSelectedAccountToEdit(null);
      }
    });
  }

  if (isLoadingDependencies) {
    return <FinancePageSkeleton rows={5} />;
  }

  if (isAccountsError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-12 text-center">
        <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
          <RefreshCw size={24} className={isFetchingAccounts ? "animate-spin" : ""} />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-red-800">Failed to load contracts</h3>
        <Button
          variant="outline"
          className="mt-4 border-red-200 bg-white text-red-600 hover:bg-red-50"
          onClick={() => refetchAccounts()}
          disabled={isFetchingAccounts}
        >
          <RefreshCw size={16} className={isFetchingAccounts ? "mr-2 animate-spin" : "mr-2"} />
          {isFetchingAccounts ? "Trying Again..." : "Try Again"}
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[22px] border border-border/70 bg-card shadow-[0_14px_42px_rgba(38,24,84,0.055)]">
      <FinanceSectionHeader
        icon={<FileText size={19} strokeWidth={1.9} />}
        title="Student Financial Contracts"
        description="Create and manage each student's fee plan, selected services, and installment policy."
        action={
          <Button
            variant="outline"
            onClick={() => setCreateOpen(true)}
            className="h-11 rounded-[14px] border-primary/25 bg-background px-4 text-primary shadow-none hover:border-primary/40 hover:bg-primary/[0.04] hover:text-primary"
          >
            <Plus className="mr-2 h-4 w-4" /> Finalize Contract
          </Button>
        }
      />
      <div className="p-5 sm:p-6">
      <ContractsTable 
        accounts={accounts} 
        onViewDetails={(account) => {
          setSelectedStudentId(account.studentId);
          setDetailsOpen(true);
        }}

        onEdit={(account) => {
          setSelectedAccountToEdit(account);
          setEditOpen(true);
        }}
      />
      </div>

      <FinalizeContractDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        students={students}
        academicYears={academicYears}
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
        academicYears={academicYears}
        feePlans={feePlans}
        installmentPolicies={installmentPolicies}
        isLoading={updateContract.isPending}
        onSubmit={handleUpdateContract}
      />
    </div>
  );
}