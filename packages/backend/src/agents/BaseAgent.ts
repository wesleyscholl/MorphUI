import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

export interface AgentMessage {
  role: 'designer' | 'engineer' | 'ux' | 'system';
  content: string;
  timestamp: number;
  confidence?: number;
  metadata?: Record<string, any>;
}

export interface AgentResponse {
  agentType: string;
  message: string;
  confidence: number;
  suggestions?: string[];
  concerns?: string[];
  approves?: boolean;
  reasoning?: string;
}

export interface DesignContext {
  userMood?: string;
  timeOfDay?: string;
  feature?: string;
  previousMessages?: AgentMessage[];
  constraints?: string[];
  userPreferences?: Record<string, any>;
}

/**
 * Base abstract class for all AI agents in the system
 * Each agent has a specific role and expertise
 */
export abstract class BaseAgent {
  protected gemini: GoogleGenerativeAI;
  protected model: GenerativeModel;
  protected agentType: string;
  protected expertise: string;
  protected systemPrompt: string;

  constructor(apiKey: string, agentType: string, expertise: string) {
    this.gemini = new GoogleGenerativeAI(apiKey);
    this.model = this.gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });
    this.agentType = agentType;
    this.expertise = expertise;
    this.systemPrompt = this.buildSystemPrompt();
  }

  /**
   * Build the system prompt that defines this agent's role
   */
  protected abstract buildSystemPrompt(): string;

  /**
   * Process a design request and return agent's response
   */
  abstract processRequest(
    request: string,
    context: DesignContext
  ): Promise<AgentResponse>;

  /**
   * Review another agent's proposal
   */
  abstract reviewProposal(
    proposal: AgentResponse,
    context: DesignContext
  ): Promise<AgentResponse>;

  /**
   * Helper to call Gemini API with structured prompts
   * Includes retry logic for rate limit errors
   */
  protected async callGemini(prompt: string, retries: number = 2): Promise<string> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await this.model.generateContent(prompt);
        return result.response.text();
      } catch (error: any) {
        // Check if it's a rate limit error (429 or specific error message)
        const isRateLimitError = 
          error.status === 429 || 
          error.message?.includes('rate limit') ||
          error.message?.includes('RESOURCE_EXHAUSTED');

        if (isRateLimitError && attempt < retries) {
          const waitTime = Math.pow(2, attempt) * 10000; // Exponential backoff: 10s, 20s
          console.warn(`[${this.agentType}] Rate limit hit, waiting ${waitTime / 1000}s before retry ${attempt + 1}/${retries}`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        console.error(`[${this.agentType}] Gemini API error:`, error);
        throw error;
      }
    }
    throw new Error('Max retries reached');
  }

  /**
   * Parse JSON response from Gemini, handling markdown code blocks
   */
  protected parseJSON<T>(text: string): T {
    const cleanText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    return JSON.parse(cleanText);
  }

  /**
   * Build context string from previous messages
   */
  protected buildContextString(context: DesignContext): string {
    const parts: string[] = [];

    if (context.userMood) {
      parts.push(`User Mood: ${context.userMood}`);
    }

    if (context.timeOfDay) {
      parts.push(`Time of Day: ${context.timeOfDay}`);
    }

    if (context.feature) {
      parts.push(`Feature: ${context.feature}`);
    }

    if (context.constraints && context.constraints.length > 0) {
      parts.push(`Constraints: ${context.constraints.join(', ')}`);
    }

    if (context.previousMessages && context.previousMessages.length > 0) {
      parts.push('\nPrevious Discussion:');
      context.previousMessages.forEach((msg) => {
        parts.push(`[${msg.role}]: ${msg.content}`);
      });
    }

    return parts.join('\n');
  }

  /**
   * Calculate confidence score based on response quality
   */
  protected calculateConfidence(response: string, _context: DesignContext): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence for longer, more detailed responses
    if (response.length > 200) confidence += 0.1;
    if (response.length > 500) confidence += 0.1;

    // Increase confidence if specific design elements are mentioned
    const designKeywords = ['color', 'layout', 'animation', 'spacing', 'typography'];
    const keywordMatches = designKeywords.filter(keyword => 
      response.toLowerCase().includes(keyword)
    ).length;
    confidence += keywordMatches * 0.05;

    // Cap at 0.95 (never 100% certain)
    return Math.min(confidence, 0.95);
  }

  /**
   * Get agent type identifier
   */
  getAgentType(): string {
    return this.agentType;
  }

  /**
   * Get agent expertise description
   */
  getExpertise(): string {
    return this.expertise;
  }
}
