import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  reasoning?: string;
  accessibility?: string;
}

export interface SVGIcon {
  svg: string;
  description: string;
}

export class VisualGenerationService {
  private gemini: GoogleGenerativeAI;
  // private ollamaUrl = 'http://localhost:11434'; // For future image generation

  constructor(apiKey: string) {
    this.gemini = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Generate a color palette based on mood and context
   */
  async generateColorPalette(
    mood: string,
    timeOfDay: string,
    context?: string
  ): Promise<ColorPalette> {
    const model = this.gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert UI/UX designer specializing in color theory and emotional design.

Generate a 7-color palette for a modern web interface.

Context:
- User mood: ${mood}
- Time of day: ${timeOfDay}
- Additional context: ${context || 'N/A'}

Requirements:
1. All colors MUST meet WCAG AA contrast standards for text/background combinations
2. Colors should evoke the appropriate emotional response for the mood
3. Include both light and dark variations
4. Use modern, professional hex codes
5. Consider color psychology and accessibility

Output ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "palette": {
    "primary": "#hexcode",
    "secondary": "#hexcode",
    "accent": "#hexcode",
    "background": "#hexcode",
    "surface": "#hexcode",
    "text": "#hexcode",
    "textSecondary": "#hexcode"
  },
  "reasoning": "Brief explanation of why these colors work for the given mood",
  "accessibility": "Confirmation that all combinations are WCAG AA compliant"
}`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Clean up response (remove markdown code blocks if present)
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText);

      return {
        ...parsed.palette,
        reasoning: parsed.reasoning,
        accessibility: parsed.accessibility
      };
    } catch (error) {
      console.error('Failed to generate color palette:', error);
      // Fallback palette
      return this.getFallbackPalette(mood);
    }
  }

  /**
   * Generate an SVG icon dynamically
   */
  async generateSVGIcon(
    featureName: string,
    style: 'outline' | 'filled' | 'duotone',
    mood: string,
    color: string
  ): Promise<SVGIcon> {
    const model = this.gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert SVG icon designer.

Generate a simple, modern SVG icon.

Requirements:
- Feature: ${featureName}
- Style: ${style}
- Mood: ${mood}
- Primary color: ${color}
- viewBox: 0 0 24 24
- Clean, minimal paths (no unnecessary complexity)
- No text elements
- Production-ready code
- Modern, professional design

Output ONLY the complete SVG code (no markdown, no explanation, just the <svg>...</svg> tag):`;

    try {
      const result = await model.generateContent(prompt);
      const svg = result.response.text().trim();
      
      // Clean up response
      const cleanSvg = svg
        .replace(/```svg\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^svg\s*/i, '')
        .trim();

      return {
        svg: cleanSvg,
        description: `${style} icon for ${featureName}`
      };
    } catch (error) {
      console.error('Failed to generate SVG icon:', error);
      return this.getFallbackIcon(featureName);
    }
  }

  /**
   * Generate hero image using Ollama (Flux or SD)
   * Note: This is a placeholder - actual image generation would need a model like flux
   */
  async generateHeroImage(
    mood: string,
    _style: string,
    _timeOfDay: string
  ): Promise<string> {
    // For now, return a gradient as we need flux model for actual image generation
    // You can uncomment this when flux is available
    /*
    const prompt = this.buildImagePrompt(mood, style, timeOfDay);

    try {
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'flux:schnell',
          prompt: prompt,
          stream: false,
          options: {
            num_predict: 100,
            temperature: 0.8
          }
        })
      });

      const data = await response.json();
      return `data:image/png;base64,${data.response}`;
    } catch (error) {
      console.error('Failed to generate hero image:', error);
      return this.getFallbackImage(mood);
    }
    */
    
    // Return fallback gradient for now
    return this.getFallbackImage(mood);
  }

  /**
   * Build optimized image generation prompt
   */
  /* private buildImagePrompt(mood: string, style: string, timeOfDay: string): string {
    const moodPrompts: Record<string, string> = {
      stressed: 'calm mountain landscape at sunset, soft gradients, peaceful, minimalist',
      focused: 'abstract geometric patterns, sharp lines, professional, dark tones',
      relaxed: 'gentle ocean waves, pastel colors, serene, flowing',
      energetic: 'vibrant city lights, neon colors, dynamic, energetic',
      exploratory: 'cosmic nebula, colorful, mysterious, expansive'
    };

    const timePrompts: Record<string, string> = {
      morning: 'bright, warm sunrise tones',
      afternoon: 'clear, balanced lighting',
      evening: 'golden hour, warm ambiance',
      night: 'deep blues, cool tones, starlight'
    };

    const base = moodPrompts[mood] || moodPrompts['focused'];
    const time = timePrompts[timeOfDay] || timePrompts['afternoon'];

    return `${base}, ${time}, ${style} style, 16:9 aspect ratio, high quality, professional, no text, no people`;
  } */

  /**
   * Fallback palette for API failures
   */
  private getFallbackPalette(mood: string): ColorPalette {
    const palettes: Record<string, ColorPalette> = {
      stressed: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#10b981',
        background: '#f8fafc',
        surface: '#ffffff',
        text: '#1e293b',
        textSecondary: '#64748b',
        reasoning: 'Calm blues and gentle greens to reduce stress',
        accessibility: 'All combinations meet WCAG AA standards'
      },
      focused: {
        primary: '#3b82f6',
        secondary: '#6366f1',
        accent: '#8b5cf6',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#cbd5e1',
        reasoning: 'Dark theme with focused blue accents for concentration',
        accessibility: 'All combinations meet WCAG AA standards'
      },
      relaxed: {
        primary: '#10b981',
        secondary: '#14b8a6',
        accent: '#06b6d4',
        background: '#f0fdf4',
        surface: '#ffffff',
        text: '#064e3b',
        textSecondary: '#065f46',
        reasoning: 'Soft greens and aqua tones for relaxation',
        accessibility: 'All combinations meet WCAG AA standards'
      },
      energetic: {
        primary: '#f59e0b',
        secondary: '#ef4444',
        accent: '#ec4899',
        background: '#fffbeb',
        surface: '#ffffff',
        text: '#7c2d12',
        textSecondary: '#9a3412',
        reasoning: 'Vibrant warm colors to energize and motivate',
        accessibility: 'All combinations meet WCAG AA standards'
      },
      exploratory: {
        primary: '#8b5cf6',
        secondary: '#6366f1',
        accent: '#ec4899',
        background: '#faf5ff',
        surface: '#ffffff',
        text: '#4c1d95',
        textSecondary: '#6b21a8',
        reasoning: 'Playful purples and pinks to encourage exploration',
        accessibility: 'All combinations meet WCAG AA standards'
      }
    };

    return palettes[mood] || palettes['focused'];
  }

  /**
   * Fallback icon for generation failures
   */
  private getFallbackIcon(featureName: string): SVGIcon {
    // Generic icon SVG
    return {
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>`,
      description: `Fallback icon for ${featureName}`
    };
  }

  /**
   * Fallback gradient background
   */
  private getFallbackImage(mood: string): string {
    const gradients: Record<string, string> = {
      stressed: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      focused: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)',
      relaxed: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
      energetic: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      exploratory: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    };

    return gradients[mood] || gradients['focused'];
  }
}

// Singleton instance
let visualGenService: VisualGenerationService | null = null;

export function initVisualGenerationService(apiKey: string): VisualGenerationService {
  if (!visualGenService) {
    visualGenService = new VisualGenerationService(apiKey);
  }
  return visualGenService;
}

export function getVisualGenerationService(): VisualGenerationService {
  if (!visualGenService) {
    throw new Error('VisualGenerationService not initialized. Call initVisualGenerationService first.');
  }
  return visualGenService;
}
