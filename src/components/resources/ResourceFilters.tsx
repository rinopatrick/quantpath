'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

interface ResourceFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: string;
  onTypeChange: (type: string | null) => void;
  difficultyFilter: string;
  onDifficultyChange: (difficulty: string | null) => void;
  skillFilter: string;
  onSkillChange: (skill: string | null) => void;
  showNuclearOnly: boolean;
  onNuclearOnlyChange: (show: boolean) => void;
  onClearFilters: () => void;
}

export function ResourceFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  difficultyFilter,
  onDifficultyChange,
  skillFilter,
  onSkillChange,
  showNuclearOnly,
  onNuclearOnlyChange,
  onClearFilters,
}: ResourceFiltersProps) {
  const hasFilters = searchQuery || typeFilter !== 'all' || difficultyFilter !== 'all' || 
                     skillFilter !== 'all' || showNuclearOnly;

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          {hasFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="text-xs text-slate-400 hover:text-white"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 bg-slate-800 border-slate-700 text-white"
          />
        </div>

        {/* Type Filter */}
        <div>
          <label className="text-xs font-medium text-slate-400 mb-1 block">Type</label>
          <Select value={typeFilter} onValueChange={onTypeChange}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="book">Book</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="tutorial">Tutorial</SelectItem>
              <SelectItem value="documentation">Documentation</SelectItem>
              <SelectItem value="interactive">Interactive</SelectItem>
              <SelectItem value="practice">Practice</SelectItem>
              <SelectItem value="api">API</SelectItem>
              <SelectItem value="tool">Tool</SelectItem>
              <SelectItem value="reference">Reference</SelectItem>
              <SelectItem value="article">Article</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="text-xs font-medium text-slate-400 mb-1 block">Difficulty</label>
          <Select value={difficultyFilter} onValueChange={onDifficultyChange}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Skill Filter */}
        <div>
          <label className="text-xs font-medium text-slate-400 mb-1 block">Skill</label>
          <Select value={skillFilter} onValueChange={onSkillChange}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="All Skills" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Skills</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="linear-algebra">Linear Algebra</SelectItem>
              <SelectItem value="calculus">Calculus</SelectItem>
              <SelectItem value="probability">Probability</SelectItem>
              <SelectItem value="statistics">Statistics</SelectItem>
              <SelectItem value="financial-markets">Financial Markets</SelectItem>
              <SelectItem value="supervised-learning">Machine Learning</SelectItem>
              <SelectItem value="deep-learning">Deep Learning</SelectItem>
              <SelectItem value="pandas-numpy">Pandas/NumPy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Nuclear Only */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="nuclear-only"
            checked={showNuclearOnly}
            onChange={(e) => onNuclearOnlyChange(e.target.checked)}
            className="rounded border-slate-600"
          />
          <label htmlFor="nuclear-only" className="text-xs text-slate-400">
            Nuclear Relevant Only
          </label>
        </div>

        {/* Active Filters */}
        {hasFilters && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Active Filters:</p>
            <div className="flex flex-wrap gap-1">
              {searchQuery && (
                <Badge variant="secondary" className="bg-slate-800 text-slate-300 text-xs">
                  Search: {searchQuery}
                </Badge>
              )}
              {typeFilter !== 'all' && (
                <Badge variant="secondary" className="bg-slate-800 text-slate-300 text-xs">
                  Type: {typeFilter}
                </Badge>
              )}
              {difficultyFilter !== 'all' && (
                <Badge variant="secondary" className="bg-slate-800 text-slate-300 text-xs">
                  Level: {difficultyFilter}
                </Badge>
              )}
              {skillFilter !== 'all' && (
                <Badge variant="secondary" className="bg-slate-800 text-slate-300 text-xs">
                  Skill: {skillFilter}
                </Badge>
              )}
              {showNuclearOnly && (
                <Badge variant="secondary" className="bg-blue-900 text-blue-300 text-xs">
                  Nuclear Only
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
