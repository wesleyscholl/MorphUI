import type { UIAdaptation, MoodState, MoodAnalysis } from '../types';

// Preset adaptations that work without Gemini
export const presetAdaptations: Record<string, { adaptation: UIAdaptation; mood: MoodAnalysis }> = {
  stress: {
    adaptation: {
      theme: 'minimal-dark',
      layout: 'list',
      visibleFeatures: ['dashboard', 'tasks', 'settings'],
      animations: 'minimal',
      spacing: 'spacious',
      complexity: 'simple',
      reasoning: 'Demo: Stressed mode - Simplified interface with calming dark theme and reduced features'
    },
    mood: {
      mood: 'stressed',
      confidence: 1.0,
      indicators: {
        rapidClicks: 15,
        errorRate: 0.18,
        avgDwellTime: 1.5,
        hesitation: 0.7
      },
      recommendations: [
        'Simplify interface to reduce cognitive load',
        'Use calming colors and minimal animations',
        'Hide non-essential features'
      ],
      timestamp: Date.now()
    }
  },
  
  focus: {
    adaptation: {
      theme: 'productivity',
      layout: 'list',
      visibleFeatures: ['dashboard', 'tasks', 'calendar', 'notes', 'analytics'],
      animations: 'minimal',
      spacing: 'compact',
      complexity: 'moderate',
      reasoning: 'Demo: Focus mode - Productivity-optimized with minimal distractions'
    },
    mood: {
      mood: 'focused',
      confidence: 1.0,
      indicators: {
        rapidClicks: 6,
        errorRate: 0.03,
        avgDwellTime: 8.5,
        hesitation: 0.2
      },
      recommendations: [
        'Maintain clean, distraction-free layout',
        'Enable keyboard shortcuts',
        'Use compact, information-dense design'
      ],
      timestamp: Date.now()
    }
  },
  
  explorer: {
    adaptation: {
      theme: 'vibrant',
      layout: 'grid',
      visibleFeatures: [
        'dashboard', 'analytics', 'search', 'help', 'calendar', 
        'tasks', 'notes', 'chat', 'reports', 'files', 'team', 'activity'
      ],
      animations: 'playful',
      spacing: 'spacious',
      complexity: 'advanced',
      reasoning: 'Demo: Explorer mode - Feature-rich interface with playful animations and vibrant colors'
    },
    mood: {
      mood: 'exploratory',
      confidence: 1.0,
      indicators: {
        rapidClicks: 4,
        errorRate: 0.04,
        avgDwellTime: 6.8,
        hesitation: 0.3
      },
      recommendations: [
        'Display all available features',
        'Add tooltips and guidance',
        'Use engaging visuals'
      ],
      timestamp: Date.now()
    }
  },
  
  relax: {
    adaptation: {
      theme: 'minimal-light',
      layout: 'cards',
      visibleFeatures: [
        'dashboard', 'analytics', 'calendar', 'tasks', 
        'notes', 'team', 'activity', 'files'
      ],
      animations: 'normal',
      spacing: 'spacious',
      complexity: 'moderate',
      reasoning: 'Demo: Relaxed mode - Comfortable, spacious layout with pleasant light theme'
    },
    mood: {
      mood: 'relaxed',
      confidence: 1.0,
      indicators: {
        rapidClicks: 3,
        errorRate: 0.02,
        avgDwellTime: 12.3,
        hesitation: 0.1
      },
      recommendations: [
        'Show more features and options',
        'Use comfortable spacing',
        'Enable smooth animations'
      ],
      timestamp: Date.now()
    }
  }
};

export function getPresetAdaptation(mode: string) {
  return presetAdaptations[mode] || null;
}
