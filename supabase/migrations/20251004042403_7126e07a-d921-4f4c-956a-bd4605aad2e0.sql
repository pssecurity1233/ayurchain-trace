-- Create consumer_feedback table for product reviews and authenticity reports
CREATE TABLE IF NOT EXISTS public.consumer_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id UUID NOT NULL,
  qr_code_id TEXT,
  batch_id UUID,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('review', 'authenticity_report', 'quality_concern')),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  description TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved', 'dismissed')),
  admin_response TEXT,
  reward_points INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.consumer_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Consumers can insert their own feedback"
ON public.consumer_feedback
FOR INSERT
WITH CHECK (auth.uid() = consumer_id);

CREATE POLICY "Consumers can view their own feedback"
ON public.consumer_feedback
FOR SELECT
USING (auth.uid() = consumer_id);

CREATE POLICY "Admins and regulators can view all feedback"
ON public.consumer_feedback
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid() AND (role = 'admin' OR role = 'regulator')
  )
);

CREATE POLICY "Admins can update feedback"
ON public.consumer_feedback
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_consumer_feedback_consumer_id ON public.consumer_feedback(consumer_id);
CREATE INDEX IF NOT EXISTS idx_consumer_feedback_qr_code_id ON public.consumer_feedback(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_consumer_feedback_batch_id ON public.consumer_feedback(batch_id);
CREATE INDEX IF NOT EXISTS idx_consumer_feedback_status ON public.consumer_feedback(status);

-- Create QR scan history table
CREATE TABLE IF NOT EXISTS public.qr_scan_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id UUID,
  qr_code_id TEXT NOT NULL,
  batch_id UUID,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  location_data JSONB,
  user_agent TEXT,
  ip_address INET
);

-- Enable RLS
ALTER TABLE public.qr_scan_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can insert scan history"
ON public.qr_scan_history
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Consumers can view their own scan history"
ON public.qr_scan_history
FOR SELECT
USING (auth.uid() = consumer_id OR consumer_id IS NULL);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_qr_scan_history_consumer_id ON public.qr_scan_history(consumer_id);
CREATE INDEX IF NOT EXISTS idx_qr_scan_history_qr_code_id ON public.qr_scan_history(qr_code_id);