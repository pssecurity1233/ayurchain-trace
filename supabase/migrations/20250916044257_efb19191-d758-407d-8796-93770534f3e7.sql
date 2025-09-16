-- Final database schema completion with policy fixes

-- Clean up existing policies and recreate
DROP POLICY IF EXISTS "Admins can manage system config" ON system_config;
DROP POLICY IF EXISTS "Public can read public config" ON system_config;
DROP POLICY IF EXISTS "Users can manage their sessions" ON user_sessions;
DROP POLICY IF EXISTS "System can manage cache" ON cache_entries;
DROP POLICY IF EXISTS "Users can access notification channels" ON notification_channels;

-- Create comprehensive RLS policies
CREATE POLICY "Admins can manage system config" ON system_config FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public can read public config" ON system_config FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their sessions" ON user_sessions FOR ALL USING (user_id = auth.uid());

CREATE POLICY "System can manage cache" ON cache_entries FOR ALL USING (true);

CREATE POLICY "Users can access notification channels" ON notification_channels FOR SELECT USING (true);

CREATE POLICY "System can manage notification channels" ON notification_channels FOR INSERT USING (true);

CREATE POLICY "System can update notification channels" ON notification_channels FOR UPDATE USING (true);

-- Update existing search vectors for all records
UPDATE products SET search_vector = to_tsvector('english', 
    COALESCE(name, '') || ' ' || 
    COALESCE(product_code, '') || ' ' ||
    COALESCE(formulation::text, ''))
WHERE search_vector IS NULL;

UPDATE batches SET search_vector = to_tsvector('english',
    COALESCE(product_name, '') || ' ' ||
    COALESCE(species_id, '') || ' ' ||
    COALESCE(qr_code, ''))
WHERE search_vector IS NULL;

UPDATE collection_events SET search_vector = to_tsvector('english',
    COALESCE(species_id, '') || ' ' ||
    COALESCE(notes, ''))
WHERE search_vector IS NULL;

-- Update geometry columns from lat/lng
UPDATE collection_events 
SET geom = ST_SetSRID(ST_MakePoint(longitude::double precision, latitude::double precision), 4326)
WHERE longitude IS NOT NULL AND latitude IS NOT NULL AND geom IS NULL;

UPDATE facilities 
SET geom = ST_SetSRID(ST_MakePoint(longitude::double precision, latitude::double precision), 4326)
WHERE longitude IS NOT NULL AND latitude IS NOT NULL AND geom IS NULL;

-- Create rate limiting function for API calls
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_user_id UUID,
    p_endpoint TEXT,
    p_max_requests INTEGER DEFAULT 100,
    p_window_minutes INTEGER DEFAULT 60
) RETURNS BOOLEAN AS $$
DECLARE
    current_count INTEGER;
    window_start TIMESTAMPTZ;
BEGIN
    window_start := date_trunc('hour', now()) + (extract(minute from now())::integer / p_window_minutes) * (p_window_minutes || ' minutes')::interval;
    
    -- Count requests in current window
    SELECT COUNT(*) INTO current_count
    FROM api_rate_limits
    WHERE user_id = p_user_id 
    AND endpoint = p_endpoint 
    AND window_start >= window_start;
    
    -- Update or insert rate limit record
    INSERT INTO api_rate_limits (user_id, endpoint, window_start, requests_count)
    VALUES (p_user_id, p_endpoint, window_start, 1)
    ON CONFLICT (user_id, endpoint, window_start) 
    DO UPDATE SET requests_count = api_rate_limits.requests_count + 1;
    
    RETURN current_count < p_max_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create blockchain integration tracking function
CREATE OR REPLACE FUNCTION track_blockchain_transaction(
    p_table_name TEXT,
    p_record_id UUID,
    p_operation TEXT,
    p_tx_hash TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    audit_id UUID;
BEGIN
    INSERT INTO audit_logs (
        action, table_name, record_id, user_id, 
        blockchain_tx_hash, status, fabric_response
    ) VALUES (
        p_operation, p_table_name, p_record_id, auth.uid(),
        p_tx_hash, 'blockchain_pending', 
        jsonb_build_object('initiated_at', now())
    ) RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create comprehensive analytics function
CREATE OR REPLACE FUNCTION get_system_analytics(
    p_date_from DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_date_to DATE DEFAULT CURRENT_DATE
) RETURNS JSONB AS $$
DECLARE
    result JSONB;
    collection_stats JSONB;
    batch_stats JSONB;
    qr_stats JSONB;
    user_stats JSONB;
BEGIN
    -- Collection statistics
    SELECT jsonb_build_object(
        'total_collections', COUNT(*),
        'total_quantity_kg', SUM(quantity_kg),
        'unique_collectors', COUNT(DISTINCT collector_id),
        'species_collected', COUNT(DISTINCT species_id)
    ) INTO collection_stats
    FROM collection_events
    WHERE created_at::date BETWEEN p_date_from AND p_date_to;
    
    -- Batch statistics
    SELECT jsonb_build_object(
        'total_batches', COUNT(*),
        'finalized_batches', COUNT(*) FILTER (WHERE status = 'finalized'),
        'recalled_batches', COUNT(*) FILTER (WHERE status = 'recalled'),
        'avg_batch_size_kg', AVG(total_quantity_kg)
    ) INTO batch_stats
    FROM batches
    WHERE created_at::date BETWEEN p_date_from AND p_date_to;
    
    -- QR code statistics
    SELECT jsonb_build_object(
        'total_qr_codes', COUNT(*),
        'total_scans', SUM(access_count),
        'active_codes', COUNT(*) FILTER (WHERE is_active = true)
    ) INTO qr_stats
    FROM qr_codes
    WHERE created_at::date BETWEEN p_date_from AND p_date_to;
    
    -- User statistics
    SELECT jsonb_build_object(
        'total_users', COUNT(*),
        'collectors', COUNT(*) FILTER (WHERE role = 'collector'),
        'processors', COUNT(*) FILTER (WHERE role = 'processor'),
        'manufacturers', COUNT(*) FILTER (WHERE role = 'manufacturer'),
        'labs', COUNT(*) FILTER (WHERE role = 'lab')
    ) INTO user_stats
    FROM profiles
    WHERE created_at::date BETWEEN p_date_from AND p_date_to;
    
    -- Combine all statistics
    result := jsonb_build_object(
        'date_range', jsonb_build_object(
            'from', p_date_from,
            'to', p_date_to
        ),
        'collections', collection_stats,
        'batches', batch_stats,
        'qr_codes', qr_stats,
        'users', user_stats,
        'generated_at', now()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;