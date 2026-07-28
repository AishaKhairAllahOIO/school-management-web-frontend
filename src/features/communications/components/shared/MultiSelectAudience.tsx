import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, X, Search, Users } from "lucide-react";
import { Button } from "@/shared/ui/button";

export type OptionItem = {
  id: string | number;
  name: string;
  subtitle?: string;
};

type Props = {
  label?: string;
  placeholder?: string;
  options: OptionItem[];
  selectedIds: (string | number)[];
  onChange: (ids: (string | number)[]) => void;
  isLoading?: boolean;
};

export function MultiSelectAudience({
  label = "Select Audience",
  placeholder = "Search and select...",
  options = [],
  selectedIds = [],
  onChange,
  isLoading = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    return options.filter(
      (opt) =>
        opt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opt.subtitle && opt.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [options, searchQuery]);

  const isSelected = (id: string | number) => selectedIds.includes(id);

  const toggleSelection = (id: string | number) => {
    if (isSelected(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredOptions.map((opt) => opt.id);
    const newSelected = Array.from(new Set([...selectedIds, ...allFilteredIds]));
    onChange(newSelected);
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-2 w-full">

      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <Users className="w-4 h-4 text-primary" />
          {label}
          {selectedIds.length > 0 && (
            <span className="ml-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
              {selectedIds.length}
            </span>
          )}
        </label>

        {options.length > 0 && (
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-primary hover:underline font-medium"
            >
              Select All
            </button>
            <span className="text-border">|</span>
            <button
              type="button"
              onClick={handleDeselectAll}
              className="text-muted-foreground hover:text-destructive hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>


      <div className="min-h-[42px] p-1.5 rounded-xl border border-input bg-card text-card-foreground flex flex-wrap gap-1.5 items-center focus-within:border-primary focus-within:ring-1 focus-within:ring-ring transition-all">
        {selectedIds.length === 0 ? (
          <span className="text-sm text-muted-foreground px-2 select-none">
            No items selected
          </span>
        ) : (
          selectedIds.map((id) => {
            const item = options.find((opt) => opt.id === id);
            if (!item) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground border border-border rounded-lg px-2.5 py-1 text-xs font-medium animate-in fade-in zoom-in duration-150"
              >
                {item.name}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelection(id);
                  }}
                  className="text-muted-foreground hover:text-destructive hover:bg-muted rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto text-muted-foreground hover:text-foreground h-7 px-2"
        >
          <ChevronsUpDown className="w-4 h-4" />
        </Button>
      </div>


      {isOpen && (
        <div className="relative z-50 mt-1 w-full rounded-xl border border-border bg-popover text-popover-foreground shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">

          <div className="p-2 border-b border-border flex items-center gap-2 bg-muted/40">
            <Search className="w-4 h-4 text-muted-foreground ml-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Loading audience...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const selected = isSelected(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleSelection(opt.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                      selected
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-accent hover:text-accent-foreground text-foreground"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span>{opt.name}</span>
                      {opt.subtitle && (
                        <span className="text-xs text-muted-foreground">{opt.subtitle}</span>
                      )}
                    </div>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        selected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-input bg-card"
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}