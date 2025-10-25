import { useEffect, useCallback, useRef } from 'react';
import { analyticsService } from '../services/api';
import type { UserInteraction } from '../types';

interface UseBehaviorTrackingOptions {
  enabled?: boolean;
  trackClicks?: boolean;
  trackScroll?: boolean;
  trackHover?: boolean;
  debounceMs?: number;
}

export function useBehaviorTracking(options: UseBehaviorTrackingOptions = {}) {
  const {
    enabled = true,
    trackClicks = true,
    trackScroll = true,
    trackHover = false,
    debounceMs = 300
  } = options;

  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();

  const trackInteraction = useCallback(
    (interaction: Omit<UserInteraction, 'timestamp'>) => {
      if (!enabled) return;
      analyticsService.trackInteraction(interaction);
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    // Track clicks
    const handleClick = (e: MouseEvent) => {
      if (!trackClicks) return;

      const target = e.target as HTMLElement;
      const featureName = 
        target.getAttribute('data-feature') ||
        target.closest('[data-feature]')?.getAttribute('data-feature') ||
        target.tagName.toLowerCase();

      trackInteraction({
        type: 'click',
        target: featureName,
        coordinates: { x: e.clientX, y: e.clientY }
      });
    };

    // Track scroll
    const handleScroll = () => {
      if (!trackScroll) return;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const scrollDepth = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        trackInteraction({
          type: 'scroll',
          metadata: { 
            scrollY: window.scrollY,
            scrollDepth: Math.min(scrollDepth, 1)
          }
        });
      }, debounceMs);
    };

    // Track hover
    const handleMouseMove = (e: MouseEvent) => {
      if (!trackHover) return;

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      hoverTimeoutRef.current = setTimeout(() => {
        const target = e.target as HTMLElement;
        const featureName = 
          target.getAttribute('data-feature') ||
          target.closest('[data-feature]')?.getAttribute('data-feature');

        if (featureName) {
          trackInteraction({
            type: 'hover',
            target: featureName,
            coordinates: { x: e.clientX, y: e.clientY }
          });
        }
      }, debounceMs);
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);
    
    if (trackHover) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, [enabled, trackClicks, trackScroll, trackHover, debounceMs, trackInteraction]);

  // Track navigation
  useEffect(() => {
    if (!enabled) return;

    const handleNavigation = () => {
      trackInteraction({
        type: 'navigation',
        target: window.location.pathname
      });
      
      analyticsService.trackPageView(window.location.pathname);
    };

    // Track initial page load
    handleNavigation();

    // Listen for route changes (for SPA)
    window.addEventListener('popstate', handleNavigation);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [enabled, trackInteraction]);

  return {
    trackInteraction,
    trackSuccess: (target: string) => {
      trackInteraction({ type: 'success', target });
    },
    trackError: (target: string, error?: unknown) => {
      trackInteraction({ 
        type: 'error', 
        target,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
  };
}
