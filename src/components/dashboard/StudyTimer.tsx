'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

export function StudyTimer() {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(WORK_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [totalStudyMinutes, setTotalStudyMinutes] = useState(0);
  const [todayStudyMinutes, setTodayStudyMinutes] = useState(0);
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartRef = useRef<number>(0);

  const todayKey = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const total = parseInt(localStorage.getItem('totalStudyMinutes') || '0', 10);
    const todayData = localStorage.getItem('todayStudyData');
    let today = 0;
    if (todayData) {
      const parsed = JSON.parse(todayData);
      if (parsed.date === todayKey) {
        today = parsed.minutes;
      }
    }
    setTotalStudyMinutes(total);
    setTodayStudyMinutes(today);
    setMounted(true);
  }, []);

  const totalDuration = mode === 'work' ? WORK_MINUTES * 60 : BREAK_MINUTES * 60;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference - (progress / 100) * circumference;

  const addStudyTime = useCallback((minutes: number) => {
    setTotalStudyMinutes((prev) => {
      const next = prev + minutes;
      localStorage.setItem('totalStudyMinutes', String(next));
      return next;
    });
    setTodayStudyMinutes((prev) => {
      const next = prev + minutes;
      localStorage.setItem('todayStudyData', JSON.stringify({ date: todayKey, minutes: next }));
      return next;
    });
  }, [todayKey]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (mode === 'work') {
            addStudyTime(WORK_MINUTES);
            setMode('break');
            return BREAK_MINUTES * 60;
          } else {
            setMode('work');
            return WORK_MINUTES * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, addStudyTime]);

  const handleStart = () => {
    sessionStartRef.current = Date.now();
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(WORK_MINUTES * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (!mounted) return null;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-4">
        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Timer className="h-4 w-4 text-emerald-500" />
          Study Timer
        </CardTitle>
        <Badge variant={mode === 'work' ? 'default' : 'secondary'} className="text-[10px]">
          {mode === 'work' ? 'Focus' : 'Break'}
        </Badge>
      </CardHeader>
      <CardContent className="p-3 md:p-4 pt-0 flex flex-col items-center">
        <div className="relative w-28 h-28 md:w-32 md:h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-muted/20"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className={mode === 'work' ? 'text-emerald-500' : 'text-blue-400'}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl md:text-3xl font-bold tracking-tight">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          {!isRunning ? (
            <Button size="sm" onClick={handleStart} className="gap-1.5">
              <Play className="h-3.5 w-3.5" />
              Start
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={handlePause} className="gap-1.5">
              <Pause className="h-3.5 w-3.5" />
              Pause
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="text-center">
            <p className="font-semibold text-foreground text-sm">{todayStudyMinutes} min</p>
            <p>Today</p>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="text-center">
            <p className="font-semibold text-foreground text-sm">{Math.floor(totalStudyMinutes / 60)}h {totalStudyMinutes % 60}m</p>
            <p>All Time</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
