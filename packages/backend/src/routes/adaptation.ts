import { Router, Request, Response } from 'express';
import { getBehaviorAnalyzer } from '../services/behaviorAnalyzer.js';
import { getGeminiService, initGeminiService } from '../services/gemini.js';
import type { AdaptationRequest, UIAdaptation, MoodAnalysis, MoodState } from '../types/index.js';

export const adaptationRouter = Router();

// Initialize Gemini service
const apiKey = process.env.GEMINI_API_KEY;
let geminiAvailable = false;

if (apiKey) {
  try {
    initGeminiService(apiKey);
    geminiAvailable = true;
    console.log('✅ Gemini AI service initialized');
  } catch (error) {
    console.warn('⚠️  Failed to initialize Gemini service. Using fallback mode.');
  }
} else {
  console.warn('⚠️  GEMINI_API_KEY not found. AI features will use fallback logic.');
}

// Preset adaptations for demo/fallback mode
const presetAdaptations: Record<MoodState, { adaptation: UIAdaptation; mood: MoodAnalysis }> = {
  stressed: {
    adaptation: {
      theme: 'minimal-dark',
      layout: 'list',
      visibleFeatures: ['dashboard', 'tasks', 'settings'],
      animations: 'minimal',
      spacing: 'spacious',
      complexity: 'simple',
      reasoning: 'Preset: Stressed mode - Simplified interface with calming dark theme'
    },
    mood: {
      mood: 'stressed',
      confidence: 0.8,
      indicators: { rapidClicks: 15, errorRate: 0.18, avgDwellTime: 1.5, hesitation: 0.7 },
      recommendations: ['Simplify interface', 'Use calming colors', 'Hide non-essential features'],
      timestamp: Date.now()
    }
  },
  focused: {
    adaptation: {
      theme: 'productivity',
      layout: 'list',
      visibleFeatures: ['dashboard', 'tasks', 'calendar', 'notes', 'analytics'],
      animations: 'minimal',
      spacing: 'compact',
      complexity: 'moderate',
      reasoning: 'Preset: Focus mode - Productivity-optimized layout'
    },
    mood: {
      mood: 'focused',
      confidence: 0.8,
      indicators: { rapidClicks: 6, errorRate: 0.03, avgDwellTime: 8.5, hesitation: 0.2 },
      recommendations: ['Maintain clean layout', 'Enable shortcuts', 'Use compact design'],
      timestamp: Date.now()
    }
  },
  relaxed: {
    adaptation: {
      theme: 'minimal-light',
      layout: 'cards',
      visibleFeatures: ['dashboard', 'analytics', 'calendar', 'tasks', 'notes', 'team', 'activity', 'files'],
      animations: 'normal',
      spacing: 'spacious',
      complexity: 'moderate',
      reasoning: 'Preset: Relaxed mode - Comfortable, spacious layout'
    },
    mood: {
      mood: 'relaxed',
      confidence: 0.8,
      indicators: { rapidClicks: 3, errorRate: 0.02, avgDwellTime: 12.3, hesitation: 0.1 },
      recommendations: ['Show more features', 'Use comfortable spacing', 'Enable smooth animations'],
      timestamp: Date.now()
    }
  },
  exploratory: {
    adaptation: {
      theme: 'vibrant',
      layout: 'grid',
      visibleFeatures: ['dashboard', 'analytics', 'search', 'help', 'calendar', 'tasks', 'notes', 'chat', 'reports', 'files', 'team', 'activity'],
      animations: 'playful',
      spacing: 'spacious',
      complexity: 'advanced',
      reasoning: 'Preset: Explorer mode - Feature-rich with playful animations'
    },
    mood: {
      mood: 'exploratory',
      confidence: 0.8,
      indicators: { rapidClicks: 4, errorRate: 0.04, avgDwellTime: 6.8, hesitation: 0.3 },
      recommendations: ['Display all features', 'Add tooltips', 'Use engaging visuals'],
      timestamp: Date.now()
    }
  },
  frustrated: {
    adaptation: {
      theme: 'minimal-dark',
      layout: 'list',
      visibleFeatures: ['dashboard', 'help', 'settings'],
      animations: 'minimal',
      spacing: 'spacious',
      complexity: 'simple',
      reasoning: 'Preset: Frustrated mode - Simplified with prominent help'
    },
    mood: {
      mood: 'frustrated',
      confidence: 0.8,
      indicators: { rapidClicks: 12, errorRate: 0.25, avgDwellTime: 2.1, hesitation: 0.6 },
      recommendations: ['Provide clear help', 'Simplify workflows', 'Reduce error opportunities'],
      timestamp: Date.now()
    }
  }
};

