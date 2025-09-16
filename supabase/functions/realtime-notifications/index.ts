import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Redis pub/sub-like functionality for real-time notifications
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, channel, message, user_id, subscription_data } = await req.json()

    switch (action) {
      case 'publish':
        // Publish message to channel
        const { error: publishError } = await supabase
          .from('notification_channels')
          .upsert({
            channel_name: channel,
            last_message: {
              ...message,
              timestamp: new Date().toISOString(),
              message_id: crypto.randomUUID()
            }
          })
        
        if (publishError) throw publishError
        
        // Also create individual notifications for subscribers
        const { data: channelData } = await supabase
          .from('notification_channels')
          .select('subscribers')
          .eq('channel_name', channel)
          .single()
        
        if (channelData?.subscribers) {
          const notifications = channelData.subscribers.map((subscriber: string) => ({
            user_id: subscriber,
            type: 'realtime',
            subject: message.title || 'Real-time Update',
            body: message.body || JSON.stringify(message),
            metadata: { channel, message }
          }))
          
          await supabase
            .from('notifications')
            .insert(notifications)
        }
        
        return new Response(JSON.stringify({ 
          success: true, 
          published: true 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'subscribe':
        // Subscribe user to channel
        const { data: currentChannel } = await supabase
          .from('notification_channels')
          .select('subscribers')
          .eq('channel_name', channel)
          .single()
        
        const currentSubscribers = currentChannel?.subscribers || []
        if (!currentSubscribers.includes(user_id)) {
          currentSubscribers.push(user_id)
          
          await supabase
            .from('notification_channels')
            .upsert({
              channel_name: channel,
              subscribers: currentSubscribers
            })
        }
        
        return new Response(JSON.stringify({ 
          success: true, 
          subscribed: true 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'unsubscribe':
        // Unsubscribe user from channel
        const { data: unsubChannel } = await supabase
          .from('notification_channels')
          .select('subscribers')
          .eq('channel_name', channel)
          .single()
        
        if (unsubChannel?.subscribers) {
          const updatedSubscribers = unsubChannel.subscribers.filter(
            (sub: string) => sub !== user_id
          )
          
          await supabase
            .from('notification_channels')
            .update({ subscribers: updatedSubscribers })
            .eq('channel_name', channel)
        }
        
        return new Response(JSON.stringify({ 
          success: true, 
          unsubscribed: true 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'get_messages':
        // Get recent messages from channel
        const { data: messages } = await supabase
          .from('notification_channels')
          .select('last_message')
          .eq('channel_name', channel)
          .single()
        
        return new Response(JSON.stringify({
          messages: messages?.last_message ? [messages.last_message] : []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})