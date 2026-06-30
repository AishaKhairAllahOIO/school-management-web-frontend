import { CrudPage } from "../../shared/components/CrudPage";
import { useClassrooms, useCreateClassroom, useDeleteClassroom, useUpdateClassroom } from "../hooks/useClassrooms";
import type { Classroom, CreateClassroomPayload, UpdateClassroomPayload } from "../types/classroom.types";

export function ClassroomsPage() {
  const { data = [], isLoading } = useClassrooms();
  return (
    <CrudPage<Classroom, CreateClassroomPayload, UpdateClassroomPayload>
      title="Classrooms"
      description="Manage classrooms for each grade and academic year."
      addLabel="Add Classroom"
      rows={data}
      isLoading={isLoading}
      createMutation={useCreateClassroom()}
      updateMutation={useUpdateClassroom()}
      deleteMutation={useDeleteClassroom()}
      fields={[
        { name: "academicYearId", label: "Academic Year ID", type: "text", defaultValue: "year-1" },
        { name: "gradeId", label: "Grade ID", type: "text", defaultValue: "grade-7" },
        { name: "capacity", label: "Capacity", type: "number", defaultValue: 30 },
      ]}
      columns={[
        { key: "name", header: "Name", render: (row) => <strong className="text-slate-950">{row.name}</strong> },
        { key: "academicYearId", header: "Academic Year", render: (row) => row.academicYearId },
        { key: "gradeId", header: "Grade", render: (row) => row.gradeId },
        { key: "capacity", header: "Capacity", render: (row) => row.capacity },
        { key: "currentStudentsCount", header: "Current Students", render: (row) => row.currentStudentsCount },
        { key: "availableSeats", header: "Available Seats", render: (row) => row.availableSeats },
      ]}
      toFormValues={(row) => row}
      buildPayload={(values) => ({
        academicYearId: String(values.academicYearId),
        gradeId: String(values.gradeId),
        capacity: Number(values.capacity),
      })}
    />
  );
}
