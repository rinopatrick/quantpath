'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  ExternalLink,
  DollarSign,
  Zap
} from 'lucide-react';

interface Competition {
  id: string;
  name: string;
  organizer: string;
  url: string;
  frequency: string;
  difficulty: string;
  prize: string;
  deadline: string;
  description: string;
  skills: string[];
  timeCommitment: string;
  registrationOpen: boolean;
  status: string;
}

interface CompetitionCardProps {
  competition: Competition;
  status: 'registered' | 'completed' | 'interested' | null;
  onStatusChange: (id: string, status: 'registered' | 'completed' | 'interested' | null) => void;
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-600',
  intermediate: 'bg-yellow-600',
  advanced: 'bg-red-600',
};

const statusColors: Record<string, string> = {
  registered: 'bg-blue-600',
  completed: 'bg-green-600',
  interested: 'bg-yellow-600',
};

export function CompetitionCard({ competition, status, onStatusChange }: CompetitionCardProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <CardTitle className="text-sm text-white">{competition.name}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge 
              variant="secondary" 
              className={difficultyColors[competition.difficulty]}
            >
              {competition.difficulty}
            </Badge>
            {status && (
              <Badge 
                variant="secondary" 
                className={statusColors[status]}
              >
                {status}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-1">{competition.organizer}</p>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-slate-400 mb-3">{competition.description}</p>
        
        <div className="space-y-3">
          {/* Prize */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <DollarSign className="h-3 w-3" />
            <span>Prize: {competition.prize}</span>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="h-3 w-3" />
            <span>Deadline: {competition.deadline}</span>
          </div>

          {/* Time Commitment */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            <span>Time: {competition.timeCommitment}</span>
          </div>

          {/* Frequency */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Zap className="h-3 w-3" />
            <span>Frequency: {competition.frequency}</span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1">
            {competition.skills.map((skill) => (
              <Badge 
                key={skill} 
                variant="secondary" 
                className="bg-slate-800 text-slate-300 text-xs"
              >
                {skill}
              </Badge>
            ))}
          </div>

          {/* Registration Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Registration:</span>
            <Badge 
              variant="outline" 
              className={competition.registrationOpen ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'}
            >
              {competition.registrationOpen ? 'Open' : 'Closed'}
            </Badge>
          </div>

          {/* Status Buttons */}
          <div className="flex gap-2">
            <Button 
              variant={status === 'interested' ? 'default' : 'outline'}
              size="sm" 
              className="flex-1 border-slate-700 text-slate-400 hover:text-white"
              onClick={() => onStatusChange(competition.id, status === 'interested' ? null : 'interested')}
            >
              Interested
            </Button>
            <Button 
              variant={status === 'registered' ? 'default' : 'outline'}
              size="sm" 
              className="flex-1 border-slate-700 text-slate-400 hover:text-white"
              onClick={() => onStatusChange(competition.id, status === 'registered' ? null : 'registered')}
            >
              Registered
            </Button>
            <Button 
              variant={status === 'completed' ? 'default' : 'outline'}
              size="sm" 
              className="flex-1 border-slate-700 text-slate-400 hover:text-white"
              onClick={() => onStatusChange(competition.id, status === 'completed' ? null : 'completed')}
            >
              Completed
            </Button>
          </div>

          {/* Visit Link */}
          <a 
            href={competition.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full h-8 px-3 text-sm font-medium border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Visit Competition
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
