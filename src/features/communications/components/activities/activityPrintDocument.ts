import {
  createPosterDocument,
  type PrintIdentity,
} from "@/features/printing";

import type { Activity } from "../../types/communication.types";

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
      }).format(date);
}

function formatTime(value: string) {
  if (!value) return "—";

  const [hours, minutes] = value
    .slice(0, 5)
    .split(":")
    .map(Number);

  const date = new Date();

  date.setHours(
    hours || 0,
    minutes || 0,
    0,
    0,
  );

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function buildActivityPosterDocument(
  activity: Activity,
  identity: PrintIdentity,
) {
  return createPosterDocument({
    title: `${activity.activity_name} poster`,

    identity,

    eyebrow:
      activity.type ||
      "School activity",

    headline:
      activity.activity_name,

    description:
      activity.description ||
      "Join the school community for a meaningful and memorable activity.",

    details: [
      {
        label: "Date",
        value: formatDate(
          activity.activity_date,
        ),
      },

      {
        label: "Time",
        value: `${formatTime(
          activity.start_time,
        )} – ${formatTime(
          activity.end_time,
        )}`,
      },

      {
        label: "Audience",
        value:
          activity.class_room_ids?.length
            ? `${activity.class_room_ids.length} classroom${
                activity.class_room_ids.length === 1
                  ? ""
                  : "s"
              }`
            : "School community",
      },
    ],

    footer:
      "Take part · Create memories · Grow together",

    tone: "violet",
  });
}