# MorphUI Quick Start Guide

Get MorphUI running in 5 minutes! ⚡

## Prerequisites

- Node.js 20+ ([Download](https://nodejs.org))
- Ollama for local AI ([Install](https://ollama.ai))

## Installation

### Option 1: Automated Script (Recommended)

```bash
# Clone the repository
git clone https://github.com/wesleyscholl/MorphUI.git
cd MorphUI

# Install Ollama (if not installed)
brew install ollama  # macOS
# or visit https://ollama.ai for other platforms

# Start Ollama
ollama serve

# Pull the AI model (in another terminal)
ollama pull gemma3:270m

# Run installation script
chmod +x install.sh
./install.sh

# Start development
npm run dev
```

### Option 2: Manual Installation

```bash
# Clone
git clone https://github.com/wesleyscholl/MorphUI.git
cd MorphUI

# Install Ollama
brew install ollama  # or visit https://ollama.ai

# Start Ollama service
ollama serve

# Pull AI model (in another terminal)
ollama pull gemma3:270m

# Install dependencies
npm install
cd packages/backend && npm install && cd ../..
cd packages/frontend && npm install && cd ../..

# Configure environment (optional - defaults work)
cp packages/backend/.env.example packages/backend/.env
# Defaults: OLLAMA_URL=http://localhost:11434, OLLAMA_MODEL=gemma3:270m

# Start servers
npm run dev
```

## Access the App

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## First Steps

### 1. Interact with the UI
Click around, explore features, scroll through content. MorphUI is watching! 👀

### 2. Wait for Adaptation
After ~10 interactions, MorphUI will analyze your behavior and adapt (every 30s).

### 3. Try Demo Modes
Click the **🎮 Demo** button (top right) to try preset moods:
- **🤖 Auto** - AI-driven adaptation
- **😰 Stressed** - Simplified, calm UI
- **🎯 Focused** - Minimal distractions
- **🔍 Explorer** - Rich, playful features
- **😌 Relaxed** - Spacious, comfortable

### 4. Force Adaptation
Click **🔄 Request Adaptation** in the Demo Controls to trigger immediate analysis.

## What to Expect

### Stressed Mode
- **Dark, minimal theme**
- **List layout** (single column)
- **Only 3 core features** visible
- **Slow, calming animations**
- **Increased spacing**

### Explorer Mode
- **Vibrant, colorful theme**
- **Grid layout** with cards
- **All 15 features** visible
- **Playful animations**
- **Tooltips everywhere**

### Focused Mode
- **Dark productivity theme**
- **Compact spacing**
- **5-7 key features**
- **Minimal animations**
- **Keyboard shortcuts** (future)

## Troubleshooting

### "Cannot connect to backend"
```bash
# Check backend is running
curl http://localhost:3000/health

# If not, restart:
npm run dev:backend
```

### "GEMINI_API_KEY not found"
```bash
# Verify .env exists and has your key
cat packages/backend/.env

# Restart backend after adding key
npm run dev:backend
```

### "Adaptation not triggering"
- **Interact more** - Need 10+ interactions
- **Wait 30 seconds** - Auto-adaptation has a delay
- **Try manual trigger** - Use Demo Controls
- **Check console** - Look for errors in browser DevTools

### "UI looks wrong"
```bash
# Clear browser cache
# Hard reload: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# Restart frontend
npm run dev:frontend
```

## Testing the AI

### Simulate Stressed User
1. Click rapidly on different features (15+ clicks in 30 seconds)
2. Make some "errors" (click same thing multiple times quickly)
3. Short dwell times (click, wait 1s, click again)
4. Wait for adaptation → Should suggest minimal, calm UI

### Simulate Relaxed User
1. Click slowly, explore leisurely
2. Long dwell times (stay on each feature 5+ seconds)
3. Low error rate
4. Deep scrolling
5. Wait for adaptation → Should suggest spacious, colorful UI

### Simulate Explorer
1. Visit many different features
2. Scroll through everything
3. Hover over elements (if enabled)
4. Navigate to different "pages" (pageview tracking)
5. Wait for adaptation → Should suggest rich, feature-filled UI

## API Endpoints

### Analytics
```bash
# Create session
curl -X POST http://localhost:3000/api/analytics/session \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-123"}'

# Track interaction
curl -X POST http://localhost:3000/api/analytics/interaction \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-123","interaction":{"type":"click","target":"dashboard"}}'

# Get metrics
curl http://localhost:3000/api/analytics/metrics/test-123
```

### Adaptation
```bash
# Request adaptation
curl -X POST http://localhost:3000/api/adaptation/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId":"test-123",
    "currentState":{
      "theme":"minimal-light",
      "layout":"grid",
      "features":["dashboard","analytics"]
    }
  }'
```

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Edit frontend code → Browser auto-refreshes
- Edit backend code → Server auto-restarts

### Debug Mode
```bash
# Backend with detailed logs
NODE_ENV=development npm run dev:backend

# Frontend with React DevTools
# Install: https://react.dev/learn/react-developer-tools
```

### Testing Adaptations
```javascript
// In browser console:
localStorage.clear(); // Clear session
sessionStorage.clear(); // Clear session ID
location.reload(); // Fresh start
```

## Next Steps

1. **Read the docs**: Check `ARCHITECTURE.md` for system design
2. **Customize themes**: Edit `packages/frontend/src/theme/themes.ts`
3. **Add features**: Create new feature cards in Dashboard
4. **Improve AI**: Tune prompts in `packages/backend/src/services/ollama.ts`
5. **Try different models**: `ollama pull gemma2:2b` (faster) or `ollama pull llama3.2:3b`
6. **Contribute**: See `CONTRIBUTING.md` for guidelines

## Resources

- **Main README**: `/README.md`
- **Architecture**: `/ARCHITECTURE.md`
- **Contributing**: `/CONTRIBUTING.md`
- **Environment Vars**: `/ENVIRONMENT.md`

## Getting Help

- **Issues**: Open a GitHub issue
- **Discussions**: GitHub Discussions
- **Email**: [Add your email]

---

**Enjoy your adaptive UI experience!** 🧬✨
