import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/services/axios/axiosClient";

import { FeePlansSection } from "../sections/FeePlansSection";
import { InstallmentPoliciesSection } from "../sections/InstallmentPoliciesSection";
import { useInstallmentPolicies } from "../hooks/useInstallmentPolicies";

export const FinancialDashboard = () => {
  // حالة (State) للتحكم بالقسم المعروض حالياً (قسمين فقط)
  const [activeTab, setActiveTab] = useState<"fee-plans" | "policies">("fee-plans");

  // 1. جلب سياسات التقسيط الحقيقية
  const { data: policies = [], isLoading: isLoadingPolicies } = useInstallmentPolicies();
  
  const installmentPoliciesOptions = policies.map((policy) => ({
    id: policy.id,
    name: policy.name,
  }));

  // 2. جلب السنوات الدراسية الحقيقية من الـ API
  const { data: academicYears = [], isLoading: isLoadingYears } = useQuery({
    queryKey: ["academic-years"],
    queryFn: async () => {
      // تنويه: تأكد أن هذا المسار يطابق مسار الباك إند لديك
      const response = await axiosClient.get("/api/admin/academic-years");
      return response.data.data ?? [];
    },
  });

  // 3. جلب المراحل الدراسية الحقيقية من الـ API
  const { data: gradeLevels = [], isLoading: isLoadingGrades } = useQuery({
    queryKey: ["grade-levels"],
    queryFn: async () => {
      // تنويه: تأكد أن هذا المسار يطابق مسار الباك إند لديك
      const response = await axiosClient.get("/api/admin/grade-levels");
      return response.data.data ?? [];
    },
  });

  const isLoadingDependencies = isLoadingPolicies || isLoadingYears || isLoadingGrades;

  return (
    <div className="mt-8 space-y-8">
      
      {/* شريط التبويبات (Tabs) - مقسم لعمودين فقط */}
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

      {/* محتوى كل قسم بناءً على التبويبة النشطة */}
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