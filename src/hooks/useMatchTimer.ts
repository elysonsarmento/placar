import { useState, useEffect, useCallback } from 'react';

interface MatchTimerOptions {
  timerMode: 'progressive' | 'regressive';
  timerDuration: number; // in minutes
}

export function useMatchTimer({ timerMode, timerDuration }: MatchTimerOptions) {
  const [timerValue, setTimerValue] = useState(() => 
    timerMode === 'regressive' ? timerDuration * 60 : 0
  );
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    setTimerValue(timerMode === 'regressive' ? timerDuration * 60 : 0);
    setIsTimerRunning(false);
  }, [timerDuration, timerMode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerValue((prev) => {
          if (timerMode === 'regressive') {
            if (prev <= 1) {
              setIsTimerRunning(false);
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMode]);

  const resetTimer = useCallback(() => {
    setTimerValue(timerMode === 'regressive' ? timerDuration * 60 : 0);
    setIsTimerRunning(false);
  }, [timerDuration, timerMode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return {
    timerValue,
    isTimerRunning,
    setIsTimerRunning,
    resetTimer,
    formatTime,
  };
}
