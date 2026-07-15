'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Code,
  CheckCircle,
  Circle,
  ExternalLink,
  Filter,
  StickyNote,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Trophy,
  Target,
  TrendingUp,
} from 'lucide-react';
import leetcodeData from '@/data/leetcode-problems.json';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

type Difficulty = 'easy' | 'medium' | 'hard';

const difficultyColors: Record<Difficulty, string> = {
  easy: 'bg-green-500/10 text-green-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  hard: 'bg-red-500/10 text-red-500',
};

const categoryColors: Record<string, string> = {
  array: 'bg-blue-500/10 text-blue-500',
  string: 'bg-purple-500/10 text-purple-500',
  'linked-list': 'bg-orange-500/10 text-orange-500',
  tree: 'bg-emerald-500/10 text-emerald-500',
  graph: 'bg-cyan-500/10 text-cyan-500',
  dp: 'bg-pink-500/10 text-pink-500',
  stack: 'bg-amber-500/10 text-amber-500',
  heap: 'bg-rose-500/10 text-rose-500',
  'binary-search': 'bg-teal-500/10 text-teal-500',
  backtracking: 'bg-violet-500/10 text-violet-500',
  matrix: 'bg-sky-500/10 text-sky-500',
  'sliding-window': 'bg-lime-500/10 text-lime-500',
};

const categories = Array.from(new Set(leetcodeData.problems.map((p) => p.category))).sort();

const STORAGE_KEY = 'quantpath-leetcode';

interface LeetCodeProgress {
  solved: Record<string, boolean>;
  notes: Record<string, string>;
}

export default function LeetCodePage() {
  const { user } = useAuth();
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [solvedMap, setSolvedMap] = useState<Record<string, boolean>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);
  const [showSolvedOnly, setShowSolvedOnly] = useState(false);

  async function loadProgress() {
    if (!user) return;
    const { data } = await supabase
      .from('leetcode_progress')
      .select('solved, notes')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setSolvedMap(data.solved || {});
      setNotesMap(data.notes || {});
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const local: LeetCodeProgress = JSON.parse(saved);
        setSolvedMap(local.solved || {});
        setNotesMap(local.notes || {});
      }
    }
  }

  useEffect(() => {
    if (user) {
      loadProgress();
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: LeetCodeProgress = JSON.parse(saved);
        setSolvedMap(data.solved || {});
        setNotesMap(data.notes || {});
      }
    }
  }, [user]);

  const saveProgress = async (solved: Record<string, boolean>, notes: Record<string, string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ solved, notes }));
    if (user) {
      await supabase
        .from('leetcode_progress')
        .upsert(
          { user_id: user.id, solved, notes, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );
    }
  };

  const toggleSolved = (problemId: string) => {
    const newSolved = { ...solvedMap, [problemId]: !solvedMap[problemId] };
    setSolvedMap(newSolved);
    saveProgress(newSolved, notesMap);
  };

  const updateNote = (problemId: string, note: string) => {
    const newNotes = { ...notesMap, [problemId]: note };
    setNotesMap(newNotes);
    saveProgress(solvedMap, newNotes);
  };

  const filteredProblems = leetcodeData.problems.filter((p) => {
    if (difficultyFilter !== 'all' && p.difficulty !== difficultyFilter) return false;
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (showSolvedOnly && !solvedMap[p.id]) return false;
    return true;
  });

  const totalSolved = Object.values(solvedMap).filter(Boolean).length;
  const totalProblems = leetcodeData.problems.length;
  const easySolved = leetcodeData.problems.filter((p) => p.difficulty === 'easy' && solvedMap[p.id]).length;
  const mediumSolved = leetcodeData.problems.filter((p) => p.difficulty === 'medium' && solvedMap[p.id]).length;
  const hardSolved = leetcodeData.problems.filter((p) => p.difficulty === 'hard' && solvedMap[p.id]).length;
  const easyTotal = leetcodeData.problems.filter((p) => p.difficulty === 'easy').length;
  const mediumTotal = leetcodeData.problems.filter((p) => p.difficulty === 'medium').length;
  const hardTotal = leetcodeData.problems.filter((p) => p.difficulty === 'hard').length;
  const progressPercent = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 p-6 md:p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Code className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">LeetCode Tracker</h1>
              <p className="text-teal-100 text-sm">Track your algorithm and data structure problem solving</p>
            </div>
          </div>
          <div className="flex gap-4 mt-4 flex-wrap">
            <Badge variant="secondary" className="bg-green-500/20 text-white border-0">
              <CheckCircle className="h-3 w-3 mr-1" />
              {totalSolved}/{totalProblems} Solved
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white/80 border-0">
              <Trophy className="h-3 w-3 mr-1" />
              {progressPercent}% Complete
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{totalSolved} / {totalProblems}</span>
          </div>
          <Progress value={progressPercent} />
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{easySolved}<span className="text-sm text-muted-foreground font-normal">/{easyTotal}</span></p>
                <p className="text-xs text-muted-foreground">Easy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mediumSolved}<span className="text-sm text-muted-foreground font-normal">/{mediumTotal}</span></p>
                <p className="text-xs text-muted-foreground">Medium</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{hardSolved}<span className="text-sm text-muted-foreground font-normal">/{hardTotal}</span></p>
                <p className="text-xs text-muted-foreground">Hard</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter:</span>
            </div>

            {/* Difficulty Filter */}
            <div className="flex gap-2">
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
            </div>

            <div className="w-px h-6 bg-border hidden sm:block" />

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={categoryFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryFilter('all')}
                className="text-xs"
              >
                All Topics
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={categoryFilter === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter(cat)}
                  className="text-xs capitalize"
                >
                  {cat.replace('-', ' ')}
                </Button>
              ))}
            </div>

            <div className="w-px h-6 bg-border hidden sm:block" />

            {/* Solved Only Toggle */}
            <Button
              variant={showSolvedOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowSolvedOnly(!showSolvedOnly)}
              className="text-xs"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Solved Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Problems List */}
      <div className="space-y-3">
        {filteredProblems.map((problem, index) => {
          const isSolved = !!solvedMap[problem.id];
          const isExpanded = expandedProblem === problem.id;
          const diffColor = difficultyColors[problem.difficulty as Difficulty];
          const catColor = categoryColors[problem.category] || 'bg-gray-500/10 text-gray-500';

          return (
            <Card
              key={problem.id}
              className={`card-hover animate-in stagger-${(index % 7) + 1} ${isSolved ? 'border-green-500/20 bg-green-500/5' : ''}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSolved(problem.id)}
                    className={`flex-shrink-0 h-8 w-8 p-0 ${isSolved ? 'text-green-500' : 'text-muted-foreground'}`}
                  >
                    {isSolved ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                  </Button>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-bold truncate">{problem.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="secondary" className={`text-xs ${diffColor}`}>
                        {problem.difficulty}
                      </Badge>
                      <Badge variant="secondary" className={`text-xs ${catColor}`}>
                        {problem.category.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <a
                      href={problem.leetcodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                      title="Open on LeetCode"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedProblem(isExpanded ? null : problem.id)}
                      className="flex-shrink-0 h-8 w-8 p-0"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 mb-2">
                    <StickyNote className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">Personal Notes</span>
                  </div>
                  <textarea
                    value={notesMap[problem.id] || ''}
                    onChange={(e) => updateNote(problem.id, e.target.value)}
                    placeholder="Add notes, solution approach, time/space complexity..."
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
            <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No problems match filters</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your difficulty or category filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setDifficultyFilter('all');
                setCategoryFilter('all');
                setShowSolvedOnly(false);
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
