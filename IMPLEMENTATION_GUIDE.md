# 🛠️ MorphUI Implementation Guide - Step by Step

## 📋 Prerequisites

### Required Software
- Node.js 20+
- Ollama installed and running
- Gemini API key (free tier works)

### Install Ollama Models
```bash
# Image generation (choose one or both)
ollama pull flux:schnell         # Fast, recommended
ollama pull stable-diffusion     # Classic

# Current text model (you already have)
ollama pull gemma3:4b
```

---

## 🎯 Phase 1: AI Visual Generation

### Step 1.1: Set Up Visual Generation Service

Create `packages/backend/src/services/VisualGenerationService.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

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
  private ollamaUrl = 'http://localhost:11434';

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
    const model = this.gemini.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

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
    const model = this.gemini.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

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
   */
  async generateHeroImage(
    mood: string,
    style: string,
    timeOfDay: string
  ): Promise<string> {
    const prompt = this.buildImagePrompt(mood, style, timeOfDay);

    try {
      const response = await axios.post(`${this.ollamaUrl}/api/generate`, {
        model: 'flux:schnell', // or 'stable-diffusion'
        prompt: prompt,
        stream: false,
        options: {
          num_predict: 100,
          temperature: 0.8
        }
      });

      // Ollama returns base64 image in response
      const image = response.data.response;
      return `data:image/png;base64,${image}`;
    } catch (error) {
      console.error('Failed to generate hero image:', error);
      // Return fallback gradient
      return this.getFallbackImage(mood);
    }
  }

  /**
   * Build optimized image generation prompt
   */
  private buildImagePrompt(mood: string, style: string, timeOfDay: string): string {
    const moodPrompts = {
      stressed: 'calm mountain landscape at sunset, soft gradients, peaceful, minimalist',
      focused: 'abstract geometric patterns, sharp lines, professional, dark tones',
      relaxed: 'gentle ocean waves, pastel colors, serene, flowing',
      energetic: 'vibrant city lights, neon colors, dynamic, energetic',
      exploratory: 'cosmic nebula, colorful, mysterious, expansive'
    };

    const timePrompts = {
      morning: 'bright, warm sunrise tones',
      afternoon: 'clear, balanced lighting',
      evening: 'golden hour, warm ambiance',
      night: 'deep blues, cool tones, starlight'
    };

    const base = moodPrompts[mood as keyof typeof moodPrompts] || moodPrompts.focused;
    const time = timePrompts[timeOfDay as keyof typeof timePrompts] || timePrompts.afternoon;

    return `${base}, ${time}, ${style} style, 16:9 aspect ratio, high quality, professional, no text, no people`;
  }

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
        textSecondary: '#64748b'
      },
      focused: {
        primary: '#3b82f6',
        secondary: '#6366f1',
        accent: '#8b5cf6',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#cbd5e1'
      },
      // Add more fallbacks...
    };

    return palettes[mood] || palettes.focused;
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

    return gradients[mood] || gradients.focused;
  }
}
```

### Step 1.2: Create API Endpoints

Add to `packages/backend/src/index.ts`:

```typescript
import { VisualGenerationService } from './services/VisualGenerationService';

const visualGen = new VisualGenerationService(process.env.GEMINI_API_KEY!);

// Generate color palette
app.post('/api/visuals/palette', async (req, res) => {
  try {
    const { mood, timeOfDay, context } = req.body;
    const palette = await visualGen.generateColorPalette(mood, timeOfDay, context);
    res.json({ success: true, palette });
  } catch (error) {
    console.error('Palette generation error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate palette' });
  }
});

// Generate SVG icon
app.post('/api/visuals/icon', async (req, res) => {
  try {
    const { featureName, style, mood, color } = req.body;
    const icon = await visualGen.generateSVGIcon(featureName, style, mood, color);
    res.json({ success: true, icon });
  } catch (error) {
    console.error('Icon generation error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate icon' });
  }
});

// Generate hero image
app.post('/api/visuals/hero', async (req, res) => {
  try {
    const { mood, style, timeOfDay } = req.body;
    const image = await visualGen.generateHeroImage(mood, style, timeOfDay);
    res.json({ success: true, image });
  } catch (error) {
    console.error('Hero image generation error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate image' });
  }
});
```

### Step 1.3: Frontend Integration

