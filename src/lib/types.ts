export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type ResourceType = 'course' | 'book' | 'video' | 'tutorial' | 'documentation' | 'interactive' | 'practice' | 'api' | 'tool' | 'reference' | 'article';

export interface Skill {
  id: string;
  name: string;
  difficulty: Difficulty;
  estimatedHours: number;
  prerequisites: string[];
  nuclearStrength: boolean;
  description: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: Skill[];
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  difficulty: Difficulty;
  skills: string[];
  estimatedHours: number;
  free: boolean;
  description: string;
  actionSteps: string[];
  nuclearRelevance: string;
  specificLinks: Record<string, string>;
}

export interface Project {
  id: string;
  title: string;
  difficulty: Difficulty;
  cvImpact: number;
  skills: string[];
  estimatedHours: number;
  description: string;
  actionSteps: string[];
  starterResources: string[];
  nuclearNiche: boolean;
  githubTemplate: string | null;
}

export interface Competition {
  id: string;
  name: string;
  organizer: string;
  url: string;
  frequency: string;
  difficulty: Difficulty;
  prize: string;
  deadline: string;
  description: string;
  skills: string[];
  timeCommitment: string;
  registrationOpen: boolean;
  status: 'upcoming' | 'active' | 'completed';
}

export interface Milestone {
  week: number;
  title: string;
  description: string;
  skills: string[];
  resources: string[];
  projects: string[];
  competitions: string[];
}

export interface WeeklySchedule {
  week: number;
  focus: string;
  tasks: string[];
  hours: number;
}

export interface UserProgress {
  skills: Record<string, number>;
  completedResources: string[];
  completedProjects: string[];
  competitions: Record<string, 'registered' | 'completed' | 'interested'>;
  currentWeek: number;
  startDate: string;
}

export interface AIProvider {
  name: string;
  apiKey: string;
  baseUrl: string;
  model: string;
}
