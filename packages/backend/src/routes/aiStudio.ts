import { Router, Request, Response } from 'express';
import { getAIStudio } from '../services/AIStudio.js';

const router = Router();

/**
 * POST /api/ai-studio/generate
 * Generate a design through multi-agent collaboration
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, userMood, timeOfDay, feature, constraints } = req.body;

    // Validate required fields
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'prompt is required and must be a string'
      });
    }

    // Get AI Studio instance
    const aiStudio = getAIStudio();

    // Generate design through collaboration
    console.log('[AI Studio API] Starting design generation:', prompt);
    const result = await aiStudio.generateDesign({
      prompt,
      userMood,
      timeOfDay,
      feature,
      constraints: constraints || []
    });

    console.log('[AI Studio API] Design generated successfully');
    console.log(`  - Consensus: ${result.consensus}`);
    console.log(`  - Confidence: ${result.confidence}`);
    console.log(`  - Iterations: ${result.iterationCount}`);

    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('[AI Studio API] Error generating design:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate design'
    });
  }
});

/**
 * POST /api/ai-studio/quick
 * Get a quick design suggestion from the designer agent only
 */
router.post('/quick', async (req: Request, res: Response) => {
  try {
    const { prompt, userMood, timeOfDay, feature } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'prompt is required and must be a string'
      });
    }

    const aiStudio = getAIStudio();

    console.log('[AI Studio API] Quick design request:', prompt);
    const result = await aiStudio.quickDesign(prompt, {
      userMood,
      timeOfDay,
      feature
    });

    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('[AI Studio API] Error generating quick design:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate quick design'
    });
  }
});

/**
 * GET /api/ai-studio/status
 * Check if AI Studio is initialized and ready
 */
router.get('/status', (_req: Request, res: Response) => {
  try {
    getAIStudio(); // Will throw if not initialized
    res.json({
      status: 'ready',
      agents: ['designer', 'engineer', 'ux'],
      capabilities: [
        'Multi-agent design collaboration',
        'Technical feasibility validation',
        'UX and accessibility review',
        'Consensus-driven design decisions'
      ]
    });
  } catch (error) {
    res.status(503).json({
      status: 'not_initialized',
      error: error instanceof Error ? error.message : 'AI Studio not initialized'
    });
  }
});

export default router;
