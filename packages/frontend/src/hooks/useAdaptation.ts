import { useEffect, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { analyticsService, adaptationService } from '../services/api';

interface UseAdaptationOptions {
  enabled?: boolean;
  intervalMs?: number;
  minInteractions?: number;
}

export function useAdaptation(options: UseAdaptationOptions = {}) {
  const {
    enabled = true,
    intervalMs = 30000, // Check every 30 seconds
    minInteractions = 10 // Minimum interactions before adapting
  } = options;

  const { 
    theme, 
    layout, 
    visibleFeatures,
    applyAdaptation,
    setIsAdapting,
    demoMode
  } = useAppStore();

  const requestAdaptation = useCallback(async () => {
    if (!enabled || demoMode) return;

    try {
      setIsAdapting(true);

      const metrics = await analyticsService.getMetrics();
      
      if (!metrics) {
        setIsAdapting(false);
        return;
      }

      // Check if we have enough interactions
      const totalInteractions = Object.values(metrics.featureEngagement)
        .reduce((sum, count) => sum + count, 0);

      if (totalInteractions < minInteractions) {
        setIsAdapting(false);
        return;
      }

      const sessionId = analyticsService.getSessionId();
      const adaptation = await adaptationService.requestAdaptation(
        sessionId,
        {
          theme,
          layout,
          features: visibleFeatures
        },
        metrics
      );

      if (adaptation) {
        applyAdaptation(adaptation.adaptation, adaptation.mood);
      }

    } catch (error) {
      console.error('Adaptation failed:', error);
    } finally {
      setIsAdapting(false);
    }
  }, [enabled, theme, layout, visibleFeatures, applyAdaptation, setIsAdapting, minInteractions, demoMode]);

  // Periodic adaptation checks
  useEffect(() => {
    if (!enabled || demoMode) return;

    const interval = setInterval(() => {
      requestAdaptation();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [enabled, intervalMs, requestAdaptation, demoMode]);

  return {
    requestAdaptation,
    isAutoAdapting: enabled && !demoMode
  };
}
