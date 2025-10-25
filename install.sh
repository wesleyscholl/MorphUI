#!/bin/bash

# MorphUI Installation Script

set -e

echo "🧬 Installing MorphUI..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    echo "   Visit: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js 20+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd packages/backend
npm install
cd ../..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd packages/frontend
npm install
cd ../..

# Setup environment
echo "🔧 Setting up environment..."
if [ ! -f "packages/backend/.env" ]; then
    cp packages/backend/.env.example packages/backend/.env
    echo "✅ Created packages/backend/.env"
    echo "⚠️  Please add your GEMINI_API_KEY to packages/backend/.env"
else
    echo "ℹ️  packages/backend/.env already exists"
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Add your GEMINI_API_KEY to packages/backend/.env"
echo "      Get one at: https://ai.google.dev/"
echo "   2. Run 'npm run dev' to start development servers"
echo "   3. Open http://localhost:5173 in your browser"
echo ""
echo "🚀 Happy coding with MorphUI!"
