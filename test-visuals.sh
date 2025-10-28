#!/bin/bash

# Test script for MorphUI Visual Generation API
# Make sure the backend is running on http://localhost:3000

echo "🧪 Testing MorphUI Visual Generation API"
echo "=========================================="
echo ""

# Test 1: Health Check
echo "1️⃣  Testing health endpoint..."
curl -s http://localhost:3000/health | jq
echo ""
echo ""

# Test 2: Color Palette Generation
echo "2️⃣  Testing color palette generation (relaxed + evening)..."
curl -s -X POST http://localhost:3000/api/visuals/palette \
  -H "Content-Type: application/json" \
  -d '{"mood":"relaxed","timeOfDay":"evening"}' | jq
echo ""
echo ""

# Test 3: SVG Icon Generation
echo "3️⃣  Testing SVG icon generation (calendar icon)..."
curl -s -X POST http://localhost:3000/api/visuals/icon \
  -H "Content-Type: application/json" \
  -d '{"featureName":"calendar","style":"outline","mood":"focused","color":"#6366f1"}' | jq '.icon.description'
echo ""
echo ""

# Test 4: Hero Image (returns gradient fallback)
echo "4️⃣  Testing hero image generation (returns gradient)..."
curl -s -X POST http://localhost:3000/api/visuals/hero \
  -H "Content-Type: application/json" \
  -d '{"mood":"energetic","style":"modern","timeOfDay":"morning"}' | jq '.image' | head -c 100
echo "..."
echo ""
echo ""

echo "✅ All tests completed!"
echo ""
echo "📝 Note: To enable full AI generation (not just fallbacks),"
echo "   set your GEMINI_API_KEY in packages/backend/.env"
echo "   Get it from: https://aistudio.google.com/app/apikey"
