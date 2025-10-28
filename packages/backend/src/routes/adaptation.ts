import { Router, Request, Response } from 'express';
import { getBehaviorAnalyzer } from '../services/behaviorAnalyzer.js';
import { getOllamaService, initOllamaService } from '../services/ollama.js';
import type { AdaptationRequest, UIAdaptation, MoodAnalysis, MoodState, ThemeGenerationRequest, ThemeGenerationResponse } from '../types/index.js';

export const adaptationRouter = Router();

// Initialize Ollama service
const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
const ollamaModel = process.env.OLLAMA_MODEL || 'gemma3:270m';
let ollamaAvailable = false;

try {
  initOllamaService(ollamaUrl, ollamaModel);
  ollamaAvailable = true;
  console.log(`✅ Ollama AI service initialized (${ollamaModel} @ ${ollamaUrl})`);
} catch (error) {
  console.warn('⚠️  Failed to initialize Ollama service. Using fallback mode.');
  console.warn('   Make sure Ollama is running: ollama serve');
  console.warn(`   Then pull the model: ollama pull ${ollamaModel}`);
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

    // Try Ollama AI if available
    if (ollamaAvailable) {
      try {
        const ollama = getOllamaService();
        mood = await ollama.analyzeMood(metrics);
        adaptation = await ollama.generateUIAdaptation({
          ...request,
          metrics,
          mood
        });
      } catch (error) {
        console.error('Ollama API failed, using preset:', error);
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
      source: ollamaAvailable ? 'ollama' : 'preset'
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

    // Try Ollama if available
    if (ollamaAvailable) {
      try {
        const ollama = getOllamaService();
        mood = await ollama.analyzeMood(behaviorMetrics);
      } catch (error) {
        console.error('Ollama mood analysis failed, using preset:', error);
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
      source: ollamaAvailable ? 'ollama' : 'preset'
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
  const { sessionId, adaptationId, effectiveness: _effectiveness, userFeedback: _userFeedback } = req.body;

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

// Generate custom theme based on prompt
adaptationRouter.post('/generate-theme', async (req: Request, res: Response) => {
  const { prompt, baseTheme, sessionId } = req.body as ThemeGenerationRequest;

  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({ 
      error: 'prompt is required and cannot be empty' 
    });
  }

  if (prompt.length > 500) {
    return res.status(400).json({ 
      error: 'prompt must be less than 500 characters' 
    });
  }

  try {
    const ollamaService = getOllamaService();
    
    const result = await ollamaService.generateTheme({
      prompt,
      baseTheme,
      sessionId
    });

    const response: ThemeGenerationResponse = {
      theme: result.theme,
      reasoning: result.reasoning,
      timestamp: Date.now()
    };

    res.json(response);

  } catch (error: any) {
    console.error('Theme generation error:', error);
    
    // Check if it's a rate limit error from Ollama
    const isRateLimitError = error?.response?.status === 429 || 
                            error?.message?.includes('429') ||
                            error?.message?.includes('rate limit');
    
    // Check if it's a connection error
    const isConnectionError = error?.code === 'ECONNREFUSED' || 
                             error?.message?.includes('ECONNREFUSED') ||
                             error?.message?.includes('connect');
    
    if (isRateLimitError) {
      // Return rate limit error to client
      return res.status(429).json({ 
        error: 'Ollama rate limit exceeded. Please wait a moment and try again, or use a preset theme.',
        message: 'Too many requests to the AI service'
      });
    }
    
    if (isConnectionError) {
      return res.status(503).json({ 
        error: 'Cannot connect to Ollama service. Make sure it is running.',
        message: 'Service unavailable'
      });
    }
    
    // For other errors, try fallback theme generation
    try {
      const ollamaService = getOllamaService();
      const result = await ollamaService.generateTheme({ prompt, baseTheme, sessionId });
      
      const response: ThemeGenerationResponse = {
        theme: result.theme,
        reasoning: result.reasoning + ' (Generated using fallback)',
        timestamp: Date.now()
      };

      return res.json(response);
    } catch (fallbackError) {
      console.error('Fallback theme generation error:', fallbackError);
    }

    res.status(500).json({ 
      error: 'Failed to generate theme',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
