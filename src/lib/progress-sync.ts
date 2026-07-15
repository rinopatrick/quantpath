import { supabase } from '@/lib/supabase';

export interface ProgressData {
  resourcesCompleted: string[];
  projectsCompleted: string[];
  competitions: Record<string, string>;
  currentWeek: number;
  completedTasks: string[];
  startDate: string;
  skills: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  activeDays: string[];
  totalStudyMinutes: number;
}

const STORAGE_KEY = 'quantpath-progress';

export function getLocalProgress(): ProgressData | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

export function saveLocalProgress(data: ProgressData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function loadServerProgress(userId: string): Promise<ProgressData | null> {
  const { data, error } = await supabase
    .from('progress')
    .select('data')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return data.data as ProgressData;
}

export async function saveServerProgress(userId: string, data: ProgressData): Promise<boolean> {
  const { error } = await supabase
    .from('progress')
    .upsert(
      { user_id: userId, data, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );

  return !error;
}

export async function syncProgress(userId: string): Promise<ProgressData> {
  const local = getLocalProgress();
  const server = await loadServerProgress(userId);

  if (!local && !server) {
    const empty: ProgressData = {
      resourcesCompleted: [],
      projectsCompleted: [],
      competitions: {},
      currentWeek: 1,
      completedTasks: [],
      startDate: new Date().toISOString().split('T')[0],
      skills: {},
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      activeDays: [],
      totalStudyMinutes: 0,
    };
    saveLocalProgress(empty);
    await saveServerProgress(userId, empty);
    return empty;
  }

  if (!server && local) {
    await saveServerProgress(userId, local);
    return local;
  }

  if (server && !local) {
    saveLocalProgress(server);
    return server;
  }

  if (local && server) {
    const localTasks = new Set(local.completedTasks);
    const serverTasks = new Set(server.completedTasks);
    const mergedTasks = [...new Set([...local.completedTasks, ...server.completedTasks])];

    const mergedActiveDays = [...new Set([...local.activeDays, ...server.activeDays])];

    const merged: ProgressData = {
      resourcesCompleted: [...new Set([...local.resourcesCompleted, ...server.resourcesCompleted])],
      projectsCompleted: [...new Set([...local.projectsCompleted, ...server.projectsCompleted])],
      competitions: { ...server.competitions, ...local.competitions },
      currentWeek: Math.max(local.currentWeek, server.currentWeek),
      completedTasks: mergedTasks,
      startDate: local.startDate || server.startDate,
      skills: mergeSkills(local.skills, server.skills),
      currentStreak: Math.max(local.currentStreak, server.currentStreak),
      longestStreak: Math.max(local.longestStreak, server.longestStreak),
      lastActiveDate: local.lastActiveDate > server.lastActiveDate ? local.lastActiveDate : server.lastActiveDate,
      activeDays: mergedActiveDays,
      totalStudyMinutes: Math.max(local.totalStudyMinutes, server.totalStudyMinutes),
    };

    saveLocalProgress(merged);
    await saveServerProgress(userId, merged);
    return merged;
  }

  return local!;
}

function mergeSkills(local: Record<string, number>, server: Record<string, number>): Record<string, number> {
  const merged: Record<string, number> = {};
  const allKeys = new Set([...Object.keys(local), ...Object.keys(server)]);
  for (const key of allKeys) {
    merged[key] = Math.max(local[key] || 0, server[key] || 0);
  }
  return merged;
}