Create `packages/frontend/src/services/visualService.ts`:

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const visualService = {
  async generatePalette(mood: string, timeOfDay: string, context?: string) {
    const response = await axios.post(`${API_URL}/visuals/palette`, {
      mood,
      timeOfDay,
      context
    });
    return response.data.palette;
  },

  async generateIcon(featureName: string, style: string, mood: string, color: string) {
    const response = await axios.post(`${API_URL}/visuals/icon`, {
      featureName,
      style,
      mood,
      color
    });
    return response.data.icon;
  },

  async generateHeroImage(mood: string, style: string, timeOfDay: string) {
    const response = await axios.post(`${API_URL}/visuals/hero`, {
      mood,
      style,
      timeOfDay
    });
    return response.data.image;
  }
};
```

### Step 1.4: Add to Store

Update `packages/frontend/src/store/appStore.ts`:

```typescript
interface AppStore {
  // ... existing state ...
  
  // NEW: Visual generation state
  generatedPalette: ColorPalette | null;
  generatedIcons: Map<string, string>;
  heroImage: string | null;
  isGeneratingVisuals: boolean;
  
  // NEW: Actions
  generateVisuals: (mood: string) => Promise<void>;
  applyGeneratedPalette: (palette: ColorPalette) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // ... existing state ...
  
  generatedPalette: null,
  generatedIcons: new Map(),
  heroImage: null,
  isGeneratingVisuals: false,
  
  generateVisuals: async (mood: string) => {
    set({ isGeneratingVisuals: true });
    
    try {
      const timeOfDay = getTimeOfDay();
      
      // Generate palette
      const palette = await visualService.generatePalette(mood, timeOfDay);
      set({ generatedPalette: palette });
      
      // Generate hero image
      const heroImage = await visualService.generateHeroImage(mood, 'modern', timeOfDay);
      set({ heroImage });
      
      // Apply palette
      get().applyGeneratedPalette(palette);
    } catch (error) {
      console.error('Visual generation failed:', error);
    } finally {
      set({ isGeneratingVisuals: false });
    }
  },
  
  applyGeneratedPalette: (palette: ColorPalette) => {
    // Apply to CSS variables
    const root = document.documentElement;
    Object.entries(palette).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('#')) {
        root.style.setProperty(`--color-${key}`, value);
      }
    });
  }
}));

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  if (hour < 22) return 'evening';
  return 'night';
}
```

---

## 🎨 Phase 2: Multi-Agent AI System

### Step 2.1: Create Agent Base Class

Create `packages/backend/src/agents/BaseAgent.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AgentResponse<T> {
  data: T;
  reasoning: string;
  confidence: number;
}

export abstract class BaseAgent {
  protected gemini: GoogleGenerativeAI;
  protected modelName = 'gemini-2.0-flash-exp';

  constructor(apiKey: string) {
    this.gemini = new GoogleGenerativeAI(apiKey);
  }

  protected async query<T>(prompt: string): Promise<AgentResponse<T>> {
    const model = this.gemini.getGenerativeModel({ model: this.modelName });
    
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Clean and parse JSON
      const cleanText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const parsed = JSON.parse(cleanText);
      
      return {
        data: parsed.data || parsed,
        reasoning: parsed.reasoning || 'No reasoning provided',
        confidence: parsed.confidence || 0.8
      };
    } catch (error) {
      console.error('Agent query failed:', error);
      throw new Error(`Agent query failed: ${error}`);
    }
  }

  abstract process(context: any): Promise<AgentResponse<any>>;
}
```

### Step 2.2: Designer Agent

Create `packages/backend/src/agents/DesignerAgent.ts`:

```typescript
import { BaseAgent, AgentResponse } from './BaseAgent';

export interface DesignProposal {
  layout: 'grid' | 'list' | 'dashboard' | 'minimal' | 'cards';
  theme: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  typography: {
    scale: 'compact' | 'normal' | 'large';
    fontFamily: string;
  };
  componentDensity: 'sparse' | 'normal' | 'dense';
  animationStyle: 'minimal' | 'normal' | 'playful';
  spacing: 'compact' | 'normal' | 'spacious';
}

export interface UserContext {
  mood: string;
  behavior: any;
  timeOfDay: string;
  sessionDuration: number;
  deviceType: string;
}

