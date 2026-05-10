'use client';

import { useState, useEffect } from 'react';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { SkillRadar } from '@/components/dashboard/SkillRadar';
import { UpcomingCompetitions } from '@/components/dashboard/UpcomingCompetitions';
import { RecommendedNext } from '@/components/dashboard/RecommendedNext';
import { WeeklyProgress } from '@/components/dashboard/WeeklyProgress';
import resourcesData from '@/data/resources.json';
import projectsData from '@/data/projects.json';
import competitionsData from '@/data/competitions.json';
import roadmapData from '@/data/roadmap.json';

export default function Dashboard() {
  const [progress, setProgress] = useState({
    resourcesCompleted: [] as string[],
    projectsCompleted: [] as string[],
    competitions: {} as Record<string, string>,
    currentWeek: 1,
    skills: {
      math: 0,
      programming: 0,
      finance: 0,
      ml: 0,
      tools: 0,
    },
  });

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quantpath-progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

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

  const recommendations = [
    {
      type: 'resource' as const,
      title: 'Start with Python Basics',
      description: 'Begin your quant journey with Python fundamentals - the primary language for quantitative finance.',
      href: '/resources?skill=python',
      priority: 'high' as const,
    },
    {
      type: 'skill' as const,
      title: 'Review Linear Algebra',
      description: 'Strengthen your math foundation - essential for portfolio optimization and ML.',
      href: '/roadmap?skill=linear-algebra',
      priority: 'high' as const,
    },
    {
      type: 'project' as const,
      title: 'Build Correlation Visualizer',
      description: 'Start with a beginner project to practice Python and data visualization.',
      href: '/projects?difficulty=beginner',
      priority: 'medium' as const,
    },
  ];

  const milestones = roadmapData.milestones.map((m) => ({
    week: m.week,
    title: m.title,
    completed: progress.currentWeek > m.week,
    current: progress.currentWeek <= m.week && progress.currentWeek > (m.week - 4),
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="p-6 rounded-lg bg-gradient-to-r from-blue-900 to-slate-900 border border-blue-800">
        <h1 className="text-2xl font-bold text-white">
          Welcome to QuantPath
        </h1>
        <p className="text-slate-300 mt-2">
          Your personal learning companion for transitioning from Nuclear Engineering to Quantitative Finance.
          Follow the 24-week learning path to build the skills you need.
        </p>
      </div>

      {/* Quick Stats */}
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
      <div className="grid gap-6 md:grid-cols-2">
        {/* Skill Radar */}
        <SkillRadar skills={progress.skills} />

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
    </div>
  );
}
