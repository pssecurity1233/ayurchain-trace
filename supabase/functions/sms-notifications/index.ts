import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SMSRequest {
  phone_number: string;
  message: string;
  user_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { phone_number, message, user_id }: SMSRequest = await req.json();

    if (!phone_number || !message) {
      throw new Error('phone_number and message are required');
    }

    // Log the SMS notification request
    const { error: logError } = await supabaseClient
      .from('sms_notifications')
      .insert({
        user_id: user_id || null,
        phone_number,
        message,
        status: 'pending',
      });

    if (logError) throw logError;

    // In production, integrate with SMS provider like Twilio, AWS SNS, or local SMS gateway
    // For now, we'll simulate SMS sending
    
    // Example Twilio integration (commented out):
    /*
    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
    const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phone_number,
          From: TWILIO_PHONE_NUMBER,
          Body: message,
        }),
      }
    );

    const twilioData = await twilioResponse.json();
    */

    // Simulate successful SMS for demo
    console.log(`SMS sent to ${phone_number}: ${message}`);

    // Update status to sent
    const { error: updateError } = await supabaseClient
      .from('sms_notifications')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('phone_number', phone_number)
      .eq('message', message)
      .order('created_at', { ascending: false })
      .limit(1);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'SMS sent successfully',
        phone_number,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('SMS Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
