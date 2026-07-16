// import {
//   Edit3,
//   Eye,
//   MoreVertical,
//   Power,
//   Search,
//   Trash2,
//   Upload,
//   UserPlus,
// } from "lucide-react";
// import {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   type ReactNode,
// } from "react";

// import { StudentImportPanel } from "../components/StudentImportPanel";
// import { StudentRegistrationDialog } from "../components/StudentRegistrationDialog";
// import {
//   useStudents,
//   useToggleStudentAccount,
//   useWithdrawStudent,
// } from "../hooks/useStudents";
// import type {
//   EnrollmentStatus,
//   StudentListFilters,
//   StudentListItem,
// } from "../types/student-api.types";

// export function StudentsPage() {
//   const [searchValue, setSearchValue] =
//     useState("");

//   const [debouncedSearch, setDebouncedSearch] =
//     useState("");

//   const [gradeLevel, setGradeLevel] =
//     useState("");

//   const [classroomName, setClassroomName] =
//     useState("");

//   const [status, setStatus] =
//     useState<EnrollmentStatus | "">("");

//   const [sort, setSort] =
//     useState<"asc" | "desc">("asc");

//   const [page, setPage] =
//     useState(1);

//   const [
//     isRegistrationOpen,
//     setIsRegistrationOpen,
//   ] = useState(false);

//   const [isImportOpen, setIsImportOpen] =
//     useState(false);

//   useEffect(() => {
//     const timeout = window.setTimeout(() => {
//       setDebouncedSearch(searchValue.trim());
//       setPage(1);
//     }, 350);

//     return () => {
//       window.clearTimeout(timeout);
//     };
//   }, [searchValue]);

//   const filters =
//     useMemo<StudentListFilters>(
//       () => ({
//         query:
//           debouncedSearch || undefined,

//         level: gradeLevel
//           ? Number(gradeLevel)
//           : undefined,

//         classroomName:
//           classroomName.trim() || undefined,

//         status: status || undefined,
//         sort,
//         page,
//       }),
//       [
//         debouncedSearch,
//         gradeLevel,
//         classroomName,
//         status,
//         sort,
//         page,
//       ],
//     );

//   const studentsQuery =
//     useStudents(filters);

//   const students =
//     studentsQuery.data?.items ?? [];

//   const pagination =
//     studentsQuery.data?.meta;

//   const withdrawStudentMutation =
//     useWithdrawStudent();

//   const toggleStatusMutation =
//     useToggleStudentAccount();

//   function handleWithdraw(
//     student: StudentListItem,
//   ) {
//     const confirmed = window.confirm(
//       `Withdraw ${student.fullName}'s file? This will suspend the academic enrollment and disable the account without permanently deleting the data.`,
//     );

//     if (!confirmed) {
//       return;
//     }

//     withdrawStudentMutation.mutate(
//       student.enrollmentId,
//     );
//   }

//   function handlePageChange(
//     nextPage: number,
//   ) {
//     const lastPage =
//       pagination?.lastPage ?? 1;

//     if (
//       nextPage < 1 ||
//       nextPage > lastPage ||
//       nextPage === page
//     ) {
//       return;
//     }

//     setPage(nextPage);
//   }

//   return (
//     <div className="space-y-6">
//       <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-foreground">
//             Students
//           </h1>

//           <p className="mt-1 text-sm text-muted-foreground">
//             Manage student records, guardians and
//             academic enrollment.
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-3">
//           <button
//             type="button"
//             onClick={() =>
//               setIsImportOpen(true)
//             }
//             className="flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-bold text-foreground transition hover:bg-muted"
//           >
//             <Upload size={17} />
//             Import Excel
//           </button>

//           <button
//             type="button"
//             onClick={() =>
//               setIsRegistrationOpen(true)
//             }
//             className="flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
//           >
//             <UserPlus size={17} />
//             Add Student
//           </button>
//         </div>
//       </header>

//       <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
//         <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_150px_180px_170px_140px]">
//           <label className="relative block">
//             <Search
//               size={17}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
//             />

//             <input
//               value={searchValue}
//               onChange={(event) =>
//                 setSearchValue(
//                   event.target.value,
//                 )
//               }
//               placeholder="Search students..."
//               className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm font-semibold outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
//             />
//           </label>

//           <input
//             type="number"
//             min={1}
//             value={gradeLevel}
//             onChange={(event) => {
//               setGradeLevel(
//                 event.target.value,
//               );
//               setPage(1);
//             }}
//             placeholder="Grade level"
//             className="h-11 rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
//           />

