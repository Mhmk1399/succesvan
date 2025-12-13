#!/bin/bash

# Conversational AI Feature - Setup Verification
echo "🤖 Conversational AI Feature - Setup Check"
echo "=========================================="
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check OpenAI library
echo "📚 Checking OpenAI Library..."
if grep -q "textToSpeech" lib/openai.ts; then
    echo -e "${GREEN}✅ TTS function found${NC}"
else
    echo -e "${RED}❌ TTS function missing${NC}"
fi

if grep -q "conversationalReservation" lib/openai.ts; then
    echo -e "${GREEN}✅ Conversational function found${NC}"
else
    echo -e "${RED}❌ Conversational function missing${NC}"
fi

echo ""
echo "🔌 Checking API Endpoints..."
if [ -f "app/api/conversation/route.ts" ]; then
    echo -e "${GREEN}✅ Conversation API endpoint exists${NC}"
else
    echo -e "${RED}❌ Conversation API endpoint missing${NC}"
fi

echo ""
echo "🎣 Checking Hooks..."
if [ -f "hooks/useConversationalVoice.ts" ]; then
    echo -e "${GREEN}✅ Conversational voice hook exists${NC}"
else
    echo -e "${RED}❌ Conversational voice hook missing${NC}"
fi

echo ""
echo "🎨 Checking Components..."
if [ -f "components/global/ConversationalModal.tsx" ]; then
    echo -e "${GREEN}✅ Conversational modal exists${NC}"
else
    echo -e "${RED}❌ Conversational modal missing${NC}"
fi

if grep -q "ConversationalModal" components/global/ReservationForm.tsx; then
    echo -e "${GREEN}✅ Modal integrated in ReservationForm${NC}"
else
    echo -e "${RED}❌ Modal not integrated${NC}"
fi

if grep -q "Talk to AI" components/global/ReservationForm.tsx; then
    echo -e "${GREEN}✅ 'Talk to AI' button added${NC}"
else
    echo -e "${RED}❌ 'Talk to AI' button missing${NC}"
fi

echo ""
echo "📖 Checking Documentation..."
if [ -f "CONVERSATIONAL_AI_GUIDE.md" ]; then
    echo -e "${GREEN}✅ User guide exists${NC}"
else
    echo -e "${RED}❌ User guide missing${NC}"
fi

echo ""
echo "⚙️  Checking Environment..."
if [ -f ".env" ]; then
    if grep -q "OPENAI_API_KEY" .env; then
        key_value=$(grep "^OPENAI_API_KEY=" .env | cut -d '=' -f2-)
        if [ -n "$key_value" ] && [ "$key_value" != "your_"* ]; then
            echo -e "${GREEN}✅ OpenAI API key configured${NC}"
        else
            echo -e "${YELLOW}⚠️  OpenAI API key not set${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  OpenAI API key variable missing${NC}"
    fi
else
    echo -e "${RED}❌ .env file not found${NC}"
fi

echo ""
echo "=========================================="
echo "📊 Summary"
echo "=========================================="
echo ""
echo "New Files Created:"
echo "  • lib/openai.ts (updated with TTS & conversation)"
echo "  • app/api/conversation/route.ts"
echo "  • hooks/useConversationalVoice.ts"
echo "  • components/global/ConversationalModal.tsx"
echo "  • CONVERSATIONAL_AI_GUIDE.md"
echo ""
echo "Modified Files:"
echo "  • components/global/ReservationForm.tsx"
echo ""
echo "New Features:"
echo "  🎤 Voice-to-text transcription (Whisper-1)"
echo "  🤖 Conversational AI (GPT-4o-mini)"
echo "  🔊 Text-to-speech responses (TTS-1)"
echo "  💬 Multi-turn conversation support"
echo "  📋 Real-time booking preview"
echo "  ✅ Voice confirmation of details"
echo ""
echo "=========================================="
echo "🚀 Next Steps"
echo "=========================================="
echo ""
echo "1. Make sure OPENAI_API_KEY is set in .env"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000/reservation"
echo "4. Click the purple 'Talk to AI' button"
echo "5. Have a conversation!"
echo ""
echo "📖 For detailed instructions, see:"
echo "   CONVERSATIONAL_AI_GUIDE.md"
echo ""
