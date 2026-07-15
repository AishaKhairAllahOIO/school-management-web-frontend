import {
  ChevronDown,
  Eye,
  LogOut,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useCurrentUser } from "@/app/layouts/hooks/useCurrentUser";
import { useLocale } from "@/app/providers/locale";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useDismissibleLayer } from "@/shared/hooks/use-dismissible-layer";

import { getRoleLabel } from "./topbar.helpers";
import { ProfileMenuItem } from "./ProfileMenuItem";
import type { TopbarMenuProps } from "./topbar.types";

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

  const fullName =
    "fullName" in user
      ? user.fullName
      : `${user.firstName} ${user.lastName}`.trim();

  const photoUrl =
    "avatarUrl" in user
      ? user.avatarUrl
      : user.photoUrl;

  const roleLabel = getRoleLabel(user);

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
      className="relative hidden lg:block"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={
          t.layout.topbar.openProfileMenu
        }
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="topbar-item-shadow flex h-[44px] items-center gap-[10px] rounded-[16px] border border-topbar-border bg-topbar-surface/92 py-[5px] pe-[6px] ps-[7px] backdrop-blur-xl"
      >
        <img
          src={photoUrl}
          alt={fullName}
          className="h-[34px] w-[34px] rounded-full object-cover ring-[2px] ring-topbar-surface"
        />

        <span className="flex min-w-0 max-w-[120px] flex-col text-start">
          <span className="truncate text-[12px] font-bold leading-[15px] text-topbar-text">
            {fullName}
          </span>

          <span className="truncate text-[10px] font-semibold leading-[14px] text-topbar-muted">
            {roleLabel}
          </span>
        </span>

        <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[12px] text-topbar-text">
          <ChevronDown
            aria-hidden="true"
            size={15}
            strokeWidth={2.3}
          />
        </span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="topbar-menu-shadow absolute end-0 top-full z-50 mt-4 w-[255px] rounded-[26px] border border-topbar-border/80 bg-topbar-surface/95 p-[18px] backdrop-blur-2xl"
        >
          <div className="mb-[20px] flex items-center gap-[9px] px-1 text-[12px] font-medium text-topbar-subtle">
            <span
              aria-hidden="true"
              className="h-[7px] w-[7px] rounded-full bg-topbar-success"
            />

            {t.layout.topbar.online}
          </div>

          <div className="space-y-[8px]">
            <ProfileMenuItem
              title={
                t.layout.topbar.viewProfile
              }
              icon={Eye}
              onClick={() =>
                navigateAndClose("/profile")
              }
            />

            <ProfileMenuItem
              title={
                t.layout.topbar
                  .changePassword
              }
              icon={ShieldCheck}
              onClick={() =>
                navigateAndClose("/profile")
              }
            />

            {roleLabel === "Super Admin" ? (
              <ProfileMenuItem
                title={
                  t.layout.topbar.manageUsers
                }
                icon={Settings}
                onClick={() =>
                  navigateAndClose(
                    "/users",
                  )
                }
              />
            ) : null}
          </div>

          <div className="mt-[18px] border-t border-topbar-divider pt-[14px]">
            <button
              type="button"
              onClick={handleLogout}
              disabled={
                logoutMutation.isPending
              }
              className="flex h-[44px] w-full items-center gap-[13px] rounded-[15px] px-[10px] text-start text-[13px] font-bold text-topbar-danger transition hover:bg-topbar-danger-soft disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-topbar-danger"
            >
              <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[12px] bg-topbar-danger-icon text-topbar-danger">
                <LogOut
                  aria-hidden="true"
                  size={16}
                  strokeWidth={2.1}
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