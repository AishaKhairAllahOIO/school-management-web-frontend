import { useEffect, useState } from "react";

export function useResendOtpTimer(initialSeconds = 60) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  return {
    seconds,
    canResend: seconds === 0,
    restart: (nextSeconds = initialSeconds) => setSeconds(nextSeconds),
  };
}
