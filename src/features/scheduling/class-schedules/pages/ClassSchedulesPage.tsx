// import { CalendarDays, Pencil, Plus, Trash2 } from "lucide-react";
// import { useMemo, useState } from "react";

// import { useClassrooms } from "@/features/academics/classrooms/hooks/useClassrooms";
// import { useGrades } from "@/features/academics/grades/hooks/useGrades";
// import { useSubjects } from "@/features/academics/subjects/hooks/useSubjects";
// import { ClassScheduleFormDialog } from "@/features/scheduling/class-schedules/components/ClassScheduleFormDialog";
// import {
//   timeSlots,
//   weekDays,
// } from "@/features/scheduling/class-schedules/mocks/class-schedules.mock";
// import {
//   useClassSchedules,
//   useCreateClassSchedule,
//   useDeleteClassSchedule,
//   useUpdateClassSchedule,
// } from "@/features/scheduling/class-schedules/hooks/useClassSchedules";
// import type {
//   ClassSchedule,
//   CreateClassSchedulePayload,
// } from "@/features/scheduling/class-schedules/types/class-schedule.types";
// import { GradeTabs } from "@/features/scheduling/components/GradeTabs";
// import { SchedulePageHeader } from "@/features/scheduling/components/SchedulePageHeader";
// import { useTeachers } from "@/features/users/teachers/hooks/useTeachers";

// const subjectClasses: Record<string, string> = {
//   "subject-arabic": "bg-success/10 text-success",
//   "subject-english": "bg-info/10 text-info",
//   "subject-math": "bg-primary/10 text-primary",
//   "subject-science": "bg-success/10 text-success",
//   "subject-french": "bg-warning/10 text-warning",
//   "subject-national": "bg-destructive/10 text-destructive",
//   "subject-sports": "bg-info/10 text-info",
// };

// function getFullName(firstName?: string, lastName?: string) {
//   return [firstName, lastName].filter(Boolean).join(" ") || "—";
// }

// export function ClassSchedulesPage() {
//   const { data: schedules = [], isLoading, isError } = useClassSchedules();
//   const { data: grades = [] } = useGrades();
//   const { data: classrooms = [] } = useClassrooms();
//   const { data: subjects = [] } = useSubjects();
//   const { data: teachers = [] } = useTeachers();

//   const createScheduleMutation = useCreateClassSchedule();
//   const updateScheduleMutation = useUpdateClassSchedule();
//   const deleteScheduleMutation = useDeleteClassSchedule();

//   const [gradeId, setGradeId] = useState("grade-7");
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
//   const [selectedSchedule, setSelectedSchedule] =
//     useState<ClassSchedule | null>(null);

//   const selectedGrade = grades.find((grade) => grade.id === gradeId);

//   const gradeOptions = grades.map((grade) => ({
//     label: grade.name,
//     value: grade.id,
//   }));

//   const classroomsInGrade = classrooms.filter(
//     (classroom) => classroom.gradeId === gradeId
//   );

//   const classroomIds = classroomsInGrade.map((classroom) => classroom.id);

//   const visibleSchedules = schedules.filter((schedule) =>
//     classroomIds.includes(schedule.classroomId)
//   );

//   const upcomingClasses = useMemo(
//     () =>
//       visibleSchedules
//         .filter((schedule) => schedule.status === "upcoming")
//         .slice(0, 6),
//     [visibleSchedules]
//   );

//   const classroomOptions = classroomsInGrade.map((item) => ({
//     label: item.name,
//     value: item.id,
//   }));

//   const subjectOptions = subjects.map((item) => ({
//     label: item.name,
//     value: item.id,
//   }));

//   const teacherOptions = teachers.map((item) => ({
//     label: getFullName(item.firstName, item.lastName),
//     value: item.id,
//   }));

//   function getSubjectName(subjectId: string) {
//     return subjects.find((subject) => subject.id === subjectId)?.name ?? "—";
//   }

//   function getTeacherName(teacherId: string) {
//     const teacher = teachers.find((item) => item.id === teacherId);
//     return getFullName(teacher?.firstName, teacher?.lastName);
//   }