export class DesignerAgent extends BaseAgent {
  async process(context: UserContext): Promise<AgentResponse<DesignProposal>> {
    const prompt = `You are a world-class UI/UX designer with expertise in:
- Design systems and component libraries
- Color theory and psychology
- Typography and visual hierarchy
- Responsive design
- Accessibility (WCAG standards)
- Micro-interactions and animations

User Context:
${JSON.stringify(context, null, 2)}

Your task: Propose a complete UI design that:
1. Matches the user's emotional state
2. Optimizes for their behavior patterns
3. Considers time of day and device type
4. Maintains accessibility standards
5. Creates visual delight

Output ONLY valid JSON in this format (no markdown):
{
  "data": {
    "layout": "grid|list|dashboard|minimal|cards",
    "theme": "descriptive name",
    "palette": {
      "primary": "#hexcode",
      "secondary": "#hexcode",
      "accent": "#hexcode",
      "background": "#hexcode",
      "surface": "#hexcode",
      "text": "#hexcode",
      "textSecondary": "#hexcode"
    },
    "typography": {
      "scale": "compact|normal|large",
      "fontFamily": "font name"
    },
    "componentDensity": "sparse|normal|dense",
    "animationStyle": "minimal|normal|playful",
    "spacing": "compact|normal|spacious"
  },
  "reasoning": "Explain your design decisions in 2-3 sentences",
  "confidence": 0.85
}`;

    return await this.query<DesignProposal>(prompt);
  }
}
```

### Step 2.3: Engineer Agent

Create `packages/backend/src/agents/EngineerAgent.ts`:

```typescript
import { BaseAgent, AgentResponse } from './BaseAgent';
import { DesignProposal } from './DesignerAgent';

export interface ValidationResult {
  approved: boolean;
  concerns: string[];
  suggestions: string[];
  implementationApproach: string;
  estimatedComplexity: 'low' | 'medium' | 'high';
}

export class EngineerAgent extends BaseAgent {
  async process(design: DesignProposal): Promise<AgentResponse<ValidationResult>> {
    const prompt = `You are a senior frontend engineer specializing in:
- React and TypeScript
- Framer Motion and animations
- Styled Components and CSS-in-JS
- Web performance optimization
- Accessibility implementation
- Progressive enhancement

Design Proposal:
${JSON.stringify(design, null, 2)}

Current Tech Stack:
- React 18 + TypeScript
- Framer Motion for animations
- Styled Components for styling
- Zustand for state management
- Vite for bundling

Your task: Validate this design for technical feasibility.

Consider:
1. Can this be implemented with our current stack?
2. Are there performance concerns?
3. Does this maintain accessibility?
4. What's the implementation complexity?
5. Any potential issues?

Output ONLY valid JSON (no markdown):
{
  "data": {
    "approved": true,
    "concerns": ["list of concerns or empty array"],
    "suggestions": ["list of suggestions or empty array"],
    "implementationApproach": "brief description of how to build this",
    "estimatedComplexity": "low|medium|high"
  },
  "reasoning": "Technical assessment in 2-3 sentences",
  "confidence": 0.9
}`;

    return await this.query<ValidationResult>(prompt);
  }
}
```

### Step 2.4: UX Agent

Create `packages/backend/src/agents/UXAgent.ts`:

```typescript
import { BaseAgent, AgentResponse } from './BaseAgent';
import { DesignProposal } from './DesignerAgent';
import { UserContext } from './DesignerAgent';

export interface UXFeedback {
  predictedReaction: 'positive' | 'neutral' | 'negative';
  cognitiveLoad: 'low' | 'medium' | 'high';
  emotionalImpact: string;
  frictionPoints: string[];
  delightMoments: string[];
  score: number; // 0-1
}

