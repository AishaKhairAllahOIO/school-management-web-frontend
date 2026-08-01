import {
  ChevronDown,
  Eye,
  LogOut,
  Settings,
  UserPlus,
  UsersRound,
} from "lucide-react";

import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useCurrentUser } from "@/app/layout/hooks/useCurrentUser";
import { useLocale } from "@/app/providers/locale";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useAuthenticatedImage } from "@/shared/hooks/useAuthenticatedImage";
import { useDismissibleLayer } from "@/shared/hooks/use-dismissible-layer";

import type { TopbarMenuProps } from "../topbar.types";
import { ProfileMenuItem } from "./ProfileMenuItem";

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
        className={[
          "flex h-[56px] w-[56px]",
          "items-center justify-center",
          "rounded-[18px]",
          "border border-topbar-border/75",
          "bg-topbar-surface/92",
          "p-[5px]",
          "shadow-[0_8px_24px_rgb(46_38_108_/_0.07)]",
          "backdrop-blur-xl",
          "transition-all duration-200 ease-out",
          "hover:-translate-y-0.5",
          "hover:border-primary/15",
          "hover:bg-topbar-soft",
          "hover:shadow-[0_12px_28px_rgb(46_38_108_/_0.11)]",
          "focus-visible:outline-none",
          "focus-visible:ring-4",
          "focus-visible:ring-primary/10",
          "lg:w-[278px]",
          "lg:justify-start",
          "lg:gap-3",
          "lg:rounded-[20px]",
          "lg:px-[7px]",
        ].join(" ")}
      >
        <img
          src={photoUrl}
          alt={displayName}
          className={[
            "h-[46px] w-[46px]",
            "shrink-0 rounded-full",
            "object-cover",
            "ring-2 ring-topbar-surface",
          ].join(" ")}
        />

        <span
          className={[
            "hidden min-w-0 flex-1",
            "flex-col text-start",
            "lg:flex",
          ].join(" ")}
        >
          <span
            className={[
              "truncate",
              "text-[14px] font-semibold",
              "leading-[18px]",
              "text-topbar-text",
            ].join(" ")}
          >
            {displayName}
          </span>

          <span
            className={[
              "truncate",
              "text-[11px] font-normal",
              "leading-[15px]",
              "tracking-[0.01em]",
              "text-topbar-muted",
            ].join(" ")}
          >
            {roleLabel}
          </span>
        </span>

        <span
          className={[
            "hidden h-8 w-8 shrink-0",
            "items-center justify-center",
            "rounded-[10px]",
            "text-topbar-muted",
            "transition-colors duration-200",
            "group-hover:text-topbar-text",
            "lg:flex",
          ].join(" ")}
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
          className={[
            "topbar-menu-shadow",
            "absolute end-0 top-full",
            "z-[100] mt-3",
            "w-[min(278px,calc(100vw-24px))]",
            "overflow-hidden",
            "rounded-[22px]",
            "border border-topbar-border/80",
            "bg-topbar-surface/98",
            "p-2.5",
            "backdrop-blur-2xl",
          ].join(" ")}
        >
          <div className="space-y-1">
            <ProfileMenuItem
              title={
                t.layout.topbar.viewProfile
              }
              description="Personal account details"
              icon={Eye}
              onClick={() =>
                navigateAndClose("/profile")
              }
            />

            {isSuperAdmin && (
              <>
                <ProfileMenuItem
                  title="View All Administrators"
                  description="Manage administrator accounts"
                  icon={UsersRound}
                  onClick={() =>
                    navigateAndClose(
                      "/users/administrators",
                    )
                  }
                />

                <ProfileMenuItem
                  title="Add Administrator"
                  description="Create an administrator account"
                  icon={UserPlus}
                  onClick={() =>
                    navigateAndClose(
                      "/users/administrators/new",
                    )
                  }
                />

                <ProfileMenuItem
                  title={
                    t.layout.topbar.manageUsers
                  }
                  description="Open the users workspace"
                  icon={Settings}
                  onClick={() =>
                    navigateAndClose("/users")
                  }
                />
              </>
            )}
          </div>

          <div
            className={[
              "mt-2",
              "border-t border-topbar-divider",
              "pt-2",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={handleLogout}
              disabled={
                logoutMutation.isPending
              }
              className={[
                "group flex min-h-[48px] w-full",
                "items-center gap-3",
                "rounded-[15px]",
                "border border-transparent",
                "px-3 text-start",
                "text-[13px] font-semibold",
                "text-topbar-danger",
                "transition-all duration-200",
                "hover:border-topbar-danger/10",
                "hover:bg-topbar-danger-soft",
                "disabled:cursor-not-allowed",
                "disabled:opacity-60",
                "focus-visible:outline-none",
                "focus-visible:ring-4",
                "focus-visible:ring-topbar-danger/10",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-9 w-9 shrink-0",
                  "items-center justify-center",
                  "rounded-[12px]",
                  "bg-topbar-danger-icon",
                  "text-topbar-danger",
                ].join(" ")}
              >
                <LogOut
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.9}
                />
              </span>

              <span>
                {logoutMutation.isPending
                  ? t.common.loading
                  : t.layout.topbar.logout}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}