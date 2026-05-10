'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Sparkles } from 'lucide-react';

interface ResourceExplainerProps {
  resourceTitle: string;
  resourceDescription: string;
}

export function ResourceExplainer({ resourceTitle, resourceDescription }: ResourceExplainerProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExplain = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'deepseek',
          prompt: `Explain this learning resource and what I should do with it:

Resource: ${resourceTitle}
Description: ${resourceDescription}

Please provide:
1. What this resource teaches
2. Why it's important for quantitative finance
3. Specific steps to complete it
4. How it connects to nuclear engineering (if applicable)
5. Tips for getting the most out of it`,
          context: 'Resource explanation for quant learning',
        }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setExplanation(data.response);
      }
    } catch (err) {
      setError('Failed to get explanation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            AI Resource Explainer
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExplain}
            disabled={loading}
            className="text-blue-400 hover:text-blue-300"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BookOpen className="h-4 w-4" />
            )}
            <span className="ml-1">Explain</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="text-xs text-red-400 mb-2">{error}</p>
        )}
        {explanation ? (
          <div className="text-xs text-slate-400 whitespace-pre-wrap">{explanation}</div>
        ) : (
          <p className="text-xs text-slate-500">
            Click &quot;Explain&quot; to get AI-powered guidance on this resource.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
