
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Construction,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type UserTypePlaceholderPageProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export function UserTypePlaceholderPage({
  title,
  description,
  icon: Icon = UsersRound,
}: UserTypePlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f7f7f5] px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
        <section className="relative w-full overflow-hidden rounded-[36px] border border-white bg-white px-6 py-14 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:px-10">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-rose-100/70 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-slate-950 text-white shadow-xl shadow-slate-300">
              <Icon className="h-9 w-9" />
            </div>

            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 ring-1 ring-amber-200">
              <Construction className="h-4 w-4" />
              الصفحة قيد التطوير
            </div>

            <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {title}
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-500 sm:text-base">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/users")}
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-slate-950 px-6 text-sm font-bold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <ArrowRight className="h-4 w-4" />
                العودة إلى المستخدمين
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="h-12 rounded-2xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                رجوع
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
