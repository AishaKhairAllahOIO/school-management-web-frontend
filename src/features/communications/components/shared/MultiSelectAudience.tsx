import { Check, Search, Users, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/shared/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

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

  /**
   * IMPORTANT:
   * We normalize IDs to strings when comparing them.
   *
   * This prevents:
   * 1 === "1"
   * from being treated as two different IDs.
   */
  const selectedKeySet = useMemo(() => {
    return new Set(selectedIds.map((id) => String(id)));
  }, [selectedIds]);

  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return options;
    }

    return options.filter((option) => {
      const name = option.name?.toLowerCase() ?? "";
      const subtitle = option.subtitle?.toLowerCase() ?? "";

      return name.includes(query) || subtitle.includes(query);
    });
  }, [options, searchQuery]);

  function isSelected(id: string | number) {
    return selectedKeySet.has(String(id));
  }

  function toggleSelection(id: string | number) {
    const key = String(id);

    if (selectedKeySet.has(key)) {
      const nextIds = selectedIds.filter(
        (selectedId) => String(selectedId) !== key,
      );

      onChange(nextIds);
      return;
    }

    onChange([...selectedIds, id]);
  }

  function selectVisible() {
    if (!filteredOptions.length) {
      return;
    }

    const nextIds = [...selectedIds];

    for (const option of filteredOptions) {
      const alreadySelected = nextIds.some(
        (id) => String(id) === String(option.id),
      );

      if (!alreadySelected) {
        nextIds.push(option.id);
      }
    }

    onChange(nextIds);
  }

  function clearSelection() {
    onChange([]);
  }

  const selectedOptions = useMemo(() => {
    return options.filter((option) => selectedKeySet.has(String(option.id)));
  }, [options, selectedKeySet]);

  return (
    <div className="space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-[11px] font-medium text-foreground">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-[9px] ${styles.badge}`}
          >
            <Users className="h-3.5 w-3.5" />
          </span>

          {label}
        </label>

        <div className="flex items-center gap-2 text-[10.5px]">
          <button
            type="button"
            onClick={selectVisible}
            disabled={!filteredOptions.length}
            className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Select visible
          </button>

          <span className="text-border">/</span>

          <button
            type="button"
            onClick={clearSelection}
            disabled={!selectedIds.length}
            className="text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Selector */}
      <Popover modal>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="
              flex min-h-11 w-full
              items-center justify-between gap-3
              rounded-[13px]
              border border-border/70
              bg-background
              px-3.5 py-2
              text-start
              outline-none
              transition
              hover:border-border
              focus-visible:ring-4
              focus-visible:ring-primary/10
            "
          >
            <span className="min-w-0 flex-1 truncate text-[12px] text-foreground">
              {selectedIds.length > 0
                ? `${selectedIds.length} ${
                    selectedIds.length === 1 ? "recipient" : "recipients"
                  } selected`
                : "Choose recipients"}
            </span>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${styles.badge}`}
            >
              {selectedIds.length}
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={6}
          className="
            z-[100]
            w-[min(520px,calc(100vw-2rem))]
            overflow-hidden
            p-0
          "
        >
          {/* Search */}
          <div className="border-b border-border/55 p-3">
            <div className="relative">
              <Search
                className="
                  absolute start-3 top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={placeholder}
                className="h-10 rounded-[12px] ps-9 text-[12px]"
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-72 overflow-y-auto p-2">
            {isLoading ? (
              <div className="space-y-2 p-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="
                      h-12
                      animate-pulse
                      rounded-[12px]
                      bg-muted/60
                    "
                  />
                ))}
              </div>
            ) : filteredOptions.length === 0 ? (
              <p className="px-3 py-8 text-center text-[11px] text-muted-foreground">
                No matching recipients were found.
              </p>
            ) : (
              <div className="space-y-1">
                {filteredOptions.map((option) => {
                  const selected = isSelected(option.id);

                  return (
                    <button
                      key={String(option.id)}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        toggleSelection(option.id);
                      }}
                      className={`
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-[12px]
                        border
                        px-3
                        py-2.5
                        text-start
                        transition

                        ${
                          selected
                            ? styles.active
                            : "border-transparent hover:border-border/55 hover:bg-muted/25"
                        }
                      `}
                    >
                      {/* VISUAL CHECKBOX ONLY */}
                      <span
                        aria-hidden="true"
                        className={`
                          flex
                          h-4
                          w-4
                          shrink-0
                          items-center
                          justify-center
                          rounded-[4px]
                          border
                          transition

                          ${
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input bg-background"
                          }
                        `}
                      >
                        {selected && <Check className="h-3 w-3" />}
                      </span>

                      {/* Text */}
                      <span className="min-w-0 flex-1">
                        <span
                          className="
                            block
                            truncate
                            text-[12px]
                            font-medium
                            text-foreground
                          "
                        >
                          {option.name}
                        </span>

                        {option.subtitle ? (
                          <span
                            className="
                              mt-0.5
                              block
                              truncate
                              text-[10.5px]
                              text-muted-foreground
                            "
                          >
                            {option.subtitle}
                          </span>
                        ) : null}
                      </span>

                      {/* Selected icon */}
                      {selected && (
                        <Check
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-primary"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected chips */}
      {selectedOptions.length > 0 && (
        <div
          className="
            flex
            max-h-24
            flex-wrap
            gap-1.5
            overflow-y-auto
            rounded-[13px]
            border
            border-border/55
            bg-muted/[0.12]
            p-2.5
          "
        >
          {selectedOptions.map((option) => (
            <span
              key={String(option.id)}
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-border/60
                bg-background
                px-2.5
                py-1
                text-[10.5px]
                text-foreground
              "
            >
              <span className="max-w-[180px] truncate">{option.name}</span>

              <button
                type="button"
                onClick={() => toggleSelection(option.id)}
                aria-label={`Remove ${option.name}`}
                className="
                  flex
                  h-4
                  w-4
                  items-center
                  justify-center
                  rounded-full
                  text-muted-foreground
                  transition
                  hover:bg-muted
                  hover:text-destructive
                "
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
