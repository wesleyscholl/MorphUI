# 🚀 MorphUI Quick Reference

## 📚 Documentation Index

| Document | Purpose | Audience |
|----------|---------|----------|
| **[MORPHING_VISION.md](./MORPHING_VISION.md)** | Complete architectural vision | Developers |
| **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** | Step-by-step code examples | Implementers |
| **[DEMO_STRATEGY.md](./DEMO_STRATEGY.md)** | How to demo and wow people | Everyone |
| **[README.md](./README.md)** | Project overview | First-time visitors |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Current system design | Technical reviewers |

---

## ⚡ Quick Commands

### Development
```bash
# Start everything
npm run dev                    # Root - starts both frontend & backend

# Individual services
cd packages/backend && npm run dev   # Backend on :3000
cd packages/frontend && npm run dev  # Frontend on :5173

# Ollama
ollama serve                   # Start Ollama service
ollama pull flux:schnell       # Image generation
ollama pull gemma3:4b          # Text generation
```

### Testing
```bash
# Test AI services
curl http://localhost:3000/health
curl http://localhost:11434/api/tags

# Test visual generation
curl -X POST http://localhost:3000/api/visuals/palette \
  -H "Content-Type: application/json" \
  -d '{"mood":"relaxed","timeOfDay":"evening"}'

# Test AI Studio
curl -X POST http://localhost:3000/api/ai-studio/generate \
  -H "Content-Type: application/json" \
  -d '{"mood":"focused","behavior":{},"timeOfDay":"night"}'
```

---

## 🎯 Implementation Phases

### ✅ Current (Done)
- Basic theme switching
- Mood detection
- Behavior tracking
- Particle background
- Glassmorphic UI
- Framer Motion animations
- Gemini integration for decisions

### 🚧 Phase 1: AI Visual Generation (Week 1-2)
**Goal:** AI generates colors, icons, and images

**Key Files to Create:**
- `packages/backend/src/services/VisualGenerationService.ts`
- `packages/frontend/src/services/visualService.ts`

**New Dependencies:**
```bash
# Backend: none needed (using existing Gemini)
# Frontend: none needed (using existing axios)
```

**Test Command:**
```bash
curl -X POST localhost:3000/api/visuals/palette \
  -d '{"mood":"relaxed","timeOfDay":"evening"}' \
  -H "Content-Type: application/json"
```

### 🚧 Phase 2: Multi-Agent System (Week 2-3)
**Goal:** Designer, Engineer, UX agents collaborate

**Key Files to Create:**
- `packages/backend/src/agents/BaseAgent.ts`
- `packages/backend/src/agents/DesignerAgent.ts`
- `packages/backend/src/agents/EngineerAgent.ts`
- `packages/backend/src/agents/UXAgent.ts`
- `packages/backend/src/services/AIStudio.ts`

**Test Command:**
```bash
curl -X POST localhost:3000/api/ai-studio/generate \
  -d '{"mood":"focused","behavior":{},"timeOfDay":"night"}' \
  -H "Content-Type: application/json"
```

### 🚧 Phase 3: Morphing Animations (Week 3-4)
**Goal:** Smooth transitions between UI states

**Key Files to Update:**
- `packages/frontend/src/components/Dashboard.tsx`
- `packages/frontend/src/components/FeatureCard.tsx`
- Create: `packages/frontend/src/components/LayoutMorpher.tsx`
- Create: `packages/frontend/src/components/ColorMorpher.tsx`

**New Dependencies:**
```bash
cd packages/frontend
npm install react-spring
```

### 🚧 Phase 4: Context Enhancement (Week 4-5)
**Goal:** Better tracking and user input

**Key Features:**
- Voice input (Web Speech API)
- Enhanced behavior tracking
- Session memory
- Explicit mood prompts

**Key Files to Update:**
- `packages/frontend/src/hooks/useBehaviorTracking.ts`
- Create: `packages/frontend/src/hooks/useVoiceInput.ts`
- `packages/backend/src/services/BehaviorAnalyzer.ts`

### 🚧 Phase 5: Polish & Demo (Week 5-6)
**Goal:** Production-ready with killer demo

**Key Features:**
- "Morph Again" button
- AI reasoning display
- Demo video
- README with GIFs
- Performance optimization

---

## 🛠️ Tech Stack

### Current
| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | React | 18.2 |
| Frontend | TypeScript | 5.2 |
| Frontend | Vite | 5.1 |
| Frontend | Framer Motion | 11.0 |
| Frontend | Styled Components | 6.1 |
| Frontend | Zustand | 4.5 |
| Backend | Node.js | 20+ |
| Backend | Express | 4.18 |
| Backend | TypeScript | 5.2 |
| AI | Gemini | 2.0 Flash |
| AI | Ollama | Latest |

### To Add
```bash
# Frontend
npm install react-spring           # Physics-based animations

# Backend (if using images)
npm install sharp                  # Image processing
npm install canvas                 # Server-side canvas
```

---

## 🎨 API Endpoints Reference

### Current Endpoints

```typescript
// Analytics
POST /api/analytics/session
POST /api/analytics/interaction
POST /api/analytics/pageview
GET  /api/analytics/metrics/:sessionId
GET  /api/analytics/session/:sessionId

// Adaptation
POST /api/adaptation/recommend
POST /api/adaptation/mood
POST /api/adaptation/feedback
```

### New Endpoints (Phase 1)

```typescript
// Visual Generation
POST /api/visuals/palette
  Body: { mood, timeOfDay, context? }
  Returns: { palette, reasoning, accessibility }

POST /api/visuals/icon
  Body: { featureName, style, mood, color }
  Returns: { svg, description }

POST /api/visuals/hero
  Body: { mood, style, timeOfDay }
  Returns: { image (base64 or URL) }
```

### New Endpoints (Phase 2)

```typescript
// AI Studio
POST /api/ai-studio/generate
  Body: { mood, behavior, timeOfDay, deviceType, ... }
  Returns: { 
    config: DesignProposal,
    validation: ValidationResult,
    uxFeedback: UXFeedback,
    reasoning: {...}
  }
```

---

## 🧬 Data Flow

### Current Flow
```
User Interaction
  ↓
Behavior Tracking
  ↓
Gemini Analysis
  ↓
Mood Detection
  ↓
Theme Switch
  ↓
UI Updates
```

### New Flow (After Implementation)
```
User Input (text/voice/behavior)
  ↓
Context Collection (mood, time, device, history)
  ↓
Multi-Agent System
  ├─ Designer Agent → Proposes design
  ├─ Engineer Agent → Validates feasibility
  └─ UX Agent → Predicts user response
  ↓
Visual Generation
  ├─ Color Palette (Gemini)
  ├─ SVG Icons (Gemini)
  └─ Hero Images (Ollama/Flux)
  ↓
Morphing Animation Engine
  ├─ Color transitions (CSS vars)
  ├─ Layout morphing (Framer Motion)
  ├─ Icon transformations (SVG morphing)
  └─ Particle reactivity (Canvas)
  ↓
UI Rebuilds Itself
```

---

## 🎯 Key Differentiators

What makes MorphUI special:

1. **Multi-Agent AI** — Not one AI, but three collaborating (Designer, Engineer, UX)
2. **Visual Generation** — Creates actual design assets (icons, colors, images)
3. **True Morphing** — Layout physically rearranges, not just theme switching
4. **Context-Aware** — Understands mood, time, behavior, history
5. **Explainable AI** — Shows reasoning, not black box
6. **Local + Cloud** — Ollama for privacy, Gemini for power
7. **Unique Sessions** — Every experience is different

---

## 🚨 Common Issues & Solutions

### Ollama Issues
```bash
# Ollama not responding
pkill ollama && ollama serve

# Model not found
ollama pull flux:schnell
ollama pull gemma3:4b

# Check models
ollama list

# Test Ollama
curl http://localhost:11434/api/tags
```

### Gemini API Issues
```bash
# API key not working
echo $GEMINI_API_KEY  # Check if set

# Rate limited
# Use Gemini 2.0 Flash (higher limits)

# Quota exceeded
# Switch to Ollama for local inference
```

### Frontend Issues
```bash
# Port already in use
lsof -ti:5173 | xargs kill -9

# Build fails
rm -rf node_modules package-lock.json
npm install

# TypeScript errors
npm run build  # Check for compilation errors
```

### Backend Issues
```bash
# Port already in use
lsof -ti:3000 | xargs kill -9

# Can't connect to Gemini
curl https://generativelanguage.googleapis.com/v1/models?key=YOUR_KEY

# Can't connect to Ollama
curl http://localhost:11434/api/tags
```

---

## 📊 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First paint | < 1s | ✅ ~800ms |
| Time to interactive | < 2s | ✅ ~1.5s |
| Animation FPS | 60 | ✅ 60 |
| AI decision time | < 2s | ⚠️ ~3-4s |
| Palette generation | < 1s | 🚧 Not implemented |
| Icon generation | < 500ms | 🚧 Not implemented |
| Image generation | < 5s | 🚧 Not implemented |
| Layout morph duration | < 1s | ✅ ~800ms |

---

## 🎬 Demo Script (30 seconds)

```
[0:00] Open app → Birth animation
[0:05] Type "I'm stressed" → UI calms
[0:10] Click "Morph Again" → Everything changes
[0:15] Show AI reasoning card
[0:20] Mouse over particles → React
[0:25] Final morph → Freeze on beauty shot
[0:30] End
```

---

## 📝 Environment Setup

### `.env` Files

**`packages/backend/.env`:**
```bash
# Required
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development

# Optional
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=gemma3:4b
PORT=3000
FRONTEND_URL=http://localhost:5173
```

**`packages/frontend/.env`:**
```bash
VITE_API_URL=http://localhost:3000/api
```

---

## 🔗 Useful Links

- **Gemini API:** https://ai.google.dev/
- **Ollama:** https://ollama.ai/
- **Framer Motion:** https://www.framer.com/motion/
- **React Spring:** https://www.react-spring.dev/
- **Styled Components:** https://styled-components.com/

---

## 💬 Questions?

**"Which AI model should I use?"**
→ Gemini 2.0 Flash (fast, free tier generous) + Ollama (local, private)

**"Do I need Ollama?"**
→ Only for image generation. Color and icon generation use Gemini.

**"Can I use GPT-4 instead?"**
→ Yes, but Gemini 2.0 Flash is faster and has higher free limits.

**"How much does this cost?"**
→ Gemini free tier: 15 requests/min, 1500/day. Ollama is free (local).

**"Will this work on mobile?"**
→ Yes, but image generation might be slow. Use Gemini for everything on mobile.

---

## 🎯 Next Actions

1. **Read [MORPHING_VISION.md](./MORPHING_VISION.md)** — Understand the full vision
2. **Follow [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** — Build it step-by-step
3. **Study [DEMO_STRATEGY.md](./DEMO_STRATEGY.md)** — Plan your demo
4. **Start with Phase 1** — Get visual generation working first
5. **Test frequently** — Use the curl commands above
6. **Record your demo** — People need to see it to believe it

---

**Ready to build the future of interfaces? Let's go. 🧬🚀**
