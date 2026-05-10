'use client';

import { useState, useEffect } from 'react';
import { CompetitionCard } from '@/components/competitions/CompetitionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Trophy, 
  Filter, 
  Calendar,
  Clock,
  DollarSign
} from 'lucide-react';
import competitionsData from '@/data/competitions.json';

export default function CompetitionsPage() {
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [competitions, setCompetitions] = useState<Record<string, 'registered' | 'completed' | 'interested'>>({});

  // Load competitions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quantpath-progress');
    if (saved) {
      const progress = JSON.parse(saved);
      setCompetitions(progress.competitions || {});
    }
  }, []);

  // Save competitions to localStorage
  const handleStatusChange = (id: string, status: 'registered' | 'completed' | 'interested' | null) => {
    const newCompetitions = { ...competitions };
    if (status === null) {
      delete newCompetitions[id];
    } else {
      newCompetitions[id] = status;
    }
    
    setCompetitions(newCompetitions);
    
    const saved = localStorage.getItem('quantpath-progress');
    const progress = saved ? JSON.parse(saved) : {};
    progress.competitions = newCompetitions;
    localStorage.setItem('quantpath-progress', JSON.stringify(progress));
  };

  const clearFilters = () => {
    setDifficultyFilter('all');
    setStatusFilter('all');
  };

  // Filter competitions
  const filteredCompetitions = competitionsData.competitions.filter((competition) => {
    // Difficulty filter
    if (difficultyFilter !== 'all' && competition.difficulty !== difficultyFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all') {
      const compStatus = competitions[competition.id];
      if (statusFilter === 'registered' && compStatus !== 'registered') {
        return false;
      }
      if (statusFilter === 'completed' && compStatus !== 'completed') {
        return false;
      }
      if (statusFilter === 'interested' && compStatus !== 'interested') {
        return false;
      }
      if (statusFilter === 'not-started' && compStatus) {
        return false;
      }
    }

    return true;
  });

  const hasFilters = difficultyFilter !== 'all' || statusFilter !== 'all';

  const registeredCount = Object.values(competitions).filter((s) => s === 'registered').length;
  const completedCount = Object.values(competitions).filter((s) => s === 'completed').length;
  const interestedCount = Object.values(competitions).filter((s) => s === 'interested').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg bg-gradient-to-r from-blue-900 to-slate-900 border border-blue-800">
        <h1 className="text-2xl font-bold text-white">Competition Tracker</h1>
        <p className="text-slate-300 mt-2">
          Track quantitative finance competitions. Mark competitions as interested, registered, or completed.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{competitionsData.competitions.length}</p>
                <p className="text-xs text-slate-400">Total Competitions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{registeredCount}</p>
                <p className="text-xs text-slate-400">Registered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{completedCount}</p>
                <p className="text-xs text-slate-400">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">{interestedCount}</p>
                <p className="text-xs text-slate-400">Interested</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
                onClick={clearFilters}
                className="text-xs text-slate-400 hover:text-white"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Difficulty Filter */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Difficulty</label>
              <Select value={difficultyFilter} onValueChange={(value) => setDifficultyFilter(value || 'all')}>
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

            {/* Status Filter */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Status</label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || 'all')}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="interested">Interested</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompetitions.map((competition) => (
          <CompetitionCard
            key={competition.id}
            competition={competition}
            status={competitions[competition.id] || null}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredCompetitions.length === 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-8 text-center">
            <Trophy className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No competitions found</h3>
            <p className="text-sm text-slate-400 mb-4">
              Try adjusting your filters.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
