import { Download, Filter, Plus, Search, Upload } from "lucide-react";
import { useRef } from "react";

type UsersToolbarProps = {

  searchValue: string;
  searchPlaceholder?: string;
  addLabel: string;
  importLabel: string;
  exportLabel: string;
  filterLabel: string;
  onSearchChange: (value: string) => void;
  onAdd?: () => void;
  onImport: (file: File) => void;
  onExport: () => void;
  onOpenFilters?: () => void;
};

export function UsersToolbar({

  searchValue,
  searchPlaceholder = "Search...",
  addLabel,
  importLabel,
  exportLabel,
  filterLabel,
  onSearchChange,
  onAdd,
  onImport,
  onExport,
  onOpenFilters,
}: UsersToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-3xl bg-card p-4 shadow-soft ring-1 ring-border/70">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center">
         

          <div className="relative w-full lg:max-w-sm">
            <Search
              size={16}
              className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-xl border border-border/70 bg-background ps-9 pe-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onAdd}
            className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90"
          >
            <Plus size={16} />
            {addLabel}
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-10 items-center gap-2 rounded-xl border border-border/70 bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            <Upload size={16} />
            {importLabel}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                onImport(file);
                event.target.value = "";
              }
            }}
          />

          <button
            type="button"
            onClick={onExport}
            className="flex h-10 items-center gap-2 rounded-xl border border-border/70 bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            <Download size={16} />
            {exportLabel}
          </button>

          <button
            type="button"
            onClick={onOpenFilters}
            className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90"
          >
            <Filter size={16} />
            {filterLabel}
          </button>
        </div>
      </div>
    </div>
  );
}