import type { SchoolGrade } from "@/features/settings/school-config/types/school.enums";

type GradeTabsProps = {
  value: SchoolGrade;
  onChange: (grade: SchoolGrade) => void;
};

const grades: { label: string; value: SchoolGrade }[] = [
  { label: "Seventh", value: "seventh" },
  { label: "Eighth", value: "eighth" },
  { label: "Ninth", value: "ninth" },
];

export function GradeTabs({ value, onChange }: GradeTabsProps) {
  return (
    <div className="mx-auto grid w-full max-w-lg grid-cols-3 rounded-2xl border border-border/70 bg-background p-1">
      {grades.map((grade) => (
        <button
          key={grade.value}
          type="button"
          onClick={() => onChange(grade.value)}
          className={[
            "h-10 rounded-xl text-sm font-semibold transition",
            value === grade.value
              ? "bg-primary text-primary-foreground shadow-soft"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          ].join(" ")}
        >
          {grade.label}
        </button>
      ))}
    </div>
  );
}