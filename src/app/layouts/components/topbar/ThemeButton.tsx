import { Sun } from "lucide-react";

import { useLocale } from "@/app/providers/locale";
import { useAppTheme } from "@/app/providers/theme";

import { TOPBAR_ICON_BUTTON_CLASS_NAME } from "./topbar.constants";

function MoonFillIcon() {
  return (
    <svg
      aria-hidden="true"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20.45 15.28A8.35 8.35 0 0 1 8.72 3.55a8.75 8.75 0 1 0 11.73 11.73Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ThemeButton() {
  const { resolvedTheme, setTheme } =
    useAppTheme();

  const { t } = useLocale();

  const isDark =
    resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() =>
        setTheme(
          isDark ? "light" : "dark",
        )
      }
      aria-label={
        t.layout.topbar.toggleTheme
      }
      className={
        TOPBAR_ICON_BUTTON_CLASS_NAME
      }
    >
      {isDark ? (
        <span className="text-topbar-info">
          <MoonFillIcon />
        </span>
      ) : (
        <Sun
          aria-hidden="true"
          size={17}
          strokeWidth={2.1}
          className="text-topbar-warning"
        />
      )}
    </button>
  );
}