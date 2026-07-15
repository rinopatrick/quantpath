'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Lightbulb, 
  Clock, 
  Star, 
  ExternalLink,
  BookOpen,
  Zap
} from 'lucide-react';
import resourcesData from '@/data/resources.json';

interface Project {
  id: string;
  title: string;
  difficulty: string;
  cvImpact: number;
  skills: string[];
  estimatedHours: number;
  description: string;
  actionSteps: string[];
  starterResources: string[];
  nuclearNiche: boolean;
  githubTemplate: string | null;
  portfolioRole: string;
  scheduledWeeks: number[];
}

// Build lookup from resource ID → {title, url}
const resourceMap = new Map<string, { title: string; url: string }>();
resourcesData.resources.forEach((r) => {
  resourceMap.set(r.id, { title: r.title, url: r.url });
});

// Fallback for IDs that don't match resources.json
const fallbackUrls: Record<string, { title: string; url: string }> = {
  'yfinance': { title: 'yfinance', url: 'https://pypi.org/project/yfinance/' },
  'pandas-docs': { title: 'Pandas Docs', url: 'https://pandas.pydata.org/docs/' },
  'scipy-docs': { title: 'SciPy Docs', url: 'https://docs.scipy.org/doc/scipy/' },
  'scikit-learn-docs': { title: 'Scikit-learn Docs', url: 'https://scikit-learn.org/stable/' },
  'matplotlib-docs': { title: 'Matplotlib Docs', url: 'https://matplotlib.org/stable/' },
  'streamlit': { title: 'Streamlit', url: 'https://streamlit.io/' },
  'pytest-docs': { title: 'Pytest Docs', url: 'https://docs.pytest.org/' },
  'openmc': { title: 'OpenMC', url: 'https://docs.openmc.org/' },
  'pymc': { title: 'PyMC', url: 'https://www.pymc.io/' },
  'cvxpy-docs': { title: 'CVXPY Docs', url: 'https://www.cvxpy.org/' },
  'pulp-docs': { title: 'PuLP Docs', url: 'https://coin-or.github.io/pulp/' },
  'quantlib-python': { title: 'QuantLib-Python', url: 'https://quantlib-python-docs.readthedocs.io/' },
  'statsmodels-docs': { title: 'Statsmodels Docs', url: 'https://www.statsmodels.org/stable/' },
  'prophet-docs': { title: 'Prophet Docs', url: 'https://facebook.github.io/prophet/' },
  'hmmlearn-docs': { title: 'hmmlearn Docs', url: 'https://hmmlearn.readthedocs.io/' },
  'learncpp': { title: 'LearnCpp.com', url: 'https://www.learncpp.com/' },
  'boost-asio': { title: 'Boost.Asio', url: 'https://www.boost.org/doc/libs/release/libs/asio/' },
  'websocket-docs': { title: 'WebSocket Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket' },
  'fred-api': { title: 'FRED API', url: 'https://fred.stlouisfed.org/' },
  'eia-api': { title: 'EIA API', url: 'https://www.eia.gov/' },
  'nrc-docs': { title: 'NRC Docs', url: 'https://www.nrc.gov/reading-rm.html' },
  'machinelearningmastery': { title: 'ML Mastery', url: 'https://machinelearningmastery.com/' },
  'quantconnect-tutorials': { title: 'QuantConnect Tutorials', url: 'https://www.quantconnect.com/tutorials/' },
  'avellaneda-stoikov-paper': { title: 'Avellaneda-Stoikov Paper', url: 'https://math.nyu.edu/~avellane/AvellanedaStoikov.pdf' },
  'mit-numerical-methods': { title: 'MIT 18.330 Numerical Methods', url: 'https://ocw.mit.edu/courses/18-330-introduction-to-numerical-analysis-spring-2012/' },
  'mit-2201': { title: 'MIT 22.01 Nuclear Engineering', url: 'https://ocw.mit.edu/courses/22-01-introduction-to-nuclear-engineering-and-ionizing-radiation-fall-2016/' },
  'mit-15433': { title: 'MIT 15.433 Investments', url: 'https://ocw.mit.edu/courses/15-433-investments-spring-2003/' },
  'coursera-ml-ng': { title: 'Coursera ML (Andrew Ng)', url: 'https://www.coursera.org/specializations/machine-learning-introduction' },
  'coursera-fe-1': { title: 'Coursera FE Part 1', url: 'https://www.coursera.org/learn/financial-engineering-1' },
  'coursera-portfolio': { title: 'Coursera Portfolio', url: 'https://www.coursera.org/learn/portfolio-selection-risk-management' },
  'coursera-risk-mgmt': { title: 'Coursera Risk Mgmt', url: 'https://www.coursera.org/learn/financial-risk-management' },
  'coursera-ts-forecasting': { title: 'Coursera Time Series', url: 'https://www.coursera.org/learn/practical-time-series-analysis' },
  'coursera-ts-econometrics': { title: 'Coursera Econometrics', url: 'https://www.coursera.org/learn/econometrics' },
};

