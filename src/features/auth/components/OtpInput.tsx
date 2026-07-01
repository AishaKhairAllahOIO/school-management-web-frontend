import { useEffect, useMemo, useRef } from "react";

import { OTP_LENGTH } from "../constants/auth.constants";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function OtpInput({ value, onChange, disabled }: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const digits = useMemo(
    () => Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? ""),
    [value]
  );

  useEffect(() => {
    if (value.length === 0) inputsRef.current[0]?.focus();
  }, [value.length]);

  function updateDigit(index: number, digit: string) {
    const sanitizedDigit = digit.replace(/\D/g, "").slice(-1);

    const nextDigits = [...digits];
    nextDigits[index] = sanitizedDigit;

    onChange(nextDigits.join("").slice(0, OTP_LENGTH));

    if (sanitizedDigit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  return (
    <div className="grid grid-cols-6 gap-2 sm:gap-3" dir="ltr">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputsRef.current[index] = node;
          }}
          value={digit}
          disabled={disabled}
          inputMode="numeric"
          maxLength={1}
          className="h-14 rounded-2xl border border-slate-200 bg-white text-center text-xl font-black text-slate-900 shadow-[0_10px_28px_rgba(15,23,42,0.04)] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
          onChange={(event) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digits[index] && index > 0) {
              inputsRef.current[index - 1]?.focus();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();

            const pasted = event.clipboardData
              .getData("text")
              .replace(/\D/g, "")
              .slice(0, OTP_LENGTH);

            onChange(pasted);
            inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
          }}
        />
      ))}
    </div>
  );
}