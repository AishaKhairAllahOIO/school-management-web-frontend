import { Trophy, X, Medal } from "lucide-react";

export function TopStudentsModal({ 
  reportCards, 
  isOpen, 
  onClose 
}: { 
  reportCards: any[];
  isOpen: boolean; 
  onClose: () => void; 
}) {
  if (!isOpen) return null;

  // Logic: Filter passed students, sort by total marks descending, pick top 10
  const topStudents = [...(reportCards || [])]
    .filter(card => 
      card.summary?.final_result === 'passed' || 
      card.summary?.attendance_status === 'passed'
    )
    .sort((a, b) => parseFloat(b.summary?.total_marks || "0") - parseFloat(a.summary?.total_marks || "0"))
    .slice(0, 10);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[600px] overflow-hidden rounded-[24px] border border-border/60 bg-card shadow-2xl animate-in zoom-in-95 duration-200 text-left">
        
        {/* Header */}
        <header className="border-b border-border/45 px-6 py-5 bg-primary/[0.03] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-yellow-100 text-yellow-600 shadow-sm border border-yellow-200">
              <Trophy size={24} strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-[18px] font-extrabold text-foreground">Honor Roll</h2>
              <p className="mt-1 text-[12px] font-medium text-muted-foreground">
                Top 10 performing students
              </p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-muted/50 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
            <X size={18} />
          </button>
        </header>

        {/* Students List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {topStudents.length === 0 ? (
             <div className="text-center py-10">
               <Trophy size={48} className="mx-auto text-muted-foreground/30 mb-3" />
               <p className="text-muted-foreground font-medium">Not enough data to display the honor roll.</p>
             </div>
          ) : (
            <div className="space-y-3">
              {topStudents.map((student, index) => (
                <div key={student.report_card_id || index} className="flex items-center justify-between p-4 rounded-[16px] border border-border/60 bg-background hover:border-primary/30 transition-all shadow-sm">
                  
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-black text-[16px] ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600 shadow-md border border-yellow-300' :
                      index === 1 ? 'bg-gray-100 text-gray-500 shadow-sm border border-gray-300' :
                      index === 2 ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-200' :
                      'bg-primary/5 text-primary border border-primary/10'
                    }`}>
                      {index < 3 ? <Medal size={22}/> : index + 1}
                    </div>
                    
                    <div>
                      <h3 className="text-[15px] font-bold text-foreground">{student.student_name}</h3>
                      <p className="text-[11px] font-medium text-muted-foreground mt-0.5 capitalize">
                        {student.grade_level} • {student.class_room}
                      </p>
                    </div>
                  </div>

                  <div className="text-right bg-muted/30 px-4 py-2 rounded-[12px]">
                    <span className="block text-[18px] font-black text-primary">
                      {student.summary?.total_marks || "0"}
                    </span>
                    <span className="block text-[10px] text-muted-foreground font-bold mt-0.5">
                      out of {student.summary?.max_total_marks || "0"}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}