import {
  Check,
  Search,
  Users,
  X,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";

export type OptionItem = {
  id: string | number;
  name: string;
  subtitle?: string;
  parentId?: string | number;
};

type Props = {
  label?: string;
  placeholder?: string;
  options: OptionItem[];
  selectedIds: (string | number)[];
  onChange: (ids: (string | number)[]) => void;
  isLoading?: boolean;
  tone?: "primary" | "info" | "warning" | "success";
};

const toneClasses = {
  primary: {
    badge: "bg-primary/[0.09] text-primary",
    active: "border-primary/20 bg-primary/[0.055]",
  },
  info: {
    badge: "bg-info/[0.10] text-info",
    active: "border-info/20 bg-info/[0.055]",
  },
  warning: {
    badge: "bg-warning/[0.11] text-warning",
    active: "border-warning/20 bg-warning/[0.055]",
  },
  success: {
    badge: "bg-success/[0.10] text-success",
    active: "border-success/20 bg-success/[0.055]",
  },
} as const;

export function MultiSelectAudience({
  label = "Recipients",
  placeholder = "Search by name",
  options = [],
  selectedIds = [],
  onChange,
  isLoading = false,
  tone = "primary",
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const styles = toneClasses[tone];

  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return options;

    return options.filter(
      (option) =>
        option.name.toLowerCase().includes(query) ||
        option.subtitle?.toLowerCase().includes(query),
    );
  }, [options, searchQuery]);

  function isSelected(id: string | number) {
    return selectedIds.some((selectedId) => String(selectedId) === String(id));
  }

  function toggleSelection(id: string | number) {
    if (isSelected(id)) {
      onChange(
        selectedIds.filter(
          (selectedId) => String(selectedId) !== String(id),
        ),
      );
      return;
    }

    onChange([...selectedIds, id]);
  }

  function selectVisible() {
    onChange(
      Array.from(
        new Map(
          [...selectedIds, ...filteredOptions.map((option) => option.id)].map(
            (id) => [String(id), id],
          ),
        ).values(),
      ),
    );
  }

  const selectedOptions = options.filter((option) => isSelected(option.id));

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-[11px] font-medium text-foreground">
          <span className={`flex h-7 w-7 items-center justify-center rounded-[9px] ${styles.badge}`}>
            <Users className="h-3.5 w-3.5" />
          </span>
          {label}
        </label>

        <div className="flex items-center gap-2 text-[10.5px]">
          <button type="button" onClick={selectVisible} className="font-medium text-primary hover:underline">
            Select visible
          </button>
          <span className="text-border">/</span>
          <button type="button" onClick={() => onChange([])} className="text-muted-foreground hover:text-foreground">
            Clear
          </button>
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex min-h-11 w-full items-center justify-between gap-3 rounded-[13px] border border-border/70 bg-background px-3.5 py-2 text-start outline-none transition hover:border-border focus-visible:ring-4 focus-visible:ring-primary/10"
          >
            <span className="min-w-0 flex-1 truncate text-[12px] text-foreground">
              {selectedIds.length
                ? `${selectedIds.length} recipient${selectedIds.length === 1 ? "" : "s"} selected`
                : "Choose recipients"}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${styles.badge}`}>
              {selectedIds.length}
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-[min(520px,calc(100vw-2rem))] overflow-hidden p-0">
          <div className="border-b border-border/55 p-3">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={placeholder}
                className="h-10 rounded-[12px] ps-9 text-[12px]"
              />
            </div>
          </div>

          <div className="max-h-72 space-y-1 overflow-y-auto p-2">
            {isLoading ? (
              <div className="space-y-2 p-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-12 animate-pulse rounded-[12px] bg-muted/60" />
                ))}
              </div>
            ) : filteredOptions.length === 0 ? (
              <p className="px-3 py-8 text-center text-[11px] text-muted-foreground">
                No matching recipients were found.
              </p>
            ) : (
              filteredOptions.map((option) => {
                const selected = isSelected(option.id);

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleSelection(option.id)}
                    className={`flex w-full items-center gap-3 rounded-[12px] border px-3 py-2.5 text-start transition ${
                      selected
                        ? styles.active
                        : "border-transparent hover:border-border/55 hover:bg-muted/25"
                    }`}
                  >
                    <Checkbox checked={selected} className="pointer-events-none" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-medium text-foreground">
                        {option.name}
                      </span>
                      {option.subtitle ? (
                        <span className="mt-0.5 block truncate text-[10.5px] text-muted-foreground">
                          {option.subtitle}
                        </span>
                      ) : null}
                    </span>
                    {selected ? <Check className="h-4 w-4 text-primary" /> : null}
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selectedOptions.length ? (
        <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto rounded-[13px] border border-border/55 bg-muted/[0.12] p-2.5">
          {selectedOptions.map((option) => (
            <span
              key={option.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-2.5 py-1 text-[10.5px] text-foreground"
            >
              {option.name}
              <button type="button" onClick={() => toggleSelection(option.id)} aria-label={`Remove ${option.name}`}>
                <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
