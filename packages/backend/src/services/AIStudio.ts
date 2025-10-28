import { DesignerAgent } from '../agents/DesignerAgent.js';
import { EngineerAgent } from '../agents/EngineerAgent.js';
import { UXAgent } from '../agents/UXAgent.js';
import { AgentMessage, AgentResponse, DesignContext } from '../agents/BaseAgent.js';

export interface AIStudioRequest {
  prompt: string;
  userMood?: string;
  timeOfDay?: string;
  feature?: string;
  constraints?: string[];
}

export interface AIStudioResult {
  finalDesign: string;
  consensus: boolean;
  confidence: number;
  discussion: AgentMessage[];
  designerProposal: AgentResponse;
  engineerReview: AgentResponse;
  uxReview: AgentResponse;
  iterationCount: number;
  timestamp: number;
}

/**
 * AI Studio - Orchestrates multi-agent collaboration for design decisions
 * Coordinates Designer, Engineer, and UX agents to reach consensus
 */
export class AIStudio {
  private designer: DesignerAgent;
  private engineer: EngineerAgent;
  private ux: UXAgent;

  constructor(apiKey: string) {
    this.designer = new DesignerAgent(apiKey);
    this.engineer = new EngineerAgent(apiKey);
    this.ux = new UXAgent(apiKey);
  }

  /**
   * Generate a design through multi-agent collaboration
   * Process:
   * 1. Designer proposes initial design
   * 2. Engineer reviews technical feasibility
   * 3. UX reviews user experience
   * 4. If not approved, iterate (max 2 iterations)
   * 5. Return final design with consensus
   */
  async generateDesign(request: AIStudioRequest): Promise<AIStudioResult> {
    const context: DesignContext = {
      userMood: request.userMood,
      timeOfDay: request.timeOfDay,
      feature: request.feature,
      constraints: request.constraints,
      previousMessages: []
    };

    const discussion: AgentMessage[] = [];
    const maxIterations = 2;
    let iterationCount = 0;
    let consensus = false;
    let finalDesign = '';
    let designerProposal: AgentResponse | null = null;
    let engineerReview: AgentResponse | null = null;
    let uxReview: AgentResponse | null = null;

    // Add initial request to discussion
    discussion.push({
      role: 'system',
      content: `Design Request: ${request.prompt}`,
      timestamp: Date.now()
    });

    while (!consensus && iterationCount < maxIterations) {
      iterationCount++;
      console.log(`[AIStudio] Starting iteration ${iterationCount}/${maxIterations}`);

      // Update context with previous discussion
      context.previousMessages = discussion;

      // Step 1: Designer proposes a design
      console.log('[AIStudio] Designer is proposing design...');
      designerProposal = await this.designer.processRequest(request.prompt, context);
      
      discussion.push({
        role: 'designer',
        content: designerProposal.message,
        timestamp: Date.now(),
        confidence: designerProposal.confidence,
        metadata: {
          suggestions: designerProposal.suggestions,
          reasoning: designerProposal.reasoning
        }
      });

      console.log(`[AIStudio] Designer proposal (confidence: ${designerProposal.confidence}):`, 
        designerProposal.message.substring(0, 100) + '...');

      // Step 2: Engineer reviews the design
      console.log('[AIStudio] Engineer is reviewing...');
      engineerReview = await this.engineer.reviewProposal(designerProposal, context);
      
      discussion.push({
        role: 'engineer',
        content: engineerReview.message,
        timestamp: Date.now(),
        confidence: engineerReview.confidence,
        metadata: {
          approves: engineerReview.approves,
          concerns: engineerReview.concerns,
          suggestions: engineerReview.suggestions
        }
      });

      console.log(`[AIStudio] Engineer review (approves: ${engineerReview.approves}, confidence: ${engineerReview.confidence})`);

      // Step 3: UX reviews the design
      console.log('[AIStudio] UX expert is reviewing...');
      uxReview = await this.ux.reviewProposal(designerProposal, context);
      
      discussion.push({
        role: 'ux',
        content: uxReview.message,
        timestamp: Date.now(),
        confidence: uxReview.confidence,
        metadata: {
          approves: uxReview.approves,
          concerns: uxReview.concerns,
          suggestions: uxReview.suggestions
        }
      });

      console.log(`[AIStudio] UX review (approves: ${uxReview.approves}, confidence: ${uxReview.confidence})`);

      // Check for consensus
      if (engineerReview.approves && uxReview.approves) {
        consensus = true;
        finalDesign = this.synthesizeFinalDesign(
          designerProposal,
          engineerReview,
          uxReview
        );
        console.log('[AIStudio] ✅ Consensus reached!');
      } else {
        console.log('[AIStudio] ❌ No consensus, iterating...');
        
        // Add feedback for next iteration
        const feedback = this.generateFeedback(engineerReview, uxReview);
        discussion.push({
          role: 'system',
          content: `Feedback for next iteration: ${feedback}`,
          timestamp: Date.now()
        });
      }
    }

    // If no consensus after max iterations, use best available design
    if (!consensus && designerProposal) {
      finalDesign = this.synthesizeFinalDesign(
        designerProposal,
        engineerReview!,
        uxReview!
      );
      console.log('[AIStudio] ⚠️  Max iterations reached, using best available design');
    }

    // Calculate overall confidence
    const overallConfidence = this.calculateOverallConfidence(
      designerProposal!,
      engineerReview!,
      uxReview!,
      consensus
    );

    return {
      finalDesign,
      consensus,
      confidence: overallConfidence,
      discussion,
      designerProposal: designerProposal!,
      engineerReview: engineerReview!,
      uxReview: uxReview!,
      iterationCount,
      timestamp: Date.now()
    };
  }

  /**
   * Synthesize final design from all agent inputs
   */
  private synthesizeFinalDesign(
    designer: AgentResponse,
    engineer: AgentResponse,
    ux: AgentResponse
  ): string {
    const parts: string[] = [];

    // Start with designer's proposal
    parts.push('## Design Proposal');
    parts.push(designer.message);

    if (designer.suggestions && designer.suggestions.length > 0) {
      parts.push('\n### Design Suggestions:');
      designer.suggestions.forEach(s => parts.push(`- ${s}`));
    }

    // Add engineer's technical guidance
    if (engineer.suggestions && engineer.suggestions.length > 0) {
      parts.push('\n### Technical Implementation:');
      engineer.suggestions.forEach(s => parts.push(`- ${s}`));
    }

    if (engineer.concerns && engineer.concerns.length > 0) {
      parts.push('\n### Technical Considerations:');
      engineer.concerns.forEach(c => parts.push(`- ${c}`));
    }

    // Add UX recommendations
    if (ux.suggestions && ux.suggestions.length > 0) {
      parts.push('\n### UX Recommendations:');
      ux.suggestions.forEach(s => parts.push(`- ${s}`));
    }

    if (ux.concerns && ux.concerns.length > 0) {
      parts.push('\n### Accessibility & Usability Notes:');
      ux.concerns.forEach(c => parts.push(`- ${c}`));
    }

    return parts.join('\n');
  }

  /**
   * Generate feedback for the next iteration
   */
  private generateFeedback(engineer: AgentResponse, ux: AgentResponse): string {
    const feedback: string[] = [];

    if (!engineer.approves && engineer.concerns) {
      feedback.push(`Technical concerns: ${engineer.concerns.join(', ')}`);
    }

    if (!ux.approves && ux.concerns) {
      feedback.push(`UX concerns: ${ux.concerns.join(', ')}`);
    }

    if (engineer.suggestions) {
      feedback.push(`Technical suggestions: ${engineer.suggestions.join(', ')}`);
    }

    if (ux.suggestions) {
      feedback.push(`UX suggestions: ${ux.suggestions.join(', ')}`);
    }

    return feedback.join(' | ');
  }

  /**
   * Calculate overall confidence based on all agents
   */
  private calculateOverallConfidence(
    designer: AgentResponse,
    engineer: AgentResponse,
    ux: AgentResponse,
    consensus: boolean
  ): number {
    const avgConfidence = (designer.confidence + engineer.confidence + ux.confidence) / 3;
    
    // Reduce confidence if no consensus
    const consensusFactor = consensus ? 1.0 : 0.7;
    
    return Math.round(avgConfidence * consensusFactor * 100) / 100;
  }

  /**
   * Get a quick design suggestion (single agent, no collaboration)
   */
  async quickDesign(request: string, context?: DesignContext): Promise<AgentResponse> {
    return this.designer.processRequest(request, context || {});
  }
}

// Singleton instance
let aiStudioInstance: AIStudio | null = null;

export function initAIStudio(apiKey: string): AIStudio {
  if (!aiStudioInstance) {
    aiStudioInstance = new AIStudio(apiKey);
  }
  return aiStudioInstance;
}

export function getAIStudio(): AIStudio {
  if (!aiStudioInstance) {
    throw new Error('AIStudio not initialized. Call initAIStudio first.');
  }
  return aiStudioInstance;
}
