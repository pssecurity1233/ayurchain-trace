import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IPFSUploadRequest {
  file_data: string; // Base64 encoded file
  file_name: string;
  file_type: string;
  related_table?: string;
  related_record_id?: string;
  metadata?: any;
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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const requestData: IPFSUploadRequest = await req.json();
    const { file_data, file_name, file_type, related_table, related_record_id, metadata } = requestData;

    if (!file_data || !file_name || !file_type) {
      throw new Error('file_data, file_name, and file_type are required');
    }

    // In production, integrate with IPFS providers like Pinata, Infura, or Web3.Storage
    // For now, we'll simulate IPFS upload and generate a mock hash

    // Example Pinata integration (commented out):
    /*
    const PINATA_API_KEY = Deno.env.get('PINATA_API_KEY');
    const PINATA_SECRET_KEY = Deno.env.get('PINATA_SECRET_KEY');

    const formData = new FormData();
    const fileBlob = new Blob([Uint8Array.from(atob(file_data), c => c.charCodeAt(0))]);
    formData.append('file', fileBlob, file_name);
    formData.append('pinataMetadata', JSON.stringify({ name: file_name }));

    const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
      body: formData,
    });

    const pinataData = await pinataResponse.json();
    const ipfsHash = pinataData.IpfsHash;
    */

    // Generate mock IPFS hash for demo (CID format)
    const ipfsHash = `Qm${btoa(file_name + Date.now()).substring(0, 44)}`;
    const fileSize = Math.ceil(file_data.length * 0.75); // Approximate size from base64

    console.log(`File uploaded to IPFS: ${ipfsHash}`);

    // Store IPFS metadata in database
    const { data: uploadRecord, error: dbError } = await supabaseClient
      .from('ipfs_uploads')
      .insert({
        uploaded_by: user.id,
        ipfs_hash: ipfsHash,
        file_name,
        file_type,
        file_size: fileSize,
        related_table,
        related_record_id,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return new Response(
      JSON.stringify({
        success: true,
        ipfs_hash: ipfsHash,
        ipfs_url: `https://ipfs.io/ipfs/${ipfsHash}`,
        gateway_url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        file_name,
        file_size: fileSize,
        upload_id: uploadRecord.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('IPFS Upload Error:', error);
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
