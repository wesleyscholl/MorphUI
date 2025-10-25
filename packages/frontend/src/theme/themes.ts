import { DefaultTheme } from 'styled-components';
import type { UIAdaptation } from '../types';

export interface Theme extends DefaultTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    accent: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: string;
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
}

const baseSpacing = {
  compact: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px'
  },
  normal: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px'
  },
  spacious: {
    xs: '12px',
    sm: '24px',
    md: '36px',
    lg: '48px',
    xl: '64px'
  }
};

const transitions = {
  minimal: {
    fast: 'none',
    normal: 'all 0.15s ease',
    slow: 'all 0.2s ease'
  },
  normal: {
    fast: 'all 0.15s ease',
    normal: 'all 0.3s ease',
    slow: 'all 0.5s ease'
  },
  playful: {
    fast: 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    normal: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    slow: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
};

export const themes: Record<UIAdaptation['theme'], Theme> = {
  'minimal-dark': {
    name: 'Minimal Dark',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      accent: '#06b6d4'
    },
    spacing: baseSpacing.normal,
    borderRadius: '8px',
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
    },
    transitions: transitions.normal
  },

  'minimal-light': {
    name: 'Minimal Light',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      accent: '#06b6d4'
    },
    spacing: baseSpacing.normal,
    borderRadius: '8px',
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    transitions: transitions.normal
  },

  'vibrant': {
    name: 'Vibrant',
    colors: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      background: '#fdf4ff',
      surface: '#ffffff',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e9d5ff',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      accent: '#06b6d4'
    },
    spacing: baseSpacing.spacious,
    borderRadius: '16px',
    shadows: {
      sm: '0 1px 2px 0 rgba(236, 72, 153, 0.1)',
      md: '0 4px 6px -1px rgba(236, 72, 153, 0.2)',
      lg: '0 10px 15px -3px rgba(236, 72, 153, 0.3)'
    },
    transitions: transitions.playful
  },

  'gamified': {
    name: 'Gamified',
    colors: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      background: '#1a1a2e',
      surface: '#16213e',
      text: '#eee',
      textSecondary: '#a8a8a8',
      border: '#0f3460',
      success: '#00ff88',
      warning: '#ffaa00',
      error: '#ff5555',
      accent: '#00d4ff'
    },
    spacing: baseSpacing.normal,
    borderRadius: '12px',
    shadows: {
      sm: '0 2px 4px 0 rgba(139, 92, 246, 0.3)',
      md: '0 6px 12px -2px rgba(139, 92, 246, 0.4)',
      lg: '0 12px 24px -4px rgba(139, 92, 246, 0.5)'
    },
    transitions: transitions.playful
  },

  'productivity': {
    name: 'Productivity',
    colors: {
      primary: '#3b82f6',
      secondary: '#06b6d4',
      background: '#1e293b',
      surface: '#334155',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      border: '#475569',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      accent: '#8b5cf6'
    },
    spacing: baseSpacing.compact,
    borderRadius: '4px',
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
      md: '0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      lg: '0 4px 8px -2px rgba(0, 0, 0, 0.2)'
    },
    transitions: transitions.minimal
  }
};

export function getTheme(
  themeName: UIAdaptation['theme'],
  spacing: UIAdaptation['spacing'],
  animations: UIAdaptation['animations']
): Theme {
  const baseTheme = themes[themeName];
  
  return {
    ...baseTheme,
    spacing: baseSpacing[spacing],
    transitions: transitions[animations]
  };
}
