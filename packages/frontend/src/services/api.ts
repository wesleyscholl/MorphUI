import axios from 'axios';
import type { UserInteraction, BehaviorMetrics, AdaptationResponse, UIAdaptation, ThemeGenerationRequest, ThemeGenerationResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class AnalyticsService {
  private sessionId: string;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('morphui-session-id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('morphui-session-id', sessionId);
    }
    return sessionId;
  }

  async initSession(userId?: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/analytics/session`, {
        sessionId: this.sessionId,
        userId
      });
    } catch (error) {
      console.error('Failed to init session:', error);
    }
  }

  async trackInteraction(interaction: Omit<UserInteraction, 'timestamp'>): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/analytics/interaction`, {
        sessionId: this.sessionId,
        interaction: {
          ...interaction,
          timestamp: Date.now()
        }
      });
    } catch (error) {
      console.error('Failed to track interaction:', error);
    }
  }

  async trackPageView(page: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/analytics/pageview`, {
        sessionId: this.sessionId,
        page
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  async getMetrics(): Promise<BehaviorMetrics | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/metrics/${this.sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get metrics:', error);
      return null;
    }
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

class AdaptationService {
  async requestAdaptation(
    sessionId: string,
    currentState: {
      theme: UIAdaptation['theme'];
      layout: UIAdaptation['layout'];
      features: string[];
    },
    metrics?: BehaviorMetrics
  ): Promise<AdaptationResponse | null> {
    try {
      const response = await axios.post<AdaptationResponse>(`${API_BASE_URL}/adaptation/recommend`, {
        sessionId,
        currentState,
        metrics
      });
      return response.data;
    } catch (error) {
      console.error('Failed to request adaptation:', error);
      return null;
    }
  }

  async submitFeedback(
    sessionId: string,
    adaptationId: string,
    effectiveness: number,
    userFeedback?: string
  ): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/adaptation/feedback`, {
        sessionId,
        adaptationId,
        effectiveness,
        userFeedback
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  }

  async generateTheme(request: ThemeGenerationRequest): Promise<ThemeGenerationResponse> {
    const response = await axios.post<ThemeGenerationResponse>(
      `${API_BASE_URL}/adaptation/generate-theme`,
      request
    );
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();
export const adaptationService = new AdaptationService();

// Export convenience functions
export const generateTheme = (request: ThemeGenerationRequest) => 
  adaptationService.generateTheme(request);
