import { useEffect, useMemo, useRef } from "react";

import { OTP_LENGTH } from "../constants/auth.constants";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function OtpInput({
  value,
  onChange,
  disabled,
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const digits = useMemo(
    () =>
      Array.from(
        { length: OTP_LENGTH },
        (_, index) => value[index] ?? "",
      ),
    [value],
  );

  useEffect(() => {
    if (value.length === 0) {
      inputsRef.current[0]?.focus();
    }
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
    <div className="grid grid-cols-6 gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputsRef.current[index] = node;
          }}
          value={digit}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          aria-label={`OTP digit ${index + 1}`}
          className="h-14 min-w-0 rounded-xl border border-input bg-background text-center text-xl font-semibold text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 sm:h-16"
          onChange={(event) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => {
            if (
              event.key === "Backspace" &&
              !digits[index] &&
              index > 0
            ) {
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

            inputsRef.current[
              Math.min(pasted.length, OTP_LENGTH - 1)
            ]?.focus();
          }}
        />
      ))}
    </div>
  );
}