//           <input
//             value={classroomName}
//             onChange={(event) => {
//               setClassroomName(
//                 event.target.value,
//               );
//               setPage(1);
//             }}
//             placeholder="Classroom name"
//             className="h-11 rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
//           />

//           <select
//             value={status}
//             onChange={(event) => {
//               setStatus(
//                 event.target
//                   .value as EnrollmentStatus | "",
//               );
//               setPage(1);
//             }}
//             className="h-11 rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none"
//           >
//             <option value="">
//               All statuses
//             </option>

//             <option value="pending">
//               Pending
//             </option>

//             <option value="enrolled">
//               Enrolled
//             </option>

//             <option value="suspended">
//               Suspended
//             </option>
//           </select>

//           <select
//             value={sort}
//             onChange={(event) => {
//               setSort(
//                 event.target.value as
//                   | "asc"
//                   | "desc",
//               );
//               setPage(1);
//             }}
//             className="h-11 rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none"
//           >
//             <option value="asc">
//               Ascending
//             </option>

//             <option value="desc">
//               Descending
//             </option>
//           </select>
//         </div>
//       </section>

//       <section className="overflow-visible rounded-3xl border border-border/70 bg-card shadow-soft">
//         {studentsQuery.isLoading ? (
//           <div className="p-10 text-center text-sm font-semibold text-muted-foreground">
//             Loading students...
//           </div>
//         ) : studentsQuery.isError ? (
//           <div className="p-10 text-center">
//             <p className="text-sm font-bold text-destructive">
//               Failed to load students.
//             </p>

//             <button
//               type="button"
//               onClick={() => {
//                 void studentsQuery.refetch();
//               }}
//               className="mt-4 h-10 rounded-xl border border-border px-5 text-xs font-bold text-foreground hover:bg-muted"
//             >
//               Try Again
//             </button>
//           </div>
//         ) : students.length === 0 ? (
//           <div className="p-10 text-center text-sm font-semibold text-muted-foreground">
//             No students found.
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[1000px]">
//                 <thead className="bg-muted/40">
//                   <tr className="border-b border-border text-left">
//                     <TableHeader>
//                       Student
//                     </TableHeader>

//                     <TableHeader>
//                       Grade
//                     </TableHeader>

//                     <TableHeader>
//                       Classroom
//                     </TableHeader>

//                     <TableHeader>
//                       Status
//                     </TableHeader>

//                     <TableHeader>
//                       Student ID
//                     </TableHeader>

//                     <TableHeader>
//                       Guardian ID
//                     </TableHeader>

//                     <TableHeader>
//                       Enrollment ID
//                     </TableHeader>

//                     <TableHeader>
//                       Actions
//                     </TableHeader>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {students.map((student) => (
//                     <tr
//                       key={student.enrollmentId}
//                       className="border-b border-border/70 last:border-0"
//                     >
//                       <TableCell>
//                         <div>
//                           <p className="font-bold text-foreground">
//                             {student.fullName}
//                           </p>

//                           <p className="mt-1 text-xs text-muted-foreground">
//                             User #{student.userId}
//                           </p>
//                         </div>
//                       </TableCell>

//                       <TableCell>
//                         {student.grade?.name ??
//                           "—"}
//                       </TableCell>

//                       <TableCell>
//                         {student.classroom?.name ??
//                           "—"}
//                       </TableCell>

//                       <TableCell>
//                         <StatusBadge
//                           status={student.status}
//                         />
//                       </TableCell>

//                       <TableCell>
//                         {student.studentId}
//                       </TableCell>

//                       <TableCell>
//                         {student.guardianId}
//                       </TableCell>

//                       <TableCell>
//                         {student.enrollmentId}
//                       </TableCell>

//                       <TableCell>
//                         <StudentActions
//                           student={student}
//                           disabled={
//                             withdrawStudentMutation.isPending ||
//                             toggleStatusMutation.isPending
//                           }
//                           onWithdraw={() =>
//                             handleWithdraw(student)
//                           }
//                           onToggleStatus={() =>
//                             toggleStatusMutation.mutate(
//                               student.enrollmentId,
//                             )
//                           }
//                         />
//                       </TableCell>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <Pagination
//               currentPage={
//                 pagination?.currentPage ?? 1
//               }
//               lastPage={
//                 pagination?.lastPage ?? 1
//               }
//               disabled={
//                 studentsQuery.isFetching
//               }
//               onPageChange={handlePageChange}
//             />
//           </>
//         )}
//       </section>

//       <StudentRegistrationDialog
//         open={isRegistrationOpen}
//         onClose={() =>
//           setIsRegistrationOpen(false)
//         }
//       />

