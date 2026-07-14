import {
  Edit3,
  MoreVertical,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

type Props = {
  onEdit: () => void;
  onDelete?: () => void;
};

export function ActionMenu({
  onEdit,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClick,
      );
    };
  }, []);

  function handleEdit() {
    setOpen(false);
    onEdit();
  }

  function handleDelete() {
    if (!onDelete) {
      return;
    }

    setOpen(false);
    onDelete();
  }

  return (
    <div
      ref={ref}
      className="relative inline-flex"
    >
      <button
        type="button"
        aria-label="Open actions"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
      >
        <MoreVertical size={17} />
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-30 min-w-36 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          <button
            type="button"
            onClick={handleEdit}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-black text-indigo-600 transition hover:bg-indigo-50"
          >
            <Edit3 size={15} />
            Edit
          </button>

          {onDelete ? (
            <button
              type="button"
              onClick={handleDelete}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-black text-red-500 transition hover:bg-red-50"
            >
              <Trash2 size={15} />
              Delete
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}