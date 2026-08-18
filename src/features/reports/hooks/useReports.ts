import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DollarSign,
  GraduationCap,
  UserCheck,
  Users,
  CalendarDays,
  Wallet,
  Clock,
} from "lucide-react";
import { reportsApi } from "../api/reports.api";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/axios/axiosClient";
import { getAxiosErrorMessage } from "@/services/axios/axiosError";
import type {
  ReportFormat,
  ReportTemplate,
  ReportsWorkspaceData,
} from "../types/reports.types";
import jsPDF from "jspdf";

/* ========================================================================== */
/*                   1. REPORT CARDS & PROMOTION HOOKS (الجلاءات)             */
/* ========================================================================== */

export const reportCardKeys = {
  all: ["report-cards"] as const,
  list: (semesterId?: string | number, classRoomId?: string | number) => 
    [...reportCardKeys.all, "list", { semesterId, classRoomId }] as const,
};


export function useReportCards(semesterId?: string | number, classRoomId?: string | number) {
  return useQuery({
    queryKey: reportCardKeys.list(semesterId, classRoomId),
    queryFn: async () => {
      const response = await axiosClient.get(API_ENDPOINTS.REPORT_CARDS.LIST, {
        params: { semester_id: semesterId, class_room_id: classRoomId },
      });
      return response.data?.data;
    },
    enabled: !!semesterId, 
  });
}


export function useGenerateReportCards() {
  return useMutation({
    mutationFn: async (payload: { semester_id: string | number; class_room_id?: string | number }) => {
      const response = await axiosClient.post(API_ENDPOINTS.REPORT_CARDS.GENERATE, payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "تم بدء عملية توليد الجلاءات في الخلفية، سيتم إشعارك عند الانتهاء.");
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}


export function useTogglePublishReportCards() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { semester_id: string | number; class_room_id?: string | number; is_published: boolean }) => {
      const response = await axiosClient.post(API_ENDPOINTS.REPORT_CARDS.TOGGLE_PUBLISH, payload);
      return response.data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: reportCardKeys.all });
      toast.success(data.message || "تم تعديل حالة النشر بنجاح.");
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error));
    },
  });
}


export function usePromoteStudents() {
  return useMutation({
    mutationFn: async (payload: { from_academic_year_id: string | number; to_academic_year_id: string | number }) => {
      const response = await axiosClient.post(API_ENDPOINTS.REPORT_CARDS.PROMOTE, payload);
      return response.data;
    },
    onSuccess: (data) => {
      const stats = data.data;
      if (stats) {
        toast.success(
          `${data.message} (تم ترفيع: ${stats.promoted_students_count}، تخرج: ${stats.graduated_students_count})`
        );
      } else {
        toast.success(data.message || "تم تنفيذ عملية الترفيع السنوي بنجاح.");
      }
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error) || "حدث خطأ أثناء عملية الترفيع.");
    },
  });
}

/* ========================================================================== */
/*                     2. REPORTS WORKSPACE HOOKS (التقارير التحليلية)         */
/* ========================================================================== */

const getReportTemplates = (): ReportTemplate[] => [
  {
    id: "student-attendance-summary",
    title: "Student Attendance & Classroom Breakdown",
    description: "Full breakdown of attendance and absence rates across all classrooms and sections.",
    category: "Attendance",
    formats: ["PDF", "CSV", "JSON"],
    tone: "success",
    icon: CalendarDays,
    featured: true,
    endpoint: API_ENDPOINTS.REPORTS?.ATTENDANCE?.STUDENTS || "/admin/reports/attendance/students",
  },
  {
    id: "staff-attendance-report",
    title: "Staff Attendance & Missed Periods",
    description: "Teacher attendance rates, excused/unexcused absences, and missed class periods per subject.",
    category: "Staff",
    formats: ["PDF", "CSV", "JSON"],
    tone: "info",
    icon: UserCheck,
    featured: true,
    endpoint: API_ENDPOINTS.REPORTS?.ATTENDANCE?.STAFF || "/admin/reports/attendance/staff",
  },
  {
    id: "student-finance-revenue",
    title: "Student Fee Collection & Outstanding Revenue",
    description: "Summary of expected vs collected student tuition fees, outstanding balances, and collection rates.",
    category: "Finance",
    formats: ["PDF", "CSV", "JSON"],
    tone: "primary",
    icon: DollarSign,
    featured: true,
    endpoint: API_ENDPOINTS.REPORTS?.FINANCE?.STUDENTS || "/admin/reports/finance/students",
  },
  {
    id: "staff-payroll-summary",
    title: "Staff Payroll & Salary Disbursements",
    description: "Detailed report of total net salaries paid, processed payroll runs, and average teacher compensation.",
    category: "Finance",
    formats: ["PDF", "CSV", "JSON"],
    tone: "warning",
    icon: Wallet,
    endpoint: API_ENDPOINTS.REPORTS?.FINANCE?.STAFF || "/admin/reports/finance/staff",
  },
];

