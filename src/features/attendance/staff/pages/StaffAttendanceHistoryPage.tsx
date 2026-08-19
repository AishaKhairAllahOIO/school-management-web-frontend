import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarX, CheckCircle, Clock, FileText } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useStaffAttendanceHistory } from "../hooks/useStaffAttendance";

function formatDate(dateStr?: string) {
  if (!dateStr) return "N/A";
  return dateStr.split("T")[0];
}

export function StaffAttendanceHistoryPage() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  
  const { data: historyRecords = [], isLoading } = useStaffAttendanceHistory(employeeId!);

  const totalRecords = historyRecords.length;
  const totalAbsences = historyRecords.filter((r: any) => r.status === 'absent').length;
  const totalLeaves = historyRecords.filter((r: any) => r.status === 'on_leave').length;
  const partialAbsences = historyRecords.filter((r: any) => r.status === 'partial_absence').length;

  return (
    <section className="space-y-6 pt-5 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border/50 pb-5">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/attendance/staff')}
          className="h-9 w-9 rounded-[12px] border-border/70 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </Button>
        <div>
          <h1 className="text-[18px] font-extrabold tracking-tight text-foreground">Staff History</h1>
          <p className="text-[12.5px] text-muted-foreground font-medium mt-0.5">Detailed attendance history and leave records.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total Records" value={totalRecords} icon={FileText} color="violet" />
        <StatCard title="Full Absences" value={totalAbsences} icon={CalendarX} color="rose" />
        <StatCard title="Days On Leave" value={totalLeaves} icon={CheckCircle} color="amber" />
        <StatCard title="Partial Absences" value={partialAbsences} icon={Clock} color="sky" />
      </div>

      {/* History Table */}
      <div className="overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[700px] table-fixed">
            <thead className="bg-muted/40">
              <tr className="text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/50">
                <th className="h-12 px-6 text-start w-[20%]">Date</th>
                <th className="h-12 px-4 text-start w-[20%]">Status</th>
                <th className="h-12 px-4 text-start w-[20%]">Absence Type</th>
                <th className="h-12 px-6 text-start w-[40%]">Additional Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}><td colSpan={4} className="px-6 py-4"><div className="h-10 animate-pulse bg-muted/50 rounded-[12px]" /></td></tr>
                ))
              ) : historyRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-muted-foreground font-medium text-[13px]">
                    No attendance history found for this staff member.
                  </td>
                </tr>
              ) : (
                historyRecords.map((record: any) => (
                  <tr key={record.id} className="transition-colors hover:bg-muted/30 group">
                    <td className="px-6 py-4 font-bold text-foreground text-[12.5px]">
                      {formatDate(record.attendance_date)}
                    </td>
                    
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-[10px] text-[11.5px] font-bold capitalize border ${
                        record.status === 'present' ? 'text-success bg-success/10 border-success/25' : 
                        record.status === 'absent' ? 'text-destructive bg-destructive/10 border-destructive/25' : 
                        record.status === 'on_leave' ? 'text-warning bg-warning/10 border-warning/25' : 
                        'text-primary bg-primary/10 border-primary/25'
                      }`}>
                        {record.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {record.absence_type ? (
                        <span className={`text-[12px] font-semibold capitalize px-2 py-0.5 rounded-[6px] ${
                          record.absence_type === 'unexcused' ? 'text-warning bg-warning/10' : 'text-info bg-info/10'
                        }`}>
                          {record.absence_type}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60 font-medium">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {record.status === 'on_leave' && record.leave ? (
                        <div className="flex flex-col gap-1 bg-warning/10 border border-warning/25 rounded-[12px] p-2.5 w-max">
                          <span className="text-[11.5px] font-bold text-warning">
                            Leave ID: #{record.leave.id} <span className="opacity-70">({record.leave.days_count} Days)</span>
                          </span>
                          <span className="text-[11px] font-medium text-warning/90">
                            From {formatDate(record.leave.start_date)} to {formatDate(record.leave.end_date)}
                          </span>
                        </div>
                      ) : record.status === 'partial_absence' && record.period_attendances?.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {record.period_attendances.map((p: any, idx: number) => (
                            <span key={idx} className="bg-primary/10 text-primary border border-primary/25 text-[11px] font-bold px-2 py-1 rounded-[8px]">
                              Period {p.period_index || p.id}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/60 text-[12px] font-medium">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// كارد الإحصائيات 
function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: Record<string, string> = {
    violet: "bg-primary/10 text-primary border-primary/25",
    rose: "bg-destructive/10 text-destructive border-destructive/25",
    amber: "bg-warning/10 text-warning border-warning/25",
    sky: "bg-info/10 text-info border-info/25",
  };
  const theme = colors[color];

  return (
    <div className="flex items-center gap-3.5 rounded-[18px] border border-border/70 bg-card px-4 py-3.5 shadow-sm">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border ${theme}`}>
        <Icon className="h-4.5 w-4.5" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col justify-center gap-0.5">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
        <span className={`text-[17px] font-extrabold leading-none ${theme.split(' ')[1]}`}>{value}</span>
      </div>
    </div>
  );
}