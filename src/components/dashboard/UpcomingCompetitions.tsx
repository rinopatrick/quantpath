'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink, Trophy } from 'lucide-react';

interface Competition {
  id: string;
  name: string;
  organizer: string;
  deadline: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prize: string;
  url: string;
}

interface UpcomingCompetitionsProps {
  competitions: Competition[];
}

const difficultyColors = {
  beginner: 'bg-green-600',
  intermediate: 'bg-yellow-600',
  advanced: 'bg-red-600',
};

export function UpcomingCompetitions({ competitions }: UpcomingCompetitionsProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-white">Upcoming Competitions</CardTitle>
        <Trophy className="h-5 w-5 text-yellow-400" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {competitions.slice(0, 3).map((comp) => (
            <div 
              key={comp.id}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700"
            >
              <div className="flex-1">
                <h4 className="font-medium text-white text-sm">{comp.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{comp.organizer}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    variant="secondary" 
                    className={`${difficultyColors[comp.difficulty]} text-white text-xs`}
                  >
                    {comp.difficulty}
                  </Badge>
                  <span className="text-xs text-slate-500">{comp.prize}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="h-3 w-3" />
                  <span>{comp.deadline}</span>
                </div>
                <Link 
                  href={comp.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-7 w-7 text-blue-400 hover:text-blue-300 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link 
            href="/competitions"
            className="inline-flex items-center justify-center w-full h-8 px-3 text-sm font-medium border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            View All Competitions
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
