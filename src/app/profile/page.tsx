'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  BookOpen, 
  Lightbulb, 
  Trophy, 
  Calendar,
  Download,
  Upload,
  Sigma,
  Code,
  DollarSign,
  Brain,
  Wrench,
  Clock,
  CheckCircle
} from 'lucide-react';
import skillsData from '@/data/skills.json';
import resourcesData from '@/data/resources.json';
import projectsData from '@/data/projects.json';
import competitionsData from '@/data/competitions.json';
import roadmapData from '@/data/roadmap.json';
import { exportToPDF } from '@/lib/pdf-export';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  math: Sigma,
  programming: Code,
  finance: DollarSign,
  ml: Brain,
  tools: Wrench,
};

const categoryColors: Record<string, string> = {
  math: 'text-blue-400',
  programming: 'text-green-400',
  finance: 'text-yellow-400',
  ml: 'text-purple-400',
  tools: 'text-orange-400',
};

export default function ProfilePage() {
  const [progress, setProgress] = useState({
    resourcesCompleted: [] as string[],
    projectsCompleted: [] as string[],
    competitions: {} as Record<string, string>,
    currentWeek: 1,
    skills: {} as Record<string, number>,
  });

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quantpath-progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  // Export progress
  const exportProgress = () => {
    const data = JSON.stringify(progress, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quantpath-progress.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import progress
  const importProgress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setProgress(imported);
        localStorage.setItem('quantpath-progress', JSON.stringify(imported));
      } catch (error) {
        console.error('Failed to import progress:', error);
      }
    };
    reader.readAsText(file);
  };

  // Calculate skill progress
  const skillProgress = skillsData.categories.map((category) => {
    const totalSkills = category.skills.length;
    const completedSkills = category.skills.filter((s) => 
      progress.skills[s.id] && progress.skills[s.id] >= 80
    ).length;
    return {
      ...category,
      completed: completedSkills,
      total: totalSkills,
      percentage: (completedSkills / totalSkills) * 100,
    };
  });

  // Calculate overall progress
  const totalResources = resourcesData.resources.length;
  const totalProjects = projectsData.projects.length;
  const totalCompetitions = competitionsData.competitions.length;
  const totalWeeks = roadmapData.weeks;

  const resourceProgress = (progress.resourcesCompleted.length / totalResources) * 100;
  const projectProgress = (progress.projectsCompleted.length / totalProjects) * 100;
  const competitionProgress = (Object.keys(progress.competitions).length / totalCompetitions) * 100;
  const weekProgress = (progress.currentWeek / totalWeeks) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg bg-gradient-to-r from-blue-900 to-slate-900 border border-blue-800">
        <h1 className="text-2xl font-bold text-white">Profile & Skills</h1>
        <p className="text-slate-300 mt-2">
          Track your progress and assess your skills. Export your progress for backup or sharing.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={exportProgress} className="border-slate-700 text-slate-400">
          <Download className="h-4 w-4 mr-2" />
          Export Progress
        </Button>
        <div>
          <input
            type="file"
            id="import-progress"
            accept=".json"
            onChange={importProgress}
            className="hidden"
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('import-progress')?.click()}
            className="border-slate-700 text-slate-400"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Progress
          </Button>
        </div>
        <Button 
          variant="outline" 
          onClick={() => exportToPDF(progress)}
          className="border-slate-700 text-slate-400"
        >
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Overall Progress */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{progress.resourcesCompleted.length}</p>
                <p className="text-xs text-slate-400">Resources Completed</p>
              </div>
            </div>
            <Progress value={resourceProgress} className="mt-2" />
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{progress.projectsCompleted.length}</p>
                <p className="text-xs text-slate-400">Projects Completed</p>
              </div>
            </div>
            <Progress value={projectProgress} className="mt-2" />
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{Object.keys(progress.competitions).length}</p>
                <p className="text-xs text-slate-400">Competitions Entered</p>
              </div>
            </div>
            <Progress value={competitionProgress} className="mt-2" />
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">Week {progress.currentWeek}</p>
                <p className="text-xs text-slate-400">Timeline Progress</p>
              </div>
            </div>
            <Progress value={weekProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Skill Progress */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">Skill Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillProgress.map((category) => {
              const Icon = categoryIcons[category.id] || User;
              return (
                <div key={category.id} className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${categoryColors[category.id]}`} />
                      <span className="font-medium text-white">{category.name}</span>
                    </div>
                    <span className="text-sm text-slate-400">
                      {category.completed}/{category.total} skills
                    </span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {category.skills.map((skill) => (
                      <Badge 
                        key={skill.id}
                        variant="secondary" 
                        className={
                          progress.skills[skill.id] && progress.skills[skill.id] >= 80
                            ? 'bg-green-600 text-white'
                            : progress.skills[skill.id] && progress.skills[skill.id] >= 50
                              ? 'bg-yellow-600 text-white'
                              : 'bg-slate-700 text-slate-300'
                        }
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 24-Week Timeline */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">24-Week Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roadmapData.milestones.map((milestone) => (
              <div 
                key={milestone.week}
                className={`p-4 rounded-lg border ${
                  progress.currentWeek >= milestone.week
                    ? 'bg-green-900/20 border-green-800'
                    : 'bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {progress.currentWeek >= milestone.week ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <Clock className="h-5 w-5 text-slate-400" />
                  )}
                  <div>
                    <span className="font-medium text-white">Week {milestone.week}</span>
                    <span className="text-sm text-slate-400 ml-2">{milestone.title}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{milestone.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completed Items */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Completed Resources */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm text-white">Completed Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {progress.resourcesCompleted.length === 0 ? (
                <p className="text-xs text-slate-500">No resources completed yet</p>
              ) : (
                progress.resourcesCompleted.map((id) => {
                  const resource = resourcesData.resources.find((r) => r.id === id);
                  return resource ? (
                    <div key={id} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span>{resource.title}</span>
                    </div>
                  ) : null;
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Completed Projects */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm text-white">Completed Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {progress.projectsCompleted.length === 0 ? (
                <p className="text-xs text-slate-500">No projects completed yet</p>
              ) : (
                progress.projectsCompleted.map((id) => {
                  const project = projectsData.projects.find((p) => p.id === id);
                  return project ? (
                    <div key={id} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span>{project.title}</span>
                    </div>
                  ) : null;
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Competitions */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm text-white">Competitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {Object.keys(progress.competitions).length === 0 ? (
                <p className="text-xs text-slate-500">No competitions entered yet</p>
              ) : (
                Object.entries(progress.competitions).map(([id, status]) => {
                  const competition = competitionsData.competitions.find((c) => c.id === id);
                  return competition ? (
                    <div key={id} className="flex items-center gap-2 text-xs text-slate-400">
                      <Trophy className="h-3 w-3 text-yellow-400" />
                      <span>{competition.name}</span>
                      <Badge 
                        variant="secondary" 
                        className={
                          status === 'completed' ? 'bg-green-600' :
                          status === 'registered' ? 'bg-blue-600' :
                          'bg-yellow-600'
                        }
                      >
                        {status}
                      </Badge>
                    </div>
                  ) : null;
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
