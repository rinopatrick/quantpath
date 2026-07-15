'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { SkillRadar } from '@/components/dashboard/SkillRadar';
import { UpcomingCompetitions } from '@/components/dashboard/UpcomingCompetitions';
import { RecommendedNext } from '@/components/dashboard/RecommendedNext';
import { DailyTasks } from '@/components/dashboard/DailyTasks';
import { StreakCounter } from '@/components/dashboard/StreakCounter';
import { StudyTimer } from '@/components/dashboard/StudyTimer';
import { DailyQuote } from '@/components/dashboard/DailyQuote';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  ExternalLink, 
  Clock, 
  ArrowRight,
  Zap,
  Calendar,
  Cloud,
  CloudOff,
  LogIn
} from 'lucide-react';
import resourcesData from '@/data/resources.json';
import projectsData from '@/data/projects.json';
import competitionsData from '@/data/competitions.json';
import roadmapData from '@/data/roadmap.json';
import skillsData from '@/data/skills.json';
import dailyScheduleData from '@/data/daily-schedule.json';
import { useAuth } from '@/lib/auth-context';
import { syncProgress, saveLocalProgress, saveServerProgress, getLocalProgress, ProgressData } from '@/lib/progress-sync';

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
  totalStudyMinutes?: number;
}

function calculateSkills(progress: Progress) {
  const skills = { math: 0, programming: 0, finance: 0, ml: 0, tools: 0 };
  const categoryMap: Record<string, keyof typeof skills> = {
    math: 'math',
    programming: 'programming',
    finance: 'finance',
    ml: 'ml',
    tools: 'tools',
  };

  skillsData.categories.forEach((category) => {
    const catKey = categoryMap[category.id];
    if (!catKey) return;

    let totalWeight = 0;
    let completedWeight = 0;

    category.skills.forEach((skill) => {
      const weight = skill.difficulty === 'beginner' ? 1 : skill.difficulty === 'intermediate' ? 2 : 3;
      totalWeight += weight;

      const skillResources = resourcesData.resources.filter((r) => r.skills.includes(skill.id));
      const completedSkillResources = skillResources.filter((r) => progress.resourcesCompleted.includes(r.id));
      
      if (skillResources.length > 0) {
        const resourceProgress = completedSkillResources.length / skillResources.length;
        completedWeight += weight * resourceProgress;
      }
    });

    skills[catKey] = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
  });

  return skills;
}

function getCurrentWeek(startDate: string): number {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return Math.min(diffWeeks, 32);
}

function getCurrentDay(startDate: string): number {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return ((diffDays - 1) % 7) + 1;
}

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

function generateRecommendations(progress: Progress) {
  const recommendations = [];
  const completedResourceIds = new Set(progress.resourcesCompleted);

  if (progress.resourcesCompleted.length === 0) {
    recommendations.push({
      type: 'resource' as const,
      title: 'Start with Python Basics',
      description: 'Begin your quant journey with Python fundamentals.',
      href: '/resources',
      priority: 'high' as const,
    });
  }

  const incompleteResources = resourcesData.resources.filter(
    (r) => !completedResourceIds.has(r.id) && r.difficulty === 'beginner'
  );

  if (incompleteResources.length > 0) {
    const next = incompleteResources[0];
    recommendations.push({
      type: 'resource' as const,
      title: `Next: ${next.title}`,
      description: next.description,
      href: '/resources',
      priority: 'high' as const,
    });
  }

  return recommendations.slice(0, 3);
}