function getResourceInfo(id: string): { title: string; url: string | null } {
  const fromResources = resourceMap.get(id);
  if (fromResources) return fromResources;
  const fallback = fallbackUrls[id];
  if (fallback) return fallback;
  return { title: id, url: null };
}

interface ProjectCardProps {
  project: Project;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-600',
  intermediate: 'bg-yellow-600',
  advanced: 'bg-red-600',
};

export function ProjectCard({ project, isCompleted, onToggleComplete }: ProjectCardProps) {
  return (
    <Card className={`bg-slate-900 border-slate-800 ${isCompleted ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={isCompleted}
              onCheckedChange={() => onToggleComplete(project.id)}
              className="border-slate-600"
            />
            <Lightbulb className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Badge variant="outline" className="capitalize border-emerald-500/30 text-emerald-400">
              {project.portfolioRole}
            </Badge>
            <Badge 
              variant="secondary" 
              className={difficultyColors[project.difficulty]}
            >
              {project.difficulty}
            </Badge>
            {project.nuclearNiche && (
              <Badge variant="secondary" className="bg-blue-600">
                Nuclear
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-sm text-white mt-2">{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-slate-400 mb-3">{project.description}</p>
        
        <div className="space-y-3">
          {/* CV Impact */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">CV Impact:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= project.cvImpact 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            <span>{project.estimatedHours} hours</span>
          </div>

          {project.scheduledWeeks.length > 0 && (
            <p className="text-xs text-emerald-400">Scheduled: {project.scheduledWeeks.map((week) => `W${week}`).join(', ')}</p>
          )}

          {/* Skills */}
          <div className="flex flex-wrap gap-1">
            {project.skills.map((skill) => (
              <Badge 
                key={skill} 
                variant="secondary" 
                className="bg-slate-800 text-slate-300 text-xs"
              >
                {skill}
              </Badge>
            ))}
          </div>

          {/* Action Steps */}
          {project.actionSteps.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400">Action Steps:</p>
              <ul className="text-xs text-slate-500 space-y-1">
                {project.actionSteps.slice(0, 3).map((step, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-slate-600">•</span>
                    <span>{step}</span>
                  </li>
                ))}
                {project.actionSteps.length > 3 && (
                  <li className="text-slate-600">+{project.actionSteps.length - 3} more steps</li>
                )}
              </ul>
            </div>
          )}

          {/* Starter Resources */}
          {project.starterResources.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400">Starter Resources:</p>
              <div className="flex flex-wrap gap-1">
                {project.starterResources.map((resource) => {
                  const info = getResourceInfo(resource);
                  return info.url ? (
                    <a
                      key={resource}
                      href={info.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-blue-400 border border-blue-400/30 rounded-md hover:bg-blue-500/10 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {info.title}
                    </a>
                  ) : (
                    <Badge 
                      key={resource} 
                      variant="outline" 
                      className="text-blue-400 border-blue-400 text-xs"
                    >
                      {info.title}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* GitHub Template */}
          {project.githubTemplate && (
            <a 
              href={project.githubTemplate} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full h-8 px-3 text-sm font-medium border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Template
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
