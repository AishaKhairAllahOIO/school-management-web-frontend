import { CalendarDays } from "lucide-react";
import { useState } from "react";

import {
  useCreateAcademicYear,
  useDeleteAcademicYear,
  useUpdateAcademicYear,
} from "../../hooks/useAcademicSettings";
import type { AcademicYear } from "../../types/academic-settings.types";
import { formatDateTime } from "../../utils/academic-settings.utils";
import { AcademicYearDialog } from "../dialogs/AcademicYearDialog";
import { ActionMenu } from "../shared/ActionMenu";
import { EntityTable, EntityTd, EntityTh } from "../shared/EntityTable";
import { SectionHeader } from "../shared/SectionHeader";

type Props = {
  academicYears: AcademicYear[];
};

export function AcademicYearsSection({ academicYears }: Props) {
  const [dialogValue, setDialogValue] = useState<AcademicYear | "new" | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const createYear = useCreateAcademicYear();
  const updateYear = useUpdateAcademicYear();
  const deleteYear = useDeleteAcademicYear();

  return (
    <>
      <SectionHeader
        title="Academic Years"
        description="Create and manage academic years. The current year will be used throughout the system."
        actionLabel="Add Year"
        onAction={() => setDialogValue("new")}
      />

      <EntityTable>
        <thead>
          <tr>
            <EntityTh>Year Name</EntityTh>
            <EntityTh>Start Date</EntityTh>
            <EntityTh>End Date</EntityTh>
            <EntityTh>Status</EntityTh>
            <EntityTh>Created At</EntityTh>
            <EntityTh>Updated At</EntityTh>
            <EntityTh align="right">Actions</EntityTh>
          </tr>
        </thead>
        <tbody>
          {academicYears.map((year) => (
            <tr key={year.id}>
              <EntityTd strong>{year.name}</EntityTd>
              <EntityTd>{year.startDate}</EntityTd>
              <EntityTd>{year.endDate}</EntityTd>
              <EntityTd>
                {year.isCurrent ? (
                  <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">
                    Current Year
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                    Not Current
                  </span>
                )}
              </EntityTd>
              <EntityTd>{formatDateTime(year.createdAt)}</EntityTd>
              <EntityTd>{formatDateTime(year.updatedAt)}</EntityTd>
              <EntityTd align="right">
                <ActionMenu
                  isOpen={openMenuId === year.id}
                  onOpenChange={(open) => setOpenMenuId(open ? year.id : null)}
                  onEdit={() => {
                    setDialogValue(year);
                    setOpenMenuId(null);
                  }}
                  onDelete={() => {
                    deleteYear.mutate(year.id);
                    setOpenMenuId(null);
                  }}
                />
              </EntityTd>
            </tr>
          ))}
        </tbody>
      </EntityTable>

      <div className="mt-6 grid grid-cols-4 gap-4">
        <YearStat icon={<CalendarDays size={18} />} value={academicYears.length} label="Total Years" />
        <YearStat value={academicYears.filter((item) => item.isCurrent).length} label="Current Year" />
        <YearStat value={academicYears.filter((item) => !item.isCurrent).length} label="Other Years" />
        <YearStat value={academicYears.length ? academicYears[0].name : "—"} label="Latest Entry" />
      </div>

      {dialogValue && (
        <AcademicYearDialog
          value={dialogValue === "new" ? null : dialogValue}
          onClose={() => setDialogValue(null)}
          onSave={(payload) => {
            if (dialogValue === "new") createYear.mutate(payload);
            else updateYear.mutate({ id: dialogValue.id, payload });
            setDialogValue(null);
          }}
        />
      )}
    </>
  );
}

function YearStat({ value, label, icon }: { value: number | string; label: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-primary">
        {icon ?? <span className="text-lg font-black">{String(value).slice(0, 1)}</span>}
      </div>
      <p className="text-xl font-black text-slate-900">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
    </div>
  );
}