//   function getClassroomName(classroomId: string) {
//     return classrooms.find((classroom) => classroom.id === classroomId)?.name ?? "—";
//   }

//   function getRoomNumber(classroomId: string, fallback?: string | null) {
//     return (
//       fallback ??
//       classrooms.find((classroom) => classroom.id === classroomId)?.roomNumber ??
//       "—"
//     );
//   }

//   function openCreateDialog() {
//     setDialogMode("create");
//     setSelectedSchedule(null);
//     setIsDialogOpen(true);
//   }

//   function openEditDialog(schedule: ClassSchedule) {
//     setDialogMode("edit");
//     setSelectedSchedule(schedule);
//     setIsDialogOpen(true);
//   }

//   async function handleSubmit(payload: CreateClassSchedulePayload) {
//     if (dialogMode === "create") {
//       await createScheduleMutation.mutateAsync(payload);
//     }

//     if (dialogMode === "edit" && selectedSchedule) {
//       await updateScheduleMutation.mutateAsync({
//         scheduleId: selectedSchedule.id,
//         payload,
//       });
//     }

//     setIsDialogOpen(false);
//     setSelectedSchedule(null);
//   }

//   async function handleDelete(scheduleId: string) {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this schedule?"
//     );

//     if (!confirmed) return;

//     await deleteScheduleMutation.mutateAsync(scheduleId);
//   }

//   if (isLoading) {
//     return (
//       <div className="soft-card rounded-3xl p-6">
//         Loading class schedules...
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="soft-card rounded-3xl p-6">
//         Failed to load class schedules.
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <section className="soft-card rounded-3xl p-6">
//         <div className="mb-5 flex items-start justify-between gap-4">
//           <SchedulePageHeader
//             title="Class Schedules"
//             description="View and manage class schedules by grade"
//             icon={CalendarDays}
//           />

//           <button
//             type="button"
//             onClick={openCreateDialog}
//             className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-soft transition hover:scale-[1.02] hover:bg-primary/90"
//           >
//             <Plus size={15} />
//             Add Schedule
//           </button>
//         </div>

//         <GradeTabs value={gradeId} onChange={setGradeId} items={gradeOptions} />

//         <div className="mt-6">
//           <h2 className="mb-4 text-base font-bold text-foreground">
//             Weekly Class Timetable - {selectedGrade?.name ?? "—"}
//           </h2>

//           <div className="overflow-x-auto rounded-2xl border border-border/70">
//             <table className="w-full min-w-[980px] border-collapse">
//               <thead>
//                 <tr className="bg-muted/40">
//                   <th className="border-b border-r border-border/70 px-4 py-3 text-sm font-bold">
//                     Time
//                   </th>

//                   {weekDays.map((day) => (
//                     <th
//                       key={day}
//                       className="border-b border-r border-border/70 px-4 py-3 text-sm font-bold last:border-r-0"
//                     >
//                       {day}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {timeSlots.map((slot) => (
//                   <tr key={slot.id}>
//                     <td className="border-b border-r border-border/70 px-4 py-3 text-center text-sm font-semibold">
//                       {slot.label}
//                     </td>

// <<<<<<< HEAD
//                     {weekDays.map((day) => {
//                       const cell = visibleSchedules.find(
//                         (item) =>
//                           item.day === day && item.timeSlotId === slot.id
//                       );

//                       return (
//                         <td
//                           key={`${slot.id}-${day}`}
//                           className="border-b border-r border-border/70 px-4 py-3 last:border-r-0"
//                         >
//                           {cell ? (
//                             <button
//                               type="button"
//                               onClick={() => openEditDialog(cell)}
//                               className={[
//                                 "w-full rounded-xl px-3 py-2 text-center text-xs font-semibold transition hover:scale-[1.02]",
//                                 subjectClasses[cell.subjectId] ??
//                                   "bg-muted text-muted-foreground",
//                               ].join(" ")}
//                             >
//                               <p>{getSubjectName(cell.subjectId)}</p>

