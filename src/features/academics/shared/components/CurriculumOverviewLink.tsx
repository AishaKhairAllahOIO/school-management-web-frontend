import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers3,
} from "lucide-react";
import { Link } from "react-router-dom";

export function CurriculumOverviewLink() {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[16px]
        border border-warning/15
        bg-white
        text-center
        transition-all duration-200
      "
    >
      {/* Top warning accent */}
      <div className="h-[3px] w-full bg-warning" />

      {/* Content */}
      <div className="px-5 py-3">
        {/* Title */}
        <h3 className="text-[15px] font-semibold text-warning">
          Academic Overview
        </h3>

        {/* Description */}
        <p className="mx-auto mt-0.5 max-w-2xl text-[11.5px] leading-[16px] text-black/65">
          Review the complete academic structure of your school, including
          grades, classrooms, subjects and their academic information.
        </p>

        {/* Badges */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
          <span
            className="
              inline-flex items-center gap-1
              rounded-full
              border border-warning/20
              bg-warning/[0.11]
              px-2 py-0.5
              text-[9.5px] font-medium
              text-warning
            "
          >
            <GraduationCap className="h-3 w-3" strokeWidth={2} />
            Grades
          </span>

          <span
            className="
              inline-flex items-center gap-1
              rounded-full
              border border-warning/20
              bg-warning/[0.11]
              px-2 py-0.5
              text-[9.5px] font-medium
              text-warning
            "
          >
            <Layers3 className="h-3 w-3" strokeWidth={2} />
            Classrooms
          </span>

          <span
            className="
              inline-flex items-center gap-1
              rounded-full
              border border-warning/20
              bg-warning/[0.11]
              px-2 py-0.5
              text-[9.5px] font-medium
              text-warning
            "
          >
            <BookOpen className="h-3 w-3" strokeWidth={2} />
            Subjects
          </span>

          <span
            className="
              inline-flex items-center gap-1
              rounded-full
              border border-warning/20
              bg-warning/[0.11]
              px-2 py-0.5
              text-[9.5px] font-medium
              text-warning
            "
          >
            <BookOpen className="h-3 w-3" strokeWidth={2} />
            Marks
          </span>
        </div>
      </div>

      {/* Footer — same warning color as Secretaries */}
      <div
        className="
          border-t border-warning/[0.08]
          bg-warning/[0.04]
          px-4 py-2
          transition-colors duration-200
          hover:bg-warning/[0.08]
        "
      >
        <Link
          to="/academics/curriculum-overview"
          className="
            group
            flex
            h-7.5
            w-full
            items-center
            justify-center
            gap-1.5
            rounded-[8px]
            text-[10.5px]
            font-medium
            text-warning
            transition-all duration-200
            hover:bg-warning/[0.04]
            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-warning/10
          "
        >
          <span>Overview</span>

          <ArrowRight
            aria-hidden="true"
            className="
              h-3 w-3
              text-warning
              transition-transform duration-200
              group-hover:translate-x-1
              rtl:rotate-180
              rtl:group-hover:-translate-x-1
            "
            strokeWidth={2}
          />
        </Link>
      </div>
    </div>
  );
}