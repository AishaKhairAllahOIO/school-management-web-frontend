import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react"; 

import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints"; 

import { FeePlansSection } from "../sections/FeePlansSection";
import { InstallmentPoliciesSection } from "../sections/InstallmentPoliciesSection";

export const FinancialDashboard = () => {
  const [activeTab, setActiveTab] = useState<"fee-plans" | "policies">("fee-plans");

  const { data: academicYears = [], isLoading: isLoadingYears, isError: isYearsError } = useQuery({
    queryKey: ["academic-years"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(API_ENDPOINTS.SETTINGS.ACADEMIC_YEARS);
        return response.data?.data ?? response.data ?? [];
      } catch (error) {
        console.error("Failed to fetch academic years", error);
        return [];
      }
    },
  });


  const { data: gradeLevels = [], isLoading: isLoadingGrades, isError: isGradesError } = useQuery({
    queryKey: ["grade-levels"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(API_ENDPOINTS.SETTINGS.ACADEMIC_GRADES);
        return response.data?.data ?? response.data ?? [];
      } catch (error) {
        console.error("Failed to fetch grades", error);
        return [];
      }
    },
  });


  const isLoadingDependencies = isLoadingYears || isLoadingGrades;
  const hasErrors = isYearsError || isGradesError;

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
              <div className="flex h-64 w-full flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                <span className="font-medium text-muted-foreground">
                  Loading academic data...
                </span>
              </div>
            ) : hasErrors ? (
              <div className="flex h-40 w-full items-center justify-center text-red-500 bg-red-50 rounded-xl border border-red-200">
                Failed to load Academic Years or Grade Levels. Please check the API endpoints.
              </div>
            ) : (
              <FeePlansSection
                academicYears={academicYears}
                gradeLevels={gradeLevels}
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