const quickResources = [
  {
    id: 'python-official',
    title: 'Python Official Tutorial',
    url: 'https://docs.python.org/3/tutorial/',
    description: 'Start here - learn Python basics',
    time: '2-3 hours',
  },
  {
    id: 'automate-boring-stuff',
    title: 'Automate the Boring Stuff',
    url: 'https://automatetheboringstuff.com/',
    description: 'Practical Python programming',
    time: '10-15 hours',
  },
  {
    id: 'mit-60001',
    title: 'MIT 6.0001 Introduction to CS',
    url: 'https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/',
    description: 'MIT\'s intro CS course',
    time: '30-40 hours',
  },
  {
    id: '3b1b-linear-algebra',
    title: '3Blue1Brown Linear Algebra',
    url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab',
    description: 'Visual linear algebra intuition',
    time: '4-5 hours',
  },
];

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<Progress>({
    resourcesCompleted: [],
    projectsCompleted: [],
    competitions: {},
    currentWeek: 1,
    completedTasks: [],
    startDate: '',
    skills: {},
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    activeDays: [],
  });
  const [mounted, setMounted] = useState(false);
  const [viewingWeek, setViewingWeek] = useState<number>(1);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'offline'>('idle');

  useEffect(() => {
    const loadProgress = async () => {
      let loadedData: ProgressData | null = null;

      if (user) {
        setSyncStatus('syncing');
        try {
          loadedData = await syncProgress(user.id);
          setSyncStatus('synced');
        } catch {
          setSyncStatus('offline');
          loadedData = getLocalProgress();
        }
      } else {
        loadedData = getLocalProgress();
        setSyncStatus('offline');
      }

      if (loadedData) {
        const startDate = loadedData.startDate || new Date().toISOString().split('T')[0];
        const dateWeek = getCurrentWeek(startDate);
        const completedTasks = loadedData.completedTasks || [];

        let activeWeek = 1;
        for (let w = 1; w <= dateWeek; w++) {
          const weekData = dailyScheduleData.weeks.find((wk) => wk.week === w);
          if (weekData) {
            const totalTasks = weekData.days.reduce((sum, day) => sum + day.tasks.length, 0);
            const completed = weekData.days.reduce((sum, day) => sum + day.tasks.filter((task) => completedTasks.includes(task.id)).length, 0);
            if (completed < totalTasks) {
              activeWeek = w;
              break;
            }
            activeWeek = w + 1;
          }
        }
        activeWeek = Math.min(activeWeek, 32);

        setProgress({ ...loadedData, currentWeek: dateWeek, startDate, completedTasks } as Progress);
        setViewingWeek(activeWeek);

        const activeDays = calculateActiveDays(completedTasks, startDate);
        const { currentStreak, longestStreak } = calculateStreak(activeDays);
        setProgress((prev) => ({ ...prev, currentStreak, longestStreak, lastActiveDate: activeDays[activeDays.length - 1] || '', activeDays }));
      } else {
        const startDate = new Date().toISOString().split('T')[0];
        const newProgress = {
          resourcesCompleted: [],
          projectsCompleted: [],
          competitions: {},
          currentWeek: 1,
          completedTasks: [],
          startDate,
          skills: {},
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: '',
          activeDays: [],
          totalStudyMinutes: 0,
        };
        setProgress(newProgress);
        saveLocalProgress(newProgress as ProgressData);
        if (user) {
          await saveServerProgress(user.id, newProgress as ProgressData);
        }
      }
      setMounted(true);
    };

    if (!authLoading) {
      loadProgress();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (mounted) {
      saveLocalProgress(progress as ProgressData);
      if (user) {
        saveServerProgress(user.id, progress as ProgressData);
      }
    }
  }, [progress, mounted, user]);

  const skills = useMemo(() => calculateSkills(progress), [progress]);
  const recommendations = useMemo(() => generateRecommendations(progress), [progress]);
  const currentDay = useMemo(() => getCurrentDay(progress.startDate), [progress.startDate]);

  useEffect(() => {
    if (!mounted) return;
    setProgress((prev) => {
      if (!prev.startDate) return prev;
      const activeDays = calculateActiveDays(prev.completedTasks, prev.startDate);
      const { currentStreak, longestStreak } = calculateStreak(activeDays);
      if (
        currentStreak === prev.currentStreak &&
        longestStreak === prev.longestStreak &&
        activeDays.length === prev.activeDays.length
      ) {
        return prev;
      }
      return {
        ...prev,
        currentStreak,
        longestStreak,
        lastActiveDate: activeDays[activeDays.length - 1] || '',
        activeDays,
      };
    });
  }, [progress.completedTasks, mounted]);

  const upcomingCompetitions = competitionsData.competitions
    .filter((c) => c.status === 'active')
    .slice(0, 3)
    .map((c) => ({
      id: c.id,
      name: c.name,
      organizer: c.organizer,
      deadline: c.deadline,
      difficulty: c.difficulty as 'beginner' | 'intermediate' | 'advanced',
      prize: c.prize,
      url: c.url,
    }));

  const weekSchedule = dailyScheduleData.weeks.find((w) => w.week === viewingWeek);

  // Check if previous weeks are incomplete
  const getFirstIncompleteWeek = () => {
    for (let w = 1; w <= 32; w++) {
      const weekData = dailyScheduleData.weeks.find((wk) => wk.week === w);
      if (weekData) {
        const totalTasks = weekData.days.reduce((sum, day) => sum + day.tasks.length, 0);
        const completed = weekData.days.reduce((sum, day) => sum + day.tasks.filter((task) => progress.completedTasks.includes(task.id)).length, 0);
        if (completed < totalTasks) return w;
      }
    }
    return 32;
  };
  const firstIncompleteWeek = getFirstIncompleteWeek();
  const isSkippingAhead = viewingWeek > firstIncompleteWeek;

  const handleToggleTask = (taskId: string) => {
    const newCompletedTasks = progress.completedTasks.includes(taskId)
      ? progress.completedTasks.filter((t) => t !== taskId)
      : [...progress.completedTasks, taskId];
    
    setProgress({ ...progress, completedTasks: newCompletedTasks });
  };

  const handleWeekChange = (week: number) => {
    const target = Math.max(1, Math.min(32, week));
    // Can only go to weeks up to and including the first incomplete week
    if (target <= firstIncompleteWeek) {
      setViewingWeek(target);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 page-enter">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6 md:p-8 border border-slate-700/50">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Week {firstIncompleteWeek} · Day {currentDay}
              </h1>
              <p className="text-slate-400 mt-1 text-sm">
                {firstIncompleteWeek < progress.currentWeek
                  ? `Behind schedule — Week ${firstIncompleteWeek} not yet complete`
                  : 'On track — keep going'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{progress.currentStreak}</div>
              <p className="text-xs text-slate-400">day streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skip Ahead Warning */}
      {isSkippingAhead && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm text-amber-500">
            Selesaikan Week {firstIncompleteWeek} dulu sebelum lanjut ke Week {viewingWeek}.
            <button 
              onClick={() => setViewingWeek(firstIncompleteWeek)}
              className="ml-2 text-primary hover:underline font-medium"
            >
              Kembali ke Week {firstIncompleteWeek}
            </button>
          </p>
        </div>
      )}

      {/* Stats */}
      <QuickStats
        resourcesCompleted={progress.resourcesCompleted.length}
        totalResources={resourcesData.resources.length}
        projectsCompleted={progress.projectsCompleted.length}
        totalProjects={projectsData.projects.length}
        competitionsEntered={Object.keys(progress.competitions).length}
        totalCompetitions={competitionsData.competitions.length}
        currentWeek={progress.currentWeek}
        totalWeeks={roadmapData.weeks}
      />

      {/* Daily Tasks */}
      <DailyTasks 
        weekSchedule={weekSchedule}
        completedTasks={progress.completedTasks}
        onToggleTask={handleToggleTask}
        currentDay={currentDay}
        allWeeks={dailyScheduleData.weeks}
        currentWeek={viewingWeek}
        onWeekChange={handleWeekChange}
        maxAllowedWeek={firstIncompleteWeek}
      />

      {/* Bottom Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <SkillRadar skills={skills} />
        <StudyTimer />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DailyQuote />
        <UpcomingCompetitions competitions={upcomingCompetitions} />
      </div>
    </div>
  );
}
