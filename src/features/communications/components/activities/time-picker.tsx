import { useState, useEffect, useRef } from "react";
import { Clock3, ChevronUp, ChevronDown, RotateCcw } from "lucide-react";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TimePicker({ value, onChange, placeholder = "Choose a time" }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':').map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        setAmpm(h >= 12 ? 'PM' : 'AM');
        setHour(h % 12 || 12);
        setMinute(m);
      }
    } else {
      setHour(12);
      setMinute(0);
      setAmpm('AM');
    }
  }, [value, isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = () => {
    let h24 = hour;
    if (ampm === 'PM' && hour < 12) h24 += 12;
    if (ampm === 'AM' && hour === 12) h24 = 0;
    const formatted = `${h24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleNow = () => {
    const now = new Date();
    const h24 = now.getHours();
    const m = now.getMinutes();
    const formatted = `${h24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const displayValue = value ? (() => {
    const [h, m] = value.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return "";
    const a = h >= 12 ? 'PM' : 'AM';
    const hr = h % 12 || 12;
    return `${hr.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${a}`;
  })() : placeholder;

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className="flex h-11 w-full items-center justify-between rounded-[13px] border border-input bg-background px-3 text-[12px] cursor-pointer transition hover:border-info/35 focus-within:border-info/35 focus-within:ring-4 focus-within:ring-info/[0.07]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-info/10 text-info">
            <Clock3 className="h-3.5 w-3.5" />
          </div>
          <span className={value ? "text-foreground font-medium" : "text-muted-foreground"}>
            {displayValue}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground/60" />
      </div>

      {isOpen && (
        <div className="absolute top-[52px] left-0 z-50 w-[290px] rounded-[20px] border border-border/70 bg-card p-5 shadow-[0_24px_50px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[14px] font-semibold text-foreground">Select time</span>
            <div className="flex rounded-full bg-secondary/80 p-1">
              <button
                type="button"
                onClick={() => setAmpm('AM')}
                className={`rounded-full px-3.5 py-1 text-[11px] font-semibold transition ${ampm === 'AM' ? 'bg-background shadow-sm text-info' : 'text-muted-foreground hover:text-foreground'}`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => setAmpm('PM')}
                className={`rounded-full px-3.5 py-1 text-[11px] font-semibold transition ${ampm === 'PM' ? 'bg-background shadow-sm text-info' : 'text-muted-foreground hover:text-foreground'}`}
              >
                PM
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 py-2">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground">HOUR</span>
              <button type="button" onClick={() => setHour(h => h === 12 ? 1 : h + 1)} className="text-muted-foreground hover:text-info transition p-1"><ChevronUp className="h-5 w-5" /></button>
              <div className="flex h-14 w-16 items-center justify-center rounded-[14px] border border-border/50 bg-background text-[22px] font-semibold text-foreground shadow-sm">
                {hour.toString().padStart(2, '0')}
              </div>
              <button type="button" onClick={() => setHour(h => h === 1 ? 12 : h - 1)} className="text-muted-foreground hover:text-info transition p-1"><ChevronDown className="h-5 w-5" /></button>
            </div>

            <span className="text-[20px] font-bold text-muted-foreground mt-4">:</span>

            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground">MINUTE</span>
              <button type="button" onClick={() => setMinute(m => m === 59 ? 0 : m + 1)} className="text-muted-foreground hover:text-info transition p-1"><ChevronUp className="h-5 w-5" /></button>
              <div className="flex h-14 w-16 items-center justify-center rounded-[14px] border border-border/50 bg-background text-[22px] font-semibold text-foreground shadow-sm">
                {minute.toString().padStart(2, '0')}
              </div>
              <button type="button" onClick={() => setMinute(m => m === 0 ? 59 : m - 1)} className="text-muted-foreground hover:text-info transition p-1"><ChevronDown className="h-5 w-5" /></button>
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-6 mt-4">
            {[0, 15, 30, 45].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMinute(m)}
                className={`rounded-[9px] px-3.5 py-1.5 text-[11.5px] font-semibold transition ${minute === m ? 'bg-info text-white' : 'bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
              >
                :{m.toString().padStart(2, '0')}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-2">
            <button type="button" onClick={handleNow} className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition">
              <RotateCcw className="h-3.5 w-3.5" />
              Now
            </button>
            <button type="button" onClick={handleApply} className="rounded-[10px] bg-info px-6 py-2.5 text-[12px] font-semibold text-white shadow-[0_4px_14px_rgba(59,130,246,0.25)] hover:bg-info/90 transition">
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}