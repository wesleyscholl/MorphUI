# Contributing to MorphUI

Thank you for your interest in contributing to MorphUI! 🎉

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/MorphUI.git
   cd MorphUI
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

## Development Workflow

### Running Locally

```bash
# Start both frontend and backend
npm run dev

# Or run them separately
npm run dev:frontend
npm run dev:backend
```

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Use Prettier defaults
- **Linting**: ESLint with React/TypeScript rules
- **Naming**: camelCase for variables, PascalCase for components

### Commit Messages

Follow conventional commits:
```
feat: add new mood detection algorithm
fix: correct adaptation timing issue
docs: update API documentation
style: format theme files
refactor: simplify behavior analyzer
test: add unit tests for Gemini service
```

## Areas for Contribution

### 🧠 AI & Adaptation
- New mood detection algorithms
- Enhanced adaptation logic
- Multi-user collaboration awareness
- Predictive pre-loading

### 🎨 UI & Themes
- New theme variations
- Additional layouts (masonry, tree, etc.)
- Animation improvements
- Mobile-specific adaptations

### 📊 Analytics
- Advanced metrics calculation
- Machine learning integration
- Heatmap generation
- Session replay

### 🔧 Infrastructure
- Performance optimizations
- Caching strategies
- WebSocket implementation
- Database integration

### 📱 Features
- User preferences storage
- A/B testing framework
- Plugin system
- Voice mood detection

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Check coverage
npm run test:coverage
```

## Pull Request Process

1. **Update documentation** if you've changed APIs
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Update the README** if needed
5. **Create a pull request** with a clear description

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No lint errors
```

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

## Community

- **Be respectful** and constructive
- **Help others** learn and grow
- **Share ideas** openly
- **Celebrate success** together

## Questions?

Open an issue with the `question` label or reach out to the maintainers.

---

**Thank you for helping make MorphUI better!** 🚀
