import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";

import { axiosClient } from "@/services/axios/axiosClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";

import { FeePlansSection } from "../sections/FeePlansSection";
import { InstallmentPoliciesSection } from "../sections/InstallmentPoliciesSection";
import type { FinancialSection } from "./FinancialSettingsPage";

type Props = {
  activeSection: FinancialSection;
};

export const FinancialDashboard = ({ activeSection }: Props) => {
  const {
    data: academicYears = [],
    isLoading: isLoadingYears,
    isError: isYearsError,
  } = useQuery({
    queryKey: ["academic-years"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(
          API_ENDPOINTS.SETTINGS.ACADEMIC_YEARS,
        );
        return response.data?.data ?? response.data ?? [];
      } catch (error) {
        console.error("Failed to fetch academic years", error);
        return [];
      }
    },
  });

  const {
    data: gradeLevels = [],
    isLoading: isLoadingGrades,
    isError: isGradesError,
  } = useQuery({
    queryKey: ["grade-levels"],
    queryFn: async () => {
      try {
        const response = await axiosClient.get(
          API_ENDPOINTS.SETTINGS.ACADEMIC_GRADES,
        );
        return response.data?.data ?? response.data ?? [];
      } catch (error) {
        console.error("Failed to fetch grades", error);
        return [];
      }
    },
  });

  if (activeSection === "policies") {
    return <InstallmentPoliciesSection />;
  }

  const isLoadingDependencies = isLoadingYears || isLoadingGrades;
  const hasErrors = isYearsError || isGradesError;

  if (isLoadingDependencies) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 px-5 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-primary/[0.08] text-primary">
          <Loader2 size={20} className="animate-spin" />
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">Loading academic data</p>
          <p className="mt-1 text-xs text-muted-foreground">Preparing years and grade levels.</p>
        </div>
      </div>
    );
  }

  if (hasErrors) {
    return (
      <div className="m-5 flex min-h-[340px] flex-col items-center justify-center rounded-[18px] border border-destructive/15 bg-destructive/[0.025] px-6 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-destructive/[0.08] text-destructive">
          <RefreshCw size={19} />
        </span>
        <h3 className="mt-3 text-sm font-semibold text-foreground">Academic data is unavailable</h3>
        <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
          Fee plans require academic years and grade levels. Please verify the related API endpoints.
        </p>
      </div>
    );
  }

  return (
    <FeePlansSection
      academicYears={academicYears}
      gradeLevels={gradeLevels}
    />
  );
};
