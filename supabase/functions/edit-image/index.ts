// @ts-nocheck
/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authenticated user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = user.id; // Use authenticated user ID from JWT
    
    const { imageUrl, prompt } = await req.json();

    // Validate and sanitize prompt
    const rawPrompt = typeof prompt === 'string' ? prompt.trim() : '';
    if (rawPrompt.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Custom prompt must be less than 500 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const finalPrompt = (rawPrompt || 'Enhance this image to look more professional and visually appealing.').replace(/\s+/g, ' ').slice(0, 500);

    // Initialize Supabase client with service role for credit deduction
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Deduct credits using the database function
    const { data: deductResult, error: deductError } = await supabase
      .rpc('deduct_credits', { user_id: userId, amount: 5 });

    if (deductError || !deductResult) {
      console.error("Failed to deduct credits:", deductError);
      return new Response(
        JSON.stringify({ error: "Insufficient credits. You need 5 credits to edit an image." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ success: false, error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize the incoming image URL to a form accepted by the Lovable AI Gateway
    const normalizeImageUrl = (input: string): string => {
      const s = (input || '').trim();
      if (s.startsWith('data:')) return s;
      if (/^[A-Za-z0-9+/=]+$/.test(s)) return `data:image/png;base64,${s}`;
      return s;
    };

    const sourceImageUrl = normalizeImageUrl(imageUrl);
    console.log("Processing image edit request with prompt:", finalPrompt.substring(0, 50) + "...");

    const makeRequest = async () => {
      return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: finalPrompt },
                { type: "image_url", image_url: { url: sourceImageUrl } }
              ]
            }
          ],
          modalities: ["image", "text"],
        }),
      });
    };

    // Retry logic: up to 3 attempts for 503 errors
    let response;
    let lastError;
    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 2000;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`AI request attempt ${attempt}/${MAX_RETRIES}`);
        response = await makeRequest();

        if (response.ok) {
          console.log("AI request successful");
          break;
        }

        const errorText = await response.text();
        lastError = errorText;

        // Handle 402 - Payment Required
        if (response.status === 402) {
          console.error("Payment required - insufficient credits in workspace");
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Not enough credits. Please add credits to your Lovable AI workspace to continue." 
            }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Handle 429 - Rate Limit
        if (response.status === 429) {
          console.error("Rate limit exceeded");
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Rate limit exceeded. Please try again in a moment." 
            }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Handle 503 - Model Overloaded (retry)
        if (response.status === 503) {
          console.warn(`Model overloaded (attempt ${attempt}/${MAX_RETRIES}):`, errorText);
          if (attempt < MAX_RETRIES) {
            console.log(`Retrying in ${RETRY_DELAY_MS}ms...`);
            await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
            continue;
          } else {
            console.error("Max retries reached for 503 error");
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: "The AI model is currently overloaded. Please try again in a few moments." 
              }),
              { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }

        // Other errors
        console.error(`AI gateway error (${response.status}):`, errorText);
        throw new Error(`AI gateway returned status ${response.status}: ${errorText}`);

      } catch (error) {
        console.error(`Request attempt ${attempt} failed:`, error);
        lastError = error;
        if (attempt === MAX_RETRIES) {
          throw error;
        }
      }
    }

    if (!response || !response.ok) {
      console.error("All retry attempts failed. Last error:", lastError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to process image. Please try again later." 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("Parsing AI response...");

    // Extract generated image from Lovable AI Gateway response
    const editedImageUrl: string | undefined = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!editedImageUrl) {
      console.error("No image returned in AI response:", JSON.stringify(data).substring(0, 200));
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "AI did not return an image. Please try again." 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Image edit successful");
    return new Response(
      JSON.stringify({ success: true, editedImageUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in edit-image function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
