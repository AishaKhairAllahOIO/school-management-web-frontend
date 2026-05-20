import {
  useEffect,
  useRef,
  useState,
} from "react";

type OtpInputProps = {

  length?: number;

  onComplete: (
    otp: string
  ) => void;
};

export function OtpInput({
  length = 6,
  onComplete,
}: OtpInputProps) {

  const [otp, setOtp] =
    useState(
      Array(length).fill("")
    );

  const inputRefs =
    useRef<
      HTMLInputElement[]
    >([]);

  function handleChange(
    value: string,
    index: number
  ) {

    if (!/^[0-9]?$/.test(value))
      return;

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (
      value &&
      index < length - 1
    ) {

      inputRefs.current[
        index + 1
      ]?.focus();
    }

    const otpValue =
      newOtp.join("");

    if (
      otpValue.length === length
    ) {

      onComplete(otpValue);
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {

    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {

      inputRefs.current[
        index - 1
      ]?.focus();
    }
  }

  useEffect(() => {

    inputRefs.current[0]?.focus();

  }, []);

  return (
    <div
      className="
        flex
        items-center
        justify-center
        gap-3
      "
    >

      {otp.map((digit, index) => (

        <input
          key={index}
          ref={(el) => {

            if (el)
              inputRefs.current[
                index
              ] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) =>
            handleChange(
              e.target.value,
              index
            )
          }
          onKeyDown={(e) =>
            handleKeyDown(
              e,
              index
            )
          }
          className="
            h-14
            w-14
            rounded-2xl
            border
            border-gray-200
            bg-white
            text-center
            text-xl
            font-semibold
            text-[#1A1A2E]
            shadow-sm
            outline-none
            transition-all
            focus:border-[#5B4FC7]
            focus:ring-4
            focus:ring-[#5B4FC7]/20
          "
        />
      ))}
    </div>
  );
}