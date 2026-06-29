import { Edit3, MoreVertical, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ActionMenu({ onEdit, onDelete, isOpen, onOpenChange }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) onOpenChange(false);
    }

    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onOpenChange]);

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        type="button"
        onClick={() => onOpenChange(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
        aria-label="Open actions"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-36 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/70">
          <button
            type="button"
            onClick={onEdit}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-black text-primary hover:bg-indigo-50"
          >
            <Edit3 size={14} />
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-black text-red-500 hover:bg-red-50"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
