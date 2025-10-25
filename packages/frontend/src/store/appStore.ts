import { create } from 'zustand';
import type { UIAdaptation, MoodAnalysis } from '../types';

interface AppState {
  // UI State
  theme: UIAdaptation['theme'];
  layout: UIAdaptation['layout'];
  visibleFeatures: string[];
  animations: UIAdaptation['animations'];
  spacing: UIAdaptation['spacing'];
  complexity: UIAdaptation['complexity'];
  
  // Mood & Adaptation
  currentMood: MoodAnalysis | null;
  isAdapting: boolean;
  adaptationReasoning: string;
  
  // Demo modes
  demoMode: 'auto' | 'stress' | 'focus' | 'explorer' | 'relax' | null;
  
  // Actions
  applyAdaptation: (adaptation: UIAdaptation, mood?: MoodAnalysis) => void;
  setDemoMode: (mode: AppState['demoMode']) => void;
  setIsAdapting: (isAdapting: boolean) => void;
  resetToDefault: () => void;
}

const DEFAULT_STATE = {
  theme: 'minimal-light' as const,
  layout: 'grid' as const,
  visibleFeatures: ['dashboard', 'analytics', 'calendar', 'tasks', 'settings'],
  animations: 'normal' as const,
  spacing: 'normal' as const,
  complexity: 'moderate' as const,
  adaptationReasoning: 'Default configuration'
};

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  ...DEFAULT_STATE,
  currentMood: null,
  isAdapting: false,
  demoMode: null,

  // Actions
  applyAdaptation: (adaptation, mood) => {
    set({
      theme: adaptation.theme,
      layout: adaptation.layout,
      visibleFeatures: adaptation.visibleFeatures,
      animations: adaptation.animations,
      spacing: adaptation.spacing,
      complexity: adaptation.complexity,
      adaptationReasoning: adaptation.reasoning,
      currentMood: mood || null,
      isAdapting: false
    });
  },

  setDemoMode: (mode) => {
    set({ demoMode: mode });
  },

  setIsAdapting: (isAdapting) => {
    set({ isAdapting });
  },

  resetToDefault: () => {
    set({
      ...DEFAULT_STATE,
      currentMood: null,
      isAdapting: false,
      demoMode: null
    });
  }
}));
