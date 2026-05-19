import { Bell, Menu, Moon, Search } from "lucide-react";

import { useLayoutStore } from "../store/layoutStore";
import { UserMenu } from "./UserMenu";

export function Topbar() {
  const toggleMobileSidebar = useLayoutStore(
    (state) => state.toggleMobileSidebar
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background px-4 py-3 md:px-6 lg:px-8">
      <div className="flex h-10 items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={toggleMobileSidebar}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-foreground transition hover:bg-muted lg:hidden"
          >
            <Menu size={18} />
          </button>

          <div className="flex h-9 w-64 items-center gap-2 rounded-2xl bg-card px-3 shadow-sm md:w-72 lg:w-80">
            <Search size={16} className="shrink-0 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card text-foreground transition hover:bg-muted"
          >
            <Moon size={17} />
          </button>

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card text-foreground transition hover:bg-muted"
          >
            <Bell size={17} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          </button>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}