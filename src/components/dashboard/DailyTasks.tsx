'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

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
}

interface DailyTasksProps {
  weekSchedule: WeekSchedule | undefined;
  completedTasks: string[];
  onToggleTask: (taskId: string) => void;
  currentDay: number;
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

export function DailyTasks({ weekSchedule, completedTasks, onToggleTask, currentDay }: DailyTasksProps) {
  const [selectedDay, setSelectedDay] = useState(currentDay);

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

  const today = weekSchedule.days.find((d) => d.day === selectedDay);
  const tomorrow = weekSchedule.days.find((d) => d.day === selectedDay + 1);
  
  const todayCompleted = today?.tasks.every((t) => completedTasks.includes(t.id)) || false;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Daily Schedule - Week {weekSchedule.week}
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Day {selectedDay} of 7
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {weekSchedule.days.map((day) => {
              const dayCompleted = day.tasks.every((t) => completedTasks.includes(t.id));
              const isToday = day.day === currentDay;
              const isSelected = day.day === selectedDay;
              
              return (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(day.day)}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : isToday
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : dayCompleted
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <span className="text-[10px]">Day</span>
                  <span className="font-bold">{day.day}</span>
                </button>
              );
            })}
          </div>

          {/* Today's Title */}
          {today && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10">
              <h3 className="font-bold text-foreground text-lg">{today.title}</h3>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {today.hours} hours
                </span>
                <span className="text-sm text-muted-foreground">
                  {today.tasks.length} tasks
                </span>
                {todayCompleted && (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Tasks List */}
          {today && (
            <div className="space-y-3">
              {today.tasks.map((task, index) => {
                const isCompleted = completedTasks.includes(task.id);
                const Icon = typeIcons[task.type] || Circle;
                const colorClass = typeColors[task.type] || 'bg-gray-500/10 text-gray-500';

                return (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                      isCompleted 
                        ? 'bg-green-500/5 border-green-500/20' 
                        : 'bg-card border-border hover:border-primary/20'
                    }`}
                  >
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-muted-foreground hover:border-primary'
                      }`}
                    >
                      {isCompleted && <CheckCircle className="h-4 w-4" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className={`font-semibold text-sm ${isCompleted ? 'text-green-500 line-through' : 'text-foreground'}`}>
                            {index + 1}. {task.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                        </div>
                        <div className={`flex-shrink-0 px-2 py-1 rounded-md text-xs font-medium ${colorClass}`}>
                          {task.type}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2">
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
                            Open Resource
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tomorrow Preview */}
          {todayCompleted && tomorrow && (
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-sm text-foreground">Tomorrow: {tomorrow.title}</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {tomorrow.hours} hours • {tomorrow.tasks.length} tasks
              </p>
              <div className="space-y-1">
                {tomorrow.tasks.slice(0, 3).map((task) => (
                  <p key={task.id} className="text-xs text-muted-foreground">
                    • {task.title}
                  </p>
                ))}
                {tomorrow.tasks.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{tomorrow.tasks.length - 3} more tasks
                  </p>
                )}
              </div>
            </div>
          )}

          {/* View Full Schedule */}
          <Link
            href="/roadmap"
            className="inline-flex items-center justify-center w-full h-10 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Calendar className="mr-2 h-4 w-4" />
            View Full Roadmap
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
