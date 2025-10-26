import type { BehaviorMetrics, MoodAnalysis, MoodState, UIAdaptation, AdaptationRequest, GeneratedTheme, ThemeGenerationRequest } from '../types/index.js';

interface OllamaRequest {
  model: string;
  prompt: string;
  stream: boolean;
}

interface OllamaResponse {
  response: string;
  model: string;
  done: boolean;
}

export class OllamaService {
  private ollamaUrl: string;
  private model: string;

  constructor(ollamaUrl: string = 'http://localhost:11434', model: string = 'gemma3:270m') {
    this.ollamaUrl = ollamaUrl;
    this.model = model;
  }

  private async callOllama(prompt: string): Promise<string> {
    const requestBody: OllamaRequest = {
      model: this.model,
      prompt,
      stream: false
    };

    const response = await fetch(`${this.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as OllamaResponse;
    return data.response;
  }

  async analyzeMood(metrics: BehaviorMetrics): Promise<MoodAnalysis> {
    const prompt = `You are a UX behavior analyst. Analyze user metrics and respond with ONLY valid JSON.

User Behavior Metrics:
- Click frequency: ${metrics.avgClickFrequency.toFixed(1)} clicks/minute
- Error rate: ${(metrics.errorRate * 100).toFixed(1)}%
- Dwell time: ${metrics.avgDwellTime.toFixed(1)} seconds
- Navigation: ${metrics.navigationPattern}
- Speed: ${metrics.interactionSpeed}
- Scroll depth: ${(metrics.scrollDepth * 100).toFixed(0)}%

Determine mood from: stressed, focused, relaxed, exploratory, frustrated

Guidelines:
- High error rate (>15%) + rapid clicks (>12/min) = stressed
- Low errors (<5%) + focused navigation = focused
- Slow pace (<5 clicks/min) + long dwell time (>8s) = relaxed
- Exploratory navigation + deep scrolling = exploratory
- Very high errors (>20%) = frustrated

Respond with ONLY this JSON structure, no other text:
{
  "mood": "stressed",
  "confidence": 0.85,
  "indicators": {
    "rapidClicks": 12,
    "errorRate": 0.15,
    "avgDwellTime": 2.5,
    "hesitation": 0.6
  },
  "recommendations": ["Simplify interface", "Reduce options"]
}`;

    try {
      const text = await this.callOllama(prompt);
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('No JSON found in Ollama response, using fallback');
        return this.fallbackMoodAnalysis(metrics);
      }
      
      const analysis = JSON.parse(jsonMatch[0]) as MoodAnalysis;
      return {
        ...analysis,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Ollama mood analysis error:', error);
      // Fallback to rule-based analysis
      return this.fallbackMoodAnalysis(metrics);
    }
  }

  async generateUIAdaptation(request: AdaptationRequest): Promise<UIAdaptation> {
    const { metrics, mood, currentState } = request;

    const prompt = `You are a UI/UX designer. Create an optimal interface adaptation and respond with ONLY valid JSON.

Current UI:
- Theme: ${currentState.theme}
- Layout: ${currentState.layout}
- Features: ${currentState.features.join(', ')}

User State:
- Mood: ${mood?.mood || 'unknown'} (confidence: ${mood?.confidence || 0})
- Click rate: ${metrics.avgClickFrequency.toFixed(1)}/min
- Error rate: ${(metrics.errorRate * 100).toFixed(1)}%
- Dwell time: ${metrics.avgDwellTime.toFixed(1)}s
- Navigation: ${metrics.navigationPattern}

Adaptation Rules:
STRESSED (high errors, rapid clicks):
- Theme: minimal-dark
- Layout: list
- Features: 3-5 core only (dashboard, tasks, settings)
- Animations: minimal
- Spacing: spacious
- Complexity: simple

FOCUSED (low errors, focused navigation):
- Theme: productivity
- Layout: list
- Features: 5-7 work items (dashboard, tasks, calendar, notes, analytics)
- Animations: minimal
- Spacing: compact
- Complexity: moderate

RELAXED (slow pace, long dwell):
- Theme: minimal-light
- Layout: cards
- Features: 6-10 varied (dashboard, analytics, calendar, tasks, notes, team, activity, files)
- Animations: normal
- Spacing: spacious
- Complexity: moderate

EXPLORATORY (varied nav, deep scrolling):
- Theme: vibrant
- Layout: grid
- Features: 10+ all available (dashboard, analytics, search, help, calendar, tasks, notes, chat, reports, files, team, activity)
- Animations: playful
- Spacing: spacious
- Complexity: advanced

Respond with ONLY this JSON, no other text:
{
  "theme": "minimal-dark",
  "layout": "list",
  "visibleFeatures": ["dashboard", "tasks", "settings"],
  "animations": "minimal",
  "spacing": "spacious",
  "complexity": "simple",
  "reasoning": "User appears stressed, simplified to calm interface"
}`;

    try {
      const text = await this.callOllama(prompt);
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('No JSON found in Ollama response, using fallback');
        return this.fallbackAdaptation(metrics, mood?.mood);
      }
      
      return JSON.parse(jsonMatch[0]) as UIAdaptation;
    } catch (error) {
      console.error('Ollama adaptation error:', error);
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

  async generateTheme(request: ThemeGenerationRequest): Promise<{ theme: GeneratedTheme; reasoning: string }> {
    const baseThemeContext = request.baseTheme ? `
Base theme reference: ${request.baseTheme}
Use this as inspiration but create something new based on the prompt.
` : '';

    const prompt = `You are a UI/UX theme designer. Generate a complete theme based on the user's prompt.

User Prompt: "${request.prompt}"
${baseThemeContext}

CRITICAL: Respond with ONLY valid JSON. No markdown, no explanations outside JSON.

Generate a theme with:
1. A descriptive name (2-3 words, kebab-case, replace <theme-name> in the example structure)
2. Complete color palette (use valid hex codes, replace all #<hexcode> placeholders in the example structure, ensure that colors have good contrast and consistent temperature)
3. Spacing scale (use px or rem values, replace all px placeholders in the example structure)
4. Border radius (use px or rem, replace px placeholder in the example structure)
5. Shadow definitions (valid CSS box-shadow, replace all box-shadow placeholders in the example structure)
6. Transition timings (valid CSS transition, replace all transition placeholders in the example structure)

Example structure:
{
  "theme": {
    "name": "<theme-name>",
    "colors": {
      "primary": "#<hexcode>",
      "secondary": "#<hexcode>",
      "background": "#<hexcode>",
      "surface": "#<hexcode>",
      "text": "#<hexcode>",
      "textSecondary": "#<hexcode>",
      "border": "#<hexcode>",
      "success": "#<hexcode>",
      "warning": "#<hexcode>",
      "error": "#<hexcode>",
      "accent": "#<hexcode>"
    },
    "spacing": {
      "xs": "8px",
      "sm": "16px",
      "md": "24px",
      "lg": "32px",
      "xl": "48px"
    },
    "borderRadius": "12px",
    "shadows": {
      "sm": "0 1px 3px rgba(0,0,0,0.1)",
      "md": "0 4px 6px rgba(0,0,0,0.1)",
      "lg": "0 10px 20px rgba(0,0,0,0.15)"
    },
    "transitions": {
      "fast": "all 0.15s ease",
      "normal": "all 0.3s ease",
      "slow": "all 0.5s ease"
    }
  },
  "reasoning": "Brief explanation of design choices"
}

CRITICAL ACCESSIBILITY RULES - YOU MUST FOLLOW THESE:
1. **Text Contrast**: 
   - "text" color MUST have 7:1 contrast ratio with "background" (WCAG AAA)
   - "text" color MUST have 4.5:1 contrast ratio with "surface" (minimum WCAG AA)
   - For light backgrounds (#f0f0f0) or lighter, use DARK text (#1a1a1a to #333333)
   - For dark backgrounds (#2a2a2a) or darker, use LIGHT text (#f0f0f0 to #ffffff)

2. **Secondary Text Contrast**:
   - "textSecondary" MUST have 4.5:1 contrast with "background"
   - Never use similar brightness levels for text and background

3. **Color Temperature Consistency**:
   - Keep all colors in same temperature family (all warm OR all cool)
   - Don't mix neon greens with dark reds, or bright yellows with navy blues

4. **Background/Surface Relationship**:
   - "surface" should be slightly different from "background" (3-10% lighter or darker)
   - Both should work well with the same "text" color

5. **Action Colors**:
   - "primary" and "secondary" should be vibrant but not clash
   - Use colors that are distinguishable from background
   - Success (green), Warning (yellow/orange), Error (red) should be clear

6. **Border Visibility**:
   - "border" should be subtle but visible (10-20% different from surface)

Respond with ONLY the JSON object.`;

    try {
      const response = await this.callOllama(prompt);
      console.log('Ollama response:', response);
      
      // Try to parse the JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate the structure
      if (!parsed.theme || !parsed.reasoning) {
        throw new Error('Invalid response structure');
      }

      // Validate required theme properties
      const theme = parsed.theme;
      const requiredProps = ['name', 'colors', 'spacing', 'borderRadius', 'shadows', 'transitions'];
      for (const prop of requiredProps) {
        if (!theme[prop]) {
          throw new Error(`Missing required property: ${prop}`);
        }
      }

      // Validate color contrast
      const contrastCheck = this.validateColorContrast(theme.colors);
      if (!contrastCheck.valid) {
        console.warn('Generated theme has poor contrast:', contrastCheck.issues);
        // Auto-fix contrast issues
        theme.colors = this.fixColorContrast(theme.colors);
      }

      return {
        theme: theme as GeneratedTheme,
        reasoning: parsed.reasoning
      };
    } catch (error) {
      console.error('Theme generation error:', error);
      
      // Fallback: Generate a basic theme based on the prompt keywords
      return this.generateFallbackTheme(request.prompt);
    }
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private getLuminance(hex: string): number {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  private validateColorContrast(colors: GeneratedTheme['colors']): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check text on background (should be 7:1 for AAA, minimum 4.5:1 for AA)
    const textBgContrast = this.getContrastRatio(colors.text, colors.background);
    if (textBgContrast < 4.5) {
      issues.push(`Text/background contrast too low: ${textBgContrast.toFixed(2)}:1 (minimum 4.5:1)`);
    }

    // Check text on surface
    const textSurfaceContrast = this.getContrastRatio(colors.text, colors.surface);
    if (textSurfaceContrast < 4.5) {
      issues.push(`Text/surface contrast too low: ${textSurfaceContrast.toFixed(2)}:1 (minimum 4.5:1)`);
    }

    // Check secondary text on background
    const secondaryBgContrast = this.getContrastRatio(colors.textSecondary, colors.background);
    if (secondaryBgContrast < 3.0) {
      issues.push(`Secondary text/background contrast too low: ${secondaryBgContrast.toFixed(2)}:1 (minimum 3.0:1)`);
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  private fixColorContrast(colors: GeneratedTheme['colors']): GeneratedTheme['colors'] {
    // Determine if background is light or dark
    const bgLuminance = this.getLuminance(colors.background);
    const isLightBackground = bgLuminance > 0.5;

    // Fix text color for readability
    const textBgContrast = this.getContrastRatio(colors.text, colors.background);
    if (textBgContrast < 4.5) {
      colors.text = isLightBackground ? '#1a1a1a' : '#f0f0f0';
      console.log(`Auto-fixed text color to ${colors.text} for better contrast`);
    }

    // Fix secondary text color
    const secondaryBgContrast = this.getContrastRatio(colors.textSecondary, colors.background);
    if (secondaryBgContrast < 3.0) {
      colors.textSecondary = isLightBackground ? '#4a5568' : '#a0aec0';
      console.log(`Auto-fixed textSecondary color to ${colors.textSecondary} for better contrast`);
    }

    // Ensure surface color is distinguishable from background
    const surfaceBgContrast = this.getContrastRatio(colors.surface, colors.background);
    if (surfaceBgContrast < 1.1) {
      colors.surface = isLightBackground ? '#ffffff' : '#2d3748';
      console.log(`Auto-fixed surface color to ${colors.surface} for better distinction`);
    }

    return colors;
  }

  private generateFallbackTheme(prompt: string): { theme: GeneratedTheme; reasoning: string } {
    // Simple keyword-based fallback theme generation
    const lowerPrompt = prompt.toLowerCase();
    
    let colors;
    let name;
    let reasoning;

    if (lowerPrompt.includes('dark') || lowerPrompt.includes('night')) {
      name = 'custom-dark';
      colors = {
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
        accent: '#ec4899'
      };
      reasoning = 'Generated dark theme with vibrant accents based on your prompt.';
    } else if (lowerPrompt.includes('nature') || lowerPrompt.includes('green') || lowerPrompt.includes('forest')) {
      name = 'custom-nature';
      colors = {
        primary: '#059669',
        secondary: '#10b981',
        background: '#f0fdf4',
        surface: '#ffffff',
        text: '#064e3b',
        textSecondary: '#065f46',
        border: '#bbf7d0',
        success: '#22c55e',
        warning: '#fbbf24',
        error: '#ef4444',
        accent: '#84cc16'
      };
      reasoning = 'Nature-inspired theme with earthy greens and natural tones.';
    } else if (lowerPrompt.includes('ocean') || lowerPrompt.includes('blue') || lowerPrompt.includes('water')) {
      name = 'custom-ocean';
      colors = {
        primary: '#0284c7',
        secondary: '#0ea5e9',
        background: '#f0f9ff',
        surface: '#ffffff',
        text: '#0c4a6e',
        textSecondary: '#075985',
        border: '#bae6fd',
        success: '#06b6d4',
        warning: '#f59e0b',
        error: '#ef4444',
        accent: '#6366f1'
      };
      reasoning = 'Ocean-inspired theme with calming blues and aquatic colors.';
    } else if (lowerPrompt.includes('sunset') || lowerPrompt.includes('warm') || lowerPrompt.includes('orange')) {
      name = 'custom-sunset';
      colors = {
        primary: '#ea580c',
        secondary: '#f97316',
        background: '#fff7ed',
        surface: '#ffffff',
        text: '#7c2d12',
        textSecondary: '#9a3412',
        border: '#fed7aa',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#dc2626',
        accent: '#ec4899'
      };
      reasoning = 'Warm sunset-inspired theme with orange and pink tones.';
    } else {
      name = 'custom-theme';
      colors = {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        textSecondary: '#64748b',
        border: '#e2e8f0',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        accent: '#ec4899'
      };
      reasoning = 'Custom theme generated based on your preferences.';
    }

    return {
      theme: {
        name,
        colors,
        spacing: {
          xs: '8px',
          sm: '16px',
          md: '24px',
          lg: '32px',
          xl: '48px'
        },
        borderRadius: '12px',
        shadows: {
          sm: '0 1px 3px rgba(0,0,0,0.1)',
          md: '0 4px 6px rgba(0,0,0,0.1)',
          lg: '0 10px 20px rgba(0,0,0,0.15)'
        },
        transitions: {
          fast: 'all 0.15s ease',
          normal: 'all 0.3s ease',
          slow: 'all 0.5s ease'
        }
      },
      reasoning
    };
  }
}

// Singleton instance
let ollamaService: OllamaService | null = null;

export function initOllamaService(ollamaUrl?: string, model?: string): OllamaService {
  if (!ollamaService) {
    ollamaService = new OllamaService(ollamaUrl, model);
  }
  return ollamaService;
}

export function getOllamaService(): OllamaService {
  if (!ollamaService) {
    throw new Error('OllamaService not initialized. Call initOllamaService first.');
  }
  return ollamaService;
}

// Legacy exports for compatibility
export const initGeminiService = initOllamaService;
export const getGeminiService = getOllamaService;
