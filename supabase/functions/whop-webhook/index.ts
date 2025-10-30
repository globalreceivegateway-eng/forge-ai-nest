// @ts-nocheck
/// <reference lib="deno.ns" />

/**
 * WHOP WEBHOOK INTEGRATION FOR SUPABASE
 * 
 * This Edge Function handles Whop payment webhooks and automatically adds credits to users.
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. DEPLOY THIS EDGE FUNCTION:
 *    - This function deploys automatically when you save changes in Lovable
 *    - Your webhook URL is: https://kppoejwyebhxayjvxsaf.supabase.co/functions/v1/whop-webhook
 * 
 * 2. CONFIGURE WHOP WEBHOOK:
 *    a. Go to your Whop Dashboard: https://whop.com/dashboard
 *    b. Navigate to Settings → Developers → Webhooks
 *    c. Click "Add Webhook"
 *    d. Enter webhook URL: https://kppoejwyebhxayjvxsaf.supabase.co/functions/v1/whop-webhook
 *    e. Select these events:
 *       - payment_succeeded (main event for adding credits)
 *       - membership_activated (backup event)
 *       - payment_failed (for logging)
 *       - membership_deactivated (for logging)
 *    f. Save the webhook
 * 
 * 3. TEST THE WEBHOOK:
 *    a. In Whop Dashboard, go to your webhook settings
 *    b. Click "Test" on your webhook
 *    c. Select "payment_succeeded" event
 *    d. Send test payload
 *    e. Check logs: https://supabase.com/dashboard/project/kppoejwyebhxayjvxsaf/functions/whop-webhook/logs
 * 
 * 4. VERIFY CREDITS:
 *    - After a successful test, check your Supabase database
 *    - View profiles table: https://supabase.com/dashboard/project/kppoejwyebhxayjvxsaf/editor
 *    - Credits should be added to the user's account
 * 
 * PLAN CREDIT MAPPING:
 * - Test Trial Pack: 100 credits
 * - Starter Pack: 300 credits
 * - Pro Pack: 650 credits
 * 
 * IMPORTANT NOTES:
 * - User email from Whop MUST match email in Supabase profiles table
 * - Credits are ADDED to existing balance (not replaced)
 * - Plan names must contain exact strings (case-sensitive)
 * - All events are logged for debugging
 */

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
    console.log('✅ Webhook received successfully');
    
    // Parse raw JSON payload from Whop
    const body = await req.json();
    console.log('📦 Raw payload:', JSON.stringify(body, null, 2));

    // Extract webhook data (Whop sends: type, data)
    const { type: eventType, data } = body;
    
    console.log('🎯 Event type:', eventType);
    console.log('📄 Event data:', JSON.stringify(data, null, 2));

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle payment events from Whop (note: Whop uses dots in event names)
    if (eventType === 'payment.succeeded' || eventType === 'invoice.paid') {
      console.log('💳 Processing payment event:', eventType);
      
      // Extract user email and plan name from Whop payload
      const userEmail = data?.user?.email || data?.email || data?.customer?.email;
      const planName = data?.plan?.name || data?.product?.name || data?.plan_name;
      
      console.log('👤 User email:', userEmail);
      console.log('📋 Plan name:', planName);

      if (!userEmail) {
        console.error('❌ No user email found in webhook payload');
        return new Response(
          JSON.stringify({ success: true, message: 'No email found in payload' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      // Find user by email in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, credits')
        .eq('email', userEmail)
        .single();

      if (profileError || !profile) {
        console.error('⚠️ User not found in database:', userEmail);
        console.error('Note: User must sign up first before receiving credits');
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'User not found. Please ensure user signs up before purchasing.' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      // Match plan name to credit amount
      let creditsToAdd = 0;
      for (const [plan, credits] of Object.entries(PLAN_CREDITS)) {
        if (planName?.includes(plan)) {
          creditsToAdd = credits;
          console.log(`✨ Matched plan "${plan}" → ${credits} credits`);
          break;
        }
      }

      if (creditsToAdd === 0) {
        console.log('⚠️ No matching plan found for:', planName);
        return new Response(
          JSON.stringify({ success: true, message: 'No matching plan found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      // Add credits to user account and save plan name
      const currentCredits = profile.credits || 0;
      const newCredits = currentCredits + creditsToAdd;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          credits: newCredits,
          plan: planName 
        })
        .eq('id', profile.id);

      if (updateError) {
        console.error('❌ Failed to update credits:', updateError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to update credits' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      console.log(`✅ SUCCESS: Added ${creditsToAdd} credits to ${userEmail}`);
      console.log(`💰 Previous balance: ${currentCredits} → New balance: ${newCredits}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Credits added successfully',
          credits_added: creditsToAdd,
          new_balance: newCredits
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Handle membership.activated by resolving email via Whop API and updating credits
    if (eventType === 'membership.activated') {
      console.log('🎉 Membership activated:', data);

      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      let userEmail: string | undefined = data?.user?.email;
      const memberId: string | undefined = data?.member?.id;
      const userId: string | undefined = data?.user?.id;

      // Try to resolve email from Whop API if missing
      if (!userEmail) {
        const WHOP_API_KEY = Deno.env.get('WHOP_API_KEY');
        try {
          if (WHOP_API_KEY && (memberId || userId)) {
            // Prefer member endpoint as it includes user object with email per docs
            const url = memberId
              ? `https://api.whop.com/v1/members/${memberId}`
              : `https://api.whop.com/v1/users/${userId}`;
            const resp = await fetch(url, {
              headers: {
                'Authorization': `Bearer ${WHOP_API_KEY}`,
                'Accept': 'application/json'
              }
            });
            if (resp.ok) {
              const info = await resp.json();
              userEmail = info?.user?.email || info?.email;
              console.log('📧 Resolved email from Whop API:', userEmail);
            } else {
              const t = await resp.text();
              console.warn('⚠️ Whop API lookup failed:', resp.status, t);
            }
          } else {
            console.warn('ℹ️ WHOP_API_KEY missing or no identifiers to resolve email.');
          }
        } catch (e) {
          console.error('❌ Error fetching email from Whop API:', e);
        }
      }

      const planName = data?.product?.title || data?.plan?.name || data?.plan_name;
      console.log('📋 Plan name:', planName);

      if (!userEmail) {
        console.log('⚠️ No email available. Skipping credit update.');
        return new Response(
          JSON.stringify({ success: true, message: 'membership.activated received but no email resolved' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      // Find user by email in profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, credits')
        .eq('email', userEmail)
        .single();

      if (profileError || !profile) {
        console.warn('⚠️ User not found for email on membership.activated:', userEmail);
        return new Response(
          JSON.stringify({ success: true, message: 'User not found for email' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      // Determine credits
      let creditsToAdd = 0;
      for (const [plan, credits] of Object.entries(PLAN_CREDITS)) {
        if (planName?.includes(plan)) {
          creditsToAdd = credits as number;
          break;
        }
      }
      if (creditsToAdd === 0) {
        console.log('ℹ️ No credit mapping for plan on membership.activated:', planName);
      }

      const currentCredits = profile.credits || 0;
      const newCredits = currentCredits + creditsToAdd;
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ credits: newCredits, plan: planName })
        .eq('id', profile.id);

      if (updateError) {
        console.error('❌ Failed to update profile on membership.activated:', updateError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to update profile' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      console.log('✅ Updated profile from membership.activated:', { email: userEmail, credits_added: creditsToAdd, new_balance: newCredits });
      return new Response(
        JSON.stringify({ success: true, message: 'Profile updated from membership.activated', credits_added: creditsToAdd, new_balance: newCredits }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Handle other Whop events (for logging)
    if (eventType === 'membership.deactivated') {
      console.log('🚫 Membership deactivated:', data);
    } else if (eventType === 'payment.failed') {
      console.log('❌ Payment failed:', data);
    } else {
      console.log('ℹ️ Unhandled event type:', eventType);
    }

    // Always return 200 OK to Whop
    return new Response(
      JSON.stringify({ success: true, received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('💥 Webhook error:', error);
    // Still return 200 to prevent Whop from retrying
    return new Response(
      JSON.stringify({ success: true, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
