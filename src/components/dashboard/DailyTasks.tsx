'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  BookOpen, 
  Video, 
  Code, 
  Wrench,
  Calendar,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import resourcesData from '@/data/resources.json';
import projectsData from '@/data/projects.json';
import papersData from '@/data/papers.json';

interface Task {
  id: string;
  title: string;
  description: string;
  time: string;
  url: string | null;
  type: string;
}

interface DaySchedule {
  day: number;
  title: string;
  hours: number;
  tasks: Task[];
}

interface WeekSchedule {
  week: number;
  title: string;
  totalHours: number;
  days: DaySchedule[];
  tracks: string[];
  deliverable: string;
  acceptanceCriteria: string[];
  resourceIds: string[];
  projectIds: string[];
  paperIds: string[];
  competitionIds: string[];
  leetcodeIds: string[];
}

interface DailyTasksProps {
  weekSchedule: WeekSchedule | undefined;
  completedTasks: string[];
  onToggleTask: (taskId: string) => void;
  currentDay: number;
  allWeeks?: WeekSchedule[];
  currentWeek?: number;
  onWeekChange?: (week: number) => void;
  maxAllowedWeek?: number;
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  reading: BookOpen,
  video: Video,
  practice: Code,
  setup: Wrench,
  project: Code,
  review: BookOpen,
  planning: Calendar,
};

const typeColors: Record<string, string> = {
  reading: 'bg-blue-500/10 text-blue-500',
  video: 'bg-purple-500/10 text-purple-500',
  practice: 'bg-green-500/10 text-green-500',
  setup: 'bg-orange-500/10 text-orange-500',
  project: 'bg-yellow-500/10 text-yellow-500',
  review: 'bg-indigo-500/10 text-indigo-500',
  planning: 'bg-pink-500/10 text-pink-500',
};

