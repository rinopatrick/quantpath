'use client';

import { useState, useEffect, useMemo } from 'react';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { SkillRadar } from '@/components/dashboard/SkillRadar';
import { UpcomingCompetitions } from '@/components/dashboard/UpcomingCompetitions';
import { RecommendedNext } from '@/components/dashboard/RecommendedNext';
import { WeeklyProgress } from '@/components/dashboard/WeeklyProgress';
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
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-lg bg-gradient-to-r from-blue-900 to-slate-900 border border-blue-800">
        <h1 className="text-2xl font-bold text-white">Welcome to QuantPath</h1>
        <p className="text-slate-300 mt-2">
          Your personal learning companion for transitioning from Nuclear Engineering to Quantitative Finance.
          Week {progress.currentWeek} of 24.
        </p>
      </div>

      {todayTasks && (
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <h2 className="text-lg font-semibold text-white mb-2">
            Today&apos;s Focus: {todayTasks.focus}
          </h2>
          <ul className="space-y-2">
            {todayTasks.tasks.map((task, i) => {
              const isDone = progress.dailyTasks[today]?.includes(task);
              return (
                <li key={i} className="flex items-center gap-2">
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
                    className="rounded border-slate-600"
                  />
                  <span className={`text-sm ${isDone ? 'text-green-400 line-through' : 'text-slate-300'}`}>
                    {task}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

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

      <div className="grid gap-6 md:grid-cols-2">
        <SkillRadar skills={skills} />
        <WeeklyProgress 
          currentWeek={progress.currentWeek}
          totalWeeks={roadmapData.weeks}
          milestones={milestones}
        />
        <UpcomingCompetitions competitions={upcomingCompetitions} />
        <RecommendedNext recommendations={recommendations} />
      </div>
    </div>
  );
}
