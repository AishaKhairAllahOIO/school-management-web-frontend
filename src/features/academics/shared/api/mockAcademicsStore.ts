import { createId } from "../utils/ids";
import { nowIso } from "../utils/date";

export type ResourceName =
  | "grades"
  | "gradeConfigurations"
  | "classrooms"
  | "subjects"
  | "gradeSubjects"
  | "assessmentComponents"
  | "teacherWorkloads"
  | "teacherAssignments"
  | "studentEnrollments";

type BaseEntity = { id: string; createdAt: string; updatedAt: string };
type Store = Record<ResourceName, BaseEntity[]>;
const today = "2026-06-29T00:00:00.000Z";

const store: Store = {
  grades: [
    { id: "grade-7", academicStageId: "stage-middle", name: "Grade 7", level: 7, isGraduationGrade: false, createdAt: today, updatedAt: today },
    { id: "grade-9", academicStageId: "stage-middle", name: "Grade 9", level: 9, isGraduationGrade: true, createdAt: today, updatedAt: today },
  ],
  gradeConfigurations: [
    { id: "grade-config-1", academicYearId: "year-1", gradeId: "grade-7", supervisorId: "teacher-1", plannedClassroomsCount: 3, plannedStudentsCapacity: 90, actualClassroomsCount: 2, actualStudentsCount: 58, createdAt: today, updatedAt: today },
  ],
  classrooms: [
    { id: "classroom-1", academicYearId: "year-1", gradeId: "grade-7", name: "Grade 7 - A", capacity: 30, currentStudentsCount: 28, availableSeats: 2, createdAt: today, updatedAt: today },
    { id: "classroom-2", academicYearId: "year-1", gradeId: "grade-7", name: "Grade 7 - B", capacity: 30, currentStudentsCount: 30, availableSeats: 0, createdAt: today, updatedAt: today },
  ],
  subjects: [
    { id: "subject-math", name: "Mathematics", createdAt: today, updatedAt: today },
    { id: "subject-arabic", name: "Arabic", createdAt: today, updatedAt: today },
  ],
  gradeSubjects: [
    { id: "grade-subject-1", academicYearId: "year-1", academicTermId: "term-1", gradeId: "grade-7", subjectId: "subject-math", weeklyPeriods: 5, difficulty: "heavy", maxMark: 100, passingMark: 50, isFailingSubject: true, weightInTotal: 20, maxPeriodsPerDay: 2, avoidFirstPeriod: false, avoidLastPeriod: false, preferredPeriodIndexes: [2,3], createdAt: today, updatedAt: today },
  ],
  assessmentComponents: [
    { id: "assessment-1", gradeSubjectId: "grade-subject-1", type: "exam", name: "Final Exam", maxMark: 60, weightPercentage: 60, createdAt: today, updatedAt: today },
  ],
  teacherWorkloads: [
    { id: "workload-1", academicYearId: "year-1", teacherId: "teacher-1", requiredMonthlyPeriods: 80, assignedMonthlyPeriods: 56, remainingMonthlyPeriods: 24, createdAt: today, updatedAt: today },
  ],
  teacherAssignments: [
    { id: "assignment-1", academicYearId: "year-1", academicTermId: "term-1", teacherId: "teacher-1", gradeSubjectId: "grade-subject-1", classroomIds: ["classroom-1", "classroom-2"], createdAt: today, updatedAt: today },
  ],
  studentEnrollments: [
    { id: "enrollment-1", studentId: "student-1", academicYearId: "year-1", academicTermId: "term-1", gradeId: "grade-7", classroomId: "classroom-1", enrollmentStatus: "enrolled", enrollmentDate: "2026-06-01", activatedAt: "2026-06-01", withdrawnAt: null, transferredAt: null, completedAt: null, cancelledAt: null, createdAt: today, updatedAt: today },
  ],
};

function wait() {
  return new Promise((resolve) => setTimeout(resolve, 200));
}

export function createMockResourceApi<TEntity extends BaseEntity, TCreate extends object, TUpdate extends object>(
  resource: ResourceName,
  prefix: string,
  afterCreate?: (payload: TCreate) => Partial<TEntity>,
  afterUpdate?: (id: string, payload: TUpdate) => Partial<TEntity>
) {
  return {
    async list(): Promise<TEntity[]> {
      await wait();
      return structuredClone(store[resource]) as TEntity[];
    },
    async create(payload: TCreate): Promise<TEntity> {
      await wait();
      const now = nowIso();
      const entity = { id: createId(prefix), ...payload, ...(afterCreate?.(payload) ?? {}), createdAt: now, updatedAt: now } as TEntity;
      store[resource].push(entity);
      return structuredClone(entity);
    },
    async update(id: string, payload: TUpdate): Promise<TEntity> {
      await wait();
      const now = nowIso();
      store[resource] = store[resource].map((item) =>
        item.id === id ? ({ ...item, ...payload, ...(afterUpdate?.(id, payload) ?? {}), updatedAt: now } as BaseEntity) : item
      );
      return structuredClone(store[resource].find((item) => item.id === id)!) as TEntity;
    },
    async remove(id: string): Promise<void> {
      await wait();
      store[resource] = store[resource].filter((item) => item.id !== id);
    },
  };
}
