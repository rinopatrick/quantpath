'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  Calculator,
  CheckCircle, 
  Circle,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Filter
} from 'lucide-react';
import practiceData from '@/data/practice-problems.json';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

type Difficulty = 'easy' | 'medium' | 'hard';
type Status = 'not-started' | 'solved' | 'review';

const difficultyColors: Record<Difficulty, string> = {
  easy: 'bg-green-500/10 text-green-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  hard: 'bg-red-500/10 text-red-500',
};

const statusIcons: Record<Status, typeof CheckCircle> = {
  'not-started': Circle,
  'solved': CheckCircle,
  'review': RotateCcw,
};

const statusColors: Record<Status, string> = {
  'not-started': 'text-muted-foreground',
  'solved': 'text-green-500',
  'review': 'text-yellow-500',
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Brain,
  Calculator,
};

export default function PracticePage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('probability');
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);
  const [problemStatus, setProblemStatus] = useState<Record<string, Status>>({});
  const [problemNotes, setProblemNotes] = useState<Record<string, string>>({});
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');

  async function loadProgress() {
    if (!user) return;
    const { data } = await supabase
      .from('practice_progress')
      .select('status, notes')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProblemStatus(data.status || {});
      setProblemNotes(data.notes || {});
    }
  }

  useEffect(() => {
    if (user) {
      loadProgress();
    } else {
      const saved = localStorage.getItem('quantpath-practice');
      if (saved) {
        const data = JSON.parse(saved);
        setProblemStatus(data.status || {});
        setProblemNotes(data.notes || {});
      }
    }
  }, [user]);

  const saveProgress = async (status: Record<string, Status>, notes: Record<string, string>) => {
    localStorage.setItem('quantpath-practice', JSON.stringify({ status, notes }));
    if (user) {
      await supabase
        .from('practice_progress')
        .upsert(
          { user_id: user.id, status, notes, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );
    }
  };

  const toggleProblemStatus = (problemId: string) => {
    const current = problemStatus[problemId] || 'not-started';
    const next: Status = current === 'not-started' ? 'solved' : current === 'solved' ? 'review' : 'not-started';
    const newStatus = { ...problemStatus, [problemId]: next };
    setProblemStatus(newStatus);
    saveProgress(newStatus, problemNotes);
  };

  const updateNote = (problemId: string, note: string) => {
    const newNotes = { ...problemNotes, [problemId]: note };
    setProblemNotes(newNotes);
    saveProgress(problemStatus, newNotes);
  };

  const selectedCategoryData = practiceData.categories.find((c) => c.id === selectedCategory);

  const filteredProblems = selectedCategoryData?.problems.filter((p) => {
    if (difficultyFilter !== 'all' && p.difficulty !== difficultyFilter) return false;
    const status = problemStatus[p.id] || 'not-started';
    if (statusFilter !== 'all' && status !== statusFilter) return false;
    return true;
  }) || [];

  const getCategoryStats = (categoryId: string) => {
    const cat = practiceData.categories.find((c) => c.id === categoryId);
    if (!cat) return { total: 0, solved: 0, review: 0 };
    const total = cat.problems.length;
    const solved = cat.problems.filter((p) => problemStatus[p.id] === 'solved').length;
    const review = cat.problems.filter((p) => problemStatus[p.id] === 'review').length;
    return { total, solved, review };
  };

  const totalStats = practiceData.categories.reduce(
    (acc, cat) => {
      const stats = getCategoryStats(cat.id);
      return {
        total: acc.total + stats.total,
        solved: acc.solved + stats.solved,
        review: acc.review + stats.review,
      };
    },
    { total: 0, solved: 0, review: 0 }
  );

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 via-red-700 to-pink-800 p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Practice Tracker</h1>
              <p className="text-orange-100 text-sm">Track your brainteaser and numerical problem solving progress</p>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Badge variant="secondary" className="bg-green-500/20 text-white border-0">
              <CheckCircle className="h-3 w-3 mr-1" />
              {totalStats.solved} Solved
            </Badge>
            <Badge variant="secondary" className="bg-yellow-500/20 text-white border-0">
              <RotateCcw className="h-3 w-3 mr-1" />
              {totalStats.review} Review
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white/80 border-0">
              {totalStats.total} Total
            </Badge>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {practiceData.categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Brain;
          const stats = getCategoryStats(cat.id);
          const isActive = selectedCategory === cat.id;
          return (
            <Button
              key={cat.id}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon className="h-4 w-4" />
              {cat.name}
              <Badge variant="secondary" className="ml-1 text-xs">
                {stats.solved}/{stats.total}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Difficulty:</span>
        </div>
        {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
          <Button
            key={d}
            variant={difficultyFilter === d ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDifficultyFilter(d)}
            className="text-xs capitalize"
          >
            {d === 'all' ? 'All' : d}
          </Button>
        ))}
        <div className="w-px h-6 bg-border mx-2" />
        <span className="text-sm text-muted-foreground">Status:</span>
        {(['all', 'not-started', 'solved', 'review'] as const).map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(s)}
            className="text-xs capitalize"
          >
            {s === 'all' ? 'All' : s === 'not-started' ? 'Unsolved' : s}
          </Button>
        ))}
      </div>

      {/* Problems List */}
      <div className="space-y-3">
        {filteredProblems.map((problem) => {
          const status = problemStatus[problem.id] || 'not-started';
          const isExpanded = expandedProblem === problem.id;
          const StatusIcon = statusIcons[status];
          const diffColor = difficultyColors[problem.difficulty as Difficulty];

          return (
            <Card key={problem.id} className={`card-hover ${status === 'solved' ? 'border-green-500/20 bg-green-500/5' : status === 'review' ? 'border-yellow-500/20 bg-yellow-500/5' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleProblemStatus(problem.id)}
                    className={`flex-shrink-0 h-8 w-8 p-0 ${statusColors[status]}`}
                  >
                    <StatusIcon className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-bold truncate">{problem.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={`text-xs ${diffColor}`}>
                        {problem.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{problem.source}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedProblem(isExpanded ? null : problem.id)}
                    className="flex-shrink-0 h-8 w-8 p-0"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="pt-0">
                  <textarea
                    value={problemNotes[problem.id] || ''}
                    onChange={(e) => updateNote(problem.id, e.target.value)}
                    placeholder="Add notes, solution approach, key insights..."
                    className="w-full p-3 rounded-lg bg-muted/50 border border-border text-sm resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProblems.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No problems match filters</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
