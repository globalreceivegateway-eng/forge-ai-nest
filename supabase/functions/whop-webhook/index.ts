// @ts-nocheck
/// <reference lib="deno.ns" />

/**
 * WHOP WEBHOOK INTEGRATION FOR SUPABASE
 * 
 * This Edge Function handles Whop payment webhooks and automatically adds credits to users.
 * 
 * IMPORTANT: Users must be logged in BEFORE purchasing to link their Whop account.
 * The frontend will save the Whop user ID when redirected from checkout.
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
 *    f. Save the webhook
 * 
 * PLAN CREDIT MAPPING:
 * - Test Trial Pack: 100 credits
 * - Starter Pack: 300 credits
 * - Pro Pack: 650 credits
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
  'Starter pack': 300, // Alternative casing
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

    // Handle payment events from Whop
    if (eventType === 'payment.succeeded' || eventType === 'invoice.paid') {
      console.log('💳 Processing payment event:', eventType);
      
      const userEmail = data?.user?.email || data?.email || data?.customer?.email;
      const planName = data?.plan?.name || data?.product?.name || data?.plan_name || data?.product?.title;
      const whopUserId = data?.user?.id;
      
      console.log('👤 User email:', userEmail);
      console.log('👤 Whop user ID:', whopUserId);
      console.log('📋 Plan name:', planName);

      // Try to find user by whop_user_id first, then by email
      let profile = null;
      
      if (whopUserId) {
        const { data: profileByWhopId } = await supabase
          .from('profiles')
          .select('id, email, credits')
          .eq('whop_user_id', whopUserId)
          .maybeSingle();
        
        if (profileByWhopId) {
          profile = profileByWhopId;
          console.log('✅ Found user by Whop user ID');
        }
      }

      if (!profile && userEmail) {
        const { data: profileByEmail } = await supabase
          .from('profiles')
          .select('id, email, credits')
          .eq('email', userEmail)
          .maybeSingle();
        
        if (profileByEmail) {
          profile = profileByEmail;
          console.log('✅ Found user by email');
          
          // Link whop_user_id for future webhooks
          if (whopUserId) {
            await supabase
              .from('profiles')
              .update({ whop_user_id: whopUserId })
              .eq('id', profileByEmail.id);
            console.log('🔗 Linked Whop user ID to profile');
          }
        }
      }

      if (!profile) {
        console.error('⚠️ User not found. Please ensure user is logged in before purchasing.');
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'User not found. User must log in after purchase to receive credits.' 
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

      // Add credits to user account
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

      console.log(`✅ SUCCESS: Added ${creditsToAdd} credits to user ${profile.email}`);
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

    // Handle membership.activated
    if (eventType === 'membership.activated') {
      console.log('🎉 Membership activated:', data);
      
      const planName = data?.product?.title || data?.plan?.name;
      const whopUserId = data?.user?.id;
      const userEmail = data?.user?.email;
      
      console.log('📋 Plan name:', planName);
      console.log('👤 Whop User ID:', whopUserId);
      
      // Try to find user by whop_user_id first, then by email
      let profile = null;
      
      if (whopUserId) {
        const { data: profileByWhopId } = await supabase
          .from('profiles')
          .select('*')
          .eq('whop_user_id', whopUserId)
          .maybeSingle();
        
        if (profileByWhopId) {
          profile = profileByWhopId;
          console.log('✅ Found user by Whop user ID');
        }
      }

      if (!profile && userEmail) {
        const { data: profileByEmail } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', userEmail)
          .maybeSingle();
        
        if (profileByEmail) {
          profile = profileByEmail;
          console.log('✅ Found user by email');
          
          // Link whop_user_id
          if (whopUserId) {
            await supabase
              .from('profiles')
              .update({ whop_user_id: whopUserId })
              .eq('id', profileByEmail.id);
            console.log('🔗 Linked Whop user ID to profile');
          }
        }
      }
      
      if (!profile) {
        console.warn('⚠️ No user found. User must log in after purchase.');
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'User not linked. User should log in to receive credits.' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      // Match plan and add credits
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
      }

      const newCredits = profile.credits + creditsToAdd;
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
          JSON.stringify({ success: false, error: updateError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      console.log(`✅ Successfully added ${creditsToAdd} credits to user ${profile.email}. New total: ${newCredits}`);
      
      return new Response(JSON.stringify({ 
        success: true, 
        credits_added: creditsToAdd,
        new_total: newCredits 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Handle other events
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
    return new Response(
      JSON.stringify({ success: true, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
