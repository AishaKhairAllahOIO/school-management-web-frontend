import { Plus, Search, SlidersHorizontal } from "lucide-react";

export function ParentsToolbar() {
  return (
    <div className="soft-card rounded-3xl p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="text"
            placeholder="Search parents..."
            className="h-12 w-full rounded-2xl border border-border/70 bg-background pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="flex h-12 items-center rounded-2xl border border-border/70 bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-muted">
            All Relations
          </button>

          <button className="flex h-12 items-center gap-2 rounded-2xl border border-border/70 bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-muted">
            More Filters
            <SlidersHorizontal size={16} />
          </button>

          <button className="flex h-12 items-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90">
            <Plus size={18} />
            Add Parent
          </button>
        </div>
      </div>
    </div>
  );
}