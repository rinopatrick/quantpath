'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, Target } from 'lucide-react';

interface Milestone {
  week: number;
  title: string;
  completed: boolean;
  current: boolean;
}

interface WeeklyProgressProps {
  currentWeek: number;
  totalWeeks: number;
  milestones: Milestone[];
}

export function WeeklyProgress({ currentWeek, totalWeeks, milestones }: WeeklyProgressProps) {
  const progress = (currentWeek / totalWeeks) * 100;

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg text-white">24-Week Learning Path</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Overall Progress</span>
              <span className="text-sm font-medium text-white">{currentWeek} / {totalWeeks} weeks</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Current Week */}
          <div className="p-4 rounded-lg bg-blue-900/30 border border-blue-800">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Current Week</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">Week {currentWeek}</p>
            <p className="text-sm text-slate-400 mt-1">
              {currentWeek <= 4 && "Python & Math Fundamentals"}
              {currentWeek > 4 && currentWeek <= 8 && "Finance & Statistics"}
              {currentWeek > 8 && currentWeek <= 12 && "Data Analysis & ML Basics"}
              {currentWeek > 12 && currentWeek <= 16 && "Derivatives & Advanced Topics"}
              {currentWeek > 16 && currentWeek <= 20 && "Deep Learning & Advanced Projects"}
              {currentWeek > 20 && "Competitions & Job Applications"}
            </p>
          </div>

          {/* Milestones */}
          <div className="space-y-3">
            {milestones.map((milestone) => (
              <div 
                key={milestone.week}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  milestone.current 
                    ? 'bg-blue-900/30 border border-blue-800' 
                    : milestone.completed 
                      ? 'bg-green-900/20 border border-green-800' 
                      : 'bg-slate-800 border border-slate-700'
                }`}
              >
                <div className={`p-1 rounded-full ${
                  milestone.completed 
                    ? 'text-green-400' 
                    : milestone.current 
                      ? 'text-blue-400' 
                      : 'text-slate-500'
                }`}>
                  {milestone.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Target className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      Week {milestone.week}
                    </span>
                    {milestone.current && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{milestone.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* View Details */}
          <Link 
            href="/roadmap"
            className="inline-flex items-center justify-center w-full h-8 px-3 text-sm font-medium border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Calendar className="mr-2 h-4 w-4" />
            View Full Roadmap
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
