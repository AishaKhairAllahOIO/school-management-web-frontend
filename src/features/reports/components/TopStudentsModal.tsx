import { Trophy, X, Medal } from "lucide-react";

export function TopStudentsModal({
  reportCards,
  isOpen,
  onClose,
}: {
  reportCards: any[];
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const topStudents = [...(reportCards || [])]
    .filter(
      (card) =>
        card.summary?.final_result === "passed" ||
        card.summary?.attendance_status === "passed",
    )
    .sort(
      (a, b) =>
        parseFloat(b.summary?.total_marks || "0") -
        parseFloat(a.summary?.total_marks || "0"),
    )
    .slice(0, 10);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[600px] overflow-hidden rounded-[24px] border border-border/60 bg-card text-card-foreground shadow-2xl animate-in zoom-in-95 duration-200 text-left">
        <header className="flex items-center justify-between border-b border-border/45 bg-warning/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-warning/30 bg-warning/20 text-warning">
              <Trophy size={24} strokeWidth={2} />
            </span>

            <div>
              <h2 className="text-[18px] font-semibold text-foreground">
                Honor Roll
              </h2>

              <p className="mt-1 text-[12px] font-medium text-muted-foreground">
                Top 10 performing students
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-border/60 bg-background text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
          >
            <X size={18} />
          </button>
        </header>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          {topStudents.length === 0 ? (
            <div className="py-10 text-center">
              <Trophy
                size={48}
                className="mx-auto mb-3 text-muted-foreground/30"
              />

              <p className="font-medium text-muted-foreground">
                Not enough data to display the honor roll.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {topStudents.map((student, index) => (
                <div
                  key={student.report_card_id || index}
                  className="flex items-center justify-between rounded-[16px] border border-border/60 bg-muted/10 p-4 shadow-sm transition-all hover:bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-[16px] font-semibold ${
                        index === 0
                          ? "border-warning/40 bg-warning/20 text-warning shadow-md"
                          : index === 1
                            ? "border-border bg-muted text-foreground shadow-sm"
                            : index === 2
                              ? "border-destructive/20 bg-destructive/10 text-destructive shadow-sm"
                              : "border-primary/20 bg-primary/10 text-primary"
                      }`}
                    >
                      {index < 3 ? <Medal size={22} /> : index + 1}
                    </div>

                    <div>
                      <h3 className="text-[15px] font-semibold text-foreground">
                        {student.student_name}
                      </h3>

                      <p className="mt-0.5 text-[11.5px] font-medium capitalize text-muted-foreground">
                        {student.grade_level} • {student.class_room}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[12px] border border-border/50 bg-background px-4 py-2 text-right shadow-2xs">
                    <span className="block text-[18px] font-semibold text-primary">
                      {student.summary?.total_marks || "0"}
                    </span>

                    <span className="mt-0.5 block text-[10px] font-medium text-muted-foreground">
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