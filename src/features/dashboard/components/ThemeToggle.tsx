import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-card text-foreground transition hover:bg-muted"
    >
      {isDark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}