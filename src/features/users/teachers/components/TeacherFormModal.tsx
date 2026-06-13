// import { X } from "lucide-react";
// import { useEffect, useState } from "react";

// import type { Teacher, TeacherFormData } from "../types/teacher.types";

// type TeacherFormModalProps = {
//   isOpen: boolean;
//   teacher: Teacher | null;
//   onClose: () => void;
//   onSubmit: (data: TeacherFormData) => void;
// };

// const initialForm: TeacherFormData = {
//   firstName: "",
//   lastName: "",
//   email: "",
//   phone: "",
//   photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
//   address: "",
//   birthDate: "",
//   birthPlace: "",
//   city: "",
//   university: "",
//   degree: "",
//   studyStartDate: "",
//   studyEndDate: "",
//   subject: "",
//   department: "",
//   employmentType: "Full-time",
//   status: "active",
//   hireDate: "",
// };

// function Field({
//   label,
//   name,
//   value,
//   type = "text",
//   onChange,
// }: {
//   label: string;
//   name: keyof TeacherFormData;
//   value: string;
//   type?: string;
//   onChange: (name: keyof TeacherFormData, value: string) => void;
// }) {
//   return (
//     <label className="space-y-2">
//       <span className="text-xs font-bold text-foreground">{label}</span>

//       <input
//         type={type}
//         value={value}
//         onChange={(event) => onChange(name, event.target.value)}
//         className="h-11 w-full rounded-xl border border-border/70 bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
//       />
//     </label>
//   );
// }

// function Section({
//   title,
//   children,
// }: {
//   title: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <section className="overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-soft">
//       <div className="bg-primary px-5 py-3">
//         <h3 className="text-sm font-bold text-white">{title}</h3>
//       </div>

//       <div className="grid gap-4 p-5 md:grid-cols-2">{children}</div>
//     </section>
//   );
// }

// export function TeacherFormModal({
//   isOpen,
//   teacher,
//   onClose,
//   onSubmit,
// }: TeacherFormModalProps) {
//   const [form, setForm] = useState<TeacherFormData>(initialForm);

//   useEffect(() => {
//     if (teacher) {
//       setForm({
//         firstName: teacher.firstName,
//         lastName: teacher.lastName,
//         fatherName: teacher.fatherName,
//         motherName: teacher.motherName,
//         birthDate: teacher.birthDate,
//         birthPlace: teacher.birthPlace,
//         gender: teacher.gender,
//         nationality: teacher.nationality,
//         address: teacher.address,
//         phoneNumber: teacher.phoneNumber,
//         photoUrl: teacher.photoUrl,
//         university: teacher.university,
//         degree: teacher.degree,
//         specialization: teacher.specialization,
//         graduationYear: teacher.graduationYear,
//         studyStartDate: teacher.studyStartDate,
//         studyEndDate: teacher.studyEndDate,
//         subject: teacher.subject,
//         department: teacher.department,
//         employmentType: teacher.employmentType,
//         status: teacher.status,
//         hireDate: teacher.hireDate,
//         email: teacher.email,
//         phone: teacher.phone,
//       });
//     } else {
//       setForm(initialForm);
//     }
//   }, [teacher, isOpen]);

//   if (!isOpen) return null;

//   function updateField(name: keyof TeacherFormData, value: string) {
//     setForm((current) => ({
//       ...current,
//       [name]: value,
//     }));
//   }

//   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     onSubmit(form);
//     onClose();
//   }

//   return (
//     <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
//       <form
//         onSubmit={handleSubmit}
//         className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[30px] bg-background p-6 shadow-soft-lg"
//       >
//         <div className="mb-6 flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-foreground">
//               {teacher ? "Edit Teacher" : "Add New Teacher"}
//             </h2>

//             <p className="mt-1 text-sm text-muted-foreground">
//               Manage teacher personal, education and work information.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         <div className="space-y-6">
//           <Section title="Personal Details">
//             <Field label="First Name *" name="firstName" value={form.firstName} onChange={updateField} />
//             <Field label="Last Name *" name="lastName" value={form.lastName} onChange={updateField} />
//             <Field label="Email *" name="email" value={form.email} onChange={updateField} />
//             <Field label="Phone *" name="phone" value={form.phone} onChange={updateField} />

//             <label className="space-y-2 md:col-span-2">
//               <span className="text-xs font-bold text-foreground">
//                 Address *
//               </span>

//               <textarea
//                 value={form.address}
//                 onChange={(event) => updateField("address", event.target.value)}
//                 className="min-h-24 w-full resize-none rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
//               />
//             </label>

//             <Field label="Photo URL" name="photoUrl" value={form.photoUrl} onChange={updateField} />
//             <Field label="Birth Date *" name="birthDate" type="date" value={form.birthDate} onChange={updateField} />
//             <Field label="Birth Place *" name="birthPlace" value={form.birthPlace} onChange={updateField} />
//             <Field label="City *" name="city" value={form.city} onChange={updateField} />
//           </Section>

//           <Section title="Education">
//             <Field label="University *" name="university" value={form.university} onChange={updateField} />
//             <Field label="Degree *" name="degree" value={form.degree} onChange={updateField} />
//             <Field label="Study Start Date *" name="studyStartDate" type="date" value={form.studyStartDate} onChange={updateField} />
//             <Field label="Study End Date *" name="studyEndDate" type="date" value={form.studyEndDate} onChange={updateField} />
//           </Section>

//           <Section title="School Information">
//             <Field label="Subject *" name="subject" value={form.subject} onChange={updateField} />
//             <Field label="Department *" name="department" value={form.department} onChange={updateField} />
//             <Field label="Employment Type *" name="employmentType" value={form.employmentType} onChange={updateField} />
//             <Field label="Hire Date *" name="hireDate" type="date" value={form.hireDate} onChange={updateField} />

//             <label className="space-y-2">
//               <span className="text-xs font-bold text-foreground">
//                 Status *
//               </span>

//               <select
//                 value={form.status}
//                 onChange={(event) => updateField("status", event.target.value)}
//                 className="h-11 w-full rounded-xl border border-border/70 bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
//               >
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//                 <option value="on_leave">On Leave</option>
//               </select>
//             </label>
//           </Section>
//         </div>

//         <div className="mt-6 flex justify-end gap-3">
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-2xl border border-primary px-6 py-2.5 text-sm font-bold text-primary transition hover:bg-primary/10"
//           >
//             Save as Draft
//           </button>

//           <button
//             type="submit"
//             className="rounded-2xl bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark"
//           >
//             {teacher ? "Save Changes" : "Submit"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }