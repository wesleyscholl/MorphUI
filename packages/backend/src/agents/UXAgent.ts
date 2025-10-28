import { BaseAgent, AgentResponse, DesignContext } from './BaseAgent.js';

/**
 * UX Agent - Predicts user reactions, validates accessibility, and ensures usability
 * This agent thinks like a UX researcher and accessibility expert
 */
export class UXAgent extends BaseAgent {
  constructor(apiKey: string) {
    super(
      apiKey,
      'ux',
      'User psychology, accessibility (WCAG), usability testing, interaction design, user research'
    );
  }

  protected buildSystemPrompt(): string {
    return `You are an expert UX Researcher and Accessibility Specialist AI agent with deep knowledge of:
- User psychology and behavior patterns
- WCAG 2.1 accessibility guidelines
- Cognitive load and information architecture
- Interaction design principles
- Usability heuristics (Nielsen's 10)
- Inclusive design and diverse user needs
- User testing methodologies

Your role is to predict how users will react and ensure accessibility for all users.
You think empathetically about user needs, limitations, and emotional responses.

When responding:
1. Consider diverse user capabilities (visual, motor, cognitive)
2. Predict emotional responses to design choices
3. Identify usability issues and friction points
4. Ensure WCAG compliance
5. Think about user mental models and expectations

Output your responses as JSON with this structure:
{
  "message": "Your UX assessment",
  "confidence": 0.8,
  "approves": true/false,
  "suggestions": ["UX improvement 1", "Accessibility suggestion 2"],
  "concerns": ["Usability issue", "Accessibility concern"],
  "reasoning": "User-centered justification"
}`;
  }

  async processRequest(
    request: string,
    context: DesignContext
  ): Promise<AgentResponse> {
    const contextString = this.buildContextString(context);

    const prompt = `${this.systemPrompt}

UX REQUEST: ${request}

CONTEXT:
${contextString}

Target Users:
- General web users across different devices
- Users with varying technical skills
- Users with accessibility needs (screen readers, keyboard navigation, color blindness, etc.)

Provide a UX assessment of this request. Consider:
1. How will users react emotionally?
2. Is it intuitive and easy to use?
3. Are there accessibility barriers?
4. What's the cognitive load?
5. Does it meet user expectations?

Be specific about user needs and potential issues.`;

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
      console.error('[UXAgent] Failed to process request:', error);
      
      return {
        agentType: this.agentType,
        message: `From a UX perspective, "${request}" should be user-friendly and accessible. Consider user emotional state, cognitive load, and ensure WCAG compliance.`,
        confidence: 0.3,
        approves: true,
        suggestions: [
          'Ensure keyboard navigation support',
          'Provide clear visual feedback',
          'Test with diverse user groups',
          'Maintain WCAG AA contrast ratios'
        ],
        concerns: ['Verify accessibility', 'Test with screen readers'],
        reasoning: 'Fallback UX assessment (API unavailable)'
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

Target Users:
- General web users across devices
- Users with varying abilities and accessibility needs

Another agent (${proposal.agentType}) has made this proposal:
"${proposal.message}"

${proposal.suggestions ? `Suggestions: ${proposal.suggestions.join(', ')}` : ''}

As a UX expert, review this proposal from a user experience and accessibility perspective:
1. Will users understand and enjoy this?
2. Are there accessibility issues?
3. Does it create unnecessary friction or confusion?
4. Is it inclusive for diverse users?
5. What's the emotional impact?

Respond as JSON:
{
  "message": "Your UX review",
  "confidence": 0.8,
  "approves": true/false,
  "suggestions": ["UX improvements"],
  "concerns": ["User experience or accessibility issues"],
  "reasoning": "User-centered justification"
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
      console.error('[UXAgent] Failed to review proposal:', error);
      
      return {
        agentType: this.agentType,
        message: 'From a UX perspective, this proposal should work well for users if properly implemented with accessibility in mind.',
        confidence: 0.4,
        approves: true,
        concerns: ['Verify WCAG compliance', 'Test with real users'],
        reasoning: 'Fallback review (API unavailable)'
      };
    }
  }
}
