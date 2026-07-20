// import { useMemo, useState } from "react";

// import { UsersToolbar } from "@/features/users/components/UsersToolbar";
// import { UsersTable } from "@/features/users/components/UsersTable";
// import { counselorCsvColumns } from "@/features/users/shared/config/userCsvColumns";
// import {
//   exportDataToCsv,
//   parseCsvFile,
// } from "@/features/users/shared/utils/usersCsv.utils";

// import { counselorsMock } from "@/features/users/counselors/mocks/counselors.mock";
// import type { CounselorUser } from "@/features/users/counselors/types/counselor.types";

// export function CounselorsPage() {
//   const [searchValue, setSearchValue] = useState("");

//   const filteredCounselors = useMemo(() => {
//     const search = searchValue.trim().toLowerCase();

//     if (!search) return counselorsMock;

//     return counselorsMock.filter((counselor) => {
//       const fullName =
//         `${counselor.firstName} ${counselor.lastName}`.toLowerCase();

//       return (
//         fullName.includes(search) ||
//         counselor.phoneNumber.toLowerCase().includes(search) ||
//         counselor.counselorCode.toLowerCase().includes(search) ||
//         counselor.counselorEmail.toLowerCase().includes(search) ||
//         counselor.specialization.toLowerCase().includes(search) ||
//         (counselor.office ?? "").toLowerCase().includes(search)
//       );
//     });
//   }, [searchValue]);

//   function handleExportCounselors() {
//     exportDataToCsv(filteredCounselors, counselorCsvColumns, "counselors.csv");
//   }

//   async function handleImportCounselors(file: File) {
//     const rows = await parseCsvFile(file);

//     console.log("Counselors CSV rows ready for API:", rows);

//     // لاحقًا:
//     // await createCounselorsBulk(rows);
//   }

//   return (
//     <div className="space-y-4">
//       <UsersToolbar
//         searchValue={searchValue}
//         searchPlaceholder="Search counselors..."
//         addLabel="Add Counselor"
//         importLabel="Import Counselors"
//         exportLabel="Export Counselors"
//         filterLabel="Filter"
//         onSearchChange={setSearchValue}
//         onImport={handleImportCounselors}
//         onExport={handleExportCounselors}
//       />

//       <UsersTable<CounselorUser>
//         users={filteredCounselors}
//         nameTitle="Counselor Name"
//         extraColumns={[
//           {
//             key: "counselorCode",
//             title: "Counselor Code",
//             render: (counselor) => counselor.counselorCode,
//           },
//           {
//             key: "specialization",
//             title: "Specialization",
//             render: (counselor) => counselor.specialization,
//           },
//           {
//             key: "office",
//             title: "Office",
//             render: (counselor) => counselor.office ?? "-",
//           },
//           {
//             key: "yearsOfExperience",
//             title: "Experience",
//             render: (counselor) =>
//               `${counselor.yearsOfExperience ?? 0} Years`,
//           },
//         ]}
//       />
//     </div>
//   );
// }