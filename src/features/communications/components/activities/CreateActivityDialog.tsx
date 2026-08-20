import {
  Clock3,
  Sparkles,
} from "lucide-react";
import {
  useQuery,
} from "@tanstack/react-query";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { Button } from "@/shared/ui/button";
import { DatePicker } from "./date-picker";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import { TimePicker } from "./time-picker";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { useActivities } from "../../hooks/useActivities";

import {
  communicationService,
} from "../../services/communications.service";

import type {
  Activity,
  ActivityPayload,
} from "../../types/communication.types";

import {
  DialogFormSkeleton,
} from "../shared/DialogFormSkeleton";

import {
  MultiSelectAudience,
  type OptionItem,
} from "../shared/MultiSelectAudience";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  gradeLevels: {
    id: string | number;
    name: string;
  }[];

  classRooms: OptionItem[];

  activityToEdit?: Activity | null;
};

const inputClassName =
  "h-11 w-full rounded-[13px] border border-input bg-background px-3 text-[12px] outline-none transition hover:border-info/35 focus:border-info/35 focus:ring-4 focus:ring-info/[0.07]";

export function CreateActivityDialog({
  open,
  onOpenChange,
  gradeLevels = [],
  classRooms = [],
  activityToEdit = null,
}: Props) {
  const {
    createActivity,
    updateActivity,
  } = useActivities();

  const isEditing = Boolean(activityToEdit);

  const isPending =
    createActivity.isPending ||
    updateActivity.isPending;

  /*
   * ============================================================
   * EDIT DETAILS
   * ============================================================
   *
   * In edit mode we request the complete activity details.
   *
   * IMPORTANT:
   * This does NOT change the create/update API payload.
   */
  const detailsQuery = useQuery({
    queryKey: [
      "communications",
      "activities",
      "details",
      activityToEdit?.id,
    ],

    queryFn: () =>
      communicationService.getActivityById(
        activityToEdit!.id,
      ),

    enabled:
      open &&
      Boolean(activityToEdit?.id),
  });

  /*
   * Prefer the complete details response.
   * Fall back to the activity from the list if necessary.
   */
  const editSource =
    detailsQuery.data ?? activityToEdit;

  /*
   * ============================================================
   * FORM STATE
   * ============================================================
   */

  const [activityName, setActivityName] =
    useState("");

  const [type, setType] =
    useState("");

  const [activityDate, setActivityDate] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [gradeLevelId, setGradeLevelId] =
    useState<string | number>("");

  const [
    selectedClassRoomIds,
    setSelectedClassRoomIds,
  ] = useState<(string | number)[]>([]);

  const [description, setDescription] =
    useState("");

  const [formError, setFormError] =
    useState<string | null>(null);

  /*
   * ============================================================
   * NORMALIZE API VALUES
   * ============================================================
   */

  function normalizeTime(
    value: unknown,
  ): string {
    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    return String(value).slice(0, 5);
  }

  function normalizeDate(
    value: unknown,
  ): string {
    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    return String(value).slice(0, 10);
  }

  function resolveGradeId(
    source: any,
  ): string | number {
    return (
      source.grade_level_id ??
      source.grade_id ??
      source.grade_level?.id ??
      source.grade?.id ??
      ""
    );
  }

  function resolveClassRoomIds(
    source: any,
  ): (string | number)[] {
    /*
     * Support the possible response shapes:
     *
     * class_room_ids: [1, 2]
     *
     * classroom_ids: [1, 2]
     *
     * class_rooms: [
     *   { id: 1 },
     *   { id: 2 }
     * ]
     *
     * classrooms: [
     *   { id: 1 },
     *   { id: 2 }
     * ]
     */

    const rawRooms =
      source.class_room_ids ??
      source.classroom_ids ??
      source.class_rooms ??
      source.classrooms ??
      [];

    if (!Array.isArray(rawRooms)) {
      return [];
    }

    return rawRooms
      .map((item: any) => {
        if (
          item !== null &&
          typeof item === "object"
        ) {
          return item.id;
        }

        return item;
      })
      .filter(
        (
          id: unknown,
        ): id is string | number =>
          id !== null &&
          id !== undefined &&
          id !== "",
      );
  }

  /*
   * ============================================================
   * INITIALIZE / RESET FORM
   * ============================================================
   */

  function resetForm() {
    setActivityName("");
    setType("");
    setActivityDate("");
    setStartTime("");
    setEndTime("");
    setGradeLevelId("");
    setSelectedClassRoomIds([]);
    setDescription("");
    setFormError(null);
  }

  /*
   * ============================================================
   * LOAD EDIT DATA
   * ============================================================
   *
   * IMPORTANT:
   *
   * This effect ONLY fills the frontend form.
   *
   * It does NOT change the payload sent to the backend.
   */

  useEffect(() => {
    /*
     * Dialog closed.
     */
    if (!open) {
      resetForm();
      return;
    }

    /*
     * Create mode.
     */
    if (!isEditing) {
      resetForm();
      return;
    }

    /*
     * Edit mode but details haven't arrived yet.
     */
    if (!editSource) {
      return;
    }

    const source = editSource as any;

    /*
     * Basic information
     */
    setActivityName(
      String(
        source.activity_name ??
          source.name ??
          "",
      ),
    );

    setType(
      String(
        source.type ??
          "",
      ),
    );

    /*
     * Date / time
     */
    setActivityDate(
      normalizeDate(
        source.activity_date ??
          source.date,
      ),
    );

    setStartTime(
      normalizeTime(
        source.start_time,
      ),
    );

    setEndTime(
      normalizeTime(
        source.end_time,
      ),
    );

    /*
     * Grade
     */
    const resolvedGradeId =
      resolveGradeId(source);

    setGradeLevelId(
      resolvedGradeId,
    );

    /*
     * Classrooms
     */
    const resolvedRoomIds =
      resolveClassRoomIds(
        source,
      );

    setSelectedClassRoomIds(
      resolvedRoomIds,
    );

    /*
     * Description
     */
    setDescription(
      String(
        source.description ??
          source.notes ??
          "",
      ),
    );

    setFormError(null);
  }, [
    open,
    isEditing,
    editSource,
  ]);

  /*
   * ============================================================
   * FILTER CLASSROOMS BY GRADE
   * ============================================================
   */

  const filteredClassRooms =
    useMemo(() => {
      return classRooms.filter(
        (
          item: OptionItem & {
            parentId?: string | number;
            grade_level_id?: string | number;
            grade_id?: string | number;
          },
        ) => {
          /*
           * If no grade has been selected,
           * show all classrooms.
           */
          if (!gradeLevelId) {
            return true;
          }

          /*
           * Support the existing parentId structure
           * plus possible API naming.
           */
          const parentGradeId =
            item.parentId ??
            item.grade_level_id ??
            item.grade_id;

          return (
            String(parentGradeId) ===
            String(gradeLevelId)
          );
        },
      );
    }, [
      classRooms,
      gradeLevelId,
    ]);

  /*
   * ============================================================
   * SUBMIT
   * ============================================================
   *
   * The backend logic remains unchanged.
   */

  function submit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    setFormError(null);

    /*
     * Required fields
     */
    if (
      !activityName.trim() ||
      !type.trim() ||
      !activityDate ||
      !startTime ||
      !endTime ||
      !gradeLevelId
    ) {
      setFormError(
        "Complete all required activity fields before saving.",
      );

      return;
    }

    /*
     * Time validation
     */
    if (
      endTime <= startTime
    ) {
      setFormError(
        "End time must be later than start time.",
      );

      return;
    }

    /*
     * ==========================================================
     * SAME PAYLOAD AS BEFORE
     * ==========================================================
     */

    const payload: ActivityPayload = {
      activity_name:
        activityName.trim(),

      type:
        type.trim(),

      activity_date:
        activityDate,

      start_time:
        startTime.slice(0, 5),

      end_time:
        endTime.slice(0, 5),

      grade_level_id:
        Number(gradeLevelId),

      description:
        description.trim(),
    };

    /*
     * Only send classrooms when at least
     * one classroom is selected.
     */
    if (
      selectedClassRoomIds.length
    ) {
      payload.class_room_ids =
        selectedClassRoomIds.map(
          Number,
        );
    }

    /*
     * ==========================================================
     * MUTATION OPTIONS
     * ==========================================================
     */

    const options = {
      onSuccess: () => {
        onOpenChange(false);
      },

      onError: (
        error: unknown,
      ) => {
        const message =
          (error as any)
            ?.response
            ?.data
            ?.message ??
          (error as Error)
            ?.message ??
          "The activity could not be saved.";

        setFormError(
          String(message),
        );
      },
    };

    /*
     * ==========================================================
     * EDIT
     * ==========================================================
     */

    if (
      isEditing &&
      activityToEdit
    ) {
      updateActivity.mutate(
        {
          id:
            activityToEdit.id,

          payload,
        },
        options,
      );

      return;
    }

    /*
     * ==========================================================
     * CREATE
     * ==========================================================
     */

    createActivity.mutate(
      payload,
      options,
    );
  }

  /*
   * ============================================================
   * EDIT LOADING
   * ============================================================
   */

  const isLoadingEdit =
    isEditing &&
    detailsQuery.isLoading;

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <Dialog
      open={open}
      onOpenChange={(
        nextOpen,
      ) => {
        if (!isPending) {
          onOpenChange(
            nextOpen,
          );
        }
      }}
    >
      <DialogContent
        className="
          flex
          max-h-[92dvh]
          flex-col
          overflow-hidden
          rounded-[24px]
          border
          border-border/70
          bg-card
          p-0
          shadow-[0_28px_90px_rgba(27,19,66,0.20)]
          sm:max-w-3xl
        "
      >
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div
          className="
            shrink-0
            border-b
            border-border/50
            bg-info/[0.025]
            px-5
            py-5
            sm:px-6
          "
        >
          <DialogHeader className="text-start">
            <div className="flex items-start gap-3.5">
              <span
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-[15px]
                  border
                  border-info/10
                  bg-info/[0.09]
                  text-info
                "
              >
                <Sparkles
                  className="h-5 w-5"
                  strokeWidth={1.8}
                />
              </span>

              <div className="min-w-0">
                <DialogTitle
                  className="
                    text-[18px]
                    font-semibold
                    tracking-[-0.02em]
                    text-foreground
                  "
                >
                  {isEditing
                    ? "Edit school activity"
                    : "Create school activity"}
                </DialogTitle>

                <DialogDescription
                  className="
                    mt-1
                    text-[12.5px]
                    leading-5
                    text-muted-foreground
                  "
                >
                  Define the event, schedule,
                  grade, and participating
                  classrooms in one focused form.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* ================================================== */}
        {/* FORM CONTENT */}
        {/* ================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-5
            py-5
            sm:px-6
          "
        >
          {isLoadingEdit ? (
            <DialogFormSkeleton rows={5} />
          ) : detailsQuery.isError ? (
            <div
              className="
                rounded-[16px]
                border
                border-destructive/20
                bg-destructive/[0.035]
                p-5
              "
            >
              <p
                className="
                  text-[13px]
                  font-medium
                  text-foreground
                "
              >
                Activity details could not
                be loaded.
              </p>

              <p
                className="
                  mt-1
                  text-[11.5px]
                  leading-5
                  text-muted-foreground
                "
              >
                Retry the request before
                editing this activity.
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  void detailsQuery.refetch()
                }
                className="
                  mt-4
                  h-10
                  rounded-[12px]
                  border-border/70
                  bg-transparent
                  px-4
                  text-[12px]
                "
              >
                Try again
              </Button>
            </div>
          ) : (
            <form
              id="activity-form"
              onSubmit={submit}
              noValidate
              className="space-y-5"
            >
              {/* ================================================== */}
              {/* NAME + TYPE */}
              {/* ================================================== */}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Activity name">
                  <input
                    value={activityName}
                    onChange={(
                      event,
                    ) =>
                      setActivityName(
                        event.target.value,
                      )
                    }
                    placeholder="Science fair"
                    className={
                      inputClassName
                    }
                  />
                </Field>

                <Field label="Activity type">
                  <input
                    value={type}
                    onChange={(
                      event,
                    ) =>
                      setType(
                        event.target.value,
                      )
                    }
                    placeholder="Academic, sports, cultural..."
                    className={
                      inputClassName
                    }
                  />
                </Field>
              </div>

              {/* ================================================== */}
              {/* DATE + TIME */}
              {/* ================================================== */}

              <div
                className="
                  grid
                  gap-4
                  md:grid-cols-3
                "
              >
                <DatePicker
                  label="Activity date"
                  value={
                    activityDate
                  }
                  onChange={
                    setActivityDate
                  }
                  required
                />

                <Field
                  label="Start time"
                  icon={
                    <Clock3 className="h-3.5 w-3.5" />
                  }
                >
                  <TimePicker
                    value={
                      startTime
                    }
                    onChange={
                      setStartTime
                    }
                  />
                </Field>

                <Field
                  label="End time"
                  icon={
                    <Clock3 className="h-3.5 w-3.5" />
                  }
                >
                  <TimePicker
                    value={
                      endTime
                    }
                    onChange={
                      setEndTime
                    }
                  />
                </Field>
              </div>

              {/* ================================================== */}
              {/* GRADE + CLASSROOMS */}
              {/* ================================================== */}

              <div
                className="
                  space-y-4
                  rounded-[18px]
                  border
                  border-info/[0.12]
                  bg-info/[0.025]
                  p-4
                "
              >
                <Field label="Grade">
                  <Select
                    value={String(
                      gradeLevelId || "",
                    )}
                    onValueChange={(
                      value,
                    ) => {
                      /*
                       * Only clear classrooms
                       * when the user actually
                       * changes the grade.
                       *
                       * This is important for Edit.
                       */
                      if (
                        String(value) ===
                        String(
                          gradeLevelId,
                        )
                      ) {
                        return;
                      }

                      setGradeLevelId(
                        value,
                      );

                      setSelectedClassRoomIds(
                        [],
                      );
                    }}
                  >
                    <SelectTrigger
                      className="
                        h-11
                        rounded-[13px]
                        border-border/70
                        bg-background
                        text-[12px]
                        shadow-none
                      "
                    >
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>

                    <SelectContent>
                      {gradeLevels.map(
                        (
                          grade,
                        ) => (
                          <SelectItem
                            key={
                              grade.id
                            }
                            value={String(
                              grade.id,
                            )}
                          >
                            {
                              grade.name
                            }
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </Field>

                <MultiSelectAudience
                  label="Participating classrooms"
                  placeholder="Search classrooms"
                  options={
                    filteredClassRooms
                  }
                  selectedIds={
                    selectedClassRoomIds
                  }
                  onChange={
                    setSelectedClassRoomIds
                  }
                  tone="info"
                />
              </div>

              {/* ================================================== */}
              {/* DESCRIPTION */}
              {/* ================================================== */}

              <Field label="Activity notes">
                <textarea
                  value={
                    description
                  }
                  onChange={(
                    event,
                  ) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  placeholder="Add location, instructions, or preparation notes."
                  className="
                    min-h-[120px]
                    w-full
                    resize-none
                    rounded-[14px]
                    border
                    border-input
                    bg-background
                    p-3
                    text-[12px]
                    leading-5
                    outline-none
                    transition
                    hover:border-info/35
                    focus:border-info/35
                    focus:ring-4
                    focus:ring-info/[0.07]
                  "
                />
              </Field>

              {/* ================================================== */}
              {/* ERROR */}
              {/* ================================================== */}

              {formError ? (
                <p
                  className="
                    rounded-[12px]
                    border
                    border-destructive/15
                    bg-destructive/[0.055]
                    px-3
                    py-2.5
                    text-[11px]
                    text-destructive
                  "
                >
                  {formError}
                </p>
              ) : null}
            </form>
          )}
        </div>

        {/* ================================================== */}
        {/* ACTION BAR */}
        {/* ================================================== */}

        {!isLoadingEdit &&
          !detailsQuery.isError && (
            <div
              className="
                shrink-0
                flex
                flex-col-reverse
                gap-2
                border-t
                border-border/50
                bg-card
                px-5
                py-4
                sm:flex-row
                sm:justify-end
                sm:px-6
              "
            >
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onOpenChange(
                    false,
                  )
                }
                disabled={
                  isPending
                }
                className="
                  h-10
                  rounded-[12px]
                  border-border/70
                  bg-transparent
                  px-4
                  text-[12px]
                "
              >
                Cancel
              </Button>

              <Button
                type="submit"
                form="activity-form"
                disabled={
                  isPending
                }
                className="
                  h-10
                  rounded-[12px]
                  bg-info
                  px-5
                  text-[12px]
                  font-semibold
                  text-white
                  shadow-[0_4px_14px_rgba(59,130,246,0.25)]
                  transition
                  hover:bg-info/90
                "
              >
                {isPending ? (
                  <span
                    className="
                      h-3
                      w-24
                      animate-pulse
                      rounded-full
                      bg-primary-foreground/60
                    "
                  />
                ) : isEditing ? (
                  "Save changes"
                ) : (
                  "Create activity"
                )}
              </Button>
            </div>
          )}
      </DialogContent>
    </Dialog>
  );
}

/*
 * ============================================================
 * FIELD
 * ============================================================
 */

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="
          flex
          items-center
          gap-1.5
          text-[11.5px]
          font-medium
          text-foreground
        "
      >
        {icon}

        {label}
      </label>

      {children}
    </div>
  );
}