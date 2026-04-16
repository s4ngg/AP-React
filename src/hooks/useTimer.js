import { useState, useRef, useCallback } from "react";

export function useTimer(initialTime = 300) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback((seconds = initialTime) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(seconds);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [initialTime]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  }, []);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const formattedTime = `${minutes}:${seconds}`;

  return { timeLeft, isRunning, start, stop, formattedTime };
}
