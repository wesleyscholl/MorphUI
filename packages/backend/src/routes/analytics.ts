import { Router, Request, Response } from 'express';
import { getBehaviorAnalyzer } from '../services/behaviorAnalyzer.js';
import type { UserInteraction } from '../types/index.js';

export const analyticsRouter = Router();

// Create or get session
analyticsRouter.post('/session', (req: Request, res: Response) => {
  const { sessionId, userId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  const analyzer = getBehaviorAnalyzer();
  let session = analyzer.getSession(sessionId);

  if (!session) {
    session = analyzer.createSession(sessionId, userId);
  }

  res.json({ 
    sessionId: session.sessionId,
    startTime: session.startTime 
  });
});

// Track interaction
analyticsRouter.post('/interaction', (req: Request, res: Response) => {
  const { sessionId, interaction } = req.body;

  if (!sessionId || !interaction) {
    return res.status(400).json({ error: 'sessionId and interaction are required' });
  }

  const userInteraction: UserInteraction = {
    ...interaction,
    timestamp: interaction.timestamp || Date.now()
  };

  const analyzer = getBehaviorAnalyzer();
  analyzer.trackInteraction(sessionId, userInteraction);

  res.json({ success: true });
});

// Track page view
analyticsRouter.post('/pageview', (req: Request, res: Response) => {
  const { sessionId, page } = req.body;

  if (!sessionId || !page) {
    return res.status(400).json({ error: 'sessionId and page are required' });
  }

  const analyzer = getBehaviorAnalyzer();
  analyzer.trackPageView(sessionId, page);

  res.json({ success: true });
});

// Get behavior metrics
analyticsRouter.get('/metrics/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const analyzer = getBehaviorAnalyzer();
  const metrics = analyzer.calculateMetrics(sessionId);

  if (!metrics) {
    return res.status(404).json({ error: 'Session not found or no data available' });
  }

  res.json(metrics);
});

// Get session data
analyticsRouter.get('/session/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const analyzer = getBehaviorAnalyzer();
  const session = analyzer.getSession(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({
    sessionId: session.sessionId,
    userId: session.userId,
    startTime: session.startTime,
    lastActivity: session.lastActivity,
    interactionCount: session.interactions.length,
    pageViewCount: session.pageViews.length,
    featureUsage: session.featureUsage
  });
});
