-- Create geo_fences table for geo-spatial validation
CREATE TABLE IF NOT EXISTS public.geo_fences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id TEXT NOT NULL REFERENCES public.species(id),
  fence_name TEXT NOT NULL,
  polygon JSONB NOT NULL, -- GeoJSON polygon
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.geo_fences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for geo_fences
CREATE POLICY "Authenticated users can view geo_fences"
  ON public.geo_fences FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and regulators can manage geo_fences"
  ON public.geo_fences FOR ALL
  USING (
    has_role(auth.uid(), 'admin') OR 
    has_role(auth.uid(), 'regulator')
  );

-- Create export_certifications table
CREATE TABLE IF NOT EXISTS public.export_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES public.batches(batch_id),
  certificate_number TEXT NOT NULL UNIQUE,
  issuer_id UUID NOT NULL REFERENCES auth.users(id),
  destination_country TEXT NOT NULL,
  export_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  certificate_type TEXT NOT NULL CHECK (certificate_type IN ('phytosanitary', 'quality', 'organic', 'cites')),
  certification_body TEXT NOT NULL,
  certificate_url TEXT, -- IPFS hash or URL
  verification_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'issued', 'expired', 'revoked')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(batch_id, certificate_type, destination_country)
);

-- Enable RLS
ALTER TABLE public.export_certifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view certifications"
  ON public.export_certifications FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Regulators can manage certifications"
  ON public.export_certifications FOR ALL
  USING (
    has_role(auth.uid(), 'regulator') OR 
    has_role(auth.uid(), 'admin')
  );

-- Create offline_sync_queue table for PWA offline support
CREATE TABLE IF NOT EXISTS public.offline_sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  table_name TEXT NOT NULL,
  record_data JSONB NOT NULL,
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed', 'conflict')),
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  synced_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.offline_sync_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own sync queue"
  ON public.offline_sync_queue FOR ALL
  USING (auth.uid() = user_id);

-- Create sms_notifications table for offline SMS support
CREATE TABLE IF NOT EXISTS public.sms_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered')),
  provider_message_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.sms_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own SMS notifications"
  ON public.sms_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert SMS notifications"
  ON public.sms_notifications FOR INSERT
  WITH CHECK (true);

-- Create ipfs_uploads table for IPFS document storage
CREATE TABLE IF NOT EXISTS public.ipfs_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  ipfs_hash TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  related_table TEXT,
  related_record_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ipfs_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view IPFS uploads"
  ON public.ipfs_uploads FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload to IPFS"
  ON public.ipfs_uploads FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

-- Update quality_tests to support IPFS
ALTER TABLE public.quality_tests 
  ADD COLUMN IF NOT EXISTS ipfs_certificate_hash TEXT,
  ADD COLUMN IF NOT EXISTS ipfs_results_hash TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_geo_fences_species ON public.geo_fences(species_id);
CREATE INDEX IF NOT EXISTS idx_export_certifications_batch ON public.export_certifications(batch_id);
CREATE INDEX IF NOT EXISTS idx_offline_sync_user ON public.offline_sync_queue(user_id, sync_status);
CREATE INDEX IF NOT EXISTS idx_sms_notifications_user ON public.sms_notifications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_ipfs_uploads_hash ON public.ipfs_uploads(ipfs_hash);