export class UXAgent extends BaseAgent {
  async process(
    design: DesignProposal,
    context: UserContext
  ): Promise<AgentResponse<UXFeedback>> {
    const prompt = `You are a UX researcher and psychologist specializing in:
- User behavior prediction
- Cognitive load assessment
- Emotional design
- Usability testing
- User experience optimization

Design Proposal:
${JSON.stringify(design, null, 2)}

User Context:
${JSON.stringify(context, null, 2)}

Your task: Predict how the user will react to this design.

Consider:
1. Does it match their emotional state?
2. Will it reduce or increase cognitive load?
3. What emotional response will it evoke?
4. Where might they experience friction?
5. What will delight them?
6. Overall UX score (0-1)

Output ONLY valid JSON (no markdown):
{
  "data": {
    "predictedReaction": "positive|neutral|negative",
    "cognitiveLoad": "low|medium|high",
    "emotionalImpact": "description of emotional response",
    "frictionPoints": ["list of potential issues or empty"],
    "delightMoments": ["list of delightful elements or empty"],
    "score": 0.85
  },
  "reasoning": "UX assessment in 2-3 sentences",
  "confidence": 0.8
}`;

    return await this.query<UXFeedback>(prompt);
  }
}
```

### Step 2.5: AI Studio Orchestrator

Create `packages/backend/src/services/AIStudio.ts`:

```typescript
import { DesignerAgent, DesignProposal, UserContext } from '../agents/DesignerAgent';
import { EngineerAgent, ValidationResult } from '../agents/EngineerAgent';
import { UXAgent, UXFeedback } from '../agents/UXAgent';

export interface UIConfig extends DesignProposal {
  validation: ValidationResult;
  uxFeedback: UXFeedback;
  designReasoning: string;
  engineeringReasoning: string;
  uxReasoning: string;
}

export class AIStudio {
  private designer: DesignerAgent;
  private engineer: EngineerAgent;
  private uxAgent: UXAgent;

  constructor(geminiApiKey: string) {
    this.designer = new DesignerAgent(geminiApiKey);
    this.engineer = new EngineerAgent(geminiApiKey);
    this.uxAgent = new UXAgent(geminiApiKey);
  }

  /**
   * Generate complete UI configuration with multi-agent validation
   */
  async generateUI(context: UserContext): Promise<UIConfig> {
    console.log('🎨 Designer proposing...');
    const designResponse = await this.designer.process(context);
    const design = designResponse.data;

    console.log('⚙️  Engineer validating...');
    const validationResponse = await this.engineer.process(design);
    const validation = validationResponse.data;

    if (!validation.approved) {
      console.warn('❌ Design not approved, using fallback');
      return this.getFallbackDesign(context, validation);
    }

    console.log('🧠 UX agent simulating...');
    const uxResponse = await this.uxAgent.process(design, context);
    const uxFeedback = uxResponse.data;

    if (uxFeedback.score < 0.6) {
      console.warn('⚠️  Low UX score, refining design');
      return await this.refineDesign(design, uxFeedback, context);
    }

    console.log('✅ Design approved!');
    return {
      ...design,
      validation,
      uxFeedback,
      designReasoning: designResponse.reasoning,
      engineeringReasoning: validationResponse.reasoning,
      uxReasoning: uxResponse.reasoning
    };
  }

  /**
   * Refine design based on UX feedback (simplified iteration)
   */
  private async refineDesign(
    originalDesign: DesignProposal,
    feedback: UXFeedback,
    context: UserContext
  ): Promise<UIConfig> {
    // For MVP, return modified design with adjustments
    const refinedDesign: DesignProposal = {
      ...originalDesign,
      // Simplify if cognitive load is high
      componentDensity: feedback.cognitiveLoad === 'high' ? 'sparse' : originalDesign.componentDensity,
      // Reduce animations if overwhelming
      animationStyle: feedback.cognitiveLoad === 'high' ? 'minimal' : originalDesign.animationStyle
    };

    // Re-validate
    const validation = await this.engineer.process(refinedDesign);
    const uxFeedback = await this.uxAgent.process(refinedDesign, context);

    return {
      ...refinedDesign,
      validation: validation.data,
      uxFeedback: uxFeedback.data,
      designReasoning: 'Refined based on UX feedback',
      engineeringReasoning: validation.reasoning,
      uxReasoning: uxFeedback.reasoning
    };
  }

  /**
   * Fallback design when validation fails
   */
  private getFallbackDesign(
    context: UserContext,
    validation: ValidationResult
  ): UIConfig {
    const moodDefaults: Record<string, DesignProposal> = {
      stressed: {
        layout: 'list',
        theme: 'Calm Minimalist',
        palette: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#10b981',
          background: '#f8fafc',
          surface: '#ffffff',
          text: '#1e293b',
          textSecondary: '#64748b'
        },
        typography: { scale: 'normal', fontFamily: 'Inter' },
        componentDensity: 'sparse',
        animationStyle: 'minimal',
        spacing: 'spacious'
      },
      focused: {
        layout: 'minimal',
        theme: 'Dark Focus',
        palette: {
          primary: '#3b82f6',
          secondary: '#6366f1',
          accent: '#8b5cf6',
          background: '#0f172a',
          surface: '#1e293b',
          text: '#f1f5f9',
          textSecondary: '#cbd5e1'
        },
        typography: { scale: 'normal', fontFamily: 'Inter' },
        componentDensity: 'normal',
        animationStyle: 'minimal',
        spacing: 'normal'
      }
      // Add more...
    };

