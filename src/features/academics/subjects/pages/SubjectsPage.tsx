import { CrudPage } from "../../shared/components/CrudPage";
import { useCreateSubject, useDeleteSubject, useSubjects, useUpdateSubject } from "../hooks/useSubjects";
import type { CreateSubjectPayload, Subject, UpdateSubjectPayload } from "../types/subject.types";

export function SubjectsPage() {
  const { data = [], isLoading } = useSubjects();
  return (
    <CrudPage<Subject, CreateSubjectPayload, UpdateSubjectPayload>
      title="Subjects"
      description="Manage the subject catalog used by grade subjects."
      addLabel="Add Subject"
      rows={data}
      isLoading={isLoading}
      createMutation={useCreateSubject()}
      updateMutation={useUpdateSubject()}
      deleteMutation={useDeleteSubject()}
      fields={[{ name: "name", label: "Subject Name", type: "text", defaultValue: "" }]}
      columns={[{ key: "name", header: "Name", render: (row) => <strong className="text-slate-950">{row.name}</strong> }]}
      toFormValues={(row) => row}
      buildPayload={(values) => ({ name: String(values.name) })}
    />
  );
}
