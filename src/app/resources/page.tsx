'use client';

import { useState, useEffect } from 'react';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { ResourceFilters } from '@/components/resources/ResourceFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Grid, List } from 'lucide-react';
import resourcesData from '@/data/resources.json';

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [showNuclearOnly, setShowNuclearOnly] = useState(false);
  const [completedResources, setCompletedResources] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load completed resources from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quantpath-progress');
    if (saved) {
      const progress = JSON.parse(saved);
      setCompletedResources(progress.resourcesCompleted || []);
    }
  }, []);

  // Save completed resources to localStorage
  const toggleComplete = (id: string) => {
    const newCompleted = completedResources.includes(id)
      ? completedResources.filter((r) => r !== id)
      : [...completedResources, id];
    
    setCompletedResources(newCompleted);
    
    const saved = localStorage.getItem('quantpath-progress');
    const progress = saved ? JSON.parse(saved) : {};
    progress.resourcesCompleted = newCompleted;
    localStorage.setItem('quantpath-progress', JSON.stringify(progress));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setDifficultyFilter('all');
    setSkillFilter('all');
    setShowNuclearOnly(false);
  };

  const handleTypeChange = (value: string | null) => {
    setTypeFilter(value || 'all');
  };

  const handleDifficultyChange = (value: string | null) => {
    setDifficultyFilter(value || 'all');
  };

  const handleSkillChange = (value: string | null) => {
    setSkillFilter(value || 'all');
  };

  // Filter resources
  const filteredResources = resourcesData.resources.filter((resource) => {
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !resource.title.toLowerCase().includes(query) &&
        !resource.description.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Type filter
    if (typeFilter !== 'all' && resource.type !== typeFilter) {
      return false;
    }

    // Difficulty filter
    if (difficultyFilter !== 'all' && resource.difficulty !== difficultyFilter) {
      return false;
    }

    // Skill filter
    if (skillFilter !== 'all' && !resource.skills.includes(skillFilter)) {
      return false;
    }

    // Nuclear only
    if (showNuclearOnly && !resource.nuclearRelevance) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg bg-gradient-to-r from-blue-900 to-slate-900 border border-blue-800">
        <h1 className="text-2xl font-bold text-white">Resource Library</h1>
        <p className="text-slate-300 mt-2">
          {resourcesData.resources.length} free resources for your quant learning journey.
          Filter by type, difficulty, or skill to find what you need.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{resourcesData.resources.length}</p>
                <p className="text-xs text-slate-400">Total Resources</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{completedResources.length}</p>
                <p className="text-xs text-slate-400">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{filteredResources.length}</p>
                <p className="text-xs text-slate-400">Filtered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {resourcesData.resources.filter((r) => r.nuclearRelevance).length}
                </p>
                <p className="text-xs text-slate-400">Nuclear Relevant</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ResourceFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            typeFilter={typeFilter}
            onTypeChange={handleTypeChange}
            difficultyFilter={difficultyFilter}
            onDifficultyChange={handleDifficultyChange}
            skillFilter={skillFilter}
            onSkillChange={handleSkillChange}
            showNuclearOnly={showNuclearOnly}
            onNuclearOnlyChange={setShowNuclearOnly}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Resources Grid */}
        <div className="lg:col-span-3">
          {/* View Toggle */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-400">
              Showing {filteredResources.length} of {resourcesData.resources.length} resources
            </p>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="text-slate-400"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="text-slate-400"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Resources */}
          <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isCompleted={completedResources.includes(resource.id)}
                onToggleComplete={toggleComplete}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredResources.length === 0 && (
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No resources found</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Try adjusting your filters or search query.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
