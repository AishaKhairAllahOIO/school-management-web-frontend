import { useState, useEffect, useRef, type ReactNode } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  icon?: ReactNode;
  required?: boolean;
}

export function DatePicker({ value, onChange, label, icon, required }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
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

  const handleDateSelect = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dt = String(d.getDate()).padStart(2, '0');
    onChange(`${y}-${m}-${dt}`);
    setIsOpen(false);
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // 🌟 الحل الجذري لمشكلة TypeScript بتعريف النوع والمصفوفات صراحة
  const emptyDays = Array.from({ length: firstDay }, () => null);
  const activeDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const days: (number | null)[] = [...emptyDays, ...activeDays];

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
            {value || "Select date"}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground/60" />
      </div>

      {isOpen && (
        <div className="absolute top-[72px] left-0 z-50 w-[280px] rounded-[20px] border border-border/70 bg-card p-4 shadow-[0_24px_50px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-1.5 hover:bg-secondary rounded-[8px] transition"><ChevronLeft className="h-4 w-4 text-muted-foreground" /></button>
            <span className="text-[13px] font-semibold text-foreground">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-1.5 hover:bg-secondary rounded-[8px] transition"><ChevronRight className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-[10px] font-semibold text-muted-foreground/70">{d}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((day, i) => {
              // 🌟 التحقق الصريح يجعل TypeScript يتأكد أن day بعد هذا السطر هو Number فقط
              if (day === null) {
                return <div key={`empty-${i}`} className="h-8 w-8" />;
              }
              
              const isSelected = value === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              
              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-medium transition mx-auto ${isSelected ? 'bg-info text-white shadow-md' : 'text-foreground hover:bg-secondary'}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}