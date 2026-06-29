import { CalendarDays, Clock, GraduationCap, Layers3 } from "lucide-react";
import { useState } from "react";

import { AcademicSettingsHeader } from "../components/AcademicSettingsHeader";
import { AcademicStagesSection } from "../components/sections/AcademicStagesSection";
import { AcademicTermsSection } from "../components/sections/AcademicTermsSection";
import { AcademicYearsSection } from "../components/sections/AcademicYearsSection";
import { SchoolScheduleSection } from "../components/sections/SchoolScheduleSection";
import { SettingsWorkspace } from "../components/shared/SettingsWorkspace";
import { useAcademicSettings } from "../hooks/useAcademicSettings";

type ActiveSection = "years" | "terms" | "stages" | "schedule";

const workspaceItems = [
  {
    id: "years",
    title: "Academic Years",
    description: "Manage academic years",
    icon: <CalendarDays size={18} />,
  },
  {
    id: "terms",
    title: "Academic Terms",
    description: "Manage academic terms",
    icon: <Layers3 size={18} />,
  },
  {
    id: "stages",
    title: "Academic Stages",
    description: "Manage academic stages",
    icon: <GraduationCap size={18} />,
  },
  {
    id: "schedule",
    title: "School Schedule",
    description: "Configure school schedule",
    icon: <Clock size={18} />,
  },
];

export function AcademicSettingsPage() {
  const { data, isLoading, isError } = useAcademicSettings();
  const [activeSection, setActiveSection] = useState<ActiveSection>("years");

  if (isLoading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6">Loading academic settings...</div>;
  }

  if (isError || !data) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6">Failed to load academic settings.</div>;
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-7 text-[#0F172A]">
      <AcademicSettingsHeader />

      <SettingsWorkspace
        items={workspaceItems}
        activeId={activeSection}
        onChange={(id) => setActiveSection(id as ActiveSection)}
        hint="The current academic year is used across the system for attendance, grades and reports."
      >
        {activeSection === "years" && <AcademicYearsSection academicYears={data.academicYears} />}

        {activeSection === "terms" && (
          <AcademicTermsSection
            academicYears={data.academicYears}
            academicTerms={data.academicTerms}
            currentAcademicYearId={data.settings.currentAcademicYearId}
          />
        )}

        {activeSection === "stages" && <AcademicStagesSection academicStages={data.academicStages} />}

        {activeSection === "schedule" && <SchoolScheduleSection settings={data.settings} />}
      </SettingsWorkspace>
    </div>
  );
}
