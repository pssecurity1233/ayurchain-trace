-- Create the Ayurvedic Herb Traceability System database schema

-- Create custom types
CREATE TYPE user_role AS ENUM ('collector', 'lab', 'processor', 'manufacturer', 'admin', 'consumer');
CREATE TYPE waste_category AS ENUM ('wet_organic', 'dry_recyclable', 'hazardous', 'e_waste', 'mixed');
CREATE TYPE facility_type AS ENUM ('mrf', 'biomethanation', 'wte', 'landfill', 'scrap_shop', 'compost_facility');
CREATE TYPE report_status AS ENUM ('open', 'assigned', 'in_progress', 'resolved', 'closed');
CREATE TYPE training_status AS ENUM ('not_started', 'in_progress', 'completed', 'expired');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'consumer'::user_role,
  organization TEXT,
  ward_id UUID,
  is_verified BOOLEAN DEFAULT false,
  language_preference TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create species table for Ayurvedic herbs
CREATE TABLE public.species (
  id TEXT NOT NULL PRIMARY KEY,
  scientific_name TEXT NOT NULL,
  common_name TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create collection_events table for tracking herb collection
CREATE TABLE public.collection_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collector_id UUID NOT NULL,
  species_id TEXT NOT NULL REFERENCES public.species(id),
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  quantity_kg NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  device_id TEXT,
  gps_accuracy_m DOUBLE PRECISION,
  photo_path TEXT,
  notes TEXT,
  initial_quality JSONB DEFAULT '{}'::jsonb,
  blockchain_tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create geo_fences table for collection area management
CREATE TABLE public.geo_fences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  species_id TEXT NOT NULL REFERENCES public.species(id),
  polygon JSONB NOT NULL,
  name TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create season_windows table for harvest timing
CREATE TABLE public.season_windows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  species_id TEXT NOT NULL REFERENCES public.species(id),
  start_mmdd TEXT NOT NULL,
  end_mmdd TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create batches table for processing tracking
CREATE TABLE public.batches (
  batch_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  producer_id UUID NOT NULL,
  species_id TEXT NOT NULL,
  status TEXT DEFAULT 'in_progress',
  qr_code TEXT,
  provenance_hash TEXT,
  blockchain_tx_hash TEXT,
  finalized_at TIMESTAMP WITH TIME ZONE,
  recall_reason TEXT,
  recalled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create processing_steps table
CREATE TABLE public.processing_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  processor_id UUID NOT NULL,
  operation TEXT NOT NULL,
  input_batch_ids TEXT[] NOT NULL,
  output_batch_id TEXT,
  batch_id UUID REFERENCES public.batches(batch_id),
  parameters JSONB DEFAULT '{}'::jsonb,
  blockchain_tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quality_tests table
CREATE TABLE public.quality_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sample_id UUID NOT NULL REFERENCES public.collection_events(id),
  lab_id UUID NOT NULL,
  tests JSONB NOT NULL DEFAULT '{}'::jsonb,
  rejected BOOLEAN NOT NULL DEFAULT false,
  rejection_reason TEXT,
  lab_signature TEXT,
  lab_certificate_path TEXT,
  batch_id UUID REFERENCES public.batches(batch_id),
  blockchain_tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product_qr table for final products
CREATE TABLE public.product_qr (
  qr_id TEXT NOT NULL PRIMARY KEY,
  batch_id TEXT NOT NULL,
  collection_event_ids TEXT[] NOT NULL,
  issued_by UUID NOT NULL,
  provenance_hash TEXT,
  blockchain_tx_hash TEXT,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_logs table for blockchain tracking
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  table_name TEXT NOT NULL,
  action TEXT NOT NULL,
  record_id UUID,
  blockchain_tx_hash TEXT,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  fabric_response JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_fences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.season_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_qr ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for species (viewable by authenticated users)
CREATE POLICY "Species are viewable by authenticated users" ON public.species FOR SELECT USING (true);

-- Create RLS policies for collection_events
CREATE POLICY "Collectors can view their own collection events" ON public.collection_events FOR SELECT USING (auth.uid() = collector_id);
CREATE POLICY "Collectors can insert their own collection events" ON public.collection_events FOR INSERT WITH CHECK (auth.uid() = collector_id);
CREATE POLICY "All authenticated users can view collection events for provenance" ON public.collection_events FOR SELECT USING (true);

-- Create RLS policies for geo_fences
CREATE POLICY "Geo fences are viewable by authenticated users" ON public.geo_fences FOR SELECT USING (true);

-- Create RLS policies for season_windows
CREATE POLICY "Season windows are viewable by authenticated users" ON public.season_windows FOR SELECT USING (true);

-- Create RLS policies for batches
CREATE POLICY "Producers can manage their own batches" ON public.batches FOR ALL USING (auth.uid() = producer_id);
CREATE POLICY "All authenticated users can view batches for provenance" ON public.batches FOR SELECT USING (true);

-- Create RLS policies for processing_steps
CREATE POLICY "Processors can view and insert processing steps" ON public.processing_steps FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('processor', 'manufacturer')
  )
);
CREATE POLICY "All authenticated users can view processing steps for provenance" ON public.processing_steps FOR SELECT USING (true);

-- Create RLS policies for quality_tests
CREATE POLICY "Labs can view and insert quality tests" ON public.quality_tests FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'lab'
  )
);
CREATE POLICY "All authenticated users can view quality tests for provenance" ON public.quality_tests FOR SELECT USING (true);

-- Create RLS policies for product_qr
CREATE POLICY "QR codes are viewable by all" ON public.product_qr FOR SELECT USING (true);
CREATE POLICY "Authorized users can mint QR codes" ON public.product_qr FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('manufacturer', 'admin')
  )
);

-- Create RLS policies for audit_logs
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample species data
INSERT INTO public.species (id, scientific_name, common_name, metadata) VALUES
('ASH001', 'Withania somnifera', 'Ashwagandha', '{"benefits": ["stress relief", "immunity"], "parts_used": ["root"], "harvest_season": "winter"}'),
('TUR001', 'Curcuma longa', 'Turmeric', '{"benefits": ["anti-inflammatory", "antioxidant"], "parts_used": ["rhizome"], "harvest_season": "monsoon"}'),
('NIM001', 'Azadirachta indica', 'Neem', '{"benefits": ["skin health", "immunity"], "parts_used": ["leaves", "bark"], "harvest_season": "all_year"}'),
('BRA001', 'Bacopa monnieri', 'Brahmi', '{"benefits": ["memory", "cognitive function"], "parts_used": ["whole_plant"], "harvest_season": "monsoon"}'),
('AML001', 'Phyllanthus emblica', 'Amla', '{"benefits": ["vitamin_c", "immunity"], "parts_used": ["fruit"], "harvest_season": "winter"}');

-- Insert sample season windows
INSERT INTO public.season_windows (species_id, start_mmdd, end_mmdd) VALUES
('ASH001', '10-01', '02-28'),
('TUR001', '06-01', '10-31'),
('NIM001', '01-01', '12-31'),
('BRA001', '06-01', '09-30'),
('AML001', '11-01', '02-28');