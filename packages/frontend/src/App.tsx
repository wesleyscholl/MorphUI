import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { useAppStore } from './store/appStore';
import { getTheme } from './theme/themes';
import { useBehaviorTracking } from './hooks/useBehaviorTracking';
import { useAdaptation } from './hooks/useAdaptation';
import { analyticsService } from './services/api';
import { GlobalStyles } from './components/GlobalStyles';
import { Dashboard } from './components/Dashboard';
import { AdaptationIndicator } from './components/AdaptationIndicator';
import { DemoControls } from './components/DemoControls';

function App() {
  const { theme, spacing, animations, customTheme } = useAppStore();
  
  // Initialize analytics session
  useEffect(() => {
    analyticsService.initSession();
  }, []);

  // Setup behavior tracking
  const { trackError, trackSuccess } = useBehaviorTracking({
    enabled: true,
    trackClicks: true,
    trackScroll: true,
    trackHover: false
  });

  // Setup automatic adaptation
  const { requestAdaptation, isAutoAdapting } = useAdaptation({
    enabled: true,
    intervalMs: 30000,
    minInteractions: 10
  });

  // Global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackError('global', event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [trackError]);

  // Use custom theme if available, otherwise use preset theme
  const currentTheme = customTheme || getTheme(theme, spacing, animations);

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyles />
      <Dashboard />
      <AdaptationIndicator />
      <DemoControls 
        onRequestAdaptation={requestAdaptation}
        isAutoAdapting={isAutoAdapting}
      />
    </ThemeProvider>
  );
}

export default App;
