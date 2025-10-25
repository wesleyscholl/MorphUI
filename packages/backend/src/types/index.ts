// Types for user behavior tracking

export interface UserInteraction {
  type: 'click' | 'scroll' | 'hover' | 'navigation' | 'error' | 'success';
  timestamp: number;
  target?: string;
  coordinates?: { x: number; y: number };
  duration?: number;
  metadata?: Record<string, unknown>;
}

export interface BehaviorSession {
  sessionId: string;
  userId?: string;
  startTime: number;
  lastActivity: number;
  interactions: UserInteraction[];
  pageViews: string[];
  featureUsage: Record<string, number>;
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

export interface AdaptationRequest {
  sessionId: string;
  currentState: {
    theme: ThemeType;
    layout: LayoutType;
    features: string[];
  };
  metrics: BehaviorMetrics;
  mood?: MoodAnalysis;
}

export interface AdaptationResponse {
  adaptation: UIAdaptation;
  mood: MoodAnalysis;
  effectiveness?: number;
}
