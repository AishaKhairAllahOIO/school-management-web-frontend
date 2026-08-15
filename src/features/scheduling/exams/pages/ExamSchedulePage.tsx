import { useEffect, useState } from "react";
import {
  CalendarDays,

  Plus,

} from "lucide-react";
import { ExamCard } from "../components/ExamCard";
import { ExamModal } from "../components/ExamModal";
import {
  createExamSchedule,
  deleteExamSchedule,
  getAdminExams,
  getExamSetup,
  updateExamSchedule,
} from "../api/exam-schedule.api";

import type {
  AdminExam,
  ExamFormData,
  ExamFormSubject,
  ExamSetupSubject,
} from "../types/exam-schedule.types";

export default function ExamSchedulePage() {
  const [academicYearId, setAcademicYearId] = useState<number | "">("");
  const [semesterId, setSemesterId] = useState<number | "">("");

  const [exams, setExams] = useState<AdminExam[]>([]);

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editingExam, setEditingExam] =
    useState<AdminExam | null>(null);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const [form, setForm] = useState<ExamFormData>({
    title: "",
    type: "exam",
    grade_level_id: "",
    subjects: [],
  });

  const [setupSubjects, setSetupSubjects] =
    useState<ExamSetupSubject[]>([]);

  /*
   * Load exams
   */
  async function loadExams() {
    if (!academicYearId || !semesterId) {
      setExams([]);
      return;
    }

    try {
      setLoading(true);

      const data = await getAdminExams(
        academicYearId,
        semesterId,
      );

      setExams(data ?? []);
    } catch (error) {
      console.error("Failed to load exams", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExams();
  }, [academicYearId, semesterId]);

  /*
   * Open create
   */
  function openCreate() {
    setEditingExam(null);

    setForm({
      title: "",
      type: "exam",
      grade_level_id: "",
      subjects: [],
    });

    setSetupSubjects([]);

    setShowModal(true);
  }

  /*
   * Open edit
   */
  function openEdit(exam: AdminExam) {
    setEditingExam(exam);

    setForm({
      title: exam.title,
      type: exam.type,
      grade_level_id: exam.grade_level.id,

      subjects: exam.subjects.map((subject) => ({
        grade_subject_id: subject.grade_subject_id,
        exam_date: subject.exam_date,
        start_time: subject.start_time,
        end_time: subject.end_time,
        syllabus: subject.syllabus ?? "",
        teacher_ids: subject.teachers.map(
          (teacher) => teacher.staff_id,
        ),
      })),
    });

    setShowModal(true);

    loadSetup(exam.grade_level.id);
  }

  /*
   * Load setup data
   */
  async function loadSetup(gradeLevelId: number) {
    try {
      const data = await getExamSetup(gradeLevelId);

      setSetupSubjects(data ?? []);
    } catch (error) {
      console.error(
        "Failed to load exam setup",
        error,
      );
    }
  }

  /*
   * Grade changed
   */
  async function handleGradeChange(
    gradeLevelId: number,
  ) {
    setForm((prev) => ({
      ...prev,
      grade_level_id: gradeLevelId,
      subjects: [],
    }));

    if (!gradeLevelId) {
      setSetupSubjects([]);
      return;
    }

    await loadSetup(gradeLevelId);
  }

  /*
   * Add subject
   */
  function addSubject() {
    const firstSubject = setupSubjects[0];

    if (!firstSubject) return;

    const subject: ExamFormSubject = {
      grade_subject_id:
        firstSubject.grade_subject_id,
      exam_date: "",
      start_time: "",
      end_time: "",
      syllabus: "",
      teacher_ids:
        firstSubject.auto_teachers.map(
          (teacher) => teacher.teacher_id,
        ),
    };

    setForm((prev) => ({
      ...prev,
      subjects: [...prev.subjects, subject],
    }));
  }

  /*
   * Update subject
   */
  function updateSubject(
    index: number,
    changes: Partial<ExamFormSubject>,
  ) {
    setForm((prev) => ({
      ...prev,

      subjects: prev.subjects.map(
        (subject, subjectIndex) =>
          subjectIndex === index
            ? {
                ...subject,
                ...changes,
              }
            : subject,
      ),
    }));
  }

  /*
   * Change selected subject
   */
  function changeSubject(
    index: number,
    gradeSubjectId: number,
  ) {
    const setup = setupSubjects.find(
      (item) =>
        item.grade_subject_id === gradeSubjectId,
    );

    updateSubject(index, {
      grade_subject_id: gradeSubjectId,

      teacher_ids:
        setup?.auto_teachers.map(
          (teacher) => teacher.teacher_id,
        ) ?? [],
    });
  }

  /*
   * Remove subject
   */
  function removeSubject(index: number) {
    setForm((prev) => ({
      ...prev,

      subjects: prev.subjects.filter(
        (_, i) => i !== index,
      ),
    }));
  }

  /*
   * Save
   */
  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (!form.grade_level_id) {
      alert("Please select a grade.");
      return;
    }

    if (form.subjects.length === 0) {
      alert("Please add at least one subject.");
      return;
    }

    try {
      setLoading(true);

      if (editingExam) {
        await updateExamSchedule(
          editingExam.exam_id,
          form,
        );
      } else {
        await createExamSchedule(form);
      }

      setShowModal(false);

      await loadExams();
    } catch (error) {
      console.error(
        "Failed to save exam schedule",
        error,
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Delete
   */
  async function handleDelete() {
    if (!deleteId) return;

    try {
      setLoading(true);

      await deleteExamSchedule(deleteId);

      setDeleteId(null);

      await loadExams();
    } catch (error) {
      console.error(
        "Failed to delete exam",
        error,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            Exam Schedule
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage exams and quizzes for all grades.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          <Plus size={18} />
          Add Exam
        </button>

      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border bg-card p-5 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Academic Year
          </label>

          <select
            value={academicYearId}
            onChange={(e) =>
              setAcademicYearId(
                e.target.value
                  ? Number(e.target.value)
                  : "",
              )
            }
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="">
              Select Academic Year
            </option>

            {/* Replace with your academic years */}
            <option value="1">
              2025 / 2026
            </option>

            <option value="2">
              2026 / 2027
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Semester
          </label>

          <select
            value={semesterId}
            onChange={(e) =>
              setSemesterId(
                e.target.value
                  ? Number(e.target.value)
                  : "",
              )
            }
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="">
              Select Semester
            </option>

            <option value="1">
              Semester 1
            </option>

            <option value="2">
              Semester 2
            </option>
          </select>
        </div>

      </div>

      {/* Loading */}
      {loading && (
        <div className="py-10 text-center">
          Loading...
        </div>
      )}

      {/* Empty */}
      {!loading &&
        academicYearId &&
        semesterId &&
        exams.length === 0 && (
          <div className="rounded-xl border bg-card p-12 text-center">

            <CalendarDays
              className="mx-auto mb-4 opacity-40"
              size={42}
            />

            <h3 className="font-semibold">
              No exam schedules
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              There are no exams for this academic
              year and semester.
            </p>

          </div>
        )}

      {/* Exams */}
      <div className="space-y-6">

        {exams.map((exam) => (
          <ExamCard
            key={exam.exam_id}
            exam={exam}
            onEdit={() => openEdit(exam)}
            onDelete={() =>
              setDeleteId(exam.exam_id)
            }
          />
        ))}

      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <ExamModal
          form={form}
          editing={!!editingExam}
          setupSubjects={setupSubjects}
          loading={loading}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          onGradeChange={handleGradeChange}
          onAddSubject={addSubject}
          onRemoveSubject={removeSubject}
          onUpdateSubject={updateSubject}
          onChangeSubject={changeSubject}
        />
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-xl bg-white p-6">

            <h2 className="text-lg font-semibold">
              Delete Exam Schedule
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete this
              exam schedule? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-white"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}