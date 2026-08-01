import {
  ChevronDown,
  Eye,
  LogOut,
  Settings,
  UserPlus,
} from "lucide-react";

import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useCurrentUser } from "@/app/layouts/hooks/useCurrentUser";
import { useLocale } from "@/app/providers/locale";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useDismissibleLayer } from "@/shared/hooks/use-dismissible-layer";

import { ProfileMenuItem } from "./ProfileMenuItem";
import type { TopbarMenuProps } from "./topbar.types";
import { useAuthenticatedImage } from "@/shared/hooks/useAuthenticatedImage";

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
  useAuthenticatedImage(user?.photoUrl);

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
          h-[56px]
          w-[56px]
          items-center
          justify-center
          rounded-[18px]
          border
          border-topbar-border/75
          bg-topbar-surface/92
          p-[5px]
          shadow-[0_8px_24px_rgb(46_38_108_/_0.07)]
          backdrop-blur-xl
          transition-all
          duration-200
          ease-out
          hover:-translate-y-0.5
          hover:border-primary/15
          hover:bg-topbar-soft
          hover:shadow-[0_12px_28px_rgb(46_38_108_/_0.11)]
          focus-visible:outline-none
          focus-visible:ring-4
          focus-visible:ring-primary/10
          lg:h-[56px]
          lg:w-[278px]
          lg:justify-start
          lg:gap-[12px]
          lg:rounded-[20px]
          lg:px-[7px]
        "
      >
     <img
  src={photoUrl}
  alt={displayName}
  className="
    h-[46px]
    w-[46px]
    shrink-0
    rounded-full
    object-cover
    ring-2
    ring-topbar-surface
    lg:h-[46px]
    lg:w-[46px]
  "
/>
        <span
          className="
            hidden
            min-w-0
            flex-1
            flex-col
            text-start
            lg:flex
          "
        >
          <span
            className="
              truncate
              text-[14px]
              font-semibold
              leading-[17px]
              text-topbar-text
            "
          >
            {displayName}
          </span>

          <span
            className="
              truncate
              text-[11px]
              font-normal
              leading-[15px]
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
            h-[32px]
            w-[32px]
            shrink-0
            items-center
            justify-center
            rounded-[9px]
            text-topbar-muted
            transition
            lg:flex
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
              <>
                <ProfileMenuItem
                  title="Add Administrator"
                  icon={UserPlus}
                  onClick={() =>
                    navigateAndClose("/users/administrators/new")
                  }
                />

                <ProfileMenuItem
                  title={
                    t.layout.topbar.manageUsers
                  }
                  icon={Settings}
                  onClick={() =>
                    navigateAndClose("/users")
                  }
                />
              </>
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