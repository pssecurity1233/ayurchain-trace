import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();

    console.log('Blockchain Integration Request:', { action, data });

    // Simulate blockchain transaction
    // In production, this would integrate with Hyperledger Fabric
    const txHash = `0x${Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;

    let response;

    switch (action) {
      case 'record_collection':
        response = {
          success: true,
          txHash,
          blockNumber: Math.floor(Math.random() * 1000000),
          timestamp: new Date().toISOString(),
          data: {
            collectionId: data.collectionId,
            species: data.species,
            location: data.location,
            quantity: data.quantity
          }
        };
        break;

      case 'record_processing':
        response = {
          success: true,
          txHash,
          blockNumber: Math.floor(Math.random() * 1000000),
          timestamp: new Date().toISOString(),
          data: {
            batchId: data.batchId,
            processingType: data.processingType,
            processor: data.processor
          }
        };
        break;

      case 'record_quality_test':
        response = {
          success: true,
          txHash,
          blockNumber: Math.floor(Math.random() * 1000000),
          timestamp: new Date().toISOString(),
          data: {
            batchId: data.batchId,
            testResults: data.testResults,
            passed: data.passed
          }
        };
        break;

      case 'mint_qr':
        response = {
          success: true,
          txHash,
          blockNumber: Math.floor(Math.random() * 1000000),
          timestamp: new Date().toISOString(),
          data: {
            qrCodeId: data.qrCodeId,
            batchId: data.batchId,
            provenanceHash: data.provenanceHash
          }
        };
        break;

      case 'verify_provenance':
        response = {
          success: true,
          verified: true,
          provenanceChain: [
            {
              stage: 'Collection',
              timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              txHash: `0x${Math.random().toString(16).substring(2, 66)}`
            },
            {
              stage: 'Processing',
              timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              txHash: `0x${Math.random().toString(16).substring(2, 66)}`
            },
            {
              stage: 'Quality Testing',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              txHash: `0x${Math.random().toString(16).substring(2, 66)}`
            },
            {
              stage: 'Manufacturing',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              txHash: `0x${Math.random().toString(16).substring(2, 66)}`
            }
          ]
        };
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in blockchain-integration function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
