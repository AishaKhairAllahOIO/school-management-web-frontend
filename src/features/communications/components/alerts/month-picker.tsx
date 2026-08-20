import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface MonthPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  icon?: ReactNode;
  required?: boolean;
  placeholder?: string;

  /**
   * month -> YYYY-MM
   * date  -> YYYY-MM-DD
   */
  mode?: "month" | "date";

  /**
   * student -> blue/info
   * staff   -> yellow/warning
   */
  tone?: "student" | "staff";
}

export function MonthPicker({
  value,
  onChange,
  label,
  icon,
  required,
  placeholder,
  mode = "month",
  tone = "student",
}: MonthPickerProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  const getInitialYear = () => {
    if (value) {
      const year = parseInt(
        value.split("-")[0],
        10,
      );

      if (!Number.isNaN(year)) {
        return year;
      }
    }

    return new Date().getFullYear();
  };

  const [currentYear, setCurrentYear] =
    useState(getInitialYear);

  const [currentMonth, setCurrentMonth] =
    useState(() => {
      if (value) {
        const parts = value.split("-");
        const month = parseInt(
          parts[1],
          10,
        );

        if (
          !Number.isNaN(month) &&
          month >= 1 &&
          month <= 12
        ) {
          return month - 1;
        }
      }

      return new Date().getMonth();
    });

  const containerRef =
    useRef<HTMLDivElement>(null);

  const isStudent =
    tone === "student";

  const isDateMode =
    mode === "date";

  const accent = isStudent
    ? {
        icon:
          "bg-info/10 text-info",

        hover:
          "hover:border-info/35",

        focus:
          "focus:border-info/35 focus:ring-4 focus:ring-info/[0.07]",

        open:
          "border-info/35 ring-4 ring-info/[0.07]",

        selected:
          "bg-info text-white shadow-[0_4px_12px_rgba(59,130,246,0.30)]",

        action:
          "text-info hover:text-info/80",

        today:
          "bg-info/[0.08] text-info",
      }
    : {
        icon:
          "bg-warning/10 text-warning",

        hover:
          "hover:border-warning/35",

        focus:
          "focus:border-warning/35 focus:ring-4 focus:ring-warning/[0.07]",

        open:
          "border-warning/35 ring-4 ring-warning/[0.07]",

        selected:
          "bg-warning text-white shadow-[0_4px_12px_rgba(245,158,11,0.28)]",

        action:
          "text-warning hover:text-warning/80",

        today:
          "bg-warning/[0.08] text-warning",
      };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const weekdays = [
    "Su",
    "Mo",
    "Tu",
    "We",
    "Th",
    "Fr",
    "Sa",
  ];

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  useEffect(() => {
    if (!value) return;

    const parts = value.split("-");

    const year = parseInt(
      parts[0],
      10,
    );

    if (!Number.isNaN(year)) {
      setCurrentYear(year);
    }

    if (parts[1]) {
      const month = parseInt(
        parts[1],
        10,
      );

      if (
        !Number.isNaN(month) &&
        month >= 1 &&
        month <= 12
      ) {
        setCurrentMonth(
          month - 1,
        );
      }
    }
  }, [value]);

  const handleMonthSelect = (
    monthIndex: number,
  ) => {
    const month = String(
      monthIndex + 1,
    ).padStart(2, "0");

    if (mode === "month") {
      onChange(
        `${currentYear}-${month}`,
      );

      setIsOpen(false);
      return;
    }

    setCurrentMonth(monthIndex);
  };

  const handleDateSelect = (
    day: number,
  ) => {
    const month = String(
      currentMonth + 1,
    ).padStart(2, "0");

    const date = String(day).padStart(
      2,
      "0",
    );

    onChange(
      `${currentYear}-${month}-${date}`,
    );

    setIsOpen(false);
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(
        (year) => year - 1,
      );

      setCurrentMonth(11);
    } else {
      setCurrentMonth(
        (month) => month - 1,
      );
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(
        (year) => year + 1,
      );

      setCurrentMonth(0);
    } else {
      setCurrentMonth(
        (month) => month + 1,
      );
    }
  };

  const handleThisMonth = () => {
    const now = new Date();

    setCurrentYear(
      now.getFullYear(),
    );

    setCurrentMonth(
      now.getMonth(),
    );

    if (mode === "month") {
      onChange(
        `${now.getFullYear()}-${String(
          now.getMonth() + 1,
        ).padStart(2, "0")}`,
      );

      setIsOpen(false);
      return;
    }

    onChange(
      `${now.getFullYear()}-${String(
        now.getMonth() + 1,
      ).padStart(2, "0")}-${String(
        now.getDate(),
      ).padStart(2, "0")}`,
    );

    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  const getDaysInMonth = (
    year: number,
    month: number,
  ) => {
    return new Date(
      year,
      month + 1,
      0,
    ).getDate();
  };

  const getFirstDayOfMonth = (
    year: number,
    month: number,
  ) => {
    return new Date(
      year,
      month,
      1,
    ).getDay();
  };

  const daysInMonth =
    getDaysInMonth(
      currentYear,
      currentMonth,
    );

  const firstDay =
    getFirstDayOfMonth(
      currentYear,
      currentMonth,
    );

  const displayValue = value
    ? (() => {
        const parts =
          value.split("-");

        if (
          !parts[0] ||
          !parts[1]
        ) {
          return "";
        }

        const year = parts[0];

        const monthIndex =
          parseInt(
            parts[1],
            10,
          ) - 1;

        if (
          monthIndex < 0 ||
          monthIndex > 11
        ) {
          return "";
        }

        if (
          mode === "date" &&
          parts[2]
        ) {
          return `${months[monthIndex]} ${parts[2]}, ${year}`;
        }

        return `${months[monthIndex]} ${year}`;
      })()
    : placeholder ??
      (mode === "date"
        ? "Select date"
        : "Select month");

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
      {label && (
        <label
          className="
            mb-1.5
            flex
            items-center
            gap-1.5
            text-[11.5px]
            font-medium
            text-foreground
          "
        >
          {icon}

          {label}

          {required && (
            <span
              className="
                text-[14px]
                leading-3
                text-destructive/80
              "
            >
              *
            </span>
          )}
        </label>
      )}

      {/* Trigger */}
      <div
        role="button"
        tabIndex={0}
        onClick={() =>
          setIsOpen(
            (previous) =>
              !previous,
          )
        }
        onKeyDown={(event) => {
          if (
            event.key ===
              "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();

            setIsOpen(
              (previous) =>
                !previous,
            );
          }
        }}
        className={`
          flex
          h-11
          w-full
          cursor-pointer
          items-center
          justify-between
          rounded-[13px]
          border
          border-input
          bg-background
          px-3
          text-[12px]
          outline-none
          transition
          ${accent.hover}
          ${accent.focus}
          ${
            isOpen
              ? accent.open
              : ""
          }
        `}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-[7px]
              ${accent.icon}
            `}
          >
            <CalendarDays className="h-3.5 w-3.5" />
          </div>

          <span
            className={
              value
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            }
          >
            {displayValue}
          </span>
        </div>

        <ChevronDown className="h-4 w-4 text-muted-foreground/60" />
      </div>

      {/* Picker */}
      {isOpen && (
        <div
          className="
            absolute
            left-1/2
            top-[calc(100%+8px)]
            z-[100]
            w-[240px]
            -translate-x-1/2
            rounded-[18px]
            border
            border-border/70
            bg-card
            p-4
            shadow-[0_20px_40px_rgba(0,0,0,0.12)]
            sm:left-0
            sm:translate-x-0
          "
        >
          {!isDateMode ? (
            <>
              {/* Month header */}
              <div
                className="
                  mb-4
                  flex
                  items-center
                  justify-between
                  rounded-[10px]
                  bg-secondary/50
                  p-1
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setCurrentYear(
                      (year) =>
                        year - 1,
                    )
                  }
                  className="
                    rounded-[8px]
                    p-1.5
                    text-muted-foreground
                    shadow-sm
                    transition
                    hover:bg-background
                    hover:text-foreground
                  "
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="text-[13px] font-semibold text-foreground">
                  {currentYear}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentYear(
                      (year) =>
                        year + 1,
                    )
                  }
                  className="
                    rounded-[8px]
                    p-1.5
                    text-muted-foreground
                    shadow-sm
                    transition
                    hover:bg-background
                    hover:text-foreground
                  "
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Months */}
              <div className="grid grid-cols-3 gap-2">
                {months.map(
                  (
                    month,
                    index,
                  ) => {
                    const monthValue =
                      `${currentYear}-${String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}`;

                    const isSelected =
                      value ===
                      monthValue;

                    return (
                      <button
                        key={month}
                        type="button"
                        onClick={() =>
                          handleMonthSelect(
                            index,
                          )
                        }
                        className={`
                          flex
                          h-10
                          items-center
                          justify-center
                          rounded-[10px]
                          text-[12px]
                          font-medium
                          transition
                          ${
                            isSelected
                              ? accent.selected
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }
                        `}
                      >
                        {month}
                      </button>
                    );
                  },
                )}
              </div>
            </>
          ) : (
            <>
              {/* Date header */}
              <div
                className="
                  mb-4
                  flex
                  items-center
                  justify-between
                  rounded-[10px]
                  bg-secondary/50
                  p-1
                "
              >
                <button
                  type="button"
                  onClick={
                    handlePreviousMonth
                  }
                  className="
                    rounded-[8px]
                    p-1.5
                    text-muted-foreground
                    shadow-sm
                    transition
                    hover:bg-background
                    hover:text-foreground
                  "
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="text-[13px] font-semibold text-foreground">
                  {months[currentMonth]}{" "}
                  {currentYear}
                </span>

                <button
                  type="button"
                  onClick={
                    handleNextMonth
                  }
                  className="
                    rounded-[8px]
                    p-1.5
                    text-muted-foreground
                    shadow-sm
                    transition
                    hover:bg-background
                    hover:text-foreground
                  "
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Weekdays */}
              <div className="mb-2 grid grid-cols-7">
                {weekdays.map(
                  (day) => (
                    <span
                      key={day}
                      className="
                        flex
                        h-7
                        items-center
                        justify-center
                        text-[10px]
                        font-medium
                        text-muted-foreground
                      "
                    >
                      {day}
                    </span>
                  ),
                )}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({
                  length: firstDay,
                }).map(
                  (_, index) => (
                    <span
                      key={`empty-${index}`}
                      className="h-8"
                    />
                  ),
                )}

                {Array.from({
                  length:
                    daysInMonth,
                }).map(
                  (_, index) => {
                    const day =
                      index + 1;

                    const selectedDate =
                      `${currentYear}-${String(
                        currentMonth +
                          1,
                      ).padStart(
                        2,
                        "0",
                      )}-${String(
                        day,
                      ).padStart(
                        2,
                        "0",
                      )}`;

                    const isSelected =
                      value ===
                      selectedDate;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() =>
                          handleDateSelect(
                            day,
                          )
                        }
                        className={`
                          flex
                          h-8
                          items-center
                          justify-center
                          rounded-[8px]
                          text-[11px]
                          font-medium
                          transition
                          ${
                            isSelected
                              ? accent.selected
                              : "text-foreground hover:bg-secondary"
                          }
                        `}
                      >
                        {day}
                      </button>
                    );
                  },
                )}
              </div>
            </>
          )}

          {/* Actions */}
          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              border-t
              border-border/50
              pt-3
            "
          >
            <button
              type="button"
              onClick={handleClear}
              className="
                text-[11px]
                font-medium
                text-muted-foreground
                transition
                hover:text-destructive
              "
            >
              Clear
            </button>

            <button
              type="button"
              onClick={
                handleThisMonth
              }
              className={`
                text-[11px]
                font-semibold
                transition
                ${accent.action}
              `}
            >
              {mode === "date"
                ? "Today"
                : "This month"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}