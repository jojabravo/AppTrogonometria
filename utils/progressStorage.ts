export interface ModuleProgressData {
  completed: boolean;
  completedAt?: string;
  submodulesCompleted?: (string | number)[];
  percent: number;
  score?: number;
  lastVisited?: string;
}

export interface AppProgress {
  version: number;
  completedModules: string[];
  modules: Record<string, ModuleProgressData>;
  lastActiveModule?: string;
  streakDays: number;
  lastActiveDate?: string;
  totalPoints: number;
}

const STORAGE_KEY = 'trigonometrica_app_progress_v1';

// Sequential order of modules for progressive unlocking
export const MODULE_SEQUENCE = [
  'module1',       // 1. Ángulos (Always unlocked first)
  'triangles',     // 2. Triángulos (Unlocks when module1 completed)
  'trig-ratios',   // 3. Razones Trigonométricas (Unlocks when triangles completed)
  'sine-law',      // 4. Ley del Seno (Unlocks when trig-ratios completed)
  'cosine-law',    // 5. Ley del Coseno (Unlocks when sine-law completed)
  'graphs',        // 6. Gráficas (Coming soon)
  'identities',    // 7. Identidades (Coming soon)
  'equations'      // 8. Ecuaciones (Coming soon)
];

export const AVAILABLE_MODULE_COUNT = 5; // The 5 active interactive modules

const DEFAULT_PROGRESS: AppProgress = {
  version: 1,
  completedModules: [],
  modules: {
    'module1': { completed: false, percent: 0, submodulesCompleted: [] },
    'triangles': { completed: false, percent: 0, submodulesCompleted: [] },
    'trig-ratios': { completed: false, percent: 0, submodulesCompleted: [] },
    'sine-law': { completed: false, percent: 0, submodulesCompleted: [] },
    'cosine-law': { completed: false, percent: 0, submodulesCompleted: [] },
  },
  streakDays: 1,
  totalPoints: 0
};

export const getStoredProgress = (): AppProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as AppProgress;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      modules: {
        ...DEFAULT_PROGRESS.modules,
        ...(parsed.modules || {})
      }
    };
  } catch (e) {
    console.warn('Error reading progress from localStorage:', e);
    return DEFAULT_PROGRESS;
  }
};

export const saveStoredProgress = (progress: AppProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    // Dispatch a custom event so other components or tabs can react immediately
    window.dispatchEvent(new CustomEvent('trigonometrica-progress-updated', { detail: progress }));
  } catch (e) {
    console.warn('Error saving progress to localStorage:', e);
  }
};

export const isModuleUnlocked = (moduleId: string, progress: AppProgress): boolean => {
  // First module is always unlocked
  if (moduleId === 'module1') return true;

  // Upcoming placeholder modules (graphs, identities, equations) are permanently locked for now
  if (['graphs', 'identities', 'equations'].includes(moduleId)) {
    return false;
  }

  const index = MODULE_SEQUENCE.indexOf(moduleId);
  if (index <= 0) return true;

  // The module is unlocked if the immediate previous module in the sequence is completed
  const previousModuleId = MODULE_SEQUENCE[index - 1];
  return progress.completedModules.includes(previousModuleId) || 
         Boolean(progress.modules[previousModuleId]?.completed);
};

export const markModuleComplete = (moduleId: string): AppProgress => {
  const current = getStoredProgress();
  const alreadyCompleted = current.completedModules.includes(moduleId);
  
  const updatedCompletedModules = alreadyCompleted 
    ? current.completedModules 
    : [...current.completedModules, moduleId];

  const now = new Date().toISOString();
  
  const updated: AppProgress = {
    ...current,
    completedModules: updatedCompletedModules,
    modules: {
      ...current.modules,
      [moduleId]: {
        ...(current.modules[moduleId] || { submodulesCompleted: [] }),
        completed: true,
        percent: 100,
        completedAt: current.modules[moduleId]?.completedAt || now,
        lastVisited: now
      }
    },
    totalPoints: current.totalPoints + (alreadyCompleted ? 0 : 100)
  };

  saveStoredProgress(updated);
  return updated;
};

export const updateModuleProgress = (
  moduleId: string, 
  percent: number, 
  submoduleId?: string | number
): AppProgress => {
  const current = getStoredProgress();
  const existing = current.modules[moduleId] || { completed: false, percent: 0, submodulesCompleted: [] };
  
  let subs = existing.submodulesCompleted || [];
  if (submoduleId !== undefined && !subs.includes(submoduleId)) {
    subs = [...subs, submoduleId];
  }

  const isComplete = percent >= 100 || existing.completed;
  const updatedCompletedModules = isComplete && !current.completedModules.includes(moduleId)
    ? [...current.completedModules, moduleId]
    : current.completedModules;

  const updated: AppProgress = {
    ...current,
    completedModules: updatedCompletedModules,
    modules: {
      ...current.modules,
      [moduleId]: {
        ...existing,
        percent: Math.min(100, Math.max(existing.percent, percent)),
        completed: isComplete,
        submodulesCompleted: subs,
        lastVisited: new Date().toISOString()
      }
    }
  };

  saveStoredProgress(updated);
  return updated;
};

export const resetAllProgress = (): AppProgress => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Error clearing localStorage:', e);
  }
  const fresh = { ...DEFAULT_PROGRESS, completedModules: [], modules: { ...DEFAULT_PROGRESS.modules } };
  saveStoredProgress(fresh);
  return fresh;
};
