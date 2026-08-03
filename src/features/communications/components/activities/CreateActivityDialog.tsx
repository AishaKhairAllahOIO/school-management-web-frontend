import {
  CalendarDays,
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

import {
  Button,
} from "@/shared/ui/button";
import { DatePicker } from "@/shared/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { TimePicker } from "@/shared/ui/time-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import {
  useActivities,
} from "../../hooks/useActivities";
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
  "h-11 w-full rounded-[13px] border border-input bg-background px-3 text-[12px] outline-none transition focus:border-info/35 focus:ring-4 focus:ring-info/[0.07]";

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

  const editSource =
    detailsQuery.data ?? activityToEdit;

  const [activityName, setActivityName] =
    useState("");
  const [type, setType] = useState("");
  const [activityDate, setActivityDate] =
    useState("");
  const [startTime, setStartTime] =
    useState("");
  const [endTime, setEndTime] =
    useState("");
  const [gradeLevelId, setGradeLevelId] =
    useState<string | number>("");
  const [selectedClassRoomIds, setSelectedClassRoomIds] =
    useState<(string | number)[]>([]);
  const [description, setDescription] =
    useState("");
  const [formError, setFormError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setActivityName("");
      setType("");
      setActivityDate("");
      setStartTime("");
      setEndTime("");
      setGradeLevelId("");
      setSelectedClassRoomIds([]);
      setDescription("");
      setFormError(null);
      return;
    }

    if (editSource) {
      setActivityName(
        editSource.activity_name ?? "",
      );
      setType(editSource.type ?? "");
      setActivityDate(
        editSource.activity_date ?? "",
      );
      setStartTime(
        (editSource.start_time ?? "").slice(0, 5),
      );
      setEndTime(
        (editSource.end_time ?? "").slice(0, 5),
      );
      setGradeLevelId(
        editSource.grade_level_id ?? "",
      );
      setSelectedClassRoomIds(
        editSource.class_room_ids ?? [],
      );
      setDescription(
        editSource.description ?? "",
      );
      setFormError(null);
    }
  }, [editSource, open]);

  const filteredClassRooms = useMemo(
    () =>
      classRooms.filter(
        (item: OptionItem & { parentId?: string | number }) =>
          !gradeLevelId ||
          String(item.parentId) ===
            String(gradeLevelId),
      ),
    [classRooms, gradeLevelId],
  );

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

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

    if (endTime <= startTime) {
      setFormError(
        "End time must be later than start time.",
      );
      return;
    }

    const payload: ActivityPayload = {
      activity_name: activityName.trim(),
      type: type.trim(),
      activity_date: activityDate,
      start_time: startTime.slice(0, 5),
      end_time: endTime.slice(0, 5),
      grade_level_id: Number(gradeLevelId),
      description: description.trim(),
    };

    if (selectedClassRoomIds.length) {
      payload.class_room_ids =
        selectedClassRoomIds.map(Number);
    }

    const options = {
      onSuccess: () => onOpenChange(false),
    };

    if (isEditing && activityToEdit) {
      updateActivity.mutate(
        {
          id: activityToEdit.id,
          payload,
        },
        options,
      );
      return;
    }

    createActivity.mutate(payload, options);
  }

  const isLoadingEdit =
    isEditing && detailsQuery.isLoading;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-[24px] border border-border/70 bg-card p-0 shadow-[0_28px_90px_rgba(27,19,66,0.20)] sm:max-w-3xl">
        <div className="border-b border-border/50 bg-info/[0.025] px-5 py-5 sm:px-6">
          <DialogHeader className="text-start">
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] border border-info/10 bg-info/[0.09] text-info">
                <Sparkles className="h-5 w-5" strokeWidth={1.8} />
              </span>

              <div className="min-w-0">
                <DialogTitle className="text-[18px] font-semibold tracking-[-0.02em] text-foreground">
                  {isEditing
                    ? "Edit school activity"
                    : "Create school activity"}
                </DialogTitle>
                <DialogDescription className="mt-1 text-[12.5px] leading-5 text-muted-foreground">
                  Define the event, schedule, grade, and participating classrooms in one focused form.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="max-h-[calc(92vh-96px)] overflow-y-auto px-5 py-5 sm:px-6">
          {isLoadingEdit ? (
            <DialogFormSkeleton rows={5} />
          ) : detailsQuery.isError ? (
            <div className="rounded-[16px] border border-destructive/20 bg-destructive/[0.035] p-5">
              <p className="text-[13px] font-medium text-foreground">
                Activity details could not be loaded.
              </p>
              <p className="mt-1 text-[11.5px] leading-5 text-muted-foreground">
                Retry the request before editing this activity.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => void detailsQuery.refetch()}
                className="mt-4 h-10 rounded-[12px] border-border/70 bg-transparent px-4 text-[12px]"
              >
                Try again
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Activity name">
                  <input
                    value={activityName}
                    onChange={(event) =>
                      setActivityName(event.target.value)
                    }
                    placeholder="Science fair"
                    className={inputClassName}
                  />
                </Field>

                <Field label="Activity type">
                  <input
                    value={type}
                    onChange={(event) =>
                      setType(event.target.value)
                    }
                    placeholder="Academic, sports, cultural..."
                    className={inputClassName}
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <DatePicker
                  label="Activity date"
                  value={activityDate}
                  onChange={setActivityDate}
                  required
                  icon={<CalendarDays className="h-3.5 w-3.5" />}
                />

                <Field
                  label="Start time"
                  icon={<Clock3 className="h-3.5 w-3.5" />}
                >
                  <TimePicker
                    value={startTime}
                    onChange={setStartTime}
                  />
                </Field>

                <Field
                  label="End time"
                  icon={<Clock3 className="h-3.5 w-3.5" />}
                >
                  <TimePicker
                    value={endTime}
                    onChange={setEndTime}
                  />
                </Field>
              </div>

              <div className="space-y-4 rounded-[18px] border border-info/[0.12] bg-info/[0.025] p-4">
                <Field label="Grade">
                  <Select
                    value={String(gradeLevelId || "")}
                    onValueChange={(value) => {
                      setGradeLevelId(value);
                      setSelectedClassRoomIds([]);
                    }}
                  >
                    <SelectTrigger className="h-11 rounded-[13px] border-border/70 bg-background text-[12px] shadow-none">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeLevels.map((grade) => (
                        <SelectItem key={grade.id} value={String(grade.id)}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <MultiSelectAudience
                  label="Participating classrooms"
                  placeholder="Search classrooms"
                  options={filteredClassRooms}
                  selectedIds={selectedClassRoomIds}
                  onChange={setSelectedClassRoomIds}
                  tone="info"
                />
              </div>

              <Field label="Activity notes">
                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Add location, instructions, or preparation notes."
                  className="min-h-[120px] w-full resize-none rounded-[14px] border border-input bg-background p-3 text-[12px] leading-5 outline-none transition focus:border-info/35 focus:ring-4 focus:ring-info/[0.07]"
                />
              </Field>

              {formError ? (
                <p className="rounded-[12px] border border-destructive/15 bg-destructive/[0.055] px-3 py-2.5 text-[11px] text-destructive">
                  {formError}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-2 border-t border-border/50 pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                  className="h-10 rounded-[12px] border-border/70 bg-transparent px-4 text-[12px]"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-10 rounded-[12px] px-5 text-[12px]"
                >
                  {isPending ? (
                    <span className="h-3 w-24 animate-pulse rounded-full bg-primary-foreground/60" />
                  ) : isEditing ? (
                    "Save changes"
                  ) : (
                    "Create activity"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
      <label className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}
