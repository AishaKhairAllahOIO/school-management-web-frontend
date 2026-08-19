import { useState, useEffect, useRef, type ReactNode } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface MonthPickerProps {
  value: string; // المتوقع: "YYYY-MM" مثلاً "2026-08"
  onChange: (value: string) => void;
  label?: string;
  icon?: ReactNode;
  required?: boolean;
  placeholder?: string;
}

export function MonthPicker({ 
  value, 
  onChange, 
  label, 
  icon, 
  required, 
  placeholder = "Select month" 
}: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // استخراج السنة من القيمة الحالية، وإلا نستخدم السنة الحالية
  const [currentYear, setCurrentYear] = useState(() => {
    if (value) {
      const y = parseInt(value.split('-')[0], 10);
      if (!isNaN(y)) return y;
    }
    return new Date().getFullYear();
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMonthSelect = (monthIndex: number) => {
    const y = currentYear;
    const m = String(monthIndex + 1).padStart(2, '0');
    onChange(`${y}-${m}`);
    setIsOpen(false);
  };

  const handleThisMonth = () => {
    const now = new Date();
    onChange(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const displayValue = value ? (() => {
    const [y, m] = value.split('-');
    if (!y || !m) return "";
    const mIndex = parseInt(m, 10) - 1;
    return `${months[mIndex]} ${y}`;
  })() : placeholder;

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="flex items-center gap-1.5 text-[11.5px] font-medium text-foreground mb-1.5">
          {icon}
          {label}
          {required && <span className="text-destructive/80 text-[14px] leading-3">*</span>}
        </label>
      )}
      
      <div
        className="flex h-11 w-full items-center justify-between rounded-[13px] border border-input bg-background px-3 text-[12px] cursor-pointer transition hover:border-info/35 focus-within:border-info/35 focus-within:ring-4 focus-within:ring-info/[0.07]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-info/10 text-info">
            <CalendarDays className="h-3.5 w-3.5" />
          </div>
          <span className={value ? "text-foreground font-medium" : "text-muted-foreground"}>
            {displayValue}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground/60" />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-1/2 z-[60] w-[240px] -translate-x-1/2 sm:left-0 sm:translate-x-0 rounded-[18px] border border-border/70 bg-card p-4 shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
          
          {/* محدد السنة */}
          <div className="flex items-center justify-between mb-4 rounded-[10px] bg-secondary/50 p-1">
            <button 
              type="button" 
              onClick={() => setCurrentYear(y => y - 1)} 
              className="p-1.5 hover:bg-background rounded-[8px] transition shadow-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-[13px] font-semibold text-foreground">
              {currentYear}
            </span>
            <button 
              type="button" 
              onClick={() => setCurrentYear(y => y + 1)} 
              className="p-1.5 hover:bg-background rounded-[8px] transition shadow-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* شبكة الأشهر */}
          <div className="grid grid-cols-3 gap-2">
            {months.map((m, i) => {
              const isSelected = value === `${currentYear}-${String(i + 1).padStart(2, '0')}`;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMonthSelect(i)}
                  className={`flex h-10 items-center justify-center rounded-[10px] text-[12px] font-medium transition ${
                    isSelected 
                      ? 'bg-info text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)]' 
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>

          {/* الإجراءات السفلية */}
          <div className="flex items-center justify-between border-t border-border/50 pt-3 mt-4">
            <button 
              type="button" 
              onClick={handleClear} 
              className="text-[11px] font-medium text-muted-foreground hover:text-destructive transition"
            >
              Clear
            </button>
            <button 
              type="button" 
              onClick={handleThisMonth} 
              className="text-[11px] font-semibold text-info hover:text-info/80 transition"
            >
              This month
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
}