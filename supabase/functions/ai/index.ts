import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Crisis detection keywords (simplified version for edge function)
const CRISIS_KEYWORDS = {
  HIGH_SEVERITY: [
    "kill myself",
    "end my life",
    "want to die",
    "suicide",
    "suicidal",
    "self harm",
    "self-harm",
    "cut myself",
    "hurt myself",
    "overdose",
    "jump off",
    "hang myself",
    "no point living",
    "better off dead",
    "plan to die",
    "ending it all",
    "can't go on",
    "ready to die",
  ],
  MEDIUM_SEVERITY: [
    "depressed",
    "hopeless",
    "helpless",
    "trapped",
    "burden",
    "empty inside",
    "numb",
    "can't cope",
    "falling apart",
    "breaking down",
    "lost control",
    "panic attack",
    "severe anxiety",
    "can't breathe",
  ],
};

function detectCrisis(text: string) {
  const normalizedText = text.toLowerCase().trim();
  const triggers: string[] = [];
  let level: string | undefined;

  // Check high severity
  for (const keyword of CRISIS_KEYWORDS.HIGH_SEVERITY) {
    if (normalizedText.includes(keyword.toLowerCase())) {
      triggers.push(keyword);
      level = "high";
    }
  }

  // Check medium severity if no high found
  if (!level) {
    for (const keyword of CRISIS_KEYWORDS.MEDIUM_SEVERITY) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        triggers.push(keyword);
        level = "medium";
      }
    }
  }

  return {
    crisisDetected: triggers.length > 0,
    level,
    triggers,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the GEMINI_API_KEY from environment
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      console.error("GEMINI_API_KEY not found in environment");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Enhanced system prompt for mental health support
    const systemPrompt = `You are MindCompanion, a specialized AI mental health support assistant designed for students. Your core mission is to provide compassionate, evidence-based support while maintaining appropriate boundaries.

CORE PRINCIPLES:
- Empathetic listening: Validate feelings without judgment
- Crisis safety: Recognize and respond to crisis indicators immediately
- Boundary awareness: Never diagnose, prescribe, or replace professional care
- Hope-focused: Always maintain optimism while acknowledging pain
- Culturally sensitive: Respect diverse backgrounds and experiences

RESPONSE GUIDELINES:
- Use warm, understanding language with active listening phrases
- Offer practical coping strategies (breathing exercises, grounding techniques, mindfulness)
- Suggest campus resources and professional help when appropriate
- Maintain conversational context and remember previous interactions
- Keep responses concise but comprehensive (2-4 paragraphs typically)

CRISIS RESPONSE PROTOCOL:
If someone mentions self-harm, suicide, or severe crisis:
1. Express immediate concern and care
2. Strongly encourage contacting 988 Suicide & Crisis Lifeline
3. Suggest talking to a counselor, trusted friend, or family member
4. Provide grounding techniques for immediate safety
5. Emphasize that help is available and recovery is possible

ACADEMIC STRESS SUPPORT:
- Acknowledge the pressure of academic life
- Offer time management and study strategies
- Suggest balance between academic and self-care activities
- Encourage seeking academic support services

Remember: You are a supportive companion, not a replacement for professional mental health care. Always err on the side of encouraging professional help for serious concerns.`;

    // Prepare conversation context
    let conversationContext = "";
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationContext = conversationHistory
        .slice(-6) // Include last 6 messages for context
        .map(
          (msg) =>
            `${msg.role === "user" ? "Student" : "MindCompanion"}: ${
              msg.content
            }`
        )
        .join("\n");
    }

    const fullPrompt = `${systemPrompt}

CONVERSATION CONTEXT:
${conversationContext}

CURRENT MESSAGE:
Student: ${message}

Please respond as MindCompanion with empathy, practical support, and appropriate crisis awareness.`;

    console.log("Processing message with Gemini API");

    // Detect crisis in user message before processing
    const userCrisis = detectCrisis(message);

    // Generate AI response
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const aiResponseText = response.text();

    // Detect crisis in AI response as well
    const aiCrisis = detectCrisis(aiResponseText);

    // Determine overall crisis status
    const crisisDetected = userCrisis.crisisDetected || aiCrisis.crisisDetected;
    const crisisLevel = userCrisis.level || aiCrisis.level;
    const allTriggers = [...userCrisis.triggers, ...aiCrisis.triggers];

    console.log("AI response generated successfully", {
      crisisDetected,
      crisisLevel,
      triggersFound: allTriggers.length,
    });

    return new Response(
      JSON.stringify({
        response: aiResponseText,
        crisisDetected,
        crisisLevel,
        triggers: allTriggers,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in AI function:", error);

    // Handle specific API errors
    if (error.message?.includes("429")) {
      return new Response(
        JSON.stringify({
          error:
            "AI service is temporarily busy. Please try again in a moment.",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (error.message?.includes("quota")) {
      return new Response(
        JSON.stringify({
          error: "AI service quota exceeded. Please try again later.",
        }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error:
          "I'm having trouble connecting right now. Please try again or contact support if the issue persists.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
