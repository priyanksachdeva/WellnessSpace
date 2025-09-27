/// <reference path="../_shared/deno-types.d.ts" />

// @ts-ignore - Deno import, not Node.js
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore - ESM import, not Node.js
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.21.0";
// @ts-ignore - ESM import, not Node.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import type {
  ConversationMessage,
  CrisisDetectionResult,
} from "../_shared/types.ts";

interface CrisisAnalysisResult {
  riskLevel: "low" | "medium" | "high" | "crisis";
  confidenceScore: number;
  detectedConcerns: string[];
  suggestedActions: string[];
  emotionalIndicators: {
    distress: number;
    hopelessness: number;
    isolation: number;
    urgency: number;
  };
  requiresIntervention: boolean;
  recommendedResources: string[];
}

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

function detectCrisis(text: string): CrisisDetectionResult {
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
    level: level as CrisisDetectionResult["level"],
    triggers,
  };
}

function getLocalizedSystemPrompt(language: string): string {
  const basePrompt = {
    en: `You are MindCompanion, a specialized AI mental health support assistant designed for students. Your core mission is to provide compassionate, evidence-based support while maintaining appropriate boundaries.

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
2. Strongly encourage contacting KIRAN Mental Health Helpline 1800-599-0019 (FREE 24/7) or iCALL 9152987821
3. Suggest talking to a counselor, trusted friend, or family member
4. Provide grounding techniques for immediate safety
5. Emphasize that help is available and recovery is possible

ACADEMIC STRESS SUPPORT:
- Acknowledge the pressure of academic life
- Offer time management and study strategies
- Suggest balance between academic and self-care activities
- Encourage seeking academic support services

Remember: You are a supportive companion, not a replacement for professional mental health care. Always err on the side of encouraging professional help for serious concerns.`,

    hi: `आप MindCompanion हैं, छात्रों के लिए डिज़ाइन किया गया एक विशेष AI मानसिक स्वास्थ्य सहायता सहायक। आपका मुख्य मिशन उचित सीमाओं को बनाए रखते हुए दयालु, साक्ष्य-आधारित सहायता प्रदान करना है।

मुख्य सिद्धांत:
- सहानुभूतिपूर्ण सुनना: बिना निर्णय के भावनाओं को मान्य करें
- संकट सुरक्षा: संकट संकेतकों को पहचानें और तुरंत प्रतिक्रिया दें
- सीमा जागरूकता: कभी भी निदान, दवा न लिखें, या पेशेवर देखभाल को प्रतिस्थापित न करें
- आशा-केंद्रित: दर्द को स्वीकार करते हुए हमेशा आशावाद बनाए रखें
- सांस्कृतिक संवेदनशील: विविध पृष्ठभूमि और अनुभवों का सम्मान करें

संकट प्रतिक्रिया प्रोटोकॉल:
यदि कोई आत्म-नुकसान, आत्महत्या या गंभीर संकट का उल्लेख करता है:
1. तत्काल चिंता और देखभाल व्यक्त करें
2. स्थानीय आपातकालीन सेवाओं या मानसिक स्वास्थ्य हेल्पलाइन से संपर्क करने को प्रोत्साहित करें
3. किसी परामर्शदाता, विश्वसनीय मित्र या परिवारजन से बात करने का सुझाव दें
4. तत्काल सुरक्षा के लिए ग्राउंडिंग तकनीकें प्रदान करें
5. इस बात पर जोर दें कि मदद उपलब्ध है और रिकवरी संभव है

याद रखें: आप एक सहायक साथी हैं, पेशेवर मानसिक स्वास्थ्य देखभाल का विकल्प नहीं।`,

    bn: `আপনি MindCompanion, ছাত্রছাত্রীদের জন্য ডিজাইন করা একটি বিশেষায়িত AI মানসিক স্বাস্থ্য সহায়তা সহায়ক। আপনার মূল লক্ষ্য উপযুক্ত সীমানা বজায় রেখে সহানুভূতিশীল, প্রমাণ-ভিত্তিক সহায়তা প্রদান করা।

মূল নীতিসমূহ:
- সহানুভূতিশীল শ্রবণ: বিচার ছাড়াই অনুভূতি বৈধ করুন
- সংকট নিরাপত্তা: সংকট সূচকগুলি চিহ্নিত করুন এবং অবিলম্বে প্রতিক্রিয়া জানান
- সীমানা সচেতনতা: কখনো নির্ণয়, প্রেসক্রিপশন বা পেশাদার যত্নের বিকল্প করবেন না
- আশা-কেন্দ্রিক: ব্যথা স্বীকার করেও সর্বদা আশাবাদ বজায় রাখুন
- সাংস্কৃতিকভাবে সংবেদনশীল: বিভিন্ন পটভূমি এবং অভিজ্ঞতার প্রতি সম্মান প্রদর্শন করুন

সংকট প্রতিক্রিয় প্রোটোকল:
যদি কেউ আত্ম-ক্ষতি, আত্মহত্যা বা গুরুতর সংকটের উল্লেখ করে:
1. অবিলম্বে উদ্বেগ এবং যত্ন প্রকাশ করুন
2. স্থানীয় জরুরি সেবা বা মানসিক স্বাস্থ্য হেল্পলাইনে যোগাযোগ করতে উৎসাহিত করুন
3. একজন পরামর্শদাতা, বিশ্বস্ত বন্ধু বা পরিবারের সদস্যের সাথে কথা বলার পরামর্শ দিন
4. তাৎক্ষণিক নিরাপত্তার জন্য গ্রাউন্ডিং কৌশল প্রদান করুন
5. জোর দিন যে সাহায্য পাওয়া যায় এবং পুনরুদ্ধার সম্ভব

মনে রাখবেন: আপনি একজন সহায়ক সহচর, পেশাদার মানসিক স্বাস্থ্য সেবার বিকল্প নন।`,
  };

  return basePrompt[language as keyof typeof basePrompt] || basePrompt.en;
}

