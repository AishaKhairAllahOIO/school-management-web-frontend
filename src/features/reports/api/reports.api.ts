import { reportsMock } from "../mocks/reports.mock";
import type { ReportsResponse, ReportType } from "../types/reports.types";

export const fetchReports = async (): Promise<ReportsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return reportsMock;
};

export const generateReport = async (type: ReportType) => {
  await new Promise((resolve) => setTimeout(resolve, 120));

  return {
    success: true,
    message: `${type} report has been queued for generation.`,
  };
};