    const fallbackDesign = moodDefaults[context.mood] || moodDefaults.focused;

    return {
      ...fallbackDesign,
      validation,
      uxFeedback: {
        predictedReaction: 'neutral',
        cognitiveLoad: 'medium',
        emotionalImpact: 'Fallback design for safety',
        frictionPoints: [],
        delightMoments: [],
        score: 0.7
      },
      designReasoning: 'Fallback design due to validation failure',
      engineeringReasoning: validation.reasoning || 'Using safe defaults',
      uxReasoning: 'Safe, tested design'
    };
  }
}
```

### Step 2.6: Add AI Studio Endpoint

Add to `packages/backend/src/index.ts`:

```typescript
import { AIStudio } from './services/AIStudio';

const aiStudio = new AIStudio(process.env.GEMINI_API_KEY!);

app.post('/api/ai-studio/generate', async (req, res) => {
  try {
    const context = req.body;
    const uiConfig = await aiStudio.generateUI(context);
    res.json({ success: true, config: uiConfig });
  } catch (error) {
    console.error('AI Studio generation error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate UI' });
  }
});
```

---

## 🎬 Phase 3: Add "Morph Again" Button

### Step 3.1: Create Morph Button Component

Create `packages/frontend/src/components/MorphButton.tsx`:

```tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAppStore } from '../store/appStore';

const MorphButton: React.FC = () => {
  const [isMorphing, setIsMorphing] = useState(false);
  const { generateVisuals, currentMood } = useAppStore();

  const handleMorph = async () => {
    setIsMorphing(true);
    try {
      await generateVisuals(currentMood?.mood || 'focused');
    } finally {
      setTimeout(() => setIsMorphing(false), 2000);
    }
  };

  return (
    <StyledButton
      onClick={handleMorph}
      disabled={isMorphing}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <IconWrapper>
        <motion.span
          animate={{ rotate: isMorphing ? 360 : 0 }}
          transition={{ duration: 1, repeat: isMorphing ? Infinity : 0, ease: 'linear' }}
        >
          🧬
        </motion.span>
      </IconWrapper>
      <span>{isMorphing ? 'Morphing...' : 'Morph Again'}</span>
    </StyledButton>
  );
};

const StyledButton = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
  z-index: 1000;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    box-shadow: 0 6px 30px rgba(99, 102, 241, 0.6);
  }
`;

const IconWrapper = styled.span`
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default MorphButton;
```

---

## 📝 Quick Start Commands

```bash
# 1. Install new dependencies
cd /Users/wscholl/MorphUI/packages/backend
npm install

cd ../frontend
npm install react-spring

# 2. Update .env files
echo "GEMINI_API_KEY=your_key_here" >> packages/backend/.env

# 3. Pull Ollama models
ollama pull flux:schnell

# 4. Start services
# Terminal 1
cd packages/backend && npm run dev

# Terminal 2
cd packages/frontend && npm run dev

# 5. Test visual generation
curl -X POST http://localhost:3000/api/visuals/palette \
  -H "Content-Type: application/json" \
  -d '{"mood":"relaxed","timeOfDay":"evening"}'
```

---

## ✅ Testing Checklist

- [ ] Color palette generation works
- [ ] SVG icons generate successfully
- [ ] Hero images generate (Ollama running)
- [ ] Multi-agent system returns valid JSON
- [ ] "Morph Again" button triggers regeneration
- [ ] UI smoothly transitions between states
- [ ] Fallbacks work when APIs fail

---

## 🎯 Next Steps

1. **Test each phase independently** before moving to the next
2. **Add error handling** for API failures
3. **Implement caching** for generated assets
4. **Add loading states** for better UX
5. **Create demo video** once working

---

This implementation guide provides production-ready code you can copy-paste and adapt. Each phase builds on the previous one, so you can implement incrementally.
