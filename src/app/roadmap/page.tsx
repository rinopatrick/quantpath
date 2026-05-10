'use client';

import { SkillTree } from '@/components/roadmap/SkillTree';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sigma, 
  Code, 
  DollarSign, 
  Brain, 
  Wrench,
  Clock,
  Target
} from 'lucide-react';
import skillsData from '@/data/skills.json';

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

export default function RoadmapPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg bg-gradient-to-r from-blue-900 to-slate-900 border border-blue-800">
        <h1 className="text-2xl font-bold text-white">Learning Roadmap</h1>
        <p className="text-slate-300 mt-2">
          Visual skill tree showing your learning path. Click on nodes to update progress.
          Green = completed, Blue = in progress, Gray = not started.
        </p>
      </div>

      {/* Category Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {skillsData.categories.map((category) => {
          const Icon = categoryIcons[category.id] || Target;
          const totalHours = category.skills.reduce((sum, s) => sum + s.estimatedHours, 0);
          const completedSkills = category.skills.filter((s) => s.nuclearStrength).length;
          const progress = (completedSkills / category.skills.length) * 100;

          return (
            <Card key={category.id} className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${categoryColors[category.id]}`} />
                  <CardTitle className="text-sm text-white">{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{category.skills.length} skills</span>
                    <span>{totalHours}h total</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>{completedSkills}/{category.skills.length} completed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Skill Tree */}
      <SkillTree />

      {/* Skills List */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">All Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillsData.categories.map((category) => (
              <div key={category.id}>
                <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                  {(() => {
                    const Icon = categoryIcons[category.id] || Target;
                    return <Icon className={`h-4 w-4 ${categoryColors[category.id]}`} />;
                  })()}
                  {category.name}
                </h3>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {category.skills.map((skill) => (
                    <div 
                      key={skill.id}
                      className="p-3 rounded-lg bg-slate-800 border border-slate-700"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">{skill.name}</span>
                        <Badge 
                          variant="secondary" 
                          className={
                            skill.difficulty === 'beginner' ? 'bg-green-600' :
                            skill.difficulty === 'intermediate' ? 'bg-yellow-600' :
                            'bg-red-600'
                          }
                        >
                          {skill.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{skill.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{skill.estimatedHours}h</span>
                        {skill.nuclearStrength && (
                          <Badge variant="outline" className="text-blue-400 border-blue-400">
                            Nuclear Strength
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
