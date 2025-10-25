import { GoogleGenerativeAI } from '@google/generative-ai';
import type { BehaviorMetrics, MoodAnalysis, MoodState, UIAdaptation, AdaptationRequest } from '../types/index.js';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async analyzeMood(metrics: BehaviorMetrics): Promise<MoodAnalysis> {
    const prompt = `Analyze the following user behavior metrics and determine their current mood state.
    
Metrics:
- Average click frequency: ${metrics.avgClickFrequency} clicks/minute
- Error rate: ${(metrics.errorRate * 100).toFixed(1)}%
- Average dwell time: ${metrics.avgDwellTime} seconds
- Navigation pattern: ${metrics.navigationPattern}
- Interaction speed: ${metrics.interactionSpeed}
- Scroll depth: ${(metrics.scrollDepth * 100).toFixed(0)}%

Determine the user's mood from: stressed, focused, relaxed, exploratory, frustrated

Respond ONLY with a JSON object in this exact format:
{
  "mood": "one of the mood states",
  "confidence": 0.0-1.0,
  "indicators": {
    "rapidClicks": number of rapid clicks detected,
    "errorRate": decimal 0-1,
    "avgDwellTime": seconds,
    "hesitation": 0-1 score
  },
  "recommendations": ["recommendation 1", "recommendation 2"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const analysis = JSON.parse(jsonMatch[0]) as MoodAnalysis;
      return {
        ...analysis,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Gemini mood analysis error:', error);
      // Fallback to rule-based analysis
      return this.fallbackMoodAnalysis(metrics);
    }
  }

  async generateUIAdaptation(request: AdaptationRequest): Promise<UIAdaptation> {
    const { metrics, mood, currentState } = request;

    const prompt = `Generate an optimal UI adaptation based on user behavior and mood.

Current UI State:
- Theme: ${currentState.theme}
- Layout: ${currentState.layout}
- Visible Features: ${currentState.features.join(', ')}

User Mood: ${mood?.mood || 'unknown'} (confidence: ${mood?.confidence || 0})

Behavior Metrics:
- Click frequency: ${metrics.avgClickFrequency} clicks/min
- Error rate: ${(metrics.errorRate * 100).toFixed(1)}%
- Dwell time: ${metrics.avgDwellTime}s
- Navigation: ${metrics.navigationPattern}
- Speed: ${metrics.interactionSpeed}

Theme options: minimal-dark, minimal-light, vibrant, gamified, productivity
Layout options: grid, list, cards, timeline, kanban
Animation levels: minimal, normal, playful
Spacing: compact, normal, spacious
Complexity: simple, moderate, advanced

Available features: dashboard, analytics, settings, notifications, search, help, profile, calendar, tasks, notes, chat, reports, files, team, activity

Respond ONLY with a JSON object in this exact format:
{
  "theme": "theme choice",
  "layout": "layout choice",
  "visibleFeatures": ["feature1", "feature2", ...],
  "animations": "animation level",
  "spacing": "spacing choice",
  "complexity": "complexity level",
  "reasoning": "brief explanation of choices"
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      return JSON.parse(jsonMatch[0]) as UIAdaptation;
    } catch (error) {
      console.error('Gemini adaptation error:', error);
      // Fallback to rule-based adaptation
      return this.fallbackAdaptation(metrics, mood?.mood);
    }
  }

  private fallbackMoodAnalysis(metrics: BehaviorMetrics): MoodAnalysis {
    let mood: MoodState = 'relaxed';
    let confidence = 0.6;

    // Rule-based mood detection
    if (metrics.errorRate > 0.15 && metrics.avgClickFrequency > 12) {
      mood = 'stressed';
      confidence = 0.75;
    } else if (metrics.avgClickFrequency < 5 && metrics.avgDwellTime > 8) {
      mood = 'relaxed';
      confidence = 0.7;
    } else if (metrics.navigationPattern === 'exploratory' && metrics.scrollDepth > 0.7) {
      mood = 'exploratory';
      confidence = 0.65;
    } else if (metrics.errorRate < 0.05 && metrics.navigationPattern === 'focused') {
      mood = 'focused';
      confidence = 0.8;
    } else if (metrics.errorRate > 0.2) {
      mood = 'frustrated';
      confidence = 0.7;
    }

    return {
      mood,
      confidence,
      indicators: {
        rapidClicks: metrics.avgClickFrequency,
        errorRate: metrics.errorRate,
        avgDwellTime: metrics.avgDwellTime,
        hesitation: metrics.interactionSpeed === 'slow' ? 0.7 : 0.3
      },
      recommendations: this.getMoodRecommendations(mood),
      timestamp: Date.now()
    };
  }

  private fallbackAdaptation(metrics: BehaviorMetrics, mood?: MoodState): UIAdaptation {
    // Rule-based adaptation logic
    const effectiveMood = mood || 'relaxed';
    
    const adaptations: Record<MoodState, Partial<UIAdaptation>> = {
      stressed: {
        theme: 'minimal-dark',
        layout: 'list',
        visibleFeatures: ['dashboard', 'tasks', 'settings'],
        animations: 'minimal',
        spacing: 'spacious',
        complexity: 'simple'
      },
      focused: {
        theme: 'productivity',
        layout: 'list',
        visibleFeatures: ['dashboard', 'tasks', 'calendar', 'notes', 'analytics'],
        animations: 'minimal',
        spacing: 'compact',
        complexity: 'moderate'
      },
      relaxed: {
        theme: 'minimal-light',
        layout: 'cards',
        visibleFeatures: ['dashboard', 'analytics', 'calendar', 'team', 'activity', 'files'],
        animations: 'normal',
        spacing: 'normal',
        complexity: 'moderate'
      },
      exploratory: {
        theme: 'vibrant',
        layout: 'grid',
        visibleFeatures: ['dashboard', 'analytics', 'search', 'help', 'calendar', 'tasks', 'notes', 'chat', 'reports', 'files', 'team'],
        animations: 'playful',
        spacing: 'spacious',
        complexity: 'advanced'
      },
      frustrated: {
        theme: 'minimal-dark',
        layout: 'list',
        visibleFeatures: ['dashboard', 'help', 'settings'],
        animations: 'minimal',
        spacing: 'spacious',
        complexity: 'simple'
      }
    };

    return {
      ...adaptations[effectiveMood],
      reasoning: `Adapted for ${effectiveMood} mood with ${metrics.navigationPattern} navigation pattern`
    } as UIAdaptation;
  }

  private getMoodRecommendations(mood: MoodState): string[] {
    const recommendations: Record<MoodState, string[]> = {
      stressed: [
        'Simplify interface to reduce cognitive load',
        'Use calming colors and minimal animations',
        'Hide non-essential features'
      ],
      focused: [
        'Maintain clean, distraction-free layout',
        'Enable keyboard shortcuts',
        'Use compact, information-dense design'
      ],
      relaxed: [
        'Show more features and options',
        'Use comfortable spacing',
        'Enable smooth animations'
      ],
      exploratory: [
        'Display all available features',
        'Add tooltips and guidance',
        'Use engaging visuals'
      ],
      frustrated: [
        'Provide clear help and guidance',
        'Simplify workflows',
        'Reduce error opportunities'
      ]
    };

    return recommendations[mood];
  }
}

// Singleton instance
let geminiService: GeminiService | null = null;

export function initGeminiService(apiKey: string): GeminiService {
  if (!geminiService) {
    geminiService = new GeminiService(apiKey);
  }
  return geminiService;
}

export function getGeminiService(): GeminiService {
  if (!geminiService) {
    throw new Error('GeminiService not initialized. Call initGeminiService first.');
  }
  return geminiService;
}
