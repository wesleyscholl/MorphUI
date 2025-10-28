#!/bin/bash

echo "🎨 Testing MorphUI AI Studio (Multi-Agent System)"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

# Test 1: Check AI Studio status
echo -e "${BLUE}1️⃣  Testing AI Studio status...${NC}"
curl -s "${BASE_URL}/api/ai-studio/status" | jq '.'
echo ""
echo ""

# Test 2: Quick design (single agent)
echo -e "${BLUE}2️⃣  Testing quick design (Designer agent only)...${NC}"
echo -e "${YELLOW}Request: Create a hero section for a meditation app${NC}"
curl -s -X POST "${BASE_URL}/api/ai-studio/quick" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a hero section for a meditation app",
    "userMood": "relaxed",
    "timeOfDay": "evening"
  }' | jq '{
    success: .success,
    agentType: .result.agentType,
    message: .result.message,
    confidence: .result.confidence,
    suggestions: .result.suggestions
  }'
echo ""
echo ""

# Test 3: Full multi-agent collaboration
echo -e "${BLUE}3️⃣  Testing multi-agent design collaboration...${NC}"
echo -e "${YELLOW}Request: Design a notification system that adapts to user stress levels${NC}"
echo -e "${YELLOW}(This will take ~30-60 seconds as 3 AI agents collaborate)${NC}"
echo ""

START_TIME=$(date +%s)

curl -s -X POST "${BASE_URL}/api/ai-studio/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Design a notification system that adapts to user stress levels. When stressed, notifications should be minimal and calming. When focused, they should be clear but non-intrusive.",
    "userMood": "stressed",
    "timeOfDay": "afternoon",
    "feature": "notifications",
    "constraints": ["Must work on mobile", "WCAG AA compliance required"]
  }' | jq '{
    success: .success,
    consensus: .result.consensus,
    confidence: .result.confidence,
    iterationCount: .result.iterationCount,
    finalDesign: .result.finalDesign,
    agentSummary: {
      designer: {
        message: .result.designerProposal.message[0:200] + "...",
        confidence: .result.designerProposal.confidence
      },
      engineer: {
        approves: .result.engineerReview.approves,
        confidence: .result.engineerReview.confidence,
        concerns: .result.engineerReview.concerns
      },
      ux: {
        approves: .result.uxReview.approves,
        confidence: .result.uxReview.confidence,
        concerns: .result.uxReview.concerns
      }
    },
    discussionLength: (.result.discussion | length)
  }'

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo -e "${GREEN}✅ Collaboration completed in ${DURATION} seconds${NC}"
echo ""

# Test 4: Another quick example
echo -e "${BLUE}4️⃣  Testing another design scenario...${NC}"
echo -e "${YELLOW}Request: Create a dashboard for tracking daily habits${NC}"

curl -s -X POST "${BASE_URL}/api/ai-studio/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a dashboard layout for tracking daily habits like water intake, exercise, and meditation",
    "userMood": "focused",
    "timeOfDay": "morning",
    "feature": "dashboard"
  }' | jq '{
    success: .success,
    consensus: .result.consensus,
    confidence: .result.confidence,
    iterationCount: .result.iterationCount,
    designSummary: .result.finalDesign[0:300] + "..."
  }'

echo ""
echo ""
echo -e "${GREEN}✅ All AI Studio tests completed!${NC}"
echo ""
echo "📝 Notes:"
echo "   - Multi-agent collaboration involves 3 AI agents discussing the design"
echo "   - Designer proposes, Engineer validates, UX reviews"
echo "   - System iterates up to 2 times to reach consensus"
echo "   - Full collaboration takes 30-90 seconds depending on complexity"
