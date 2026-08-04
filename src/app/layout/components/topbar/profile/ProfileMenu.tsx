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
import { useAnchoredTopbarMenu } from "../useAnchoredTopbarMenu";
import { ProfileMenuItem } from "./ProfileMenuItem";

export function ProfileMenu({
  isOpen,
  onToggle,
  onClose,
}: TopbarMenuProps) {
  const containerRef =
    useRef<HTMLDivElement>(null);
  const triggerRef =
    useRef<HTMLButtonElement>(null);

  const navigate = useNavigate();

  const { t } = useLocale();

  const { user } = useCurrentUser();

  const logoutMutation = useLogout();

  useDismissibleLayer({
    ref: containerRef,
    enabled: isOpen,
    onDismiss: onClose,
  });

  const menuStyle = useAnchoredTopbarMenu({
    isOpen,
    triggerRef,
    desktopMatchTrigger: true,
    preferredWidth: 320,
  });

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : t.layout.topbar.loadingUser;

  const photoUrl =
    useAuthenticatedImage(user?.photoUrl);

  const primaryRole =
    user?.role?.[0] ?? "";

  const roleLabel = (() => {
    switch (primaryRole) {
      case "super_admin":
        return t.layout.topbar.roles.superAdmin;

      case "teacher":
        return t.layout.topbar.roles.teacher;

      case "adviser":
        return t.layout.topbar.roles.adviser;

      case "supervisor":
        return t.layout.topbar.roles.supervisor;

      case "secretary":
        return t.layout.topbar.roles.secretary;

      case "counselor":
        return t.layout.topbar.roles.counselor;

      case "service_staff":
        return t.layout.topbar.roles.serviceStaff;

      case "student":
        return t.layout.topbar.roles.student;

      case "guardian":
        return t.layout.topbar.roles.guardian;

      default:
        return t.layout.topbar.roles.user;
    }
  })();

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
      className="relative block shrink-0"
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggle}
        aria-label={
          t.layout.topbar.openProfileMenu
        }
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={[
          "flex h-[42px] w-[42px] sm:h-[48px] sm:w-[48px] lg:h-[56px] lg:w-[56px]",
          "items-center justify-center",
          "rounded-[14px] sm:rounded-[16px] lg:rounded-[18px]",
          "border border-topbar-border/75",
          "bg-topbar-surface/92",
          "p-[4px] sm:p-[5px]",
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
          "w-[42px] sm:w-[48px] lg:w-[278px]",
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
            "h-[34px] w-[34px] sm:h-[38px] sm:w-[38px] lg:h-[46px] lg:w-[46px]",
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
          style={menuStyle}
          className={[
            "topbar-menu-shadow",
            "z-[100]",
            "max-h-[calc(100dvh-24px)] overflow-y-auto",
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
              description={t.layout.topbar.viewProfileDescription}
              icon={Eye}
              onClick={() =>
                navigateAndClose("/profile")
              }
            />

            {isSuperAdmin && (
              <>
                <ProfileMenuItem
                  title={
                    t.layout.topbar
                      .viewAllAdministrators
                  }
                  description={
                    t.layout.topbar
                      .viewAllAdministratorsDescription
                  }
                  icon={UsersRound}
                  onClick={() =>
                    navigateAndClose(
                      "/users/administrators",
                    )
                  }
                />

                <ProfileMenuItem
                  title={
                    t.layout.topbar
                      .addAdministrator
                  }
                  description={
                    t.layout.topbar
                      .addAdministratorDescription
                  }
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
                  description={t.layout.topbar.manageUsersDescription}
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