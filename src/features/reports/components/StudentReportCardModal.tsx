import { 
  X, Printer, CheckCircle2, XCircle, AlertTriangle, GraduationCap, School
} from "lucide-react";

export function StudentReportCardModal({ 
  student, 
  isOpen, 
  onClose 
}: { 
  student: any; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  // استخراج البيانات مباشرة من الطالب (بفرض أن الباك إند أصبح يرسلها)
  const studentName = student.student_name;
  const gradeName = student.grade_name ;
  const classroomName = student.classroom_name ;
  const mentorName = student.mentor_name ;
  const principalName = student.principal_name ;
  const semesterName = student.semester_name ;

  const summary = student.summary || {};
  const subjects = student.subjects || [];
  const isPassed = summary.final_result === 'passed' || student.academic_result === 'passed';

  return (
    <>
      <style>
        {`
          @media print {
            body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background: white !important; }
            @page { size: A4 portrait; margin: 0; }
            body * { visibility: hidden; }
            #print-container, #print-container * { visibility: visible; }
            #print-container { position: absolute; left: 0; top: 0; width: 100%; background: white; }
            .print-page {
              width: 210mm; height: 296mm; padding: 15mm 20mm; margin: 0 auto;
              background: white; box-sizing: border-box; page-break-after: always; overflow: hidden;
            }
            .print-page:last-child { page-break-after: auto; }
          }
        `}
      </style>

      {/* النافذة على الشاشة */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 print:hidden">
        <div className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-[32px] bg-background shadow-2xl border border-border/50">
          
          <div className="sticky top-0 z-20 flex items-center justify-between bg-background/90 backdrop-blur-xl px-8 py-5 border-b border-border/50 rounded-t-[32px]">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                <School size={24} />
              </span>
              <div>
                <h2 className="text-[18px] font-extrabold text-foreground">Report Card Preview</h2>
                <p className="text-[12px] font-medium text-muted-foreground">Official format (Ready for print)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="inline-flex h-11 items-center gap-2.5 rounded-[14px] bg-primary px-6 text-[13px] font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
              >
                <Printer size={18} /> Print Report Card
              </button>
              <button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-muted/50 border border-border/60 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-8 text-foreground font-sans">
             <ReportCardContent 
               studentName={studentName} summary={summary} subjects={subjects} isPassed={isPassed} 
               classroomName={classroomName} gradeName={gradeName} semesterName={semesterName} 
               mentorName={mentorName} principalName={principalName}
             />
          </div>
        </div>
      </div>

      {/* حاوية الطباعة الخاصة */}
      <div id="print-container" className="hidden print:block font-sans text-black bg-white">
         <ReportCardContent 
           studentName={studentName} summary={summary} subjects={subjects} isPassed={isPassed} 
           classroomName={classroomName} gradeName={gradeName} semesterName={semesterName} 
           mentorName={mentorName} principalName={principalName} isPrint={true} 
         />
      </div>
    </>
  );
}

// تصميم الجلاء الرسمي بالعربي
function ReportCardContent({ studentName, summary, subjects, isPassed, classroomName, gradeName, semesterName, mentorName, principalName, isPrint = false }: any) {
    return (
        <>
            {/* الصفحة الأولى: الغلاف */}
            <div className={`flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-b from-primary/[0.04] to-background rounded-[24px] border border-primary/10 p-10 relative overflow-hidden ${isPrint ? 'print-page print:rounded-none print:border-none print:bg-none print:bg-gradient-to-b print:from-primary/[0.04] print:to-white' : ''}`}>
                
                <div className="relative z-10 flex flex-col items-center w-full max-w-2xl text-center space-y-10">
                  <div className="space-y-6 flex flex-col items-center">
                    <div className="space-y-1.5">
                      <h2 className="text-[22px] font-bold tracking-wide">الجمهورية العربية السورية</h2>
                      <h3 className="text-[18px] font-semibold text-muted-foreground print:text-black">وزارة التربية - مديرية التربية والتعليم</h3>
                    </div>
                    <svg viewBox="0 0 600 400" className="w-44 h-auto shadow-md border border-border/50 print:border-black rounded-[4px] bg-white">
                      <rect width="600" height="133.33" fill="#007a3d"/>
                      <rect y="133.33" width="600" height="133.33" fill="#ffffff"/>
                      <rect y="266.66" width="600" height="133.33" fill="#000000"/>
                      <g fill="#ce1126">
                        <polygon points="150,155 161,185 192,185 167,204 176,235 150,216 124,235 133,204 108,185 139,185" />
                        <polygon points="300,155 311,185 342,185 317,204 326,235 300,216 274,235 283,204 258,185 289,185" />
                        <polygon points="450,155 461,185 492,185 467,204 476,235 450,216 424,235 433,204 408,185 439,185" />
                      </g>
                    </svg>
                  </div>

                  <div className="space-y-5 flex flex-col items-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                      <GraduationCap size={48} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                      <h1 className="text-[40px] font-black text-primary">الجــــلاء المدرســـيّ</h1>
                      <h2 className="text-[22px] font-bold text-muted-foreground print:text-black">( مرحلة التعليم الأساسي )</h2>
                    </div>
                  </div>

                  <div className="w-full bg-card print:bg-transparent rounded-[20px] border-2 border-primary/20 print:border-black p-8 shadow-sm print:shadow-none">
                    <div className="grid grid-cols-1 gap-6 text-start">
                      <div className="flex items-end gap-3 border-b-2 border-dotted border-border/60 print:border-black pb-2">
                        <span className="text-[18px] font-bold text-muted-foreground print:text-black min-w-[120px]">اسم التلميذ/ة:</span>
                        <span className="text-[24px] font-black">{studentName}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-end gap-3 border-b-2 border-dotted border-border/60 print:border-black pb-2">
                          <span className="text-[18px] font-bold text-muted-foreground print:text-black min-w-[60px]">الصف:</span>
                          <span className="text-[20px] font-bold">{gradeName}</span>
                        </div>
                        <div className="flex items-end gap-3 border-b-2 border-dotted border-border/60 print:border-black pb-2">
                          <span className="text-[18px] font-bold text-muted-foreground print:text-black min-w-[70px]">الشعبة:</span>
                          <span className="text-[20px] font-bold">{classroomName}</span>
                        </div>
                      </div>
                      <div className="flex items-end gap-3 border-b-2 border-dotted border-border/60 print:border-black pb-2">
                        <span className="text-[18px] font-bold text-muted-foreground print:text-black min-w-[120px]">الفصل الدراسي:</span>
                        <span className="text-[22px] font-bold tracking-widest">{semesterName}</span>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            {!isPrint && (
               <div className="my-12 border-b-2 border-dashed border-primary/20 w-2/3 mx-auto relative flex justify-center">
                  <span className="absolute -top-3 bg-background px-4 text-xs font-bold text-muted-foreground">نهاية الغلاف (الصفحة 1)</span>
               </div>
            )}

            {/* الصفحة الثانية: التفاصيل */}
            <div className={`space-y-4 ${isPrint ? 'print-page pt-0' : 'pt-6'}`}>
                
                <div className="hidden print:flex items-center justify-between border-b-2 border-black pb-2 mb-4 mt-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary print:border-2 print:border-black print:bg-white print:text-black text-primary-foreground">
                      <GraduationCap size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-[18px] font-black">الجــــلاء المدرســـيّ</h2>
                      <p className="text-[12px] font-bold">مرحلة التعليم الأساسي</p>
                    </div>
                  </div>
                  <div className="text-end text-[12px] font-bold space-y-1">
                    <p>اسم التلميذ/ة: {studentName}</p>
                    <p>الفصل الدراسي: {semesterName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 bg-card border border-border/50 print:border-black p-3 rounded-[12px] print:rounded-none shadow-sm print:shadow-none">
                  <div>
                    <div className="text-[11px] text-muted-foreground print:text-black font-semibold">المجموع النهائي</div>
                    <div className="text-[14px] font-black">{summary.total_marks ?? '0'} <span className="text-[11px] text-muted-foreground print:text-black font-normal">/ {summary.max_total_marks ?? '0'}</span></div>
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground print:text-black font-semibold">النتيجة النهائية</div>
                    <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-[4px] text-[11px] font-bold ${
                      isPassed ? 'bg-success/10 text-success print:bg-transparent print:text-black' : 'bg-destructive/10 text-destructive print:bg-transparent print:text-black'
                    }`}>
                      {isPassed ? <CheckCircle2 size={12} className="print:hidden"/> : <XCircle size={12} className="print:hidden"/>}
                      {isPassed ? 'ناجــح' : 'راســب'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground print:text-black font-semibold">نسبة الدوام</div>
                    <div className="text-[14px] font-bold text-primary print:text-black">{summary.attendance_percentage ?? '100%'}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground print:text-black font-semibold">غياب مبرر</div>
                    <div className="text-[14px] font-bold text-warning print:text-black">{summary.justified_absences ?? '0'} أيام</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground print:text-black font-semibold">غياب غير مبرر</div>
                    <div className="text-[14px] font-bold text-destructive print:text-black">{summary.unjustified_absences ?? (summary.absences_count ?? '0')} أيام</div>
                  </div>
                </div>

                {summary.failure_reasons && summary.failure_reasons.length > 0 && !isPassed && (
                  <div className="rounded-[12px] print:rounded-none bg-destructive/10 print:bg-transparent border border-destructive/20 print:border-black p-3 text-destructive print:text-black space-y-1 mb-2">
                    <div className="flex items-center gap-1.5 font-bold text-[12px]">
                      <AlertTriangle size={14} className="print:hidden"/>
                      <span>ملاحظات وأسباب عدم النجاح:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 ps-2 text-[11px] font-medium">
                      {summary.failure_reasons.map((reason: string, idx: number) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="overflow-hidden rounded-[12px] print:rounded-none border border-border/60 print:border-black bg-card print:bg-transparent shadow-sm print:shadow-none">
                  <table className="w-full text-start text-[10px] print:text-[11px]">
                    <thead>
                      <tr className="border-b border-border/50 print:border-black bg-primary/10 print:bg-gray-100 text-primary print:text-black">
                        <th className="px-2 py-2 text-start font-bold">المادة الدراسية</th>
                        <th className="px-1 py-2 text-center font-bold">الشفوي</th>
                        <th className="px-1 py-2 text-center font-bold">الوظائف</th>
                        <th className="px-1 py-2 text-center font-bold">مذاكرة 1</th>
                        <th className="px-1 py-2 text-center font-bold">مذاكرة 2</th>
                        <th className="px-1 py-2 text-center font-bold">المشاركة</th>
                        <th className="px-1 py-2 text-center font-bold">الامتحان</th>
                        <th className="px-1 py-2 text-center font-black border-r border-border/50 print:border-black bg-primary/5 print:bg-gray-200">العلامة</th>
                        <th className="px-1 py-2 text-center font-bold">الحد الأعلى</th>
                        <th className="px-1 py-2 text-center font-bold text-destructive/80 print:text-black">الأدنى</th>
                        <th className="px-2 py-2 text-center font-bold">النتيجة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 print:divide-black">
                      {subjects.map((sub: any, index: number) => {
                        const ev = sub.evaluations || {};
                        const isSubPassed = sub.status === 'passed';
                        return (
                          <tr key={index} className="transition-colors hover:bg-muted/30 print:hover:bg-transparent">
                            <td className="px-2 py-1.5 font-bold text-[11px]">{sub.subject_name}</td>
                            <td className="px-1 py-1.5 text-center text-muted-foreground print:text-black font-medium">{ev.oral?.mark ?? '-'}</td>
                            <td className="px-1 py-1.5 text-center text-muted-foreground print:text-black font-medium">{ev.homework?.mark ?? '-'}</td>
                            <td className="px-1 py-1.5 text-center text-muted-foreground print:text-black font-medium">{ev.quiz1?.mark ?? '-'}</td>
                            <td className="px-1 py-1.5 text-center text-muted-foreground print:text-black font-medium">{ev.quiz2?.mark ?? '-'}</td>
                            <td className="px-1 py-1.5 text-center text-muted-foreground print:text-black font-medium">{ev.participation?.mark ?? '-'}</td>
                            <td className="px-1 py-1.5 text-center text-muted-foreground print:text-black font-medium">{ev.exam?.mark ?? '-'}</td>
                            <td className="px-1 py-1.5 text-center font-black border-r border-border/50 print:border-black bg-primary/[0.02] print:bg-transparent text-[12px]">{sub.subject_total}</td>
                            <td className="px-1 py-1.5 text-center font-bold text-foreground print:text-black">{sub.max_mark}</td>
                            <td className="px-1 py-1.5 text-center font-bold text-destructive/80 print:text-black">{sub.passing_mark}</td>
                            <td className="px-2 py-1.5 text-center">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold ${
                                isSubPassed ? 'bg-success/15 text-success print:bg-transparent print:text-black' : 'bg-destructive/15 text-destructive print:bg-transparent print:text-black'
                              }`}>
                                {isSubPassed ? 'ناجح' : 'راسب'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="pt-6 grid grid-cols-3 text-center text-[12px] font-bold mt-2 text-foreground/80 print:text-black">
                  <div className="space-y-6">
                    <p>الموجه: {mentorName}</p>
                    <div className="border-b border-dotted border-border/60 print:border-black w-2/3 mx-auto"></div>
                  </div>
                  <div className="space-y-6">
                    <p>المدير: {principalName}</p>
                    <div className="border-b border-dotted border-border/60 print:border-black w-2/3 mx-auto"></div>
                  </div>
                  <div className="space-y-3">
                    <p>الختم الرسمي</p>
                    <div className="h-16 w-16 border-2 border-dashed border-primary/40 print:border-black rounded-full mx-auto flex items-center justify-center text-[10px] text-muted-foreground print:text-black">
                      مكان الختم
                    </div>
                  </div>
                </div>
            </div>
        </>
    )
}