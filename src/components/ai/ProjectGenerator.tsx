'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Lightbulb, Sparkles } from 'lucide-react';

interface ProjectGeneratorProps {
  currentSkills: string[];
}

export function ProjectGenerator({ currentSkills }: ProjectGeneratorProps) {
  const [difficulty, setDifficulty] = useState('intermediate');
  const [nuclearNiche, setNuclearNiche] = useState(false);
  const [projectIdea, setProjectIdea] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'deepseek',
          prompt: `Generate a quantitative finance project idea with these requirements:

Skills: ${currentSkills.join(', ')}
Difficulty: ${difficulty}
Nuclear Niche: ${nuclearNiche ? 'Yes - leverage nuclear engineering background' : 'No'}

Please provide:
1. Project title and description
2. Learning objectives
3. Technical implementation steps
4. Expected deliverables
5. CV impact and talking points
6. Resources needed`,
          context: 'Project idea generation for quant portfolio',
        }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setProjectIdea(data.response);
      }
    } catch (err) {
      setError('Failed to generate project idea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            AI Project Generator
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGenerate}
            disabled={loading}
            className="text-yellow-400 hover:text-yellow-300"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="h-4 w-4" />
            )}
            <span className="ml-1">Generate</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Controls */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Difficulty</label>
              <Select value={difficulty} onValueChange={(value) => setDifficulty(value || 'intermediate')}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="nuclear-niche"
                  checked={nuclearNiche}
                  onChange={(e) => setNuclearNiche(e.target.checked)}
                  className="rounded border-slate-600"
                />
                <label htmlFor="nuclear-niche" className="text-xs text-slate-400">
                  Nuclear Niche
                </label>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <p className="text-xs text-slate-400 mb-1">Your Skills:</p>
            <div className="flex flex-wrap gap-1">
              {currentSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          {/* Result */}
          {projectIdea ? (
            <div className="text-xs text-slate-400 whitespace-pre-wrap">{projectIdea}</div>
          ) : (
            <p className="text-xs text-slate-500">
              Click &quot;Generate&quot; to get an AI-powered project idea tailored to your skills.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
