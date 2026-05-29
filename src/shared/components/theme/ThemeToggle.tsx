import { Moon, Sun } from "lucide-react";

import { useAppTheme } from "@/app/providers/theme";

export function ThemeToggle() {
  const { theme, setTheme } = useAppTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/80 text-foreground shadow-soft transition hover:bg-muted"
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}