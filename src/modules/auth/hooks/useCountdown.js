import { useEffect, useState } from 'react';

/**
 * Simple countdown timer (seconds). `start(n)` restarts it;
 * `canResend` is true when the countdown has finished.
 */
export const useCountdown = (initialSeconds = 0) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const start = (value) => setSeconds(value);

  return { seconds, canResend: seconds <= 0, start };
};
