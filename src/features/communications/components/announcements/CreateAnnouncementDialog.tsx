import {
  Megaphone,
  School,
  Users,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { useAnnouncements } from "../../hooks/useAnnouncements";
import type {
  Announcement,
  AnnouncementAudience,
} from "../../types/communication.types";
import {
  MultiSelectAudience,
  type OptionItem,
} from "../shared/MultiSelectAudience";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gradeLevels: { id: string | number; name: string }[];
  classRooms: OptionItem[];
  announcementToEdit?: Announcement | null;
};

const inputClassName =
  "h-11 w-full rounded-[13px] border border-input bg-background px-3 text-[12px] outline-none transition focus:border-primary/35 focus:ring-4 focus:ring-primary/[0.07]";

export function CreateAnnouncementDialog({
  open,
  onOpenChange,
  gradeLevels = [],
  classRooms = [],
  announcementToEdit = null,
}: Props) {
  const { createAnnouncement, updateAnnouncement } = useAnnouncements();
  const isEditing = Boolean(announcementToEdit);
  const isPending =
    createAnnouncement.isPending || updateAnnouncement.isPending;

  const [audience, setAudience] =
    useState<AnnouncementAudience>("student");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gradeLevelId, setGradeLevelId] =
    useState<string | number>("");
  const [selectedClassRoomIds, setSelectedClassRoomIds] =
    useState<(string | number)[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setAudience("student");
      setTitle("");
      setDescription("");
      setGradeLevelId("");
      setSelectedClassRoomIds([]);
      setFormError(null);
      return;
    }

    if (announcementToEdit) {
      setAudience(announcementToEdit.audience ?? "student");
      setTitle(announcementToEdit.title ?? "");
      setDescription(announcementToEdit.description ?? "");
      setGradeLevelId(announcementToEdit.grade_level_id ?? "");
      setSelectedClassRoomIds(announcementToEdit.class_room_ids ?? []);
      setFormError(null);
    }
  }, [announcementToEdit, open]);

  const filteredClassRooms = useMemo(
    () =>
      classRooms.filter((item: OptionItem & { parentId?: string | number }) =>
        !gradeLevelId || String(item.parentId) === String(gradeLevelId),
      ),
    [classRooms, gradeLevelId],
  );

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (!title.trim() || !description.trim()) {
      setFormError("Title and announcement details are required.");
      return;
    }

    if (audience === "student" && !gradeLevelId) {
      setFormError("Select a grade for student announcements.");
      return;
    }

    const payload: any = {
      audience,
      title: title.trim(),
      description: description.trim(),
    };

    if (audience === "student") {
      payload.grade_level_id = Number(gradeLevelId);
      if (selectedClassRoomIds.length) {
        payload.class_room_ids = selectedClassRoomIds.map(Number);
      }
    }

    const options = { onSuccess: () => onOpenChange(false) };

    if (isEditing && announcementToEdit) {
      updateAnnouncement.mutate(
        { id: announcementToEdit.id, payload },
        options,
      );
      return;
    }

    createAnnouncement.mutate(payload, options);
  }

  const audienceOptions = [
    {
      value: "student" as const,
      label: "Students",
      description: "Target a grade and optional classrooms.",
      icon: School,
    },
    {
      value: "staff" as const,
      label: "Staff",
      description: "Publish to the staff communication feed.",
      icon: Users,
    },
    {
      value: "both" as const,
      label: "Everyone",
      description: "Share one announcement across the school.",
      icon: Megaphone,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-[24px] border border-border/70 bg-card p-0 shadow-[0_28px_90px_rgba(27,19,66,0.20)] sm:max-w-2xl">
        <div className="border-b border-border/50 bg-primary/[0.025] px-5 py-5 sm:px-6">
          <DialogHeader className="text-start">
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] border border-primary/10 bg-primary/[0.09] text-primary">
                <Megaphone className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div>
                <DialogTitle className="text-[18px] font-semibold tracking-[-0.02em]">
                  {isEditing ? "Edit announcement" : "Create announcement"}
                </DialogTitle>
                <DialogDescription className="mt-1 text-[12.5px] leading-5">
                  Choose the audience first, then write one clear message.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form
          onSubmit={submit}
          className="max-h-[calc(92vh-96px)] space-y-5 overflow-y-auto px-5 py-5 sm:px-6"
        >
          <div className="grid gap-2 sm:grid-cols-3">
            {audienceOptions.map((option) => {
              const Icon = option.icon;
              const active = audience === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setAudience(option.value);
                    if (option.value !== "student") {
                      setGradeLevelId("");
                      setSelectedClassRoomIds([]);
                    }
                  }}
                  className={[
                    "rounded-[15px] border p-3 text-start transition",
                    active
                      ? "border-primary/25 bg-primary/[0.055]"
                      : "border-border/60 bg-background hover:bg-muted/20",
                  ].join(" ")}
                >
                  <Icon className={active ? "h-4 w-4 text-primary" : "h-4 w-4 text-muted-foreground"} />
                  <p className="mt-2 text-[12px] font-medium text-foreground">{option.label}</p>
                  <p className="mt-0.5 text-[10.5px] leading-4 text-muted-foreground">{option.description}</p>
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[11px] font-medium text-foreground">Announcement title</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="A concise headline"
                className={inputClassName}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[11px] font-medium text-foreground">Message</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Write the announcement details."
                className="min-h-[130px] w-full resize-none rounded-[14px] border border-input bg-background p-3 text-[12px] leading-5 outline-none transition focus:border-primary/35 focus:ring-4 focus:ring-primary/[0.07]"
              />
            </div>
          </div>

          {audience === "student" ? (
            <div className="space-y-4 rounded-[18px] border border-primary/[0.12] bg-primary/[0.025] p-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-foreground">Grade</label>
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
              </div>

              <MultiSelectAudience
                label="Classrooms"
                placeholder="Search classrooms"
                options={filteredClassRooms}
                selectedIds={selectedClassRoomIds}
                onChange={setSelectedClassRoomIds}
                tone="primary"
              />
            </div>
          ) : null}

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
                "Publish announcement"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
