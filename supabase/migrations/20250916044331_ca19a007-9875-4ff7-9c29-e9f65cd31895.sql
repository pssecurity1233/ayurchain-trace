-- Simple final database enhancements completion

-- Update search vectors for existing records
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

-- Create comprehensive analytics function for system overview
CREATE OR REPLACE FUNCTION get_system_overview() RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_collections', (SELECT COUNT(*) FROM collection_events),
        'total_batches', (SELECT COUNT(*) FROM batches),
        'active_qr_codes', (SELECT COUNT(*) FROM qr_codes WHERE is_active = true),
        'total_users', (SELECT COUNT(*) FROM profiles),
        'total_facilities', (SELECT COUNT(*) FROM facilities),
        'recent_activity', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'action', action,
                    'table_name', table_name,
                    'timestamp', timestamp
                )
            )
            FROM audit_logs 
            ORDER BY timestamp DESC 
            LIMIT 10
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;