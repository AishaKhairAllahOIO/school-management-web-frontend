import { Plus, Trash2, X } from "lucide-react";

import type {
  ExamFormData,
  ExamFormSubject,
  ExamSetupSubject,
} from "../types/exam-schedule.types";

interface Props {
  form: ExamFormData;
  editing: boolean;
  setupSubjects: ExamSetupSubject[];
  loading: boolean;

  onClose: () => void;
  onSubmit: (
    event: React.FormEvent,
  ) => void;

  onGradeChange: (
    gradeLevelId: number,
  ) => void;

  onAddSubject: () => void;

  onRemoveSubject: (
    index: number,
  ) => void;

  onUpdateSubject: (
    index: number,
    changes: Partial<ExamFormSubject>,
  ) => void;

  onChangeSubject: (
    index: number,
    gradeSubjectId: number,
  ) => void;
}

export function ExamModal({
  form,
  editing,
  setupSubjects,
  loading,
  onClose,
  onSubmit,
  onGradeChange,
  onAddSubject,
  onRemoveSubject,
  onUpdateSubject,
  onChangeSubject,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">

      <div className="mx-auto my-8 w-full max-w-5xl rounded-2xl bg-white">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">

          <div>
            <h2 className="text-xl font-semibold">
              {editing
                ? "Edit Exam Schedule"
                : "Create Exam Schedule"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Add exam information and subjects.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-muted"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="space-y-6 p-6"
        >

          {/* Basic information */}
          <div className="grid gap-4 md:grid-cols-3">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Title
              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  onUpdateBasic(
                    "title",
                    e.target.value,
                  )
                }
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Mid Term Examination"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Type
              </label>

              <select
                value={form.type}
                onChange={(e) =>
                  onUpdateBasic(
                    "type",
                    e.target.value,
                  )
                }
                className="w-full rounded-lg border px-3 py-2"
              >
                <option value="exam">
                  Exam
                </option>

                <option value="quiz">
                  Quiz
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Grade
              </label>

              <select
                value={form.grade_level_id}
                onChange={(e) =>
                  onGradeChange(
                    Number(e.target.value),
                  )
                }
                className="w-full rounded-lg border px-3 py-2"
                required
              >
                <option value="">
                  Select Grade
                </option>

                {/* Replace with real grades */}
                <option value="1">
                  Grade 1
                </option>

                <option value="2">
                  Grade 2
                </option>

                <option value="3">
                  Grade 3
                </option>
              </select>
            </div>

          </div>

          {/* Subjects */}
          <div>

            <div className="mb-4 flex items-center justify-between">

              <div>
                <h3 className="font-semibold">
                  Exam Subjects
                </h3>

                <p className="text-sm text-muted-foreground">
                  Add subjects, dates, times and
                  teachers.
                </p>
              </div>

              <button
                type="button"
                onClick={onAddSubject}
                disabled={!form.grade_level_id}
                className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
              >
                <Plus size={16} />
                Add Subject
              </button>

            </div>

            <div className="space-y-4">

              {form.subjects.map(
                (subject, index) => (
                  <div
                    key={index}
                    className="rounded-xl border p-4"
                  >

                    <div className="mb-4 flex items-center justify-between">

                      <h4 className="font-medium">
                        Subject {index + 1}
                      </h4>

                      <button
                        type="button"
                        onClick={() =>
                          onRemoveSubject(index)
                        }
                        className="text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                    <div className="grid gap-4 md:grid-cols-4">

                      {/* Subject */}
                      <div>
                        <label className="mb-2 block text-sm">
                          Subject
                        </label>

                        <select
                          value={
                            subject.grade_subject_id
                          }
                          onChange={(e) =>
                            onChangeSubject(
                              index,
                              Number(
                                e.target.value,
                              ),
                            )
                          }
                          className="w-full rounded-lg border px-3 py-2"
                          required
                        >
                          <option value="">
                            Select Subject
                          </option>

                          {setupSubjects.map(
                            (item) => (
                              <option
                                key={
                                  item.grade_subject_id
                                }
                                value={
                                  item.grade_subject_id
                                }
                              >
                                {
                                  item.subject_name
                                }
                              </option>
                            ),
                          )}
                        </select>
                      </div>

                      {/* Date */}
                      <div>
                        <label className="mb-2 block text-sm">
                          Exam Date
                        </label>

                        <input
                          type="date"
                          value={
                            subject.exam_date
                          }
                          onChange={(e) =>
                            onUpdateSubject(
                              index,
                              {
                                exam_date:
                                  e.target.value,
                              },
                            )
                          }
                          className="w-full rounded-lg border px-3 py-2"
                          required
                        />
                      </div>

                      {/* Start */}
                      <div>
                        <label className="mb-2 block text-sm">
                          Start Time
                        </label>

                        <input
                          type="time"
                          value={
                            subject.start_time
                          }
                          onChange={(e) =>
                            onUpdateSubject(
                              index,
                              {
                                start_time:
                                  e.target.value,
                              },
                            )
                          }
                          className="w-full rounded-lg border px-3 py-2"
                          required
                        />
                      </div>

                      {/* End */}
                      <div>
                        <label className="mb-2 block text-sm">
                          End Time
                        </label>

                        <input
                          type="time"
                          value={
                            subject.end_time
                          }
                          onChange={(e) =>
                            onUpdateSubject(
                              index,
                              {
                                end_time:
                                  e.target.value,
                              },
                            )
                          }
                          className="w-full rounded-lg border px-3 py-2"
                          required
                        />
                      </div>

                    </div>

                    {/* Syllabus */}
                    <div className="mt-4">

                      <label className="mb-2 block text-sm">
                        Syllabus
                      </label>

                      <textarea
                        value={
                          subject.syllabus
                        }
                        onChange={(e) =>
                          onUpdateSubject(
                            index,
                            {
                              syllabus:
                                e.target.value,
                            },
                          )
                        }
                        rows={3}
                        className="w-full rounded-lg border px-3 py-2"
                        placeholder="Chapters, lessons..."
                      />

                    </div>

                    {/* Teachers */}
                    <div className="mt-4">

                      <label className="mb-2 block text-sm font-medium">
                        Teachers
                      </label>

                      <div className="grid gap-2 md:grid-cols-3">

                        {(
                          setupSubjects.find(
                            (item) =>
                              item.grade_subject_id ===
                              subject.grade_subject_id,
                          )?.auto_teachers ?? []
                        ).map((teacher) => {

                          const checked =
                            subject.teacher_ids.includes(
                              teacher.teacher_id,
                            );

                          return (
                            <label
                              key={
                                teacher.teacher_id
                              }
                              className="flex items-center gap-2 rounded-lg border p-3"
                            >

                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {

                                  const ids =
                                    checked
                                      ? subject.teacher_ids.filter(
                                          (id) =>
                                            id !==
                                            teacher.teacher_id,
                                        )
                                      : [
                                          ...subject.teacher_ids,
                                          teacher.teacher_id,
                                        ];

                                  onUpdateSubject(
                                    index,
                                    {
                                      teacher_ids:
                                        ids,
                                    },
                                  );
                                }}
                              />

                              <span className="text-sm">
                                {
                                  teacher.teacher_name
                                }
                              </span>

                            </label>
                          );
                        })}

                      </div>

                    </div>

                  </div>
                ),
              )}

            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-5 py-2 text-white"
            >
              {loading
                ? "Saving..."
                : editing
                  ? "Update Schedule"
                  : "Create Schedule"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );

  function onUpdateBasic(
    key: "title" | "type",
    value: string,
  ) {
    // This component needs to update the parent form.
    // Add these two fields to Props.
  }
}