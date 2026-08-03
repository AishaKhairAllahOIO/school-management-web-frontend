import {
  BellRing,
} from "lucide-react";

import {
  useLocale,
} from "@/app/providers/locale";
import type {
  SystemNotice,
} from "@/features/system-notices";

import {
  formatNoticeTime,
} from "./notifications.helpers";

type NotificationItemProps = {
  notice: SystemNotice;
  locale?: string;
};

export function NotificationItem({
  notice,
  locale,
}: NotificationItemProps) {
  const { t } = useLocale();

  return (
    <article
      className={[
        "group relative rounded-[16px] p-3",
        "transition-colors duration-200",
        "hover:bg-topbar-soft-hover",
        notice.is_read === false
          ? "bg-primary/[0.045]"
          : "bg-topbar-soft",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-primary/[0.08] text-primary">
          <BellRing
            aria-hidden="true"
            size={15}
            strokeWidth={1.85}
          />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <p className="min-w-0 flex-1 truncate text-[12px] font-semibold text-topbar-text">
              {notice.title}
            </p>

            {notice.is_read === false ? (
              <span
                aria-label={t.layout.topbar.unread}
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              />
            ) : null}
          </div>

          <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-topbar-subtle">
            {notice.description}
          </p>

          <p className="mt-1.5 text-[10px] text-topbar-muted">
            {formatNoticeTime(
              notice.created_at,
              locale,
            )}
          </p>
        </div>
      </div>
    </article>
  );
}
