'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, Sparkles } from 'lucide-react';

interface SkillAssessorProps {
  skillName: string;
  currentLevel: number;
}

export function SkillAssessor({ skillName, currentLevel }: SkillAssessorProps) {
  const [assessment, setAssessment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAssess = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'mimo',
          prompt: `Assess my skill level in ${skillName}. Current self-assessment: ${currentLevel}/100.

Please provide:
1. What skills are needed at different levels (beginner, intermediate, advanced)
2. What I should know at my current level
3. What to learn next to improve
4. Recommended resources for my level
5. Practice exercises to strengthen this skill`,
          context: 'Skill assessment for quant learning',
        }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setAssessment(data.response);
      }
    } catch (err) {
      setError('Failed to get assessment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            AI Skill Assessor
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAssess}
            disabled={loading}
            className="text-purple-400 hover:text-purple-300"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Brain className="h-4 w-4" />
            )}
            <span className="ml-1">Assess</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="bg-slate-700 text-slate-300">
            {skillName}
          </Badge>
          <Badge variant="secondary" className="bg-blue-600 text-white">
            Level: {currentLevel}/100
          </Badge>
        </div>
        {error && (
          <p className="text-xs text-red-400 mb-2">{error}</p>
        )}
        {assessment ? (
          <div className="text-xs text-slate-400 whitespace-pre-wrap">{assessment}</div>
        ) : (
          <p className="text-xs text-slate-500">
            Click &quot;Assess&quot; to get AI-powered skill assessment and recommendations.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
