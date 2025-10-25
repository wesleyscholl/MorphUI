# MorphUI Architecture

## System Overview

MorphUI is a full-stack adaptive UI application that uses AI to dynamically transform its interface based on user behavior and mood.

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interaction Layer                   │
│                   (Clicks, Scrolls, Navigation)              │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   React Frontend (Port 5173)                 │
├──────────────────────────────────────────────────────────────┤
│  Components:                                                  │
│  • Dashboard - Main UI container                             │
│  • FeatureCard - Individual feature modules                  │
│  • AdaptationIndicator - Loading state                       │
│  • DemoControls - Manual controls                            │
│                                                               │
│  State Management (Zustand):                                 │
│  • Current theme, layout, features                           │
│  • Mood analysis results                                     │
│  • Adaptation state                                          │
│                                                               │
│  Theme Engine:                                               │
│  • 5 themes (minimal-dark, minimal-light, vibrant,          │
│    gamified, productivity)                                   │
│  • 3 spacing modes (compact, normal, spacious)              │
│  • 3 animation levels (minimal, normal, playful)            │
│                                                               │
│  Behavior Tracking:                                          │
│  • Click tracking with coordinates                           │
│  • Scroll depth monitoring                                   │
│  • Navigation pattern detection                              │
│  • Feature usage analytics                                   │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST API / WebSocket (Future)
┌─────────────────────▼───────────────────────────────────────┐
│                 Node.js Backend (Port 3000)                  │
├──────────────────────────────────────────────────────────────┤
│  API Routes:                                                  │
│  • /api/analytics - Behavior tracking endpoints             │
│  • /api/adaptation - UI adaptation endpoints                │
│                                                               │
│  Services:                                                    │
│  • BehaviorAnalyzer - Session management & metrics          │
│  • GeminiService - AI-powered analysis                      │
│                                                               │
│  Behavior Analysis:                                          │
│  • Click frequency calculation                               │
│  • Error rate detection                                      │
│  • Dwell time analysis                                       │
│  • Navigation pattern recognition                            │
│  • Feature engagement scoring                                │
└─────────────────────┬───────────────────────────────────────┘
                      │ Gemini API Calls
┌─────────────────────▼───────────────────────────────────────┐
│                    Google Gemini AI                          │
├──────────────────────────────────────────────────────────────┤
│  Capabilities:                                                │
│  • Mood inference from behavioral metrics                    │
│  • UI adaptation recommendations                             │
│  • Reasoning explanation generation                          │
│                                                               │
│  Models Used:                                                │
│  • gemini-1.5-flash (Fast, cost-effective)                  │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Interaction → Tracking

```typescript
User clicks button
  ↓
BehaviorTracking Hook captures event
  ↓
POST /api/analytics/interaction {
  sessionId: "session-123",
  interaction: {
    type: "click",
    target: "dashboard",
    coordinates: { x: 100, y: 200 },
    timestamp: 1234567890
  }
}
  ↓
Backend stores in session memory
```

### 2. Behavior Analysis → Metrics

```typescript
Frontend requests metrics
  ↓
GET /api/analytics/metrics/session-123
  ↓
Backend calculates:
  - avgClickFrequency: 8.5 clicks/min
  - errorRate: 0.05
  - avgDwellTime: 5.2 seconds
  - navigationPattern: "exploratory"
  ↓
Returns BehaviorMetrics object
```

### 3. AI Analysis → Adaptation

```typescript
Adaptation cycle triggered (every 30s or manual)
  ↓
POST /api/adaptation/recommend {
  sessionId: "session-123",
  currentState: {
    theme: "minimal-light",
    layout: "grid",
    features: [...]
  }
}
  ↓
Backend:
  1. Gets behavior metrics
  2. Calls Gemini AI for mood analysis
  3. Calls Gemini AI for UI recommendations
  ↓
Gemini analyzes:
  Mood: "relaxed" (confidence: 0.85)
  Recommendation: {
    theme: "vibrant",
    layout: "cards",
    features: [...],
    reasoning: "User is exploring comfortably"
  }
  ↓
Frontend applies adaptation
  ↓
UI morphs with smooth transitions
```

