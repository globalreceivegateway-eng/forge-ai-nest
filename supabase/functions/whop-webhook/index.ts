// @ts-nocheck
/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Plan credit mapping
const PLAN_CREDITS = {
  'Test Trial Pack': 100,
  'Starter Pack': 300,
  'Pro Pack': 650,
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Whop webhook received');
    
    const body = await req.json();
    console.log('Webhook payload:', JSON.stringify(body, null, 2));

    // Extract webhook data
    const { action, data } = body;
    
    console.log('Webhook action:', action);
    console.log('Webhook data:', data);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle different Whop webhook events
    switch (action) {
      case 'membership.went_valid':
      case 'payment.succeeded':
        console.log('Processing payment/membership activation:', data);
        
        // Extract user email and plan name from webhook data
        const userEmail = data?.user?.email || data?.email;
        const planName = data?.plan?.name || data?.product?.name;
        
        console.log('User email:', userEmail);
        console.log('Plan name:', planName);

        if (!userEmail) {
          console.error('No user email found in webhook data');
          break;
        }

        // Find the user profile by email
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, credits')
          .eq('email', userEmail)
          .single();

        if (profileError || !profile) {
          console.error('User profile not found:', profileError);
          break;
        }

        // Determine credits to add based on plan
        let creditsToAdd = 0;
        for (const [plan, credits] of Object.entries(PLAN_CREDITS)) {
          if (planName?.includes(plan)) {
            creditsToAdd = credits;
            break;
          }
        }

        if (creditsToAdd === 0) {
          console.log('No matching plan found for:', planName);
          break;
        }

        // Add credits to user account
        const newCredits = (profile.credits || 0) + creditsToAdd;
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ credits: newCredits })
          .eq('id', profile.id);

        if (updateError) {
          console.error('Failed to update credits:', updateError);
        } else {
          console.log(`Successfully added ${creditsToAdd} credits to user ${userEmail}. New balance: ${newCredits}`);
        }
        break;
      
      case 'membership.went_invalid':
        console.log('Membership expired or cancelled:', data);
        // You can add logic here to handle membership cancellation if needed
        break;
      
      case 'payment.failed':
        console.log('Payment failed:', data);
        break;
      
      default:
        console.log('Unhandled webhook action:', action);
    }

    return new Response(
      JSON.stringify({ success: true, received: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
