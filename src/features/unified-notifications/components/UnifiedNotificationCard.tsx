import {
  BellRing,
  Megaphone,
  ShieldAlert,
} from "lucide-react";

import type {
  UnifiedNotification,
} from "../types/unified-notification.types";

const toneMap = {
  system: {
    icon: ShieldAlert,
    label: "System",
    iconClass: "bg-destructive/[0.09] text-destructive",
    dotClass: "bg-destructive",
    surfaceClass: "border-destructive/[0.12] bg-destructive/[0.025]",
  },
  announcement: {
    icon: Megaphone,
    label: "Announcement",
    iconClass: "bg-primary/[0.08] text-primary",
    dotClass: "bg-primary",
    surfaceClass: "border-primary/[0.10] bg-primary/[0.02]",
  },
  alert: {
    icon: BellRing,
    label: "Alert",
    iconClass: "bg-warning/[0.12] text-warning",
    dotClass: "bg-warning",
    surfaceClass: "border-warning/[0.15] bg-warning/[0.025]",
  },
} as const;

export function UnifiedNotificationCard({
  notification,
  compact = false,
}: {
  notification: UnifiedNotification;
  compact?: boolean;
}) {
  const tone = toneMap[notification.type];
  const Icon = tone.icon;

  return (
    <article
      className={[
        "relative rounded-[16px] border transition-colors duration-200",
        compact ? "p-3" : "p-4",
        tone.surfaceClass,
        "hover:bg-muted/[0.18]",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <span
          className={[
            "mt-0.5 flex shrink-0 items-center justify-center rounded-[12px]",
            compact ? "h-8 w-8" : "h-10 w-10",
            tone.iconClass,
          ].join(" ")}
        >
          <Icon
            aria-hidden="true"
            size={compact ? 15 : 18}
            strokeWidth={1.85}
          />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {tone.label}
                </span>
                {!notification.isRead ? (
                  <span
                    className={[
                      "h-1.5 w-1.5 rounded-full",
                      tone.dotClass,
                    ].join(" ")}
                  />
                ) : null}
              </div>

              <h3
                className={[
                  "mt-1 truncate font-semibold text-foreground",
                  compact ? "text-[12px]" : "text-[14px]",
                ].join(" ")}
              >
                {notification.title}
              </h3>
            </div>
          </div>

          <p
            className={[
              "mt-1.5 text-muted-foreground",
              compact
                ? "line-clamp-2 text-[11px] leading-[18px]"
                : "text-[12px] leading-5",
            ].join(" ")}
          >
            {notification.description}
          </p>

          <p className="mt-2 text-[10px] text-muted-foreground/75">
            {new Date(notification.createdAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
      </div>
    </article>
  );
}