function getPresetForMood(mood: MoodState) {
  return presetAdaptations[mood];
}

// Get UI adaptation recommendation
adaptationRouter.post('/recommend', async (req: Request, res: Response) => {
  try {
    const request: AdaptationRequest = req.body;

    if (!request.sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    // Get behavior metrics if not provided
    let metrics = request.metrics;
    if (!metrics) {
      const analyzer = getBehaviorAnalyzer();
      const calculatedMetrics = analyzer.calculateMetrics(request.sessionId);
      
      if (!calculatedMetrics) {
        return res.status(404).json({ 
          error: 'No behavior data available for this session' 
        });
      }
      
      metrics = calculatedMetrics;
    }

    let mood;
    let adaptation;

    // Try Gemini AI if available
    if (geminiAvailable) {
      try {
        const gemini = getGeminiService();
        mood = await gemini.analyzeMood(metrics);
        adaptation = await gemini.generateUIAdaptation({
          ...request,
          metrics,
          mood
        });
      } catch (error) {
        console.error('Gemini API failed, using preset:', error);
        // Fall through to preset logic
      }
    }

    // Use presets if Gemini unavailable or failed
    if (!mood || !adaptation) {
      // Determine mood from metrics using simple rules
      let detectedMood: MoodState = 'relaxed';
      
      if (metrics.errorRate > 0.15 && metrics.avgClickFrequency > 12) {
        detectedMood = 'stressed';
      } else if (metrics.errorRate > 0.2) {
        detectedMood = 'frustrated';
      } else if (metrics.avgClickFrequency < 5 && metrics.avgDwellTime > 8) {
        detectedMood = 'relaxed';
      } else if (metrics.navigationPattern === 'exploratory' && metrics.scrollDepth > 0.7) {
        detectedMood = 'exploratory';
      } else if (metrics.errorRate < 0.05 && metrics.navigationPattern === 'focused') {
        detectedMood = 'focused';
      }

      const preset = getPresetForMood(detectedMood);
      mood = preset.mood;
      adaptation = preset.adaptation;
      
      console.log(`📦 Using preset adaptation for mood: ${detectedMood}`);
    }

    res.json({
      adaptation,
      mood,
      sessionId: request.sessionId,
      timestamp: Date.now(),
      source: geminiAvailable ? 'gemini' : 'preset'
    });

  } catch (error) {
    console.error('Adaptation recommendation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate adaptation recommendation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Analyze mood only
adaptationRouter.post('/mood', async (req: Request, res: Response) => {
  try {
    const { sessionId, metrics } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    let behaviorMetrics = metrics;
    if (!behaviorMetrics) {
      const analyzer = getBehaviorAnalyzer();
      behaviorMetrics = analyzer.calculateMetrics(sessionId);
      
      if (!behaviorMetrics) {
        return res.status(404).json({ 
          error: 'No behavior data available for this session' 
        });
      }
    }

    let mood;

    // Try Gemini if available
    if (geminiAvailable) {
      try {
        const gemini = getGeminiService();
        mood = await gemini.analyzeMood(behaviorMetrics);
      } catch (error) {
        console.error('Gemini mood analysis failed, using preset:', error);
      }
    }

    // Use preset if Gemini unavailable or failed
    if (!mood) {
      let detectedMood: MoodState = 'relaxed';
      
      if (behaviorMetrics.errorRate > 0.15 && behaviorMetrics.avgClickFrequency > 12) {
        detectedMood = 'stressed';
      } else if (behaviorMetrics.errorRate > 0.2) {
        detectedMood = 'frustrated';
      } else if (behaviorMetrics.avgClickFrequency < 5 && behaviorMetrics.avgDwellTime > 8) {
        detectedMood = 'relaxed';
      } else if (behaviorMetrics.navigationPattern === 'exploratory') {
        detectedMood = 'exploratory';
      } else if (behaviorMetrics.errorRate < 0.05) {
        detectedMood = 'focused';
      }

      mood = getPresetForMood(detectedMood).mood;
    }

    res.json({ 
      mood, 
      sessionId,
      source: geminiAvailable ? 'gemini' : 'preset'
    });

  } catch (error) {
    console.error('Mood analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze mood',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Submit adaptation feedback
adaptationRouter.post('/feedback', (req: Request, res: Response) => {
  const { sessionId, adaptationId, effectiveness, userFeedback } = req.body;

  if (!sessionId || !adaptationId) {
    return res.status(400).json({ 
      error: 'sessionId and adaptationId are required' 
    });
  }

  // TODO: Store feedback for learning
  // This would be used to improve future adaptations

  res.json({ 
    success: true,
    message: 'Feedback recorded' 
  });
});