//       <StudentImportPanel
//         open={isImportOpen}
//         onClose={() =>
//           setIsImportOpen(false)
//         }
//       />
//     </div>
//   );
// }

// function StudentActions({
//   student,
//   disabled,
//   onWithdraw,
//   onToggleStatus,
// }: {
//   student: StudentListItem;
//   disabled: boolean;
//   onWithdraw: () => void;
//   onToggleStatus: () => void;
// }) {
//   const [open, setOpen] =
//     useState(false);

//   const containerRef =
//     useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (!open) {
//       return;
//     }

//     function handleOutsideClick(
//       event: MouseEvent,
//     ) {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(
//           event.target as Node,
//         )
//       ) {
//         setOpen(false);
//       }
//     }

//     function handleEscape(
//       event: KeyboardEvent,
//     ) {
//       if (event.key === "Escape") {
//         setOpen(false);
//       }
//     }

//     document.addEventListener(
//       "mousedown",
//       handleOutsideClick,
//     );

//     document.addEventListener(
//       "keydown",
//       handleEscape,
//     );

//     return () => {
//       document.removeEventListener(
//         "mousedown",
//         handleOutsideClick,
//       );

//       document.removeEventListener(
//         "keydown",
//         handleEscape,
//       );
//     };
//   }, [open]);

//   return (
//     <div
//       ref={containerRef}
//       className="relative"
//     >
//       <button
//         type="button"
//         aria-label={`Actions for ${student.fullName}`}
//         aria-expanded={open}
//         disabled={disabled}
//         onClick={() =>
//           setOpen((current) => !current)
//         }
//         className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
//       >
//         <MoreVertical size={17} />
//       </button>

//       {open ? (
//         <div className="absolute right-0 top-11 z-30 w-52 rounded-2xl border border-border bg-card p-2 shadow-xl">
//           <button
//             type="button"
//             disabled
//             title="Connect this action to the full-profile dialog."
//             className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-muted-foreground opacity-50"
//           >
//             <Eye size={15} />
//             View Full Profile
//           </button>

//           <button
//             type="button"
//             disabled
//             title="Connect this action to the student edit dialog."
//             className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-muted-foreground opacity-50"
//           >
//             <Edit3 size={15} />
//             Edit Student
//           </button>

//           <button
//             type="button"
//             onClick={() => {
//               setOpen(false);
//               onToggleStatus();
//             }}
//             className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-warning hover:bg-warning/10"
//           >
//             <Power size={15} />
//             Toggle Account Status
//           </button>

//           <button
//             type="button"
//             onClick={() => {
//               setOpen(false);
//               onWithdraw();
//             }}
//             className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-destructive hover:bg-destructive/10"
//           >
//             <Trash2 size={15} />
//             Withdraw Student File
//           </button>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// function StatusBadge({
//   status,
// }: {
//   status: EnrollmentStatus;
// }) {
//   const className =
//     status === "enrolled"
//       ? "border-success/20 bg-success/10 text-success"
//       : status === "suspended"
//         ? "border-destructive/20 bg-destructive/10 text-destructive"
//         : "border-warning/20 bg-warning/10 text-warning";

//   return (
//     <span
//       className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${className}`}
//     >
//       {status}
//     </span>
//   );
// }

// function Pagination({
//   currentPage,
//   lastPage,
//   disabled,
//   onPageChange,
// }: {
//   currentPage: number;
//   lastPage: number;
//   disabled: boolean;
//   onPageChange: (page: number) => void;
// }) {
//   if (lastPage <= 1) {
//     return null;
//   }

//   return (
//     <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
//       <p className="text-xs font-semibold text-muted-foreground">
//         Page {currentPage} of {lastPage}
//       </p>

//       <div className="flex gap-2">
//         <button
//           type="button"
//           disabled={
//             disabled || currentPage <= 1
//           }
//           onClick={() =>
//             onPageChange(currentPage - 1)
//           }
//           className="h-9 rounded-xl border border-border px-4 text-xs font-bold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
//         >
//           Previous
//         </button>

//         <button
//           type="button"
//           disabled={
//             disabled ||
//             currentPage >= lastPage
//           }
//           onClick={() =>
//             onPageChange(currentPage + 1)
//           }
//           className="h-9 rounded-xl border border-border px-4 text-xs font-bold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// function TableHeader({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return (
//     <th className="px-5 py-4 text-xs font-bold text-muted-foreground">
//       {children}
//     </th>
//   );
// }

// function TableCell({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return (
//     <td className="px-5 py-4 text-sm font-semibold text-foreground">
//       {children}
//     </td>
//   );
// }
