import { BaseAgent, AgentResponse, DesignContext } from './BaseAgent.js';

/**
 * Engineer Agent - Validates technical feasibility and implementation details
 * This agent thinks like a frontend engineer with expertise in React, CSS, and performance
 */
export class EngineerAgent extends BaseAgent {
  constructor(apiKey: string) {
    super(
      apiKey,
      'engineer',
      'React, TypeScript, CSS, animations, performance optimization, browser compatibility'
    );
  }

  protected buildSystemPrompt(): string {
    return `You are an expert Frontend Engineer AI agent with deep knowledge of:
- React 18+ and TypeScript
- CSS3, CSS-in-JS (Styled Components)
- Framer Motion animations
- Web performance optimization
- Browser compatibility and responsive design
- Accessibility (ARIA, WCAG)
- Modern build tools (Vite)

Your role is to validate technical feasibility and provide implementation guidance.
You think practically about code architecture, performance, and maintainability.

When responding:
1. Consider implementation complexity
2. Identify technical constraints and challenges
3. Suggest practical solutions
4. Think about performance implications
5. Consider browser compatibility

Output your responses as JSON with this structure:
{
  "message": "Your technical assessment",
  "confidence": 0.8,
  "approves": true/false,
  "suggestions": ["Technical suggestion 1", "Suggestion 2"],
  "concerns": ["Performance concern", "Implementation challenge"],
  "reasoning": "Technical justification for your assessment"
}`;
  }

  async processRequest(
    request: string,
    context: DesignContext
  ): Promise<AgentResponse> {
    const contextString = this.buildContextString(context);

    const prompt = `${this.systemPrompt}

IMPLEMENTATION REQUEST: ${request}

CONTEXT:
${contextString}

Tech Stack:
- React 18 with TypeScript
- Styled Components for styling
- Framer Motion for animations
- Vite for building
- Zustand for state management

Provide a technical assessment of how to implement this. Consider feasibility, performance, and best practices. Be specific about implementation approaches.`;

    try {
      const response = await this.callGemini(prompt);
      const parsed = this.parseJSON<{
        message: string;
        confidence: number;
        approves: boolean;
        suggestions: string[];
        concerns?: string[];
        reasoning: string;
      }>(response);

      return {
        agentType: this.agentType,
        message: parsed.message,
        confidence: parsed.confidence || this.calculateConfidence(response, context),
        approves: parsed.approves,
        suggestions: parsed.suggestions || [],
        concerns: parsed.concerns || [],
        reasoning: parsed.reasoning
      };
    } catch (error) {
      console.error('[EngineerAgent] Failed to process request:', error);
      
      return {
        agentType: this.agentType,
        message: `From an engineering perspective, "${request}" is implementable using React and Framer Motion. Consider component architecture, state management, and performance optimization.`,
        confidence: 0.3,
        approves: true,
        suggestions: [
          'Break down into smaller components',
          'Use React.memo for optimization',
          'Implement progressive enhancement'
        ],
        concerns: ['Need to test performance', 'Consider bundle size'],
        reasoning: 'Fallback technical assessment (API unavailable)'
      };
    }
  }

  async reviewProposal(
    proposal: AgentResponse,
    context: DesignContext
  ): Promise<AgentResponse> {
    const contextString = this.buildContextString(context);

    const prompt = `${this.systemPrompt}

CONTEXT:
${contextString}

Tech Stack:
- React 18 with TypeScript
- Styled Components
- Framer Motion
- Vite
- Zustand

Another agent (${proposal.agentType}) has made this proposal:
"${proposal.message}"

As an engineer, review this proposal from a technical perspective:
1. Is it technically feasible?
2. What are the implementation challenges?
3. Performance implications?
4. Browser compatibility concerns?
5. Maintainability and code quality?

Respond as JSON:
{
  "message": "Your technical review",
  "confidence": 0.8,
  "approves": true/false,
  "suggestions": ["Technical improvements or alternatives"],
  "concerns": ["Technical risks or challenges"],
  "reasoning": "Technical justification"
}`;

    try {
      const response = await this.callGemini(prompt);
      const parsed = this.parseJSON<{
        message: string;
        confidence: number;
        approves: boolean;
        suggestions?: string[];
        concerns?: string[];
        reasoning: string;
      }>(response);

      return {
        agentType: this.agentType,
        message: parsed.message,
        confidence: parsed.confidence,
        approves: parsed.approves,
        suggestions: parsed.suggestions || [],
        concerns: parsed.concerns || [],
        reasoning: parsed.reasoning
      };
    } catch (error) {
      console.error('[EngineerAgent] Failed to review proposal:', error);
      
      return {
        agentType: this.agentType,
        message: 'From a technical perspective, this proposal appears implementable with our current stack.',
        confidence: 0.4,
        approves: true,
        concerns: ['Need to validate performance impact'],
        reasoning: 'Fallback review (API unavailable)'
      };
    }
  }
}
