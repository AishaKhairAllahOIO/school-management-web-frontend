import type {
  ReactNode,
} from "react";
import { Pencil } from "lucide-react";

type StudentProfileSectionProps = {
  title: string;
  description?: string;
  icon: ReactNode;
  children: ReactNode;
  onEdit?: () => void;
  className?: string;
};

export function StudentProfileSection({
  title,
  description,
  icon,
  children,
  onEdit,
  className = "",
}: StudentProfileSectionProps) {
  return (
    <section
      className={[
        "mb-6 break-inside-avoid rounded-[30px] border border-white bg-white p-5 shadow-[0_16px_52px_rgba(15,23,42,0.07)] sm:p-7",
        className,
      ].join(" ")}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-slate-950 text-white">
            {icon}
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-950">
              {title}
            </h2>

            {description ? (
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
            aria-label={`تعديل ${title}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {children}
    </section>
  );
}