//                               <p className="mt-1 text-[10px] opacity-75">
//                                 {getClassroomName(cell.classroomId)}
//                               </p>
//                             </button>
//                           ) : (
//                             <span className="text-muted-foreground">—</span>
//                           )}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </section>

//       <section className="soft-card rounded-3xl p-6">
//         <h2 className="mb-4 text-base font-bold text-foreground">
//           Upcoming Classes
//         </h2>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[860px]">
//             <thead>
//               <tr className="border-b border-border/70 text-left text-xs uppercase text-muted-foreground">
//                 <th className="py-3">Day</th>
//                 <th>Time</th>
//                 <th>Subject</th>
//                 <th>Teacher</th>
//                 <th>Classroom</th>
//                 <th>Room</th>
//                 <th>Status</th>
//                 <th className="text-right">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {upcomingClasses.map((item) => {
//                 const slot = timeSlots.find(
//                   (timeSlot) => timeSlot.id === item.timeSlotId
//                 );

//                 return (
//                   <tr key={item.id} className="border-b border-border/60">
//                     <td className="py-4 text-sm">{item.day}</td>

//                     <td className="text-sm text-muted-foreground">
//                       {slot?.label ?? "—"}
//                     </td>

//                     <td>
//                       <span
//                         className={[
//                           "rounded-full px-3 py-1 text-xs font-semibold",
//                           subjectClasses[item.subjectId] ??
//                             "bg-muted text-muted-foreground",
//                         ].join(" ")}
//                       >
//                         {getSubjectName(item.subjectId)}
//                       </span>
//                     </td>

//                     <td className="text-sm text-muted-foreground">
//                       {getTeacherName(item.teacherId)}
//                     </td>

//                     <td className="text-sm text-muted-foreground">
//                       {getClassroomName(item.classroomId)}
//                     </td>

//                     <td className="text-sm text-muted-foreground">
//                       {getRoomNumber(item.classroomId, item.roomNumber)}
//                     </td>

//                     <td>
//                       <span className="rounded-full bg-info/10 px-3 py-1 text-xs font-semibold text-info">
//                         Upcoming
//                       </span>
//                     </td>

//                     <td>
//                       <div className="flex justify-end gap-2">
//                         <button
//                           type="button"
//                           onClick={() => openEditDialog(item)}
//                           className="flex h-8 w-8 items-center justify-center rounded-xl bg-info/10 text-info transition hover:bg-info/20"
//                         >
//                           <Pencil size={14} />
//                         </button>

//                         <button
//                           type="button"
//                           onClick={() => handleDelete(item.id)}
//                           className="flex h-8 w-8 items-center justify-center rounded-xl bg-destructive/10 text-destructive transition hover:bg-destructive/20"
//                         >
//                           <Trash2 size={14} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}

//               {upcomingClasses.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={8}
//                     className="py-10 text-center text-sm text-muted-foreground"
//                   >
//                     No upcoming classes found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </section>

//       <ClassScheduleFormDialog
//         open={isDialogOpen}
//         mode={dialogMode}
//         schedule={selectedSchedule}
//         classroomOptions={classroomOptions}
//         subjectOptions={subjectOptions}
//         teacherOptions={teacherOptions}
//         academicYearId="year-2024-2025"
//         isSubmitting={
//           createScheduleMutation.isPending || updateScheduleMutation.isPending
//         }
//         onClose={() => {
//           setIsDialogOpen(false);
//           setSelectedSchedule(null);
//         }}
//         onSubmit={handleSubmit}
//       />
// =======
// //               {upcomingClasses.length === 0 && (
// //                 <tr>
// //                   <td
// //                     colSpan={7}
// //                     className="py-10 text-center text-sm text-muted-foreground"
// //                   >
// //                     No upcoming classes found.
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }

// export function ClassSchedulesPage() {
//   return (
//     <div className="p-6 rounded-3xl border border-border/70 bg-card text-center text-sm text-muted-foreground">
//       Class schedules are under construction.
// >>>>>>> eda85da6a42b280ef2904d76f2bf1c05c3269c29
//     </div>
//   );
// }