import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createAnnouncementSchema,
  type CreateAnnouncementFormData,
} from "../schemas/announcement.schema";
import {
  useCreateAnnouncement,
  useUpdateAnnouncement,
} from "../hooks";
import type { Announcement } from "../types/announcement.types";

type AnnouncementFormModalProps = {
  isOpen: boolean;
  announcement: Announcement | null;
  onClose: () => void;
};

export function AnnouncementFormModal({
  isOpen,
  announcement,
  onClose,
}: AnnouncementFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAnnouncementFormData>({
    resolver: zodResolver(createAnnouncementSchema),
    defaultValues: announcement
      ? {
          title: announcement.title,
          description: announcement.description,
          target: announcement.target,
          priority: announcement.priority,
          publishDate: announcement.publishDate,
        }
      : undefined,
  });

  useEffect(() => {
    if (announcement) {
      reset({
        title: announcement.title,
        description: announcement.description,
        target: announcement.target,
        priority: announcement.priority,
        publishDate: announcement.publishDate,
      });
    } else {
      reset({
        title: "",
        description: "",
        target: "All Students",
        priority: "Medium",
        publishDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [announcement, reset, isOpen]);

  if (!isOpen) return null;

  async function onSubmit(data: CreateAnnouncementFormData) {
    setIsSubmitting(true);
    try {
      if (announcement) {
        await updateMutation.mutateAsync({
          id: announcement.id,
          data: {
            ...data,
            createdBy: announcement.createdBy,
          },
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          createdBy: "Current User",
        });
      }
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting announcement:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[30px] bg-background p-6 shadow-soft-lg"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {announcement ? "Edit Announcement" : "Create Announcement"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Share important updates with your school community.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-foreground">
              Title *
            </label>
            <input
              {...register("title")}
              placeholder="Announcement title"
              className="mt-1 h-11 w-full rounded-xl border border-border/70 bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-foreground">
              Description *
            </label>
            <textarea
              {...register("description")}
              placeholder="Announcement description"
              rows={5}
              className="mt-1 w-full resize-none rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-foreground">
                Target Audience *
              </label>
              <select
                {...register("target")}
                className="mt-1 h-11 w-full rounded-xl border border-border/70 bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              >
                <option value="All Students">All Students</option>
                <option value="All Parents">All Parents</option>
                <option value="All Staff">All Staff</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">
                Priority *
              </label>
              <select
                {...register("priority")}
                className="mt-1 h-11 w-full rounded-xl border border-border/70 bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground">
              Publish Date *
            </label>
            <input
              type="date"
              {...register("publishDate")}
              className="mt-1 h-11 w-full rounded-xl border border-border/70 bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            />
            {errors.publishDate && (
              <p className="mt-1 text-xs text-destructive">
                {errors.publishDate.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-primary px-6 py-2.5 text-sm font-bold text-primary transition hover:bg-primary/10"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : announcement
                ? "Update Announcement"
                : "Create Announcement"}
          </button>
        </div>
      </form>
    </div>
  );
}