export function DailyTasks({ weekSchedule, completedTasks, onToggleTask, currentDay, allWeeks, currentWeek, onWeekChange, maxAllowedWeek }: DailyTasksProps) {
  const [selectedDay, setSelectedDay] = useState(currentDay);

  useEffect(() => {
    setSelectedDay(currentDay);
  }, [currentDay, weekSchedule?.week]);

  // Calculate week completion stats
  const getWeekCompletion = (week: WeekSchedule) => {
    const totalTasks = week.days.reduce((sum, d) => sum + d.tasks.length, 0);
    const completedCount = week.days.reduce((sum, d) => sum + d.tasks.filter(t => completedTasks.includes(t.id)).length, 0);
    return totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  };

  if (!weekSchedule) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Daily Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No schedule available for this week</p>
        </CardContent>
      </Card>
    );
  }

  // Find the first incomplete day (auto-advance logic)
  const getActiveDay = () => {
    for (let day = 1; day <= 7; day++) {
      const daySchedule = weekSchedule.days.find((d) => d.day === day);
      if (daySchedule) {
        const allCompleted = daySchedule.tasks.every((t) => completedTasks.includes(t.id));
        if (!allCompleted) return day;
      }
    }
    return 7; // All days completed
  };

  const activeDay = getActiveDay();
  const displayDay = selectedDay || activeDay;
  
  const today = weekSchedule.days.find((d) => d.day === displayDay);
  const tomorrow = weekSchedule.days.find((d) => d.day === displayDay + 1);
  const dayAfter = weekSchedule.days.find((d) => d.day === displayDay + 2);
  
  const todayCompleted = today?.tasks.every((t) => completedTasks.includes(t.id)) || false;
  const tomorrowCompleted = tomorrow?.tasks.every((t) => completedTasks.includes(t.id)) || false;
  const weekResources = resourcesData.resources.filter((resource) => weekSchedule.resourceIds.includes(resource.id));
  const weekProjects = projectsData.projects.filter((project) => weekSchedule.projectIds.includes(project.id));
  const weekPapers = papersData.papers.filter((paper) => weekSchedule.paperIds.includes(paper.id));

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-2 md:pb-3 p-3 md:p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onWeekChange?.(Math.max(1, (currentWeek || 1) - 1))}
              disabled={(currentWeek || 1) <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-base md:text-lg font-bold flex items-center gap-2">
              <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              <span className="truncate">Week {weekSchedule.week}</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onWeekChange?.(Math.min(maxAllowedWeek || 32, (currentWeek || 1) + 1))}
              disabled={(currentWeek || 1) >= (maxAllowedWeek || 32)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs flex-shrink-0">
              Day {selectedDay}/7
            </Badge>
            <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs flex-shrink-0">
              {getWeekCompletion(weekSchedule)}%
            </Badge>
          </div>
        </div>
        {/* Week mini-map */}
        {allWeeks && (
          <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
            {allWeeks.map((w) => {
              const completion = getWeekCompletion(w);
              const isCurrent = w.week === (currentWeek || 1);
              return (
                <button
                  key={w.week}
                  onClick={() => onWeekChange?.(w.week)}
                  className={`flex-shrink-0 w-8 h-8 rounded-md text-[10px] font-medium transition-all ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                      : completion === 100
                        ? 'bg-green-500/20 text-green-500'
                        : completion > 0
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  title={`Week ${w.week}: ${w.title} (${completion}%)`}
                >
                  {w.week}
                </button>
              );
            })}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-3 md:p-4 pt-0">
        <div className="space-y-3 md:space-y-4">
          {/* Auditable week contract */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 md:p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {weekSchedule.tracks.map((track) => (
                <Badge key={track} variant="outline" className="capitalize border-emerald-500/30 text-emerald-400">
                  {track.replaceAll('-', ' ')}
                </Badge>
              ))}
              <Badge variant="outline">{weekSchedule.totalHours}h</Badge>
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-400">Weekly deliverable</p>
              <p className="text-sm font-semibold text-foreground mt-1">{weekSchedule.deliverable}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Acceptance gate</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {weekSchedule.acceptanceCriteria.map((criterion) => <li key={criterion}>• {criterion}</li>)}
                </ul>
              </div>
              <div className="space-y-2">
                {weekResources.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Core resources</p>
                    <div className="flex flex-wrap gap-1">
                      {weekResources.map((resource) => (
                        <a key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                          {resource.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {weekProjects.length > 0 && <p className="text-xs text-muted-foreground"><span className="font-medium">Projects:</span> {weekProjects.map((project) => project.title).join(', ')}</p>}
                {weekPapers.length > 0 && <p className="text-xs text-muted-foreground"><span className="font-medium">Papers:</span> {weekPapers.map((paper) => paper.title).join(', ')}</p>}
                {weekSchedule.leetcodeIds.length > 0 && <p className="text-xs text-muted-foreground"><span className="font-medium">LeetCode:</span> {weekSchedule.leetcodeIds.join(', ')}</p>}
              </div>
            </div>
          </div>

          {/* Day Selector */}
          <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {weekSchedule.days.map((day) => {
              const dayCompleted = day.tasks.every((t) => completedTasks.includes(t.id));
              const isToday = day.day === currentDay;
              const isSelected = day.day === selectedDay;
              
              return (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(day.day)}
                  className={`flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : isToday
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : dayCompleted
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <span className="text-[10px]">D</span>
                  <span className="font-bold text-sm">{day.day}</span>
                </button>
              );
            })}
          </div>

          {/* Today's Title */}
          {today && (
            <div className="p-3 md:p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10">
              <h3 className="font-bold text-foreground text-base md:text-lg">{today.title}</h3>
              <div className="flex items-center gap-3 md:gap-4 mt-1 flex-wrap">
                <span className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {today.hours}h
                </span>
                <span className="text-xs md:text-sm text-muted-foreground">
                  {today.tasks.length} tasks
                </span>
                {todayCompleted && (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Done!
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Tasks List */}
          {today && (
            <div className="space-y-2 md:space-y-3">
              {today.tasks.map((task, index) => {
                const isCompleted = completedTasks.includes(task.id);
                const colorClass = typeColors[task.type] || 'bg-gray-500/10 text-gray-500';

                return (
                  <div
                    key={task.id}
                    className={`flex items-start gap-2 md:gap-3 p-3 md:p-4 rounded-xl border transition-all ${
                      isCompleted 
                        ? 'bg-green-500/5 border-green-500/20' 
                        : 'bg-card border-border'
                    }`}
                  >
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-muted-foreground hover:border-primary'
                      }`}
                    >
                      {isCompleted && <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />}
                    </button>
                    
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-semibold text-sm ${isCompleted ? 'text-green-500 line-through' : 'text-foreground'}`}>
                                {index + 1}. {task.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                            </div>
                        <div className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium ${colorClass}`}>
                          {task.type}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.time}
                        </span>
                        {task.url && (
                          <a
                            href={task.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Open
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Next Day Preview - Shows when current day is completed */}
          {todayCompleted && tomorrow && (
            <div className={`p-3 md:p-4 rounded-xl border ${
              tomorrowCompleted 
                ? 'bg-green-500/5 border-green-500/20' 
                : 'bg-muted/50 border-border'
            }`}>
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-xs md:text-sm text-foreground">
                  {tomorrowCompleted ? 'Also Done!' : 'Up Next'}: {tomorrow.title}
                </h4>
                {tomorrowCompleted && (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 text-[10px]">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <p className="text-[11px] md:text-xs text-muted-foreground mb-1 md:mb-2">
                {tomorrow.hours}h • {tomorrow.tasks.length} tasks
              </p>
              <div className="space-y-0.5 md:space-y-1">
                {tomorrow.tasks.slice(0, 3).map((task) => (
                  <p key={task.id} className={`text-[11px] md:text-xs ${
                    completedTasks.includes(task.id) ? 'text-green-500 line-through' : 'text-muted-foreground'
                  }`}>
                    • {task.title}
                  </p>
                ))}
                {tomorrow.tasks.length > 3 && (
                  <p className="text-[11px] md:text-xs text-muted-foreground">
                    +{tomorrow.tasks.length - 3} more
                  </p>
                )}
              </div>
              
              {/* Show day after if tomorrow is also completed */}
              {tomorrowCompleted && dayAfter && (
                <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-border">
                  <p className="text-[11px] md:text-xs text-muted-foreground">
                    <span className="font-medium">Then:</span> {dayAfter.title} ({dayAfter.hours}h, {dayAfter.tasks.length} tasks)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* All Done Message */}
          {todayCompleted && !tomorrow && (
            <div className="p-3 md:p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h4 className="font-semibold text-sm text-green-500">All Done for This Week!</h4>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Great job! You&apos;ve completed all tasks for this week.
              </p>
            </div>
          )}

          {/* View Full Schedule */}
          <Link
            href="/roadmap"
            className="inline-flex items-center justify-center w-full h-10 md:h-11 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Calendar className="mr-2 h-4 w-4" />
            View Full Roadmap
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
