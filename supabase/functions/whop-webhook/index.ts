const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
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

    // Handle different Whop webhook events
    switch (action) {
      case 'membership.went_valid':
        console.log('New membership activated:', data);
        // Add your logic here (e.g., grant user access, update database)
        break;
      
      case 'membership.went_invalid':
        console.log('Membership expired or cancelled:', data);
        // Add your logic here (e.g., revoke access)
        break;
      
      case 'payment.succeeded':
        console.log('Payment successful:', data);
        // Add your logic here
        break;
      
      case 'payment.failed':
        console.log('Payment failed:', data);
        // Add your logic here
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
