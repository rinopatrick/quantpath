'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { SkillRadar } from '@/components/dashboard/SkillRadar';
import { UpcomingCompetitions } from '@/components/dashboard/UpcomingCompetitions';
import { RecommendedNext } from '@/components/dashboard/RecommendedNext';
import { DailyTasks } from '@/components/dashboard/DailyTasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  ExternalLink, 
  Clock, 
  ArrowRight,
  Zap,
  Calendar
} from 'lucide-react';
import resourcesData from '@/data/resources.json';
import projectsData from '@/data/projects.json';
import competitionsData from '@/data/competitions.json';
import roadmapData from '@/data/roadmap.json';
import skillsData from '@/data/skills.json';
import dailyScheduleData from '@/data/daily-schedule.json';

interface Progress {
  resourcesCompleted: string[];
  projectsCompleted: string[];
  competitions: Record<string, string>;
  currentWeek: number;
  completedTasks: string[];
  startDate: string;
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
  return Math.min(diffWeeks, 24);
}

function getCurrentDay(startDate: string): number {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return ((diffDays - 1) % 7) + 1;
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
  const [progress, setProgress] = useState<Progress>({
    resourcesCompleted: [],
    projectsCompleted: [],
    competitions: {},
    currentWeek: 1,
    completedTasks: [],
    startDate: '',
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('quantpath-progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      const startDate = parsed.startDate || new Date().toISOString().split('T')[0];
      const currentWeek = getCurrentWeek(startDate);
      setProgress({ ...parsed, currentWeek, startDate, completedTasks: parsed.completedTasks || [] });
    } else {
      const startDate = new Date().toISOString().split('T')[0];
      const newProgress = {
        resourcesCompleted: [],
        projectsCompleted: [],
        competitions: {},
        currentWeek: 1,
        completedTasks: [],
        startDate,
      };
      setProgress(newProgress);
      localStorage.setItem('quantpath-progress', JSON.stringify(newProgress));
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('quantpath-progress', JSON.stringify(progress));
    }
  }, [progress, mounted]);

  const skills = useMemo(() => calculateSkills(progress), [progress]);
  const recommendations = useMemo(() => generateRecommendations(progress), [progress]);
  const currentDay = useMemo(() => getCurrentDay(progress.startDate), [progress.startDate]);

  const upcomingCompetitions = competitionsData.competitions
    .filter((c) => c.status === 'upcoming' || c.status === 'active')
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

  const weekSchedule = dailyScheduleData.weeks.find((w) => w.week === progress.currentWeek);

  const handleToggleTask = (taskId: string) => {
    const newCompletedTasks = progress.completedTasks.includes(taskId)
      ? progress.completedTasks.filter((t) => t !== taskId)
      : [...progress.completedTasks, taskId];
    
    setProgress({ ...progress, completedTasks: newCompletedTasks });
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 md:p-8">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Welcome to QuantPath
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl">
            Your personal learning companion for transitioning from Nuclear Engineering to Quantitative Finance. 
            You&apos;re on <span className="font-semibold text-white">Week {progress.currentWeek}</span> of 24, 
            <span className="font-semibold text-white"> Day {currentDay}</span> of 7.
          </p>
        </div>
      </div>

      {/* Daily Tasks - Most Important */}
      <DailyTasks 
        weekSchedule={weekSchedule}
        completedTasks={progress.completedTasks}
        onToggleTask={handleToggleTask}
        currentDay={currentDay}
      />

      {/* Quick Access Resources */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Quick Access Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickResources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-200"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <ExternalLink className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                    {resource.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {resource.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{resource.time}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
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

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Skill Radar */}
        <SkillRadar skills={skills} />

        {/* Upcoming Competitions */}
        <UpcomingCompetitions competitions={upcomingCompetitions} />

        {/* Recommended Next Steps */}
        <RecommendedNext recommendations={recommendations} />

        {/* Quick Links */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold">Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/roadmap" className="group flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all">
                <Calendar className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-semibold text-sm">Learning Roadmap</p>
                  <p className="text-xs text-muted-foreground">View full skill tree</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link href="/resources" className="group flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all">
                <BookOpen className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-semibold text-sm">Resources</p>
                  <p className="text-xs text-muted-foreground">200+ learning materials</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link href="/projects" className="group flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all">
                <Zap className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-semibold text-sm">Projects</p>
                  <p className="text-xs text-muted-foreground">Build your CV</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
