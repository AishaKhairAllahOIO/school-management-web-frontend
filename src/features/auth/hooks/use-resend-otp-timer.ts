import { useEffect, useState }
from "react";

export function useResendOtpTimer(
  initialTime = 60
) {

  const [timeLeft, setTimeLeft] =
    useState(initialTime);

  useEffect(() => {

    if (timeLeft <= 0) return;

    const interval =
      setInterval(() => {

        setTimeLeft(
          (prev) => prev - 1
        );
      }, 1000);

    return () =>
      clearInterval(interval);

  }, [timeLeft]);

  const resetTimer = () => {

    setTimeLeft(initialTime);
  };

  return {
    timeLeft,
    resetTimer,
    canResend: timeLeft <= 0,
  };
}