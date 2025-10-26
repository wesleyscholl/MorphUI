// Types matching backend

export interface UserInteraction {
  type: 'click' | 'scroll' | 'hover' | 'navigation' | 'error' | 'success';
  timestamp: number;
  target?: string;
  coordinates?: { x: number; y: number };
  duration?: number;
  metadata?: Record<string, unknown>;
}

export interface BehaviorMetrics {
  avgClickFrequency: number;
  errorRate: number;
  avgDwellTime: number;
  navigationPattern: 'linear' | 'random' | 'focused' | 'exploratory';
  featureEngagement: Record<string, number>;
  scrollDepth: number;
  interactionSpeed: 'rapid' | 'normal' | 'slow';
}

export type MoodState = 'stressed' | 'focused' | 'relaxed' | 'exploratory' | 'frustrated';

export interface MoodAnalysis {
  mood: MoodState;
  confidence: number;
  indicators: {
    rapidClicks: number;
    errorRate: number;
    avgDwellTime: number;
    hesitation: number;
  };
  recommendations: string[];
  timestamp: number;
}

export type ThemeType = 'minimal-dark' | 'minimal-light' | 'vibrant' | 'gamified' | 'productivity';

export type LayoutType = 'grid' | 'list' | 'cards' | 'timeline' | 'kanban';

export interface UIAdaptation {
  theme: ThemeType;
  layout: LayoutType;
  visibleFeatures: string[];
  animations: 'minimal' | 'normal' | 'playful';
  spacing: 'compact' | 'normal' | 'spacious';
  complexity: 'simple' | 'moderate' | 'advanced';
  reasoning: string;
}

export interface AdaptationResponse {
  adaptation: UIAdaptation;
  mood: MoodAnalysis;
  sessionId: string;
  timestamp: number;
}

export interface GeneratedTheme {
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

export interface ThemeGenerationRequest {
  prompt: string;
  baseTheme?: ThemeType;
  sessionId?: string;
}

export interface ThemeGenerationResponse {
  theme: GeneratedTheme;
  reasoning: string;
  timestamp: number;
}
