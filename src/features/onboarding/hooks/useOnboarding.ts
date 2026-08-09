import { useState, useEffect, useCallback } from 'react';

export const useOnboarding = (isRunning: boolean, targetId: string | null) => {
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const updatePosition = useCallback(() => {
    if (!isRunning || !targetId) {
      setCoords(null);
      return;
    }

    const el = document.querySelector(targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setCoords(null);
    }
  }, [isRunning, targetId]);

  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [updatePosition]);

  return coords;
};