'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, BookOpen, Clock, Flame, TrendingUp, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import resourcesData from '@/data/resources.json';
import dailyScheduleData from '@/data/daily-schedule.json';
import skillsData from '@/data/skills.json';

interface Progress {
  resourcesCompleted: string[];
  projectsCompleted: string[];
  competitions: Record<string, string>;
  currentWeek: number;
  completedTasks: string[];
  startDate: string;
  skills: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  activeDays: string[];
}

const PIE_COLORS = ['#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ef4444'];

function getTaskDateMap(): Record<string, string> {
  const map: Record<string, string> = {};
  dailyScheduleData.weeks.forEach((week) => {
    week.days.forEach((day) => {
      day.tasks.forEach((task) => {
        map[task.id] = `w${week.week}-d${day.day}`;
      });
    });
  });
  return map;
}

function calculateActiveDays(completedTasks: string[], startDate: string): string[] {
  if (!startDate || completedTasks.length === 0) return [];
  const taskDateMap = getTaskDateMap();
  const start = new Date(startDate);
  const dateSet = new Set<string>();

  completedTasks.forEach((taskId) => {
    const key = taskDateMap[taskId];
    if (!key) return;
    const match = key.match(/w(\d+)-d(\d+)/);
    if (!match) return;
    const week = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);
    const offset = (week - 1) * 7 + (day - 1);
    const d = new Date(start);
    d.setDate(d.getDate() + offset);
    dateSet.add(d.toISOString().split('T')[0]);
  });

  return Array.from(dateSet).sort();
}

function calculateStreak(activeDays: string[]): { currentStreak: number; longestStreak: number } {
  if (activeDays.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const sorted = [...activeDays].sort();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let streak = 0;
  if (sorted.includes(today) || sorted.includes(yesterday)) {
    let checkDate = sorted.includes(today) ? today : yesterday;
    const activeSet = new Set(sorted);
    while (activeSet.has(checkDate)) {
      streak++;
      const d = new Date(checkDate);
      d.setDate(d.getDate() - 1);
      checkDate = d.toISOString().split('T')[0];
    }
  }

  let longest = 0;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      current++;
    } else {
      longest = Math.max(longest, current);
      current = 1;
    }
  }
  longest = Math.max(longest, current);

  return { currentStreak: streak, longestStreak: Math.max(longest, streak) };
}

function getCategoryBreakdown() {
  const categoryMap: Record<string, { name: string; skills: string[] }> = {};
  skillsData.categories.forEach((cat) => {
    categoryMap[cat.id] = { name: cat.name, skills: cat.skills.map((skill) => skill.id) };
  });

  const resourceCategoryMap: Record<string, string[]> = {};
  resourcesData.resources.forEach((r) => {
    r.skills.forEach((skillId: string) => {
      for (const [catId, cat] of Object.entries(categoryMap)) {
        if (cat.skills.includes(skillId)) {
          if (!resourceCategoryMap[catId]) resourceCategoryMap[catId] = [];
          resourceCategoryMap[catId].push(r.id);
          break;
        }
      }
    });
  });

  return { categoryMap, resourceCategoryMap };
}

export default function AnalyticsPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('quantpath-progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      const startDate = parsed.startDate || new Date().toISOString().split('T')[0];
      const activeDays = calculateActiveDays(parsed.completedTasks || [], startDate);
      const { currentStreak, longestStreak } = calculateStreak(activeDays);
      setProgress({
        ...parsed,
        startDate,
        currentStreak,
        longestStreak,
        activeDays,
      });
    }
    setNow(Date.now());
    setMounted(true);
  }, []);

  const weeklyData = useMemo(() => {
    if (!progress) return [];
    const data = [];
    for (let w = 1; w <= 32; w++) {
      const weekData = dailyScheduleData.weeks.find((week) => week.week === w);
      if (!weekData) continue;
      const totalTasks = weekData.days.reduce((sum, day) => sum + day.tasks.length, 0);
      const completed = weekData.days.reduce(
        (sum, day) => sum + day.tasks.filter((task) => progress.completedTasks.includes(task.id)).length,
        0
      );
      data.push({
        week: `W${w}`,
        completed,
        total: totalTasks,
        percentage: totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0,
      });
    }
    return data;
  }, [progress]);

  const categoryData = useMemo(() => {
    if (!progress) return [];
    const { categoryMap, resourceCategoryMap } = getCategoryBreakdown();
    return Object.entries(categoryMap).map(([catId, cat]) => {
      const resources = resourceCategoryMap[catId] || [];
      const completed = resources.filter((rId) => progress.resourcesCompleted.includes(rId)).length;
      return { name: cat.name, value: resources.length, completed };
    });
  }, [progress]);

  const heatmapData = useMemo(() => {
    if (!progress) return [];
    const days: { date: string; count: number; dayOfWeek: number }[] = [];
    const today = new Date();
    const taskDateMap = getTaskDateMap();

    const dateCounts: Record<string, number> = {};
    progress.completedTasks.forEach((taskId) => {
      const key = taskDateMap[taskId];
      if (!key) return;
      const match = key.match(/w(\d+)-d(\d+)/);
      if (!match) return;
      const week = parseInt(match[1], 10);
      const day = parseInt(match[2], 10);
      const offset = (week - 1) * 7 + (day - 1);
      const d = new Date(progress.startDate);
      d.setDate(d.getDate() + offset);
      const dateStr = d.toISOString().split('T')[0];
      dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
    });

    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        count: dateCounts[dateStr] || 0,
        dayOfWeek: d.getDay(),
      });
    }
    return days;
  }, [progress]);

  const totalTasksCompleted = progress?.completedTasks.length || 0;
  const totalStudyHours = progress ? Math.round((parseInt(localStorage.getItem('totalStudyMinutes') || '0', 10) / 60) * 10) / 10 : 0;
  const currentStreak = progress?.currentStreak || 0;
  const startDate = progress?.startDate;
  const daysSinceStart = startDate && now > 0 ? Math.max(1, Math.ceil((now - new Date(startDate).getTime()) / 86400000)) : 1;
  const avgDailyTasks = Math.round((totalTasksCompleted / daysSinceStart) * 10) / 10;

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const maxHeatmapCount = Math.max(1, ...heatmapData.map((d) => d.count));

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <Card className="bg-card border-border border-l-[3px] border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3 md:p-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Tasks Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <span className="text-2xl font-bold">{totalTasksCompleted}</span>
          </CardContent>
        </Card>

        <Card className="bg-card border-border border-l-[3px] border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3 md:p-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Study Hours</CardTitle>
            <Clock className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <span className="text-2xl font-bold">{totalStudyHours}h</span>
          </CardContent>
        </Card>

        <Card className="bg-card border-border border-l-[3px] border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3 md:p-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <span className="text-2xl font-bold">{currentStreak}</span>
            <span className="text-xs text-muted-foreground ml-1">days</span>
          </CardContent>
        </Card>

        <Card className="bg-card border-border border-l-[3px] border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3 md:p-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Avg Daily Tasks</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <span className="text-2xl font-bold">{avgDailyTasks}</span>
            <span className="text-xs text-muted-foreground ml-1">/day</span>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Completion Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Weekly Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.15)" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value, name) => {
                    const item = weeklyData.find((d) => d.percentage === value);
                    return [`${value}% (${item?.completed}/${item?.total})`, 'Completed'];
                  }}
                />
                <Bar
                  dataKey="percentage"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown & Heatmap */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        {/* Category Pie Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value, name) => {
                      const item = categoryData.find((d) => d.name === name);
                      return [`${value} resources (${item?.completed || 0} done)`, name];
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px' }}
                    formatter={(value) => <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Study Activity Heatmap */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Study Activity (28 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1.5">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-[10px] text-muted-foreground text-center font-medium">
                  {day}
                </div>
              ))}
              {heatmapData.map((day, i) => {
                const intensity = day.count === 0 ? 0 : Math.ceil((day.count / maxHeatmapCount) * 4);
                const bgColors = [
                  'bg-muted/30',
                  'bg-emerald-900/40',
                  'bg-emerald-700/50',
                  'bg-emerald-500/60',
                  'bg-emerald-400',
                ];
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-sm ${bgColors[intensity]} transition-colors`}
                    title={`${day.date}: ${day.count} tasks`}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-1.5 mt-3 justify-end">
              <span className="text-[10px] text-muted-foreground">Less</span>
              {['bg-muted/30', 'bg-emerald-900/40', 'bg-emerald-700/50', 'bg-emerald-500/60', 'bg-emerald-400'].map(
                (bg, i) => (
                  <div key={i} className={`w-3 h-3 rounded-sm ${bg}`} />
                )
              )}
              <span className="text-[10px] text-muted-foreground">More</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
