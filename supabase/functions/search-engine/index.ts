import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Elasticsearch-like search functionality using PostgreSQL full-text search
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, query, filters, aggregations, index } = await req.json()

    switch (action) {
      case 'search':
        // Use the PostgreSQL search function
        const { data: searchResults, error: searchError } = await supabase
          .rpc('search_content', { search_query: query })
        
        if (searchError) throw searchError
        
        // Apply filters if provided
        let filteredResults = searchResults
        if (filters) {
          filteredResults = searchResults.filter((result: any) => {
            return Object.entries(filters).every(([key, value]) => 
              result[key] === value
            )
          })
        }
        
        return new Response(JSON.stringify({
          hits: filteredResults,
          total: filteredResults.length
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'aggregate':
        // Perform analytics aggregations
        let aggregationResults = {}
        
        if (aggregations?.collection_analytics) {
          const { data: collectionData } = await supabase
            .from('collection_analytics')
            .select('*')
          aggregationResults = { ...aggregationResults, collection_analytics: collectionData }
        }
        
        if (aggregations?.batch_status) {
          const { data: batchData } = await supabase
            .from('batch_status_summary')
            .select('*')
          aggregationResults = { ...aggregationResults, batch_status: batchData }
        }
        
        return new Response(JSON.stringify({
          aggregations: aggregationResults
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'index':
        // Index new document (trigger search vector update)
        const { table, id, data } = index
        const { error: indexError } = await supabase
          .from(table)
          .update(data)
          .eq('id', id)
        
        if (indexError) throw indexError
        
        return new Response(JSON.stringify({ 
          success: true, 
          indexed: true 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'analytics':
        // Get search analytics
        const { data: analyticsData } = await supabase
          .from('analytics_events')
          .select('*')
          .eq('event_type', 'search')
          .order('created_at', { ascending: false })
          .limit(100)
        
        return new Response(JSON.stringify({
          recent_searches: analyticsData
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