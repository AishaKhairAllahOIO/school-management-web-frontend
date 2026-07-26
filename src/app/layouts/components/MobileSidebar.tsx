import {
  ChevronDown,
  Eye,
  LogOut,
  Settings,
} from "lucide-react";

import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useCurrentUser } from "@/app/layouts/hooks/useCurrentUser";
import { useLocale } from "@/app/providers/locale";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useDismissibleLayer } from "@/shared/hooks/use-dismissible-layer";

import { ProfileMenuItem } from "../components/topbar/ProfileMenuItem";
import type { TopbarMenuProps } from "../components/topbar/topbar.types";

export function ProfileMenu({
  isOpen,
  onToggle,
  onClose,
}: TopbarMenuProps) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const { t } = useLocale();

  const { user } = useCurrentUser();

  const logoutMutation = useLogout();

  useDismissibleLayer({
    ref: containerRef,
    enabled: isOpen,
    onDismiss: onClose,
  });

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Loading...";

  const photoUrl =
    user?.photoUrl ??
    "/images/avatar-placeholder.png";

  const roleLabel = user?.role?.[0]
    ? user.role[0]
        .split("_")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() +
            word.slice(1),
        )
        .join(" ")
    : "User";

  const isSuperAdmin =
    user?.role?.includes("super_admin");

  function navigateAndClose(
    path: string,
  ) {
    onClose();
    navigate(path);
  }

  function handleLogout() {
    onClose();
    logoutMutation.mutate();
  }

  return (
    <div
      ref={containerRef}
      className="relative block"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={
          t.layout.topbar.openProfileMenu
        }
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="
          flex
          h-[44px]
          w-[44px]
          items-center
          justify-center
          rounded-[15px]
          border
          border-topbar-border/80
          bg-topbar-surface/85
          p-[4px]
          backdrop-blur-xl
          transition
          hover:bg-topbar-soft
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-ring
          sm:w-[232px]
          sm:justify-start
          sm:gap-[10px]
          sm:px-[7px]
        "
      >
        <img
          src={photoUrl}
          alt={displayName}
          className="
            h-[34px]
            w-[34px]
            shrink-0
            rounded-full
            object-cover
            ring-2
            ring-topbar-surface
          "
        />

        <span
          className="
            hidden
            min-w-0
            flex-1
            flex-col
            text-start
            sm:flex
          "
        >
          <span
            className="
              truncate
              text-[13px]
              font-medium
              leading-[16px]
              text-topbar-text
            "
          >
            {displayName}
          </span>

          <span
            className="
              truncate
              text-[10px]
              font-normal
              leading-[14px]
              tracking-[0.01em]
              text-topbar-muted
            "
          >
            {roleLabel}
          </span>
        </span>

        <span
          className="
            hidden
            h-[28px]
            w-[28px]
            shrink-0
            items-center
            justify-center
            rounded-[9px]
            text-topbar-muted
            transition
            sm:flex
          "
        >
          <ChevronDown
            aria-hidden="true"
            size={15}
            strokeWidth={1.9}
            className={[
              "transition-transform duration-200",
              isOpen ? "rotate-180" : "",
            ].join(" ")}
          />
        </span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="
            topbar-menu-shadow
            absolute
            end-0
            top-full
            z-[100]
            mt-3
            w-[min(250px,calc(100vw-24px))]
            rounded-[22px]
            border
            border-topbar-border/80
            bg-topbar-surface/95
            p-[14px]
            backdrop-blur-2xl
          "
        >
          <div
            className="
              mb-3
              border-b
              border-topbar-divider
              px-1
              pb-3
            "
          >
            <p
              className="
                truncate
                text-sm
                font-medium
                text-topbar-text
              "
            >
              {displayName}
            </p>

            <p
              className="
                mt-1
                truncate
                text-xs
                font-normal
                text-topbar-muted
              "
            >
              {roleLabel}
            </p>
          </div>

          <div
            className="
              mb-4
              flex
              items-center
              gap-[9px]
              px-1
              text-[12px]
              font-normal
              text-topbar-subtle
            "
          >
            <span
              className="
                h-[7px]
                w-[7px]
                rounded-full
                bg-topbar-success
              "
            />

            {t.layout.topbar.online}
          </div>

          <div className="space-y-1">
            <ProfileMenuItem
              title={
                t.layout.topbar.viewProfile
              }
              icon={Eye}
              onClick={() =>
                navigateAndClose("/profile")
              }
            />

            {isSuperAdmin && (
              <ProfileMenuItem
                title={
                  t.layout.topbar.manageUsers
                }
                icon={Settings}
                onClick={() =>
                  navigateAndClose("/users")
                }
              />
            )}
          </div>

          <div
            className="
              mt-3
              border-t
              border-topbar-divider
              pt-3
            "
          >
            <button
              type="button"
              onClick={handleLogout}
              disabled={
                logoutMutation.isPending
              }
              className="
                flex
                h-[40px]
                w-full
                items-center
                gap-[12px]
                rounded-[14px]
                px-[10px]
                text-start
                text-[13px]
                font-medium
                text-topbar-danger
                transition
                hover:bg-topbar-danger-soft
                disabled:cursor-not-allowed
                disabled:opacity-60
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-topbar-danger
              "
            >
              <span
                className="
                  flex
                  h-[30px]
                  w-[30px]
                  items-center
                  justify-center
                  rounded-[10px]
                  bg-topbar-danger-icon
                  text-topbar-danger
                "
              >
                <LogOut
                  aria-hidden="true"
                  size={15}
                  strokeWidth={1.9}
                />
              </span>

              {logoutMutation.isPending
                ? t.common.loading
                : t.layout.topbar.logout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}