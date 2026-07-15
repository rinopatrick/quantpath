'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb,
  CheckCircle,
  RotateCcw,
  DollarSign,
  Code,
  TrendingUp
} from 'lucide-react';
import interviewPrepData from '@/data/interview-prep.json';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  DollarSign,
  Code,
  Brain,
};

export default function InterviewPage() {
  const [selectedCategory, setSelectedCategory] = useState('probability');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [showHints, setShowHints] = useState<Set<string>>(new Set());
  const [mastered, setMastered] = useState<Set<string>>(new Set());

  const selectedCategoryData = interviewPrepData.categories.find((c) => c.id === selectedCategory);

  const toggleQuestion = (id: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedQuestions(newExpanded);
  };

  const toggleHint = (id: string) => {
    const newHints = new Set(showHints);
    if (newHints.has(id)) {
      newHints.delete(id);
    } else {
      newHints.add(id);
    }
    setShowHints(newHints);
  };

  const toggleMastered = (id: string) => {
    const newMastered = new Set(mastered);
    if (newMastered.has(id)) {
      newMastered.delete(id);
    } else {
      newMastered.add(id);
    }
    setMastered(newMastered);
  };

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-800 p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Interview Prep</h1>
              <p className="text-purple-100 text-sm">Common quant interview questions with answers</p>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              <CheckCircle className="h-3 w-3 mr-1" />
              {mastered.size} Mastered
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white/80 border-0">
              {interviewPrepData.categories.reduce((sum, c) => sum + c.questions.length, 0)} Total
            </Badge>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {interviewPrepData.categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Brain;
          const catMastered = cat.questions.filter((q) => mastered.has(`${cat.id}-${q.question}`)).length;
          return (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon className="h-4 w-4" />
              {cat.title}
              <Badge variant="secondary" className="ml-1 text-xs">
                {catMastered}/{cat.questions.length}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Questions */}
      {selectedCategoryData && (
        <div className="space-y-4">
          {selectedCategoryData.questions.map((q, index) => {
            const questionId = `${selectedCategory}-${q.question}`;
            const isExpanded = expandedQuestions.has(questionId);
            const isHintShown = showHints.has(questionId);
            const isMastered = mastered.has(questionId);

            return (
              <Card 
                key={index} 
                className={`card-hover ${isMastered ? 'border-green-500/20 bg-green-500/5' : ''}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMastered(questionId)}
                      className={`flex-shrink-0 h-8 w-8 p-0 ${
                        isMastered ? 'text-green-500' : 'text-muted-foreground'
                      }`}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                      <CardTitle className="text-base font-bold cursor-pointer" onClick={() => toggleQuestion(questionId)}>
                        {q.question}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleQuestion(questionId)}
                      className="flex-shrink-0 h-8 w-8 p-0"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent>
                    <div className="space-y-4">
                      {/* Hint */}
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleHint(questionId)}
                          className="text-yellow-500 hover:text-yellow-600 p-0 h-auto"
                        >
                          <Lightbulb className="h-4 w-4 mr-2" />
                          {isHintShown ? 'Hide Hint' : 'Show Hint'}
                        </Button>
                        {isHintShown && (
                          <p className="text-sm text-muted-foreground mt-2 p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
                            {q.hint}
                          </p>
                        )}
                      </div>

                      {/* Answer */}
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium text-foreground">
                          <strong>Answer:</strong> {q.answer}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
