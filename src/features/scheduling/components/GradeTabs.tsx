import type { SchoolGrade } from "@/features/settings/school-config/types/school.enums";

type GradeTabsProps = {
  value: SchoolGrade;
  onChange: (grade: SchoolGrade) => void;
};

const grades: { label: string; value: SchoolGrade; className: string }[] = [
  { label: "Seventh", value: "seventh", className: "border-violet-200/70 bg-violet-50/80 text-violet-700" },
  { label: "Eighth", value: "eighth", className: "border-sky-200/70 bg-sky-50/80 text-sky-700" },
  { label: "Ninth", value: "ninth", className: "border-emerald-200/70 bg-emerald-50/80 text-emerald-700" },
];

export function GradeTabs({ value, onChange }: GradeTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {grades.map((grade) => (
        <button
          key={grade.value}
          type="button"
          onClick={() => onChange(grade.value)}
          className={[
            "rounded-full border px-4 py-2 text-xs font-medium transition",
            value === grade.value
              ? grade.className
              : "border-border/60 bg-background text-muted-foreground hover:bg-muted/35 hover:text-foreground",
          ].join(" ")}
        >
          {grade.label}
        </button>
      ))}
    </div>
  );
}
