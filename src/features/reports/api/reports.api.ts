import { reportsMock } from "../mocks/reports.mock";
import type {
  ReportBuilderSelection,
  ReportsResponse,
} from "../types/reports.types";

export async function fetchReports(): Promise<ReportsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 420));
  return reportsMock;
}

export async function generateReport(selection: ReportBuilderSelection) {
  await new Promise((resolve) => setTimeout(resolve, 700));

  return {
    success: true,
    message: `${selection.template.title} has been queued as ${selection.format}.`,
  };
}
