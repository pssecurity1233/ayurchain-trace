-- Create laboratories table first
CREATE TABLE IF NOT EXISTS laboratories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  lab_code text UNIQUE NOT NULL,
  address text NOT NULL,
  contact_info jsonb DEFAULT '{}'::jsonb,
  accreditations jsonb DEFAULT '[]'::jsonb,
  test_capabilities text[] DEFAULT '{}',
  equipment_list jsonb DEFAULT '[]'::jsonb,
  operating_hours jsonb DEFAULT '{}'::jsonb,
  capacity_per_day integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Update profiles table with role-based fields
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_documents jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS verified_by uuid,
ADD COLUMN IF NOT EXISTS permissions jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS last_login timestamp with time zone,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS license_number text,
ADD COLUMN IF NOT EXISTS certification_expiry date;

-- Create collector profiles table
CREATE TABLE IF NOT EXISTS collector_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  collector_id text UNIQUE NOT NULL,
  experience_years integer DEFAULT 0,
  specializations text[] DEFAULT '{}',
  collection_zones jsonb DEFAULT '[]'::jsonb,
  equipment_owned jsonb DEFAULT '[]'::jsonb,
  training_certificates jsonb DEFAULT '[]'::jsonb,
  sustainability_score numeric DEFAULT 0,
  collection_history_summary jsonb DEFAULT '{}'::jsonb,
  offline_sync_enabled boolean DEFAULT true,
  sms_notifications_enabled boolean DEFAULT true,
  preferred_collection_times jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create lab technician profiles
CREATE TABLE IF NOT EXISTS lab_technician_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  technician_id text UNIQUE NOT NULL,
  laboratory_id uuid REFERENCES laboratories(id),
  qualifications jsonb DEFAULT '[]'::jsonb,
  specializations text[] DEFAULT '{}',
  equipment_certifications jsonb DEFAULT '[]'::jsonb,
  test_quotas jsonb DEFAULT '{}'::jsonb,
  signature_image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create manufacturer profiles
CREATE TABLE IF NOT EXISTS manufacturer_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  manufacturer_id text UNIQUE NOT NULL,
  company_name text NOT NULL,
  facility_locations jsonb DEFAULT '[]'::jsonb,
  production_capacity jsonb DEFAULT '{}'::jsonb,
  certifications jsonb DEFAULT '[]'::jsonb,
  product_lines text[] DEFAULT '{}',
  quality_standards text[] DEFAULT '{}',
  export_licenses jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE laboratories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collector_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_technician_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for laboratories
CREATE POLICY "Authenticated users can view laboratories" 
  ON laboratories FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage laboratories" 
  ON laboratories FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'));

-- RLS Policies for collector_profiles
CREATE POLICY "Users can view their own collector profile" 
  ON collector_profiles FOR SELECT 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.user_id = collector_profiles.user_id));

CREATE POLICY "Users can update their own collector profile" 
  ON collector_profiles FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.user_id = collector_profiles.user_id));

CREATE POLICY "Users can insert their own collector profile" 
  ON collector_profiles FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.user_id = collector_profiles.user_id));

-- RLS Policies for lab_technician_profiles
CREATE POLICY "Users can view their own lab technician profile" 
  ON lab_technician_profiles FOR SELECT 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.user_id = lab_technician_profiles.user_id));

CREATE POLICY "Users can update their own lab technician profile" 
  ON lab_technician_profiles FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.user_id = lab_technician_profiles.user_id));

CREATE POLICY "Users can insert their own lab technician profile" 
  ON lab_technician_profiles FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.user_id = lab_technician_profiles.user_id));

-- RLS Policies for manufacturer_profiles
CREATE POLICY "Users can view their own manufacturer profile" 
  ON manufacturer_profiles FOR SELECT 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.user_id = manufacturer_profiles.user_id));

CREATE POLICY "Users can update their own manufacturer profile" 
  ON manufacturer_profiles FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.user_id = manufacturer_profiles.user_id));

CREATE POLICY "Users can insert their own manufacturer profile" 
  ON manufacturer_profiles FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.user_id = manufacturer_profiles.user_id));

-- Insert sample data for laboratories
INSERT INTO laboratories (name, lab_code, address, accreditations, test_capabilities) VALUES
('Central Ayurvedic Research Lab', 'CARL001', 'New Delhi, India', '[{"name": "NABL", "number": "T-001", "valid_until": "2025-12-31"}]', '{"heavy_metals", "pesticides", "microbiology", "identity"}'),
('Regional Quality Testing Center', 'RQTC002', 'Mumbai, India', '[{"name": "NABL", "number": "T-002", "valid_until": "2025-12-31"}]', '{"chemical_analysis", "purity", "potency"}'),
('Herbal Analysis Institute', 'HAI003', 'Bangalore, India', '[{"name": "ISO", "number": "17025", "valid_until": "2026-06-30"}]', '{"fingerprinting", "standardization", "stability"}')
ON CONFLICT (lab_code) DO NOTHING;