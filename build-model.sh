#!/bin/bash

# Build optimized Ollama model for MorphUI
echo "🚀 Building optimized MorphUI model..."
echo ""

# Check if Ollama is running
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed. Please install it first:"
    echo "   brew install ollama"
    exit 1
fi

# Create the model
echo "Creating model from Modelfile..."
ollama create morphui-optimized -f Modelfile

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Model created successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Update your backend .env file:"
    echo "   OLLAMA_MODEL=morphui-optimized"
    echo ""
    echo "2. Restart your backend server:"
    echo "   cd packages/backend && npm run dev"
    echo ""
    echo "3. Test theme generation with the improved model!"
else
    echo ""
    echo "❌ Failed to create model"
    echo "Make sure Ollama is running: ollama serve"
    exit 1
fi
