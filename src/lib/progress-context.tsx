'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import { syncProgress, saveLocalProgress, saveServerProgress, getLocalProgress, ProgressData } from '@/lib/progress-sync';

interface ProgressContextType {
  progress: ProgressData;
  loading: boolean;
  updateProgress: (updater: (prev: ProgressData) => ProgressData) => void;
  skillProgress: Record<string, number>;
}

const defaultProgress: ProgressData = {
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

const ProgressContext = createContext<ProgressContextType>({
  progress: defaultProgress,
  loading: true,
  updateProgress: () => {},
  skillProgress: {},
});

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<ProgressData>(defaultProgress);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (authLoading) return;
      
      let data: ProgressData | null = null;
      
      if (user) {
        try {
          data = await syncProgress(user.id);
        } catch {
          data = getLocalProgress();
        }
      } else {
        data = getLocalProgress();
      }
      
      if (data) {
        setProgress(data);
      } else {
        setProgress(defaultProgress);
        saveLocalProgress(defaultProgress);
      }
      
      setLoading(false);
    };
    
    load();
  }, [user, authLoading]);

  const updateProgress = useCallback((updater: (prev: ProgressData) => ProgressData) => {
    setProgress((prev) => {
      const next = updater(prev);
      saveLocalProgress(next);
      if (user) {
        saveServerProgress(user.id, next);
      }
      return next;
    });
  }, [user]);

  const skillProgress = calculateSkillProgress(progress);

  return (
    <ProgressContext.Provider value={{ progress, loading, updateProgress, skillProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);

function calculateSkillProgress(progress: ProgressData): Record<string, number> {
  // This will be calculated from resources and tasks
  // For now return from progress.skills
  return progress.skills || {};
}
