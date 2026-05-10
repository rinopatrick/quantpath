'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Lightbulb, 
  Clock, 
  Star, 
  ExternalLink,
  BookOpen,
  Zap
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  difficulty: string;
  cvImpact: number;
  skills: string[];
  estimatedHours: number;
  description: string;
  actionSteps: string[];
  starterResources: string[];
  nuclearNiche: boolean;
  githubTemplate: string | null;
}

interface ProjectCardProps {
  project: Project;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-600',
  intermediate: 'bg-yellow-600',
  advanced: 'bg-red-600',
};

export function ProjectCard({ project, isCompleted, onToggleComplete }: ProjectCardProps) {
  return (
    <Card className={`bg-slate-900 border-slate-800 ${isCompleted ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={isCompleted}
              onCheckedChange={() => onToggleComplete(project.id)}
              className="border-slate-600"
            />
            <Lightbulb className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="flex gap-2">
            <Badge 
              variant="secondary" 
              className={difficultyColors[project.difficulty]}
            >
              {project.difficulty}
            </Badge>
            {project.nuclearNiche && (
              <Badge variant="secondary" className="bg-blue-600">
                Nuclear
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-sm text-white mt-2">{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-slate-400 mb-3">{project.description}</p>
        
        <div className="space-y-3">
          {/* CV Impact */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">CV Impact:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= project.cvImpact 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            <span>{project.estimatedHours} hours</span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1">
            {project.skills.map((skill) => (
              <Badge 
                key={skill} 
                variant="secondary" 
                className="bg-slate-800 text-slate-300 text-xs"
              >
                {skill}
              </Badge>
            ))}
          </div>

          {/* Action Steps */}
          {project.actionSteps.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400">Action Steps:</p>
              <ul className="text-xs text-slate-500 space-y-1">
                {project.actionSteps.slice(0, 3).map((step, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-slate-600">•</span>
                    <span>{step}</span>
                  </li>
                ))}
                {project.actionSteps.length > 3 && (
                  <li className="text-slate-600">+{project.actionSteps.length - 3} more steps</li>
                )}
              </ul>
            </div>
          )}

          {/* Starter Resources */}
          {project.starterResources.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400">Starter Resources:</p>
              <div className="flex flex-wrap gap-1">
                {project.starterResources.map((resource) => (
                  <Badge 
                    key={resource} 
                    variant="outline" 
                    className="text-blue-400 border-blue-400 text-xs"
                  >
                    {resource}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* GitHub Template */}
          {project.githubTemplate && (
            <a 
              href={project.githubTemplate} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full h-8 px-3 text-sm font-medium border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Template
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
