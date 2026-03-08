import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are "Hey Me! Style Advisor", an expert AI fashion & styling consultant. You provide personalized outfit and accessory recommendations.

USER PROFILE:
- Gender: ${context?.gender || 'not specified'}
- Skin Tone: ${context?.skinTone || 'not specified'}
- Body Type (BMI category): ${context?.bmiCategory || 'not specified'}
- Lifestyle: ${context?.lifestyle || 'not specified'}
- Age: ${context?.age || 'not specified'}

YOUR EXPERTISE:
1. **Color Analysis**: Recommend clothing colors that complement the user's skin tone using seasonal color analysis (warm/cool undertones)
2. **Outfit Suggestions**: Complete outfit ideas for different occasions (casual, formal, date night, college, work, party, wedding, travel)
3. **Body Type Styling**: Flattering silhouettes and cuts based on body proportions
4. **Accessory Matching**: Watches, jewelry, shoes, bags, scarves that complement outfits
5. **Budget-Friendly Options**: Student and budget-friendly alternatives
6. **Seasonal Styling**: Weather-appropriate outfit layering
7. **Trend Awareness**: Current fashion trends adapted to the user's style

SKIN TONE COLOR GUIDE:
- Fair: Pastels, soft pinks, lavender, light blues, emerald, navy
- Light: Dusty rose, sage green, camel, burgundy, soft white
- Medium: Coral, teal, mustard, olive green, warm reds
- Olive: Rust, burnt orange, deep purple, forest green, gold
- Tan: Royal blue, magenta, bright orange, turquoise, cream
- Dark: Bold jewel tones, bright yellow, cobalt, fuchsia, white, gold

FORMAT: Use emojis for visual appeal. Structure responses with clear sections. Be specific with color hex codes or names when suggesting colors. Always explain WHY a color/style works for them.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Style advisor error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("style-advisor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