## Component Architecture

### Frontend Components

```
App.tsx (Root)
├── ThemeProvider (styled-components)
│   ├── GlobalStyles
│   ├── Dashboard
│   │   ├── Header
│   │   ├── MoodBadge
│   │   ├── AdaptationInfo
│   │   └── FeaturesGrid
│   │       └── FeatureCard (x15)
│   ├── AdaptationIndicator (Fixed position)
│   └── DemoControls (Fixed position)
│       ├── ToggleButton
│       └── Panel
│           ├── Mode Selection
│           └── Action Buttons
```

### Backend Services

```
index.ts (Express Server)
├── Routes
│   ├── /api/analytics
│   │   ├── POST /session
│   │   ├── POST /interaction
│   │   ├── POST /pageview
│   │   ├── GET /metrics/:sessionId
│   │   └── GET /session/:sessionId
│   └── /api/adaptation
│       ├── POST /recommend
│       ├── POST /mood
│       └── POST /feedback
└── Services
    ├── BehaviorAnalyzer
    │   ├── Session Management
    │   ├── Interaction Tracking
    │   ├── Metrics Calculation
    │   └── Cleanup Timer
    └── GeminiService
        ├── Mood Analysis
        ├── UI Adaptation
        └── Fallback Logic
```

## State Management (Zustand)

```typescript
AppStore {
  // UI Configuration
  theme: ThemeType
  layout: LayoutType
  visibleFeatures: string[]
  animations: 'minimal' | 'normal' | 'playful'
  spacing: 'compact' | 'normal' | 'spacious'
  complexity: 'simple' | 'moderate' | 'advanced'
  
  // AI State
  currentMood: MoodAnalysis | null
  adaptationReasoning: string
  isAdapting: boolean
  
  // Demo
  demoMode: 'auto' | 'stress' | 'focus' | 'explorer' | 'relax' | null
  
  // Actions
  applyAdaptation(adaptation, mood)
  setDemoMode(mode)
  setIsAdapting(isAdapting)
  resetToDefault()
}
```

## Session Management

### Session Lifecycle

1. **Creation**: User visits → `sessionId` generated → Stored in `sessionStorage`
2. **Tracking**: All interactions associated with `sessionId`
3. **Analysis**: Metrics calculated on-demand from session data
4. **Expiration**: Sessions auto-expire after 30 minutes of inactivity
5. **Cleanup**: Expired sessions removed every 10 minutes

### Session Data Structure

```typescript
{
  sessionId: "session-1234567890-abc123",
  userId: "user-456" (optional),
  startTime: 1234567890000,
  lastActivity: 1234567890000,
  interactions: [
    { type: "click", timestamp: ..., target: "dashboard" },
    { type: "scroll", timestamp: ..., metadata: {...} }
  ],
  pageViews: ["/", "/analytics", "/settings"],
  featureUsage: {
    "dashboard": 12,
    "analytics": 5,
    "settings": 2
  }
}
```

## AI Integration

### Gemini Prompts

#### Mood Analysis Prompt
```
Analyze the following user behavior metrics and determine their current mood state.

Metrics:
- Average click frequency: 8.5 clicks/minute
- Error rate: 5.0%
- Average dwell time: 5.2 seconds
- Navigation pattern: exploratory
- Interaction speed: normal
- Scroll depth: 70%

Determine the user's mood from: stressed, focused, relaxed, exploratory, frustrated

Respond ONLY with a JSON object: {...}
```

#### UI Adaptation Prompt
```
Generate an optimal UI adaptation based on user behavior and mood.

Current UI State:
- Theme: minimal-light
- Layout: grid
- Visible Features: dashboard, analytics, calendar, tasks, settings

User Mood: relaxed (confidence: 0.85)

Behavior Metrics: {...}

Respond ONLY with a JSON object: {...}
```

### Fallback Logic

If Gemini API fails:
1. **Rule-based mood detection**:
   - High error rate + rapid clicks → stressed
   - Low click frequency + long dwell time → relaxed
   - Exploratory navigation + deep scrolling → exploratory

2. **Predefined adaptations**:
   - Each mood has a default UI configuration
   - Guaranteed consistent user experience

## Theme System

### Theme Structure

```typescript
Theme {
  name: string
  colors: {
    primary, secondary, background, surface,
    text, textSecondary, border,
    success, warning, error, accent
  }
  spacing: { xs, sm, md, lg, xl }
  borderRadius: string
  shadows: { sm, md, lg }
  transitions: { fast, normal, slow }
}
```

### Dynamic Theme Generation

```typescript
getTheme(themeName, spacing, animations) → Theme

// Example: Generate "vibrant" theme with "spacious" spacing and "playful" animations
getTheme('vibrant', 'spacious', 'playful') → {
  name: 'Vibrant',
  colors: { ... }, // Vibrant color palette
  spacing: { xs: '12px', sm: '24px', ... }, // Spacious
  transitions: {
    fast: 'all 0.2s cubic-bezier(...)', // Playful
    normal: 'all 0.4s cubic-bezier(...)',
    slow: 'all 0.6s cubic-bezier(...)'
  }
}
```

## Performance Considerations

### Frontend
- **Debounced tracking**: Scroll/hover events debounced to 300ms
- **Interaction limit**: Only last 100 interactions stored per session
- **Animation optimization**: Framer Motion for GPU-accelerated animations
- **Code splitting**: Dynamic imports for large components (future)

### Backend
- **In-memory sessions**: Fast access, auto-cleanup
- **Rate limiting**: 100 requests per 15 minutes per IP
- **Gemini API**: Cached responses for identical queries (future)
- **Metrics calculation**: On-demand, not stored

## Security

### API Security
- **CORS**: Configured for specific frontend URL
- **Helmet**: Security headers enabled
- **Rate Limiting**: Prevents abuse
- **Input Validation**: All endpoints validate inputs
- **No sensitive data**: No passwords or PII stored

### Environment Variables
- **API keys**: Never committed to git
- **Separate configs**: Dev vs. production keys
- **Secure transmission**: HTTPS in production

## Scalability

### Current Limitations
- **In-memory sessions**: Won't scale across multiple servers
- **No persistence**: Sessions lost on server restart
- **Single server**: Not load-balanced

### Future Improvements
- **Redis**: Distributed session storage
- **PostgreSQL**: User profiles, adaptation history
- **Load balancing**: Multiple backend instances
- **WebSocket**: Real-time bidirectional communication
- **CDN**: Static asset delivery

## Testing Strategy

### Unit Tests
- Service logic (BehaviorAnalyzer, GeminiService)
- Utility functions
- State management

### Integration Tests
- API endpoints
- Service interactions
- Database operations (future)

### E2E Tests
- User flows
- Adaptation cycles
- Cross-browser compatibility

### Performance Tests
- Load testing (k6, Artillery)
- Memory profiling
- API response times

## Deployment

### Frontend (Vercel/Netlify)
```bash
cd packages/frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render/Heroku)
```bash
cd packages/backend
npm run build
# Deploy with Procfile or railway.json
```

### Environment Setup
```bash
# Frontend
VITE_API_URL=https://api.morphui.com/api

# Backend
GEMINI_API_KEY=your_key_here
NODE_ENV=production
FRONTEND_URL=https://morphui.com
```

---

This architecture enables MorphUI to:
✅ Track user behavior in real-time  
✅ Analyze mood using AI  
✅ Adapt UI dynamically  
✅ Provide smooth, delightful transitions  
✅ Scale to production workloads
