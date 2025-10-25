import type { 
  BehaviorSession, 
  BehaviorMetrics, 
  UserInteraction 
} from '../types/index.js';

export class BehaviorAnalyzer {
  private sessions: Map<string, BehaviorSession> = new Map();
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  createSession(sessionId: string, userId?: string): BehaviorSession {
    const session: BehaviorSession = {
      sessionId,
      userId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      interactions: [],
      pageViews: [],
      featureUsage: {}
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId: string): BehaviorSession | undefined {
    const session = this.sessions.get(sessionId);
    
    if (session && Date.now() - session.lastActivity > this.SESSION_TIMEOUT) {
      this.sessions.delete(sessionId);
      return undefined;
    }

    return session;
  }

  trackInteraction(sessionId: string, interaction: UserInteraction): void {
    const session = this.getSession(sessionId);
    if (!session) return;

    session.interactions.push(interaction);
    session.lastActivity = Date.now();

    // Track feature usage
    if (interaction.target) {
      session.featureUsage[interaction.target] = 
        (session.featureUsage[interaction.target] || 0) + 1;
    }

    // Limit interaction history to last 100
    if (session.interactions.length > 100) {
      session.interactions = session.interactions.slice(-100);
    }
  }

  trackPageView(sessionId: string, page: string): void {
    const session = this.getSession(sessionId);
    if (!session) return;

    session.pageViews.push(page);
    session.lastActivity = Date.now();
  }

  calculateMetrics(sessionId: string): BehaviorMetrics | null {
    const session = this.getSession(sessionId);
    if (!session || session.interactions.length === 0) return null;

    const now = Date.now();
    const sessionDuration = (now - session.startTime) / 1000; // seconds
    const interactions = session.interactions;

    // Calculate click frequency (clicks per minute)
    const clicks = interactions.filter(i => i.type === 'click');
    const avgClickFrequency = (clicks.length / sessionDuration) * 60;

    // Calculate error rate
    const errors = interactions.filter(i => i.type === 'error').length;
    const errorRate = errors / Math.max(interactions.length, 1);

    // Calculate average dwell time
    const dwellTimes = this.calculateDwellTimes(interactions);
    const avgDwellTime = dwellTimes.length > 0 
      ? dwellTimes.reduce((a, b) => a + b, 0) / dwellTimes.length 
      : 0;

    // Determine navigation pattern
    const navigationPattern = this.analyzeNavigationPattern(session);

    // Calculate feature engagement
    const featureEngagement = session.featureUsage;

    // Calculate scroll depth
    const scrollInteractions = interactions.filter(i => i.type === 'scroll');
    const scrollDepth = scrollInteractions.length > 0 ? 0.5 : 0.3; // Simplified

    // Determine interaction speed
    const interactionSpeed = this.determineInteractionSpeed(avgClickFrequency);

    return {
      avgClickFrequency,
      errorRate,
      avgDwellTime,
      navigationPattern,
      featureEngagement,
      scrollDepth,
      interactionSpeed
    };
  }

  private calculateDwellTimes(interactions: UserInteraction[]): number[] {
    const dwellTimes: number[] = [];
    
    for (let i = 0; i < interactions.length - 1; i++) {
      const current = interactions[i];
      const next = interactions[i + 1];
      
      if (current.type === 'click' || current.type === 'navigation') {
        const dwellTime = (next.timestamp - current.timestamp) / 1000;
        if (dwellTime < 120) { // Ignore very long pauses (> 2 minutes)
          dwellTimes.push(dwellTime);
        }
      }
    }

    return dwellTimes;
  }

  private analyzeNavigationPattern(session: BehaviorSession): 'linear' | 'random' | 'focused' | 'exploratory' {
    const uniquePages = new Set(session.pageViews).size;
    const totalViews = session.pageViews.length;
    const uniqueFeatures = Object.keys(session.featureUsage).length;

    if (totalViews < 3) return 'linear';

    const revisitRate = 1 - (uniquePages / totalViews);
    
    if (uniquePages > 5 && revisitRate < 0.3) return 'exploratory';
    if (uniquePages <= 2 && uniqueFeatures <= 3) return 'focused';
    if (revisitRate > 0.5) return 'focused';
    
    return 'random';
  }

  private determineInteractionSpeed(clickFrequency: number): 'rapid' | 'normal' | 'slow' {
    if (clickFrequency > 12) return 'rapid';
    if (clickFrequency < 4) return 'slow';
    return 'normal';
  }

  cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity > this.SESSION_TIMEOUT) {
        this.sessions.delete(sessionId);
      }
    }
  }

  getAllSessions(): BehaviorSession[] {
    return Array.from(this.sessions.values());
  }
}

// Singleton instance
let behaviorAnalyzer: BehaviorAnalyzer | null = null;

export function getBehaviorAnalyzer(): BehaviorAnalyzer {
  if (!behaviorAnalyzer) {
    behaviorAnalyzer = new BehaviorAnalyzer();
    
    // Cleanup expired sessions every 10 minutes
    setInterval(() => {
      behaviorAnalyzer?.cleanupExpiredSessions();
    }, 10 * 60 * 1000);
  }
  return behaviorAnalyzer;
}
