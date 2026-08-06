import {
  createPosterDocument,
  type PrintIdentity,
} from "@/features/printing";
import type { Announcement } from "../../types/communication.types";

export function buildAnnouncementPosterDocument(
  announcement: Announcement,
  identity: PrintIdentity,
) {
  const audience =
    announcement.audience === "both"
      ? "Students and staff"
      : announcement.audience === "student"
        ? "Students"
        : "Staff";

  return createPosterDocument({
    title: `${announcement.title} poster`,
    identity,
    eyebrow: "School announcement",
    headline: announcement.title,
    description: announcement.description,
    details: [
      { label: "For", value: audience },
      {
        label: "Published",
        value: announcement.created_at
          ? new Intl.DateTimeFormat(undefined, {
              year: "numeric",
              month: "long",
              day: "2-digit",
            }).format(new Date(announcement.created_at))
          : "Current announcement",
      },
      {
        label: "From",
        value: announcement.creator_name || identity.schoolName,
      },
    ],
    footer: "Stay informed · Stay connected",
    tone: "coral",
  });
}
