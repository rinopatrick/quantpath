'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Lightbulb, Zap } from 'lucide-react';

interface Recommendation {
  type: 'resource' | 'project' | 'skill';
  title: string;
  description: string;
  href: string;
  priority: 'high' | 'medium' | 'low';
}

interface RecommendedNextProps {
  recommendations: Recommendation[];
}

const priorityColors = {
  high: 'bg-red-600',
  medium: 'bg-yellow-600',
  low: 'bg-green-600',
};

const typeIcons = {
  resource: BookOpen,
  project: Lightbulb,
  skill: Zap,
};

export function RecommendedNext({ recommendations }: RecommendedNextProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg text-white">Recommended Next Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.slice(0, 3).map((rec, index) => {
            const Icon = typeIcons[rec.type];
            return (
              <div 
                key={index}
                className="p-4 rounded-lg bg-slate-800 border border-slate-700"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-slate-700">
                    <Icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white text-sm">{rec.title}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`${priorityColors[rec.priority]} text-white text-xs`}
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{rec.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Link 
                    href={rec.href}
                    className="inline-flex items-center h-7 px-2.5 text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Start Learning
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
