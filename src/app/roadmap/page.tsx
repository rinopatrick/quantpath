'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sigma, 
  Code, 
  DollarSign, 
  Brain, 
  Wrench,
  Clock,
  Target,
  CheckCircle,
  Circle,
  Lock,
  BookOpen,
  CalendarDays,
  Route,
  FolderKanban
} from 'lucide-react';
import skillsData from '@/data/skills.json';
import resourcesData from '@/data/resources.json';
import dailyScheduleData from '@/data/daily-schedule.json';
import roadmapData from '@/data/roadmap.json';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  math: Sigma,
  programming: Code,
  finance: DollarSign,
  ml: Brain,
  tools: Wrench,
};

const categoryColors: Record<string, string> = {
  math: 'blue',
  programming: 'green',
  finance: 'yellow',
  ml: 'purple',
  tools: 'orange',
};

export default function RoadmapPage() {
  const [progress, setProgress] = useState({
    resourcesCompleted: [] as string[],
    completedTasks: [] as string[],
    projectsCompleted: [] as string[],
  });

  useEffect(() => {
    const saved = localStorage.getItem('quantpath-progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      setProgress({
        resourcesCompleted: parsed.resourcesCompleted || [],
        completedTasks: parsed.completedTasks || [],
        projectsCompleted: parsed.projectsCompleted || [],
      });
    }
  }, []);

  const getSkillProgress = (skillId: string) => {
    const skillResources = resourcesData.resources.filter((r) => r.skills.includes(skillId));
    if (skillResources.length === 0) return 0;
    const completed = skillResources.filter((r) => progress.resourcesCompleted.includes(r.id));
    return Math.round((completed.length / skillResources.length) * 100);
  };

  const getSkillStatus = (skillId: string, skill: (typeof skillsData.categories)[number]['skills'][number]) => {
    const pct = getSkillProgress(skillId);
    if (pct >= 80) return 'completed';
    if (pct > 0) return 'in_progress';
    // Check prerequisites
    if (skill.prerequisites?.length > 0) {
      const prereqsMet = skill.prerequisites.every((p: string) => getSkillProgress(p) >= 50);
      if (!prereqsMet) return 'locked';
    }
    return 'not_started';
  };

  const getWeekProgress = (week: (typeof dailyScheduleData.weeks)[number]) => {
    const tasks = week.days.flatMap((day) => day.tasks);
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((task) => progress.completedTasks.includes(task.id)).length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6 md:p-8 border border-slate-700/50">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Learning Roadmap</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Skills synced with your dashboard progress. Complete resources to unlock skills.
          </p>
        </div>
      </div>

      {/* Role tracks */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Route className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-bold">Role Tracks</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {roadmapData.tracks.map((track) => (
            <Card key={track.id} className={track.primary ? 'border-emerald-500/40 bg-emerald-500/5' : ''}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold">{track.title}</h3>
                  {track.primary && <Badge className="bg-emerald-600">Recommended</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">Starts Week {track.startsWeek}</p>
                <div className="flex flex-wrap gap-1">
                  {track.competencies.map((competency) => (
                    <Badge key={competency} variant="outline" className="text-[10px]">{competency}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Canonical execution schedule */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-bold">32-Week Execution Path</h2>
          </div>
          <Badge variant="outline">{roadmapData.weeklySchedule.reduce((sum, week) => sum + week.hours, 0)}h scheduled</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {dailyScheduleData.weeks.map((week) => {
            const completion = getWeekProgress(week);
            return (
              <Card key={week.week} className={completion === 100 ? 'border-emerald-500/30 bg-emerald-500/5' : ''}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-blue-400 font-medium">Week {week.week}</p>
                      <h3 className="text-sm font-semibold mt-1">{week.title}</h3>
                    </div>
                    <Badge variant="outline">{week.totalHours}h</Badge>
                  </div>
                  <Progress value={completion} className="h-1.5" />
                  <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Deliverable:</span> {week.deliverable}</p>
                  <div className="flex flex-wrap gap-1">
                    {week.tracks.map((track) => <Badge key={track} variant="secondary" className="text-[10px] capitalize">{track.replaceAll('-', ' ')}</Badge>)}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span><BookOpen className="inline h-3 w-3 mr-1" />{week.resourceIds.length} resources</span>
                    <span><FolderKanban className="inline h-3 w-3 mr-1" />{week.projectIds.length} projects</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Skills by Category */}
      {skillsData.categories.map((category) => {
        const Icon = categoryIcons[category.id] || Target;
        const color = categoryColors[category.id] || 'slate';
        const totalHours = category.skills.reduce((sum, s) => sum + s.estimatedHours, 0);
        const avgProgress = Math.round(
          category.skills.reduce((sum, s) => sum + getSkillProgress(s.id), 0) / category.skills.length
        );

        return (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 text-${color}-500`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {category.skills.length} skills · {totalHours}h total
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{avgProgress}%</div>
                  <Progress value={avgProgress} className="w-24 h-1.5 mt-1" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.skills.map((skill) => {
                  const status = getSkillStatus(skill.id, skill);
                  const pct = getSkillProgress(skill.id);
                  const statusConfig = {
                    completed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Mastered' },
                    in_progress: { icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10', label: `${pct}%` },
                    not_started: { icon: Circle, color: 'text-muted-foreground', bg: '', label: 'Ready' },
                    locked: { icon: Lock, color: 'text-muted-foreground/50', bg: '', label: 'Locked' },
                  }[status];

                  return (
                    <div
                      key={skill.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        status === 'completed'
                          ? 'border-green-500/20 bg-green-500/5'
                          : status === 'in_progress'
                            ? 'border-blue-500/20 bg-blue-500/5'
                            : status === 'locked'
                              ? 'border-border/50 opacity-50'
                              : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${statusConfig.bg} flex items-center justify-center flex-shrink-0`}>
                        <statusConfig.icon className={`h-4 w-4 ${statusConfig.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{skill.name}</span>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {skill.difficulty}
                          </Badge>
                          {skill.nuclearStrength && (
                            <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-400/30">
                              Nuclear
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{skill.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`text-xs font-medium ${statusConfig.color}`}>{statusConfig.label}</div>
                        {status !== 'locked' && (
                          <Progress value={pct} className="w-16 h-1 mt-1" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
