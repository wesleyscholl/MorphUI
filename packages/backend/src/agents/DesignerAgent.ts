import { BaseAgent, AgentResponse, DesignContext } from './BaseAgent.js';

/**
 * Designer Agent - Proposes visual designs, color schemes, and creative solutions
 * This agent thinks like a UI/UX designer with expertise in visual design
 */
export class DesignerAgent extends BaseAgent {
  constructor(apiKey: string) {
    super(
      apiKey,
      'designer',
      'Visual design, color theory, layout composition, typography, and aesthetic principles'
    );
  }

  protected buildSystemPrompt(): string {
    return `You are an expert UI/UX Designer AI agent with deep knowledge of:
- Visual design principles (contrast, hierarchy, balance, alignment)
- Color theory and psychology
- Modern design systems and trends
- Typography and spacing
- Accessibility in visual design
- Responsive and adaptive layouts

Your role is to propose creative, beautiful, and functional design solutions.
You think visually and consider how users will perceive and interact with designs.

When responding:
1. Be creative but practical
2. Consider emotional impact of visual choices
3. Explain your design reasoning
4. Suggest multiple options when appropriate
5. Think about the overall visual experience

Output your responses as JSON with this structure:
{
  "message": "Your design proposal with specific suggestions",
  "confidence": 0.8,
  "suggestions": ["Specific design suggestion 1", "Suggestion 2"],
  "reasoning": "Why these design choices work",
  "concerns": ["Any potential issues to consider"]
}`;
  }

  async processRequest(
    request: string,
    context: DesignContext
  ): Promise<AgentResponse> {
    const contextString = this.buildContextString(context);

    const prompt = `${this.systemPrompt}

DESIGN REQUEST: ${request}

CONTEXT:
${contextString}

Provide a creative design proposal addressing this request. Think about colors, layout, visual hierarchy, and user experience. Be specific and actionable.`;

    try {
      const response = await this.callGemini(prompt);
      const parsed = this.parseJSON<{
        message: string;
        confidence: number;
        suggestions: string[];
        reasoning: string;
        concerns?: string[];
      }>(response);

      return {
        agentType: this.agentType,
        message: parsed.message,
        confidence: parsed.confidence || this.calculateConfidence(response, context),
        suggestions: parsed.suggestions || [],
        concerns: parsed.concerns || [],
        reasoning: parsed.reasoning,
        approves: true
      };
    } catch (error) {
      console.error('[DesignerAgent] Failed to process request:', error);
      
      // Fallback response
      return {
        agentType: this.agentType,
        message: `As a designer, I suggest focusing on creating a cohesive visual experience for "${request}". Consider using color psychology, clear visual hierarchy, and intuitive layouts.`,
        confidence: 0.3,
        suggestions: [
          'Use consistent spacing and alignment',
          'Choose colors that match the user mood',
          'Create clear visual hierarchy'
        ],
        reasoning: 'Fallback design principles (API unavailable)',
        approves: true
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

Another agent (${proposal.agentType}) has made this proposal:
"${proposal.message}"

As a designer, review this proposal from a visual design perspective:
1. Does it create a good visual experience?
2. Are the visual elements well-considered?
3. Will it be aesthetically pleasing and functional?
4. Any design improvements or concerns?

Respond as JSON:
{
  "message": "Your design review",
  "confidence": 0.8,
  "approves": true/false,
  "suggestions": ["Design improvements"],
  "concerns": ["Design issues to address"],
  "reasoning": "Why you approve/disapprove from a design perspective"
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
      console.error('[DesignerAgent] Failed to review proposal:', error);
      
      return {
        agentType: this.agentType,
        message: 'From a design perspective, this proposal seems reasonable.',
        confidence: 0.4,
        approves: true,
        reasoning: 'Fallback review (API unavailable)'
      };
    }
  }
}
