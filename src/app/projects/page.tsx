'use client';

import { useState, useEffect } from 'react';
import { ProjectCard } from '@/components/projects/ProjectCard';
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
  Lightbulb, 
  Filter, 
  Star,
  Clock,
  Zap
} from 'lucide-react';
import projectsData from '@/data/projects.json';

export default function ProjectsPage() {
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [cvImpactFilter, setCvImpactFilter] = useState('all');
  const [nuclearOnly, setNuclearOnly] = useState(false);
  const [completedProjects, setCompletedProjects] = useState<string[]>([]);

  // Load completed projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quantpath-progress');
    if (saved) {
      const progress = JSON.parse(saved);
      setCompletedProjects(progress.projectsCompleted || []);
    }
  }, []);

  // Save completed projects to localStorage
  const toggleComplete = (id: string) => {
    const newCompleted = completedProjects.includes(id)
      ? completedProjects.filter((p) => p !== id)
      : [...completedProjects, id];
    
    setCompletedProjects(newCompleted);
    
    const saved = localStorage.getItem('quantpath-progress');
    const progress = saved ? JSON.parse(saved) : {};
    progress.projectsCompleted = newCompleted;
    localStorage.setItem('quantpath-progress', JSON.stringify(progress));
  };

  const clearFilters = () => {
    setDifficultyFilter('all');
    setCvImpactFilter('all');
    setNuclearOnly(false);
  };

  // Filter projects
  const filteredProjects = projectsData.projects.filter((project) => {
    // Difficulty filter
    if (difficultyFilter !== 'all' && project.difficulty !== difficultyFilter) {
      return false;
    }

    // CV Impact filter
    if (cvImpactFilter !== 'all') {
      const impact = parseInt(cvImpactFilter);
      if (project.cvImpact < impact) {
        return false;
      }
    }

    // Nuclear only
    if (nuclearOnly && !project.nuclearNiche) {
      return false;
    }

    return true;
  });

  const hasFilters = difficultyFilter !== 'all' || cvImpactFilter !== 'all' || nuclearOnly;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg bg-gradient-to-r from-blue-900 to-slate-900 border border-blue-800">
        <h1 className="text-2xl font-bold text-white">Project Ideas</h1>
        <p className="text-slate-300 mt-2">
          CV-worthy projects to build your quantitative finance portfolio.
          Projects range from beginner to advanced, with nuclear engineering niche options.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{projectsData.projects.length}</p>
                <p className="text-xs text-slate-400">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{completedProjects.length}</p>
                <p className="text-xs text-slate-400">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{filteredProjects.length}</p>
                <p className="text-xs text-slate-400">Filtered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {projectsData.projects.filter((p) => p.nuclearNiche).length}
                </p>
                <p className="text-xs text-slate-400">Nuclear Niche</p>
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
          <div className="grid gap-4 md:grid-cols-3">
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

            {/* CV Impact Filter */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">CV Impact</label>
              <Select value={cvImpactFilter} onValueChange={(value) => setCvImpactFilter(value || 'all')}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="All Impact" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Impact</SelectItem>
                  <SelectItem value="5">5 Stars (Highest)</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Nuclear Only */}
            <div className="flex items-end">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="nuclear-only"
                  checked={nuclearOnly}
                  onChange={(e) => setNuclearOnly(e.target.checked)}
                  className="rounded border-slate-600"
                />
                <label htmlFor="nuclear-only" className="text-xs text-slate-400">
                  Nuclear Niche Only
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isCompleted={completedProjects.includes(project.id)}
            onToggleComplete={toggleComplete}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-8 text-center">
            <Lightbulb className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
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