export function useReports() {
  return useQuery<ReportsWorkspaceData>({
    queryKey: ["reports-workspace-data"],
    queryFn: async () => {
      const [studentAtt, staffAtt, studentFin, staffFin] = await Promise.allSettled([
        reportsApi.getStudentAttendance(),
        reportsApi.getStaffAttendance(),
        reportsApi.getStudentFinance(),
        reportsApi.getStaffFinance(),
      ]);

      const sAtt = studentAtt.status === "fulfilled" ? (studentAtt.value ?? null) : null;
      const stAtt = staffAtt.status === "fulfilled" ? (staffAtt.value ?? null) : null;
      const sFin = studentFin.status === "fulfilled" ? (studentFin.value ?? null) : null;
      const stFin = staffFin.status === "fulfilled" ? (staffFin.value ?? null) : null;

      const metrics: ReportsWorkspaceData["metrics"] = [
        {
          title: "Total Students",
          value: sAtt?.total_students ?? "—",
          change: sAtt ? `${sAtt.overall_attendance_rate}% Att.` : undefined,
          tone: "primary",
          icon: GraduationCap,
          category: "Attendance",
        },
        {
          title: "Total Staff",
          value: stAtt?.total_staff ?? "—",
          change: stAtt ? `${stAtt.overall_attendance_rate}% Att.` : undefined,
          tone: "info",
          icon: Users,
          category: "Staff",
        },
        {
          title: "Student Attendance",
          value: sAtt ? `${sAtt.overall_attendance_rate}%` : "—",
          change: sAtt ? `-${sAtt.overall_absence_rate}% Abs.` : undefined,
          tone: "success",
          icon: UserCheck,
          category: "Attendance",
        },
        {
          title: "Collected Revenue",
          value: sFin ? `$${sFin.total_collected_revenue?.toLocaleString()}` : "—",
          change: sFin ? `${sFin.overall_collection_rate}% Collected` : undefined,
          tone: "primary",
          icon: DollarSign,
          category: "Finance",
        },
        {
          title: "Salaries Paid",
          value: stFin ? `$${stFin.total_net_salaries_paid?.toLocaleString()}` : "—",
          change: stFin ? `${stFin.total_payrolls_processed} Payrolls` : undefined,
          tone: "warning",
          icon: Wallet,
          category: "Finance",
        },
        {
          title: "Missed Periods",
          value: stAtt?.total_missed_periods_count ?? "—",
          change: stAtt ? `${stAtt.total_unexcused_days} Unexcused` : undefined,
          tone: "destructive",
          icon: Clock,
          category: "Staff",
        },
      ];

      return { 
        metrics, 
        templates: getReportTemplates(),
        studentAttendance: sAtt,
        staffAttendance: stAtt,
        studentFinance: sFin,
        staffFinance: stFin,
        recentReports: [], 
      };
    },
    staleTime: 1000 * 60 * 5,
  });
}

function convertToCSV(data: any): string {
  if (!data) return "";
  const items = Array.isArray(data) ? data : [data];
  if (!items.length) return "";
  
  const replacer = (_key: string, value: any) => value === null ? '' : value; 
  const header = Object.keys(items[0]);
  const csv = [
    header.join(','),
    ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName] ?? "", replacer)).join(','))
  ].join('\r\n');
  
  return csv;
}

export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      template,
      format,
      academicYear,
      dateRange,
    }: {
      template: ReportTemplate;
      format: ReportFormat;
      academicYear: string;
      dateRange: string;
    }) => {
      
      if (!template.endpoint) {
        throw new Error("Report endpoint is undefined");
      }

      const response = await axiosClient.get(template.endpoint, {
        params: { academic_year: academicYear, date_range: dateRange },
      });

      const rawData = response.data?.data || response.data;
      let blob: Blob;
      const fileName = `${template.title.replace(/\s+/g, "_")}_${dateRange}`;

      if (format === "JSON") {
        const jsonString = JSON.stringify(rawData, null, 2);
        blob = new Blob([jsonString], { type: "application/json" });
        downloadBlob(blob, `${fileName}.json`);

      } else if (format === "CSV") {
        const csvData = rawData?.classrooms_summary || rawData?.missed_periods_by_subject || rawData;
        const csvString = convertToCSV(csvData);
        blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        downloadBlob(blob, `${fileName}.csv`);

    } else {

      const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(template.title, 14, 20);
        doc.setFontSize(10);
        doc.text(`Academic Year: ${academicYear} | Period: ${dateRange}`, 14, 28);


        let yPos = 40;
        doc.setFontSize(11);
        
        if (Array.isArray(rawData)) {
          rawData.forEach((item, index) => {
            const line = Object.entries(item)
              .map(([key, val]) => `${key}: ${val}`)
              .join(" | ");
            doc.text(`${index + 1}. ${line}`, 14, yPos);
            yPos += 8;
            if (yPos > 280) { doc.addPage(); yPos = 20; }
          });
        } else {
          Object.entries(rawData).forEach(([key, val]) => {
            doc.text(`${key.replace(/_/g, ' ')}: ${typeof val === 'object' ? JSON.stringify(val) : String(val)}`, 14, yPos);
            yPos += 8;
          });
        }

        blob = doc.output('blob');
        downloadBlob(blob, `${fileName}.pdf`);
      }
      return {
        success: true,
        message: `${template.title} generated successfully as ${format}.`,
        format,
        template,
        blob,
        filename: `${fileName}.${format.toLowerCase()}`
      };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.setQueryData(["reports-workspace-data"], (oldData: any) => {
        if (!oldData) return oldData;
        
        const newExport = {
          id: Date.now().toString(),
          title: data.template.title,
          category: data.template.category,
          format: data.format,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: "Ready",
          blob: data.blob,
          filename: data.filename,
        };

        return {
          ...oldData,
          recentReports: [newExport, ...(oldData.recentReports || [])].slice(0, 5)
        };
      });
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error) || "Failed to generate report.");
    },
  });
}


function downloadBlob(blob: Blob, filename: string) {
  if (typeof document === 'undefined') return; 
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link); 
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}