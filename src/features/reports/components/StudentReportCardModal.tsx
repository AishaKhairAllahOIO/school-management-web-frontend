import { 
  X, Printer, CheckCircle2, XCircle, AlertTriangle, GraduationCap, School 
} from "lucide-react";
import { useGeneralSettings } from "../../settings/general/hooks/useGeneralSettings.ts"; 
import { useAcademicSettings } from "../../settings/academic/hooks/useAcademicSettings.ts";

export function StudentReportCardModal({ 
  student, isOpen, onClose 
}: { 
  student: any; isOpen: boolean; onClose: () => void; 
}) {
  const { data: generalSettings } = useGeneralSettings();
  const { data: academicData } = useAcademicSettings();

  if (!isOpen || !student) return null;

  const handlePrint = () => window.print();

  const studentName = student.student_name;
  const gradeName = student.grade_level; 
  const classroomName = student.class_room;
  const mentorName = student.supervisor;
  const principalName = student.school_manager;
  const serialNumber = student.student_id; 
  const semesterName = student.semester_name; 
  
  const schoolName = student.school_name || generalSettings?.schoolName || "اسم المدرسة غير متوفر"; 
  const currentYearObj = academicData?.academicYears?.find((y: any) => y.isCurrent) || academicData?.academicYears?.[0];
  const academicYear = student.academic_year_name || currentYearObj?.name || ""; 

  const summary = student.summary || {};
  const subjects = student.subjects || [];
  const isPassed = summary.final_result === 'passed' || student.academic_result === 'passed';

  return (
    <>
      <style>
        {`
          @media print {
            body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background: white !important; margin: 0; padding: 0; }
            @page { size: A4 portrait; margin: 0; }
            body * { visibility: hidden; }
            #print-container, #print-container * { visibility: visible; }
            #print-container { position: absolute; left: 0; top: 0; width: 210mm; background: white; margin: 0; padding: 0; }
            

            .print-page {
              width: 210mm; 
              height: 296mm; 
              padding: 10mm 15mm; 
              margin: 0;
              background: white; 
              box-sizing: border-box; 
              page-break-after: always;
              page-break-inside: avoid;
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }
            .print-page:last-of-type { page-break-after: avoid; }
          }
        `}
      </style>

      {/* 💻 العرض على الشاشة 💻 */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 print:hidden" dir="rtl">
        <div className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-[32px] bg-background shadow-2xl border border-border/50 text-right">
          
          <div className="sticky top-0 z-20 flex items-center justify-between bg-background/90 backdrop-blur-xl px-8 py-5 border-b border-border/50 rounded-t-[32px]">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="inline-flex h-11 items-center gap-2.5 rounded-[14px] bg-primary px-6 text-[13px] font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
              >
                <Printer size={18} /> طباعة الجلاء
              </button>
              <button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-muted/50 border border-border/60 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-3 mr-auto">
              <div className="text-left">
                <h2 className="text-[18px] font-extrabold text-foreground">معاينة الجلاء المدرسي</h2>
                <p className="text-[12px] font-medium text-muted-foreground">التنسيق الرسمي للطباعة</p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                <School size={24} />
              </span>
            </div>
          </div>

          <div className="p-8 text-foreground font-sans">
             <ReportCardContent 
               studentName={studentName} summary={summary} subjects={subjects} isPassed={isPassed} 
               classroomName={classroomName} gradeName={gradeName} semesterName={semesterName} 
               mentorName={mentorName} principalName={principalName} schoolName={schoolName} 
               academicYear={academicYear} serialNumber={serialNumber}
             />
          </div>
        </div>
      </div>

      {/* 🖨️ حاوية الطباعة الخاصة 🖨️ */}
      <div id="print-container" className="hidden print:block font-sans text-black bg-white" dir="rtl">
         <ReportCardContent 
           studentName={studentName} summary={summary} subjects={subjects} isPassed={isPassed} 
           classroomName={classroomName} gradeName={gradeName} semesterName={semesterName} 
           mentorName={mentorName} principalName={principalName} schoolName={schoolName} 
           academicYear={academicYear} serialNumber={serialNumber} isPrint={true} 
         />
      </div>
    </>
  );
}

// -------------------------------------------------------------
// 🌟 مكون محتوى الجلاء الداخلي (غلاف + جدول) 🌟
// -------------------------------------------------------------
function ReportCardContent({ 
  studentName, summary, subjects, isPassed, classroomName, gradeName, 
  semesterName, mentorName, principalName, schoolName, academicYear, serialNumber, isPrint = false 
}: any) {
    return (
        <>
            {/* 📄 الصفحة الأولى: الغلاف 📄 */}
            <div className={`flex flex-col min-h-[70vh] bg-gradient-to-b from-primary/[0.04] to-background rounded-[24px] border border-primary/10 px-10 relative overflow-hidden ${isPrint ? 'print-page print:rounded-none print:border-none print:bg-none print:bg-white' : 'pb-16 pt-12'}`}>
                
                {/* 🌟 إضافة my-auto و justify-center لتنزيل المحتوى لوسط الورقة 🌟 */}
                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto text-center space-y-8 print:space-y-12 my-auto pt-8">
                  
                  <div className="space-y-6 print:space-y-8 flex flex-col items-center">
                    <div className="space-y-2">
                      <h2 className="text-[24px] font-bold tracking-wide">الجمهورية العربية السورية</h2>
                      <h3 className="text-[18px] font-semibold text-muted-foreground print:text-black">وزارة التربية - مديرية التربية والتعليم</h3>
                    </div>
                    {/* العلم السوري (تم تكبيره قليلاً لملء الفراغ) */}
                    <svg viewBox="0 0 600 400" className="w-40 print:w-48 h-auto shadow-md border border-border/50 print:border-black rounded-[4px] bg-white">
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

                  <div className="space-y-4 print:space-y-5 flex flex-col items-center">
                    <div className="flex h-20 w-20 print:h-24 print:w-24 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg print:border-2 print:border-black print:bg-white print:text-black">
                      <GraduationCap size={44} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                      <h1 className="text-[36px] print:text-[40px] font-black text-primary print:text-black">الجــــلاء المدرســـيّ</h1>
                      <h2 className="text-[20px] print:text-[22px] font-bold text-muted-foreground print:text-black">( مرحلة التعليم الأساسي )</h2>
                    </div>
                  </div>

                  <div className="w-full max-w-md bg-card print:bg-transparent rounded-[20px] border-2 border-primary/20 print:border-black p-8 shadow-sm print:shadow-none mx-auto">
                    <div className="flex flex-col gap-6 text-right">
                      <div className="flex items-center justify-between border-b border-border/30 print:border-black/20 pb-3">
                        <span className="text-[16px] print:text-[18px] font-bold text-muted-foreground print:text-black whitespace-nowrap min-w-max">اسم التلميذ/ة:</span>
                        <span className="text-[18px] print:text-[20px] font-black text-foreground print:text-black text-left">{studentName}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-border/30 print:border-black/20 pb-3">
                        <span className="text-[16px] print:text-[18px] font-bold text-muted-foreground print:text-black whitespace-nowrap min-w-max">المدرسة:</span>
                        <span className="text-[17px] print:text-[19px] font-bold text-foreground print:text-black text-left">{schoolName}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-border/30 print:border-black/20 pb-3">
                        <span className="text-[16px] print:text-[18px] font-bold text-muted-foreground print:text-black whitespace-nowrap min-w-max">الصف:</span>
                        <span className="text-[17px] print:text-[19px] font-bold text-foreground print:text-black capitalize text-left">{gradeName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[16px] print:text-[18px] font-bold text-muted-foreground print:text-black whitespace-nowrap min-w-max">الشعبة:</span>
                        <span className="text-[17px] print:text-[19px] font-bold text-foreground print:text-black text-left">{classroomName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🌟 رفع العام الدراسي لأعلى قليلاً بزيادة pb 🌟 */}
                <div className="mt-auto w-full flex flex-col items-center justify-center text-center space-y-2 pt-6 pb-6 print:pb-20">
                  <span className="text-[14px] print:text-[16px] font-bold text-muted-foreground print:text-black">{semesterName}</span>
                  <div className="flex items-center gap-1 text-[13px] print:text-[15px] font-semibold text-muted-foreground print:text-black justify-center">
                    <span>العام الدراسي:</span>
                    <span dir="ltr">{academicYear}</span>
                  </div>
                </div>
            </div>

            {!isPrint && (
               <div className="my-12 border-b-2 border-dashed border-primary/20 w-2/3 mx-auto relative flex justify-center">
                  <span className="absolute -top-3 bg-background px-4 text-xs font-bold text-muted-foreground">نهاية الغلاف (الصفحة 1)</span>
               </div>
            )}

            {/* 📄 الصفحة الثانية: التفاصيل (الجدول والملاحظات المصغرة) 📄 */}
            <div className={`flex flex-col ${isPrint ? 'print-page bg-white' : 'pt-6 space-y-4 overflow-x-auto min-h-screen pb-10'}`}>
                
                {/* الترويسة العلوية للجدول */}
                <div className="hidden print:flex shrink-0 items-center justify-between border-b-2 border-black pb-2 mb-3 mt-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white text-black">
                      <GraduationCap size={20} strokeWidth={1.5} />
                    </div>
                    <div className="text-right text-black">
                      <h2 className="text-[16px] font-black">الجــــلاء المدرســـيّ</h2>
                      <p className="text-[11px] font-bold">مرحلة التعليم الأساسي</p>
                    </div>
                  </div>
                  <div className="text-left text-[11px] font-bold space-y-1 text-black">
                    <p>اسم التلميذ/ة: {studentName}</p>
                    <p>الرقم التسلسلي: {serialNumber}</p>
                  </div>
                </div>

                {/* شريط الإحصائيات (مصغر للطباعة ليتسع بصفحة واحدة) */}
                <div className="shrink-0 flex flex-row flex-wrap sm:flex-nowrap items-center justify-between gap-4 mb-3 bg-card print:bg-transparent border border-border/50 print:border-black py-2 print:py-1.5 px-6 rounded-[12px] print:rounded-none shadow-sm print:shadow-none min-w-[600px]">
                  <div className="flex flex-col items-center">
                    <div className="text-[10px] print:text-[10px] text-muted-foreground print:text-black font-bold mb-0.5">المجموع النهائي</div>
                    <div className="text-[13px] print:text-[13px] font-black print:text-black" dir="ltr">{summary.total_marks ?? '-'} <span className="text-[9px] print:text-[10px] text-muted-foreground print:text-black font-normal">/ {summary.max_total_marks ?? '-'}</span></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-[10px] print:text-[10px] text-muted-foreground print:text-black font-bold mb-0.5">النتيجة النهائية</div>
                    <div className={`inline-flex items-center justify-center gap-1 px-3 py-0.5 rounded-[4px] text-[12px] print:text-[12px] font-bold ${
                      isPassed ? 'text-success print:text-black' : 'text-destructive print:text-black'
                    }`}>
                      {isPassed ? <CheckCircle2 size={12} className="print:hidden"/> : <XCircle size={12} className="print:hidden"/>}
                      {isPassed ? 'ناجــح' : 'راســب'}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-[10px] print:text-[10px] text-muted-foreground print:text-black font-bold mb-0.5">نسبة الدوام</div>
                    <div className="text-[13px] print:text-[13px] font-bold text-primary print:text-black" dir="ltr">{summary.attendance_percentage ?? '-'}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-[10px] print:text-[10px] text-muted-foreground print:text-black font-bold mb-0.5">غياب مبرر</div>
                    <div className="text-[13px] print:text-[13px] font-bold text-warning print:text-black">0 أيام</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-[10px] print:text-[10px] text-muted-foreground print:text-black font-bold mb-0.5">غياب غير مبرر</div>
                    <div className="text-[13px] print:text-[13px] font-bold text-destructive print:text-black">{summary.absences_count ?? '0'} أيام</div>
                  </div>
                </div>

                {summary.failure_reasons && summary.failure_reasons.length > 0 && !isPassed && (
                  <div className="shrink-0 rounded-[12px] print:rounded-none bg-destructive/10 print:bg-transparent border border-destructive/20 print:border-black p-2 text-destructive print:text-black space-y-1 mb-2 text-right">
                    <div className="flex items-center gap-1.5 font-bold text-[11px] print:text-[11px]">
                      <AlertTriangle size={13} className="print:hidden"/>
                      <span>ملاحظات وأسباب عدم النجاح:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 pr-2 text-[10px] print:text-[10px] font-medium">
                      {summary.failure_reasons.map((reason: string, idx: number) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 🌟 الجدول 🌟 */}
                <div className="w-full rounded-[12px] print:rounded-none border border-border/60 print:border-black bg-card print:bg-transparent shadow-sm print:shadow-none min-w-[600px] flex flex-col mb-3">
                  <table className="w-full text-center text-[10px] print:text-[11.5px]">
                    <thead>
                      <tr className="border-b border-border/50 print:border-black bg-muted/50 print:bg-gray-100 text-muted-foreground print:text-black">
                        <th className="px-2 py-2 print:py-2 text-right font-bold">المادة الدراسية</th>
                        <th className="px-1 py-2 print:py-2 font-bold">الشفوي</th>
                        <th className="px-1 py-2 print:py-2 font-bold">الوظائف</th>
                        <th className="px-1 py-2 print:py-2 font-bold">مذاكرة 1</th>
                        <th className="px-1 py-2 print:py-2 font-bold">مذاكرة 2</th>
                        <th className="px-1 py-2 print:py-2 font-bold">المشاركة</th>
                        <th className="px-1 py-2 print:py-2 font-bold">الامتحان</th>
                        <th className="px-1 py-2 print:py-2 font-black border-x border-border/50 print:border-black bg-primary/5 print:bg-gray-200">العلامة</th>
                        <th className="px-1 py-2 print:py-2 font-bold">الحد الأعلى</th>
                        <th className="px-1 py-2 print:py-2 font-bold text-destructive/80 print:text-black">الأدنى</th>
                        <th className="px-2 py-2 print:py-2 font-bold">النتيجة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 print:divide-black">
                      {subjects.map((sub: any, index: number) => {
                        const ev = sub.evaluations || {};
                        const isSubPassed = sub.status === 'passed';
                        return (
                          <tr key={index} className="transition-colors hover:bg-muted/30 print:hover:bg-transparent">
                            <td className="px-2 py-1.5 print:py-1.5 font-bold text-[11px] print:text-[12.5px] text-right">{sub.subject_name}</td>
                            <td className="px-1 py-1.5 print:py-1.5 text-muted-foreground print:text-black font-medium">{ev.oral?.mark ?? '-'}</td>
                            <td className="px-1 py-1.5 print:py-1.5 text-muted-foreground print:text-black font-medium">{ev.homework?.mark ?? '-'}</td>
                            <td className="px-1 py-1.5 print:py-1.5 text-muted-foreground print:text-black font-medium">{ev.quiz1?.mark ?? '-'}</td>
                            <td className="px-1 py-1.5 print:py-1.5 text-muted-foreground print:text-black font-medium">{ev.quiz2?.mark ?? '-'}</td>
                            <td className="px-1 py-1.5 print:py-1.5 text-muted-foreground print:text-black font-medium">{ev.participation?.mark ?? '-'}</td>
                            <td className="px-1 py-1.5 print:py-1.5 text-muted-foreground print:text-black font-medium">{ev.exam?.mark ?? '-'}</td>
                            <td className="px-1 py-1.5 print:py-1.5 font-black border-x border-border/50 print:border-black bg-primary/[0.02] print:bg-transparent text-[12px] print:text-[13.5px]">{sub.subject_total ?? '-'}</td>
                            <td className="px-1 py-1.5 print:py-1.5 font-bold text-foreground print:text-black">{sub.max_mark ?? '-'}</td>
                            <td className="px-1 py-1.5 print:py-1.5 font-bold text-destructive/80 print:text-black">{sub.passing_mark ?? '-'}</td>
                            <td className="px-2 py-1.5 print:py-1.5">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[9px] print:text-[11px] font-bold ${
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

                <div className="w-full flex flex-col gap-3 text-right pt-2 shrink-0">
                   <div className="border border-border/50 print:border-black rounded-[12px] print:rounded-none p-4 min-h-[60px] print:min-h-[70px]">
                       <p className="font-bold text-[13px] print:text-[13px] mb-4 text-foreground print:text-black">ملاحظات ولي الأمر:</p>
                       <div className="border-b border-dashed border-border/60 print:border-black w-full mb-5"></div>
                       <div className="border-b border-dashed border-border/60 print:border-black w-full"></div>
                   </div>

                   <div className="pt-2 pb-1 grid grid-cols-4 text-center text-[12px] print:text-[12px] font-bold text-foreground/80 print:text-black min-w-[600px]">
                     <div className="space-y-4">
                       <p>الختم الرسمي</p>
                       <div className="h-14 w-14 print:h-16 print:w-16 border-2 border-dashed border-primary/40 print:border-black rounded-full mx-auto flex items-center justify-center text-[10px] print:text-[10.5px] text-muted-foreground print:text-black">
                         مكان الختم
                       </div>
                     </div>
                     <div className="space-y-6">
                       <p>المدير: {principalName}</p>
                       <div className="border-b border-dotted border-border/60 print:border-black w-2/3 mx-auto"></div>
                     </div>
                     <div className="space-y-6">
                       <p>الموجه: {mentorName}</p>
                       <div className="border-b border-dotted border-border/60 print:border-black w-2/3 mx-auto"></div>
                     </div>
                     <div className="space-y-6">
                       <p>توقيع ولي الأمر</p>
                       <div className="border-b border-dotted border-border/60 print:border-black w-2/3 mx-auto"></div>
                     </div>
                   </div>
                </div>

            </div>
        </>
    )
}