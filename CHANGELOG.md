# Changelog

All notable changes to MorphUI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2025-11-19
- **Testing Infrastructure Setup**
  - Added Vitest testing framework for frontend
  - Configured @testing-library/react for component testing
  - Added vitest.config.ts with coverage thresholds (80% target)
  - Created test setup with jsdom environment
  - Added initial test suite (5 passing tests)
  - Configured coverage reporting (text, JSON, HTML)
  
- **Testing Roadmap Documentation**
  - Created TESTING_ROADMAP.md with comprehensive testing plan
  - Defined 5-week timeline to achieve 80%+ coverage
  - Identified priority components for testing:
    - MoodDetector (mood detection logic)
    - ThemeEngine (theme morphing)
    - AdaptiveLayout (layout adaptation)
    - BehaviorTracker (user behavior analysis)
  
- **Test Scripts**
  - `npm run test` - Run tests in watch mode
  - `npm run test:ui` - Run tests with Vitest UI
  - `npm run test:coverage` - Generate coverage report
  - `npm run test:watch` - Run tests in watch mode

### Changed
- Updated frontend package.json with testing dependencies
- Added testing scripts to development workflow

### Goals for Q1 2026
- **Week 1**: Framework setup + first tests (10% coverage)
- **Week 2-3**: Component tests for core mood detection (50% coverage)
- **Week 4**: Integration tests for AI communication (65% coverage)
- **Week 5**: E2E tests with Playwright (80%+ coverage)
- **Week 6**: CI/CD integration + documentation

## [1.0.0] - 2025-XX-XX

### Initial Release
- Adaptive UI with real-time morphing based on user mood
- Mood detection from interaction patterns (speed, errors, dwell time)
- Theme morphing (minimalist dark, vibrant light, focus mode, etc.)
- Layout adaptation (card vs list view, feature visibility)
- Ollama/Gemini AI integration for behavior analysis
- React frontend with Framer Motion animations
- Node.js backend with Express
- Local AI processing for privacy

### Features
- 85% mood detection confidence
- Real-time UI morphing
- Privacy-first (local AI processing)
- Responsive design
- Customizable themes
- Behavior analytics

---

## Version History
- **Unreleased**: Testing infrastructure and roadmap
- **1.0.0**: Initial production release (beta)
