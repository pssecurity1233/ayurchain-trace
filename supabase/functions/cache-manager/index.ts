import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Redis-like caching functionality using Supabase tables
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, key, value, ttl } = await req.json()

    switch (action) {
      case 'set':
        const expiresAt = new Date(Date.now() + (ttl || 3600) * 1000)
        const { error: setError } = await supabase
          .from('cache_entries')
          .upsert({
            cache_key: key,
            cache_value: value,
            expires_at: expiresAt.toISOString()
          })
        
        if (setError) throw setError
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'get':
        const { data: cacheData, error: getError } = await supabase
          .from('cache_entries')
          .select('cache_value, expires_at')
          .eq('cache_key', key)
          .gt('expires_at', new Date().toISOString())
          .single()
        
        if (getError && getError.code !== 'PGRST116') throw getError
        
        return new Response(JSON.stringify({ 
          value: cacheData?.cache_value || null 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'delete':
        await supabase
          .from('cache_entries')
          .delete()
          .eq('cache_key', key)
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'cleanup':
        // Remove expired entries
        await supabase
          .from('cache_entries')
          .delete()
          .lt('expires_at', new Date().toISOString())
        
        return new Response(JSON.stringify({ success: true }), {
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