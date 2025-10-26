# 🧬 MorphUI — The Interface That Evolves With You

<div align="center">

✨ **An adaptive, AI-driven frontend that transforms itself in real time** ✨

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Ollama](https://img.shields.io/badge/Ollama-Local_AI-000000)](https://ollama.ai/)

</div>

---

## 💡 What is MorphUI?

**MorphUI** dynamically rewrites its layout, theme, and features based on your:
- 🎭 **Mood** - Inferred from interaction patterns
- ⚙️ **Behavior** - Click patterns, navigation flow, feature usage  
- 💬 **Intent** - What you're trying to accomplish

Built with ⚛️ React, 🟩 Node.js, and 🤖 Ollama (local AI), it explores the future of **self-evolving user experiences** — where design meets intelligence.

> 💡 **Every session feels different — because MorphUI learns you.**

---

## ✨ Features

### 🎨 Dynamic Adaptation
- **Mood-Based Themes** - Stressed → calming minimalism. Focused → dark productivity mode
- **Behavior-Driven Layouts** - Card view for explorers, list view for power users
- **Intelligent Feature Toggling** - Show features you actually use, hide clutter

### 🧠 AI-Powered Intelligence
- **Real-Time Analysis** - Local Ollama AI analyzes your interactions
- **Predictive UX** - Anticipates what you need next
- **Adaptive Recommendations** - UI evolves based on effectiveness metrics
- **Privacy First** - All AI processing happens locally, no cloud APIs

### 🎭 Mood Detection
- **Interaction Speed** - Fast clicks = stressed, slow = relaxed
- **Error Rate** - High errors trigger simplified UI
- **Dwell Time** - Long contemplation = need for guidance

### 🌈 Visual Morphing
- **Minimalist Dark** - Calm, focused, distraction-free
- **Vibrant Light** - Energetic, playful, colorful
- **Gamified** - Progress bars, achievements, celebrations
- **Productivity** - Dense information, keyboard shortcuts

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      🎨 React Frontend                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Theme Engine │  │ UI Morphing  │  │  Analytics   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕️  WebSocket + REST
┌─────────────────────────────────────────────────────────────┐
│                     🟩 Node.js Backend                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Behavior    │  │  Adaptation  │  │   Session    │     │
│  │   Engine     │  │   Engine     │  │   Manager    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕️  Local HTTP
┌─────────────────────────────────────────────────────────────┐
│                  🤖 Ollama Local AI (gemma2)                 │
│      Mood Inference · UX Generation · Recommendations       │
│              ✅ Privacy-First · No Cloud APIs               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Ollama ([Install here](https://ollama.ai/))

### Installation

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

# Install dependencies
npm install

# Configure environment (optional - defaults work)
cp packages/backend/.env.example packages/backend/.env

# Start development servers
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:3000

---

## 🎯 How It Works

### 1️⃣ Behavior Tracking
Every interaction is tracked:
- Click coordinates and timing
- Mouse movement patterns
- Scroll behavior
- Feature usage frequency
- Time spent per section

### 2️⃣ Mood Inference
AI analyzes patterns to detect mood:
```typescript
{
  mood: "stressed",
  confidence: 0.85,
  indicators: {
    rapidClicks: 12,
    errorRate: 0.18,
    avgDwellTime: 1.2
  }
}
```

### 3️⃣ UI Adaptation
System morphs the interface:
```typescript
// Before: Complex dashboard
<Dashboard layout="grid" features={15} theme="vibrant" />

// After: Stress detected
<Dashboard layout="list" features={5} theme="minimal-dark" />
```

### 4️⃣ Learning Loop
Effectiveness is measured and fed back:
- Did simplification reduce errors?
- Did gamification increase engagement?
- System evolves its adaptation strategy

---

## 🎨 Adaptation Examples

### Scenario: Stressed User
**Detection:**
- 🔴 High click frequency (15+ per minute)
- 🔴 Error rate above 15%
- 🔴 Short dwell times (<2 seconds)

**Adaptation:**
```
Theme: Minimalist Dark
Layout: Single-column list
Features: Core 5 only
Colors: Muted blues and grays
Animations: Minimal, smooth
Spacing: Increased 20%
```

### Scenario: Exploratory User
**Detection:**
- 🟢 Varied navigation patterns
- 🟢 Long dwell times (>10 seconds)
- 🟢 Low error rate (<5%)

**Adaptation:**
```
Theme: Vibrant Light
Layout: Card grid with previews
Features: All 15+ visible
Colors: Bright, varied palette
Animations: Playful transitions
Help: Tooltips everywhere
```

---

## 🧪 Demo Modes

MorphUI includes preset demo modes:

```bash
# Stress mode - see simplified UI
npm run demo:stress

# Explorer mode - rich, gamified experience  
npm run demo:explorer

# Focus mode - productivity-optimized
npm run demo:focus

# Random mode - AI picks based on time of day
npm run demo:random
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Framer Motion** - Smooth animations
- **Styled Components** - Dynamic theming
- **Zustand** - State management
- **Vite** - Lightning-fast builds

### Backend
- **Node.js + Express** - REST API
- **Google Gemini AI** - Intelligence layer
- **TypeScript** - End-to-end types

### AI Integration
- **Gemini 1.5 Pro** - Behavior analysis
- **Custom prompts** - UX decision-making
- **Real-time streaming** - Instant feedback

---

## 📊 Metrics & Analytics

MorphUI tracks effectiveness:
- **Adaptation Success Rate** - Did the change help?
- **User Satisfaction** - Implicit feedback signals
- **Feature Usage** - Before/after comparison
- **Error Reduction** - Did simplification work?
- **Engagement Time** - Are users staying longer?

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Ideas for contributions:
- New mood detection algorithms
- Additional theme variations
- Mobile-specific adaptations
- Accessibility enhancements
- New demo scenarios

---

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🌟 Why MorphUI?

Traditional UIs are **static** - one design for everyone.  
MorphUI is **alive** - it adapts to you in real time.

### The Vision
- **No more "one size fits all"** - UI matches your state
- **Reduce cognitive load** - See only what you need
- **Increase productivity** - Interface optimizes for your workflow  
- **Delightful experiences** - UI surprises and adapts

### Real-World Applications
- **SaaS dashboards** - Adapt to user expertise level
- **E-commerce** - Match shopping mood (browsing vs. buying)
- **Productivity tools** - Switch between focus and exploration modes
- **Learning platforms** - Adjust complexity to comprehension
- **Healthcare apps** - Calm UI for stressed patients

---

## 🚀 Future Roadmap

- [ ] Voice tone analysis for mood detection
- [ ] Multi-user collaboration awareness
- [ ] Predictive pre-loading of likely next features
- [ ] Cross-device state synchronization
- [ ] A/B testing framework for adaptations
- [ ] Plugin system for custom adaptation rules
- [ ] Mobile-native version
- [ ] VR/AR adaptive interfaces

---

## 💬 Questions?

Open an issue or reach out:
- 📧 Email: [your-email]
- 🐦 Twitter: [@yourhandle]
- 💼 LinkedIn: [your-profile]

---

<div align="center">

**Built with ❤️ by [Wesley Scholl](https://github.com/wesleyscholl)**

*MorphUI - Because your interface should know you*

⭐ Star this repo if you believe in adaptive interfaces!

</div>
