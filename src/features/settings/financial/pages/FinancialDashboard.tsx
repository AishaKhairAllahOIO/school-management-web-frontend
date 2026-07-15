import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints"; // تأكد من مسار الاستيراد حسب مجلداتك
import { FeePlansSection } from "../sections/FeePlansSection";
import { InstallmentPoliciesSection } from "../sections/InstallmentPoliciesSection";
import { useInstallmentPolicies } from "../hooks/useInstallmentPolicies";

export const FinancialDashboard = () => {

  const [activeTab, setActiveTab] = useState<"fee-plans" | "policies">("fee-plans");


  const { data: policies = [], isLoading: isLoadingPolicies } = useInstallmentPolicies();
  
  const installmentPoliciesOptions = policies.map((policy) => ({
    id: policy.id,
    name: policy.name,
  }));


  const { data: academicYears = [], isLoading: isLoadingYears } = useQuery({
    queryKey: ["academic-years"],
    queryFn: async () => {

      const response = await axiosClient.get(API_ENDPOINTS.SETTINGS.ACADEMIC_YEARS);;
      return response.data.data ?? [];
    },
  });


  const { data: gradeLevels = [], isLoading: isLoadingGrades } = useQuery({
    queryKey: ["grade-levels"],
    queryFn: async () => {

      const response = await axiosClient.get(API_ENDPOINTS.SETTINGS.ACADEMIC_GRADES);
      return response.data.data ?? [];
    },
  });

  const isLoadingDependencies = isLoadingPolicies || isLoadingYears || isLoadingGrades;

  return (
    <div className="mt-8 space-y-8">
      

      <div className="grid w-full max-w-md grid-cols-2 rounded-2xl border border-border/50 bg-muted/30 p-1 shadow-sm">
        <button
          onClick={() => setActiveTab("fee-plans")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "fee-plans"
              ? "bg-white text-violet-700 shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Fee Plans
        </button>
        
        <button
          onClick={() => setActiveTab("policies")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "policies"
              ? "bg-white text-violet-700 shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Policies
        </button>
      </div>


      <div className="rounded-3xl border border-border/70 bg-white p-8 shadow-sm min-h-[400px]">
        
        {activeTab === "fee-plans" && (
          <div>
            {isLoadingDependencies ? (
              <div className="flex h-40 w-full items-center justify-center text-muted-foreground">
                Loading academic data...
              </div>
            ) : (
              <FeePlansSection
                academicYears={academicYears}
                gradeLevels={gradeLevels}
                installmentPolicies={installmentPoliciesOptions}
              />
            )}
          </div>
        )}

        {activeTab === "policies" && (
          <div>
            <InstallmentPoliciesSection />
          </div>
        )}

      </div>
    </div>
  );
};