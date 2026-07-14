import { CrudPage } from "../../shared/components/CrudPage";
import { useCreateGradeSubject, useDeleteGradeSubject, useGradeSubjects, useUpdateGradeSubject } from "../hooks/useGradeSubjects";
import type { CreateGradeSubjectPayload, GradeSubject, UpdateGradeSubjectPayload } from "../types/grade-subject.types";

export function GradeSubjectsPage() {
  const { data = [], isLoading } = useGradeSubjects();
  return (
    <CrudPage<GradeSubject, CreateGradeSubjectPayload, UpdateGradeSubjectPayload>
      title="Grade Subjects"
      description="Configure subjects per grade, term, marks, and scheduling constraints."
      addLabel="Add Grade Subject"
      rows={data}
      isLoading={isLoading}
      createMutation={useCreateGradeSubject()}
      updateMutation={useUpdateGradeSubject()}
      deleteMutation={useDeleteGradeSubject()}
      fields={[
        { name: "academicYearId", label: "Academic Year ID", type: "text", defaultValue: "year-1" },
        { name: "academicTermId", label: "Academic Term ID", type: "text", defaultValue: "term-1" },
        { name: "gradeId", label: "Grade ID", type: "text", defaultValue: "grade-7" },
        { name: "subjectId", label: "Subject ID", type: "text", defaultValue: "subject-math" },
        { name: "weeklyPeriods", label: "Weekly Periods", type: "number", defaultValue: 1 },
        { name: "difficulty", label: "Difficulty", type: "select", defaultValue: "medium", options: [{ label: "Light", value: "light" }, { label: "Medium", value: "medium" }, { label: "Heavy", value: "heavy" }] },
        { name: "maxMark", label: "Max Mark", type: "number", defaultValue: 100 },
        { name: "passingMark", label: "Passing Mark", type: "number", defaultValue: 50 },
        { name: "isFailingSubject", label: "Failing Subject", type: "checkbox", defaultValue: false },
        { name: "weightInTotal", label: "Weight In Total", type: "number", defaultValue: 0 },
        { name: "maxPeriodsPerDay", label: "Max Periods Per Day", type: "number", defaultValue: 1 },
        { name: "avoidFirstPeriod", label: "Avoid First Period", type: "checkbox", defaultValue: false },
        { name: "avoidLastPeriod", label: "Avoid Last Period", type: "checkbox", defaultValue: false },
        { name: "preferredPeriodIndexes", label: "Preferred Period Indexes", type: "array", defaultValue: [], full: true },
      ]}
      columns={[
        { key: "academicYearId", header: "Year", render: (row) => row.academicYearId },
        { key: "academicTermId", header: "Term", render: (row) => row.academicTermId },
        { key: "gradeId", header: "Grade", render: (row) => row.gradeId },
        { key: "subjectId", header: "Subject", render: (row) => row.subjectId },
        { key: "weeklyPeriods", header: "Weekly", render: (row) => row.weeklyPeriods },
        { key: "difficulty", header: "Difficulty", render: (row) => row.difficulty },
        { key: "maxMark", header: "Max", render: (row) => row.maxMark },
        { key: "passingMark", header: "Passing", render: (row) => row.passingMark },
      ]}
      toFormValues={(row) => row}
      buildPayload={(values) => ({
        academicYearId: String(values.academicYearId), academicTermId: String(values.academicTermId), gradeId: String(values.gradeId), subjectId: String(values.subjectId), weeklyPeriods: Number(values.weeklyPeriods), difficulty: values.difficulty as CreateGradeSubjectPayload["difficulty"], maxMark: Number(values.maxMark), passingMark: Number(values.passingMark), isFailingSubject: Boolean(values.isFailingSubject), weightInTotal: Number(values.weightInTotal), maxPeriodsPerDay: Number(values.maxPeriodsPerDay), avoidFirstPeriod: Boolean(values.avoidFirstPeriod), avoidLastPeriod: Boolean(values.avoidLastPeriod), preferredPeriodIndexes: (values.preferredPeriodIndexes as string[] | undefined)?.map(Number),
      })}
    />
  );
}
