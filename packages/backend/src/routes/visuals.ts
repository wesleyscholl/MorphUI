import { Router, Request, Response } from 'express';
import { getVisualGenerationService } from '../services/visualGeneration.js';

export const visualsRouter = Router();

/**
 * POST /api/visuals/palette
 * Generate a color palette based on mood and context
 */
visualsRouter.post('/palette', async (req: Request, res: Response) => {
  try {
    const { mood, timeOfDay, context } = req.body;

    if (!mood || !timeOfDay) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: mood and timeOfDay are required'
      });
    }

    const service = getVisualGenerationService();
    const palette = await service.generateColorPalette(mood, timeOfDay, context);

    res.json({ success: true, palette });
  } catch (error) {
    console.error('Palette generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate color palette'
    });
  }
});

/**
 * POST /api/visuals/icon
 * Generate an SVG icon dynamically
 */
visualsRouter.post('/icon', async (req: Request, res: Response) => {
  try {
    const { featureName, style, mood, color } = req.body;

    if (!featureName || !style || !mood || !color) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: featureName, style, mood, and color are required'
      });
    }

    if (!['outline', 'filled', 'duotone'].includes(style)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid style. Must be one of: outline, filled, duotone'
      });
    }

    const service = getVisualGenerationService();
    const icon = await service.generateSVGIcon(featureName, style as 'outline' | 'filled' | 'duotone', mood, color);

    res.json({ success: true, icon });
  } catch (error) {
    console.error('Icon generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate SVG icon'
    });
  }
});

/**
 * POST /api/visuals/hero
 * Generate a hero image (currently returns gradient fallback)
 */
visualsRouter.post('/hero', async (req: Request, res: Response) => {
  try {
    const { mood, style, timeOfDay } = req.body;

    if (!mood || !style || !timeOfDay) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: mood, style, and timeOfDay are required'
      });
    }

    const service = getVisualGenerationService();
    const image = await service.generateHeroImage(mood, style, timeOfDay);

    res.json({ success: true, image });
  } catch (error) {
    console.error('Hero image generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate hero image'
    });
  }
});
