'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Lightbulb, Trophy, Calendar } from 'lucide-react';

interface QuickStatsProps {
  resourcesCompleted: number;
  totalResources: number;
  projectsCompleted: number;
  totalProjects: number;
  competitionsEntered: number;
  totalCompetitions: number;
  currentWeek: number;
  totalWeeks: number;
}

export function QuickStats({
  resourcesCompleted,
  totalResources,
  projectsCompleted,
  totalProjects,
  competitionsEntered,
  totalCompetitions,
  currentWeek,
  totalWeeks,
}: QuickStatsProps) {
  const items = [
    {
      label: 'Resources',
      value: resourcesCompleted,
      total: totalResources,
      progress: (resourcesCompleted / totalResources) * 100,
      icon: BookOpen,
      color: 'text-blue-500',
    },
    {
      label: 'Projects',
      value: projectsCompleted,
      total: totalProjects,
      progress: (projectsCompleted / totalProjects) * 100,
      icon: Lightbulb,
      color: 'text-amber-500',
    },
    {
      label: 'Competitions',
      value: competitionsEntered,
      total: totalCompetitions,
      progress: (competitionsEntered / totalCompetitions) * 100,
      icon: Trophy,
      color: 'text-emerald-500',
    },
    {
      label: 'Week',
      value: currentWeek,
      total: totalWeeks,
      progress: (currentWeek / totalWeeks) * 100,
      icon: Calendar,
      color: 'text-violet-500',
      prefix: 'W',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div className="text-2xl font-bold">
                {item.prefix || ''}{item.value}
                <span className="text-sm font-normal text-muted-foreground ml-1">/ {item.total}</span>
              </div>
              <Progress value={item.progress} className="mt-2 h-1.5" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
