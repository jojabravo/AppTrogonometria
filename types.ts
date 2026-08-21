export type Screen = 'welcome' | 'menu' | 'module1' | 'triangles' | 'trig-ratios' | 'sine-law' | 'cosine-law' | 'final';

export interface Module {
  id: string;
  title: string;
  isLocked: boolean;
  description: string;
  isCompleted?: boolean;
  progressPercent?: number;
  isNextToUnlock?: boolean;
  unlockRequirement?: string;
  submoduleCount?: number;
}

export type AngleType = 'nulo' | 'agudo' | 'recto' | 'obtuso' | 'llano' | 'reflejo' | 'completo';

export interface CalculationSteps {
  input: string;
  operation: string;
  result: string;
  decimal: number;
}