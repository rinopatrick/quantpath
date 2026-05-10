'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ExternalLink, 
  Clock, 
  BookOpen, 
  Video, 
  Code, 
  Database,
  Wrench,
  FileText,
  Zap,
  Lightbulb
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  url: string;
  type: string;
  difficulty: string;
  skills: string[];
  estimatedHours: number;
  free: boolean;
  description: string;
  actionSteps: string[];
  nuclearRelevance: string;
  specificLinks: Record<string, string | undefined>;
}

interface ResourceCardProps {
  resource: Resource;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  course: BookOpen,
  video: Video,
  tutorial: Code,
  documentation: FileText,
  interactive: Zap,
  practice: Code,
  api: Database,
  tool: Wrench,
  reference: FileText,
  article: FileText,
  book: BookOpen,
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-600',
  intermediate: 'bg-yellow-600',
  advanced: 'bg-red-600',
};

export function ResourceCard({ resource, isCompleted, onToggleComplete }: ResourceCardProps) {
  const Icon = typeIcons[resource.type] || BookOpen;

  return (
    <Card className={`bg-slate-900 border-slate-800 ${isCompleted ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={isCompleted}
              onCheckedChange={() => onToggleComplete(resource.id)}
              className="border-slate-600"
            />
            <Icon className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex gap-2">
            <Badge 
              variant="secondary" 
              className={difficultyColors[resource.difficulty]}
            >
              {resource.difficulty}
            </Badge>
            <Badge variant="outline" className="text-slate-400 border-slate-600">
              {resource.type}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-sm text-white mt-2">{resource.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-slate-400 mb-3">{resource.description}</p>
        
        <div className="space-y-3">
          {/* Skills */}
          <div className="flex flex-wrap gap-1">
            {resource.skills.map((skill) => (
              <Badge 
                key={skill} 
                variant="secondary" 
                className="bg-slate-800 text-slate-300 text-xs"
              >
                {skill}
              </Badge>
            ))}
          </div>

          {/* Time */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            <span>{resource.estimatedHours} hours</span>
          </div>

          {/* Nuclear Relevance */}
          {resource.nuclearRelevance && (
            <div className="p-2 rounded bg-blue-900/30 border border-blue-800">
              <p className="text-xs text-blue-400 flex items-center gap-1">
                <Lightbulb className="h-3 w-3" />
                Nuclear Relevance: {resource.nuclearRelevance}
              </p>
            </div>
          )}

          {/* Action Steps */}
          {resource.actionSteps.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400">Action Steps:</p>
              <ul className="text-xs text-slate-500 space-y-1">
                {resource.actionSteps.slice(0, 3).map((step, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-slate-600">•</span>
                    <span>{step}</span>
                  </li>
                ))}
                {resource.actionSteps.length > 3 && (
                  <li className="text-slate-600">+{resource.actionSteps.length - 3} more steps</li>
                )}
              </ul>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-2">
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center flex-1 h-8 px-3 text-sm font-medium border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open Resource
            </a>
          </div>

          {/* Specific Links */}
          {Object.keys(resource.specificLinks).length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400">Quick Links:</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(resource.specificLinks).map(([key, url]) => (
                  <a 
                    key={key}
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center h-7 px-2.5 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {key}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
