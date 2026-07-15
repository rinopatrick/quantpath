'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  activeDays: string[];
}

function getLast7Days(): { date: string; label: string; isToday: boolean }[] {
  const days: { date: string; label: string; isToday: boolean }[] = [];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().split('T')[0],
      label: dayLabels[d.getDay()],
      isToday: i === 0,
    });
  }
  return days;
}

export function StreakCounter({ currentStreak, longestStreak, activeDays }: StreakCounterProps) {
  const activeSet = new Set(activeDays);
  const last7 = getLast7Days();

  return (
    <Card className="bg-card border-border border-l-[3px] border-l-orange-500 card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-3 md:p-4">
        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
          Daily Streak
        </CardTitle>
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
          <Flame className="h-4 w-4 text-orange-400" />
        </div>
      </CardHeader>
      <CardContent className="p-3 md:p-4 pt-0">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-bold tracking-tight">
            {currentStreak}
          </span>
          <span className="text-xs text-muted-foreground">days</span>
          {longestStreak > 0 && (
            <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
              Best: {longestStreak}
            </Badge>
          )}
        </div>

        <div className="mt-3 flex items-center gap-1">
          {last7.map((day) => {
            const isActive = activeSet.has(day.date);
            return (
              <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[10px] text-muted-foreground">{day.label}</span>
                <div
                  className={`w-full h-2 rounded-full ${
                    isActive
                      ? 'bg-green-500'
                      : day.isToday
                        ? 'bg-muted-foreground/30'
                        : 'bg-muted-foreground/15'
                  }`}
                  title={`${day.date}${isActive ? ' — active' : ''}`}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
