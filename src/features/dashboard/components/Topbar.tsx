import { Bell, Menu, Search } from "lucide-react";

import { useLayoutStore } from "../store/layoutStore";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

export function Topbar() {
  const toggleMobileSidebar = useLayoutStore(
    (state) => state.toggleMobileSidebar
  );

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b bg-card/95 px-4 backdrop-blur md:px-6 lg:h-24 lg:px-10">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-card text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-xl font-bold text-foreground md:text-2xl lg:text-3xl">
            Welcome Back 👋
          </h2>
          <p className="mt-1 hidden text-sm text-muted-foreground sm:block lg:text-base">
            Manage your school operations easily
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden h-11 w-64 items-center gap-3 rounded-2xl border bg-background px-4 md:flex lg:w-80">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            placeholder="Search..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <ThemeToggle />

        <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border bg-card text-foreground transition hover:bg-muted">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            3
          </span>
        </button>

        <UserMenu />
      </div>
    </header>
  );
}