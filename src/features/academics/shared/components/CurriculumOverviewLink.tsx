
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers3,
} from "lucide-react";
import { Link } from "react-router-dom";

export function CurriculumOverviewLink() {
  return (
    <div className="rounded-2xl border border-pink-200/70 bg-pink-50/70 px-5 py-3 text-center">
      {/* Title */}
      <h3 className="text-[15px] font-semibold text-pink-700">
        Academic Overview
      </h3>

      {/* Description */}
      <p className="mx-auto mt-0.5 max-w-2xl text-[11.5px] leading-[16px] text-black/70">
        Review the complete academic structure of your school, including
        grades, classrooms, subjects and their academic information.
      </p>

      {/* Badges */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
        {/* Grades */}
        <span className="inline-flex items-center gap-1 rounded-full border border-pink-300 bg-pink-100 px-2 py-0.5 text-[9.5px] font-medium text-pink-700">
          <GraduationCap
            className="h-3 w-3 text-pink-700"
            strokeWidth={2}
          />
          Grades
        </span>

        {/* Classrooms */}
        <span className="inline-flex items-center gap-1 rounded-full border border-pink-300 bg-pink-100 px-2 py-0.5 text-[9.5px] font-medium text-pink-700">
          <Layers3
            className="h-3 w-3 text-pink-700"
            strokeWidth={2}
          />
          Classrooms
        </span>

        {/* Subjects */}
        <span className="inline-flex items-center gap-1 rounded-full border border-pink-300 bg-pink-100 px-2 py-0.5 text-[9.5px] font-medium text-pink-700">
          <BookOpen
            className="h-3 w-3 text-pink-700"
            strokeWidth={2}
          />
          Subjects
        </span>

        
        {/* Mark */}
        <span className="inline-flex items-center gap-1 rounded-full border border-pink-300 bg-pink-100 px-2 py-0.5 text-[9.5px] font-medium text-pink-700">
          <BookOpen
            className="h-3 w-3 text-pink-700"
            strokeWidth={2}
          />
          Marks
        </span>
      </div>

      {/* Overview button */}
      <Link
        to="/academics/curriculum-overview"
        className="group mt-2 inline-flex h-7.5 items-center justify-center gap-1.5 rounded-[8px] border border-pink-300 bg-pink-100 px-3 text-[10.5px] font-medium text-pink-700 transition-all duration-200 hover:border-pink-400 hover:bg-pink-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-200"
      >
        <span>Overview</span>

        <ArrowRight
          aria-hidden="true"
          className="h-3 w-3 text-pink-700 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
          strokeWidth={2}
        />
      </Link>
    </div>
  );
}
