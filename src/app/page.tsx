'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { SkillRadar } from '@/components/dashboard/SkillRadar';
import { UpcomingCompetitions } from '@/components/dashboard/UpcomingCompetitions';
import { RecommendedNext } from '@/components/dashboard/RecommendedNext';
import { WeeklyProgress } from '@/components/dashboard/WeeklyProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  ExternalLink, 
  CheckCircle, 
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

interface Progress {
  resourcesCompleted: string[];
  projectsCompleted: string[];
  competitions: Record<string, string>;
  currentWeek: number;
  dailyTasks: Record<string, string[]>;
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

function generateRecommendations(progress: Progress) {
  const recommendations = [];
  const completedResourceIds = new Set(progress.resourcesCompleted);
  const completedProjectIds = new Set(progress.projectsCompleted);

  if (progress.resourcesCompleted.length === 0) {
    recommendations.push({
      type: 'resource' as const,
      title: 'Start with Python Basics',
      description: 'Begin your quant journey with Python fundamentals.',
      href: '/resources?skill=python',
      priority: 'high' as const,
    });
  }

  const incompleteResources = resourcesData.resources.filter(
    (r) => !completedResourceIds.has(r.id)
  );

  const beginnerResources = incompleteResources.filter((r) => r.difficulty === 'beginner');
  if (beginnerResources.length > 0) {
    const next = beginnerResources[0];
    recommendations.push({
      type: 'resource' as const,
      title: `Complete: ${next.title}`,
      description: next.description,
      href: `/resources`,
      priority: 'high' as const,
    });
  }

  const incompleteProjects = projectsData.projects.filter(
    (p) => !completedProjectIds.has(p.id)
  );
  const beginnerProjects = incompleteProjects.filter((p) => p.difficulty === 'beginner');
  if (beginnerProjects.length > 0 && progress.resourcesCompleted.length >= 3) {
    const next = beginnerProjects[0];
    recommendations.push({
      type: 'project' as const,
      title: `Build: ${next.title}`,
      description: next.description,
      href: `/projects`,
      priority: 'medium' as const,
    });
  }

  const upcomingComps = competitionsData.competitions.filter(
    (c) => !progress.competitions[c.id]
  );
  if (upcomingComps.length > 0 && progress.resourcesCompleted.length >= 5) {
    const next = upcomingComps[0];
    recommendations.push({
      type: 'skill' as const,
      title: `Join: ${next.name}`,
      description: next.description,
      href: `/competitions`,
      priority: 'low' as const,
    });
  }

  return recommendations.slice(0, 3);
}

const week1Resources = [
  {
    id: 'python-official',
    title: 'Python Official Tutorial',
    url: 'https://docs.python.org/3/tutorial/',
    description: 'Start here - learn Python basics',
    time: '2-3 hours',
  },
  {
    id: 'automate-boring-stuff',
    title: 'Automate the Boring Stuff with Python',
    url: 'https://automatetheboringstuff.com/',
    description: 'Practical Python programming',
    time: '10-15 hours',
  },
  {
    id: 'mit-60001',
    title: 'MIT 6.0001 Introduction to CS',
    url: 'https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/',
    description: 'MIT\'s intro CS course with Python',
    time: '30-40 hours',
  },
  {
    id: 'python-for-everybody',
    title: 'Python for Everybody',
    url: 'https://www.py4e.com/',
    description: 'Complete beginner Python course',
    time: '30 hours',
  },
];

const week1Tasks = [
  { task: 'Install Python 3.x and VS Code', done: false },
  { task: 'Complete Python Official Tutorial (Chapters 1-5)', done: false },
  { task: 'Start Automate the Boring Stuff (Chapters 1-3)', done: false },
  { task: 'Watch MIT 6.0001 Lecture 1', done: false },
  { task: 'Write your first Python script', done: false },
];

export default function Dashboard() {
  const [progress, setProgress] = useState<Progress>({
    resourcesCompleted: [],
    projectsCompleted: [],
    competitions: {},
    currentWeek: 1,
    dailyTasks: {},
    startDate: '',
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('quantpath-progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      const startDate = parsed.startDate || new Date().toISOString().split('T')[0];
      const currentWeek = getCurrentWeek(startDate);
      setProgress({ ...parsed, currentWeek, startDate });
    } else {
      const startDate = new Date().toISOString().split('T')[0];
      const newProgress = {
        resourcesCompleted: [],
        projectsCompleted: [],
        competitions: {},
        currentWeek: 1,
        dailyTasks: {},
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

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = roadmapData.weeklySchedule.find(
    (w) => w.week === progress.currentWeek
  );

  const milestones = roadmapData.milestones.map((m) => ({
    week: m.week,
    title: m.title,
    completed: progress.currentWeek >= m.week,
    current: progress.currentWeek >= m.week - 4 && progress.currentWeek < m.week,
  }));

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
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Welcome to QuantPath
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl">
            Your personal learning companion for transitioning from Nuclear Engineering to Quantitative Finance. 
            You&apos;re on <span className="font-semibold text-white">Week {progress.currentWeek}</span> of 24.
          </p>
        </div>
      </div>

      {/* Today's Focus - Most Important */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Today&apos;s Focus
            </CardTitle>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Week {progress.currentWeek}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {todayTasks ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">{todayTasks.focus}</h3>
                <p className="text-sm text-muted-foreground">
                  Estimated time: {todayTasks.hours} hours this week
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Tasks to complete:</p>
                {todayTasks.tasks.map((task, i) => {
                  const isDone = progress.dailyTasks[today]?.includes(task);
                  return (
                    <label 
                      key={i} 
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        isDone ? 'bg-green-500/10 border border-green-500/20' : 'bg-muted/50 hover:bg-muted'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isDone || false}
                        onChange={() => {
                          const newDailyTasks = { ...progress.dailyTasks };
                          if (!newDailyTasks[today]) newDailyTasks[today] = [];
                          if (isDone) {
                            newDailyTasks[today] = newDailyTasks[today].filter((t) => t !== task);
                          } else {
                            newDailyTasks[today].push(task);
                          }
                          setProgress({ ...progress, dailyTasks: newDailyTasks });
                        }}
                        className="mt-0.5 rounded border-slate-600"
                      />
                      <span className={`text-sm ${isDone ? 'text-green-400 line-through' : 'text-foreground'}`}>
                        {task}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No tasks for this week</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Access Resources */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Start Learning Now
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {week1Resources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-200 hover:shadow-md"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <ExternalLink className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                    {resource.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
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

        {/* Weekly Progress */}
        <WeeklyProgress 
          currentWeek={progress.currentWeek}
          totalWeeks={roadmapData.weeks}
          milestones={milestones}
        />

        {/* Upcoming Competitions */}
        <UpcomingCompetitions competitions={upcomingCompetitions} />

        {/* Recommended Next Steps */}
        <RecommendedNext recommendations={recommendations} />
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold">Quick Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href="/roadmap" className="group flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium text-sm">Learning Roadmap</p>
                <p className="text-xs text-muted-foreground">View skill tree</p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link href="/resources" className="group flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all">
              <BookOpen className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">Resources</p>
                <p className="text-xs text-muted-foreground">200+ learning materials</p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link href="/projects" className="group flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium text-sm">Projects</p>
                <p className="text-xs text-muted-foreground">Build your CV</p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
