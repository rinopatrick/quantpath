'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Lightbulb, 
  Trophy, 
  Calendar,
  TrendingUp,
  Clock,
  Target,
  Zap
} from 'lucide-react';

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
  const resourceProgress = (resourcesCompleted / totalResources) * 100;
  const projectProgress = (projectsCompleted / totalProjects) * 100;
  const competitionProgress = (competitionsEntered / totalCompetitions) * 100;
  const weekProgress = (currentWeek / totalWeeks) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">
            Resources Completed
          </CardTitle>
          <BookOpen className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{resourcesCompleted}</div>
          <p className="text-xs text-slate-500">
            of {totalResources} total
          </p>
          <Progress value={resourceProgress} className="mt-2" />
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">
            Projects Done
          </CardTitle>
          <Lightbulb className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{projectsCompleted}</div>
          <p className="text-xs text-slate-500">
            of {totalProjects} total
          </p>
          <Progress value={projectProgress} className="mt-2" />
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">
            Competitions
          </CardTitle>
          <Trophy className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{competitionsEntered}</div>
          <p className="text-xs text-slate-500">
            of {totalCompetitions} total
          </p>
          <Progress value={competitionProgress} className="mt-2" />
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">
            Timeline Progress
          </CardTitle>
          <Calendar className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">Week {currentWeek}</div>
          <p className="text-xs text-slate-500">
            of {totalWeeks} weeks
          </p>
          <Progress value={weekProgress} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}