async function invokeCrisisAnalysis(
  content: string,
  userId?: string,
  language?: string
): Promise<CrisisAnalysisResult | null> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials for crisis analysis");
      return null;
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/crisis-analysis`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          contentType: "message",
          userId,
          language,
        }),
      }
    );

    if (!response.ok) {
      console.error("Crisis analysis request failed:", response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error invoking crisis analysis:", error);
    return null;
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory, userId, userLanguage } =
      await req.json();

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return new Response(
        JSON.stringify({
          error: "Message is required and must be a non-empty string",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
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

    // Get language-specific system prompt
    const systemPrompt = getLocalizedSystemPrompt(userLanguage || "en");

    // Prepare conversation context
    let conversationContext = "";
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationContext = conversationHistory
        .slice(-6) // Include last 6 messages for context
        .filter((msg) => msg && msg.role && msg.content) // Filter valid messages
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

    // Get advanced crisis analysis
    const advancedCrisisAnalysis = await invokeCrisisAnalysis(
      message,
      userId,
      userLanguage
    );

    // Fallback to simple crisis detection if advanced analysis fails
    const fallbackCrisis = detectCrisis(message);

    // Generate AI response
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const aiResponseText = response.text();

    // Merge crisis detection results (backward compatibility)
    let mergedCrisisResult: CrisisDetectionResult;

    if (advancedCrisisAnalysis) {
      // Convert advanced analysis to backward-compatible format
      mergedCrisisResult = {
        crisisDetected:
          advancedCrisisAnalysis.requiresIntervention ||
          advancedCrisisAnalysis.riskLevel === "crisis" ||
          advancedCrisisAnalysis.riskLevel === "high",
        level:
          advancedCrisisAnalysis.riskLevel === "crisis"
            ? "high"
            : advancedCrisisAnalysis.riskLevel === "high"
            ? "high"
            : advancedCrisisAnalysis.riskLevel === "medium"
            ? "medium"
            : undefined,
        triggers: advancedCrisisAnalysis.detectedConcerns,
      };
    } else {
      // Use fallback crisis detection
      mergedCrisisResult = fallbackCrisis;
    }

    // Detect crisis in AI response as well (using simple detection for performance)
    const aiCrisis = detectCrisis(aiResponseText);

    // Determine overall crisis status
    const crisisDetected =
      mergedCrisisResult.crisisDetected || aiCrisis.crisisDetected;
    const crisisLevel = mergedCrisisResult.level || aiCrisis.level;
    const allTriggers = [
      ...(mergedCrisisResult.triggers || []),
      ...aiCrisis.triggers,
    ];

    console.log("AI response generated successfully", {
      crisisDetected,
      crisisLevel,
      triggersFound: allTriggers.length,
      hasAdvancedAnalysis: !!advancedCrisisAnalysis,
    });

    // Return response with backward compatibility and enhanced data
    const responseData: any = {
      response: aiResponseText,
      crisisDetected,
      crisisLevel,
      triggers: allTriggers,
    };

    // Add advanced crisis analysis if available
    if (advancedCrisisAnalysis) {
      responseData.advancedCrisisAnalysis = advancedCrisisAnalysis;
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in AI function:", error);

    // Handle specific API errors
    if (error instanceof Error && error.message?.includes("429")) {
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

    if (error instanceof Error && error.message?.includes("quota")) {
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
