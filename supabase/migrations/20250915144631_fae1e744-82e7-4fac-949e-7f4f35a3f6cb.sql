-- Comprehensive Database Schema Enhancements for Traceability System

-- Enable PostGIS extension for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS btree_gin; -- For composite indexes

-- Create audit function for versioning
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (action, table_name, record_id, user_id, status, fabric_response)
        VALUES ('INSERT', TG_TABLE_NAME, NEW.id, auth.uid(), 'completed', to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (action, table_name, record_id, user_id, status, fabric_response)
        VALUES ('UPDATE', TG_TABLE_NAME, NEW.id, auth.uid(), 'completed', 
                jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (action, table_name, record_id, user_id, status, fabric_response)
        VALUES ('DELETE', TG_TABLE_NAME, OLD.id, auth.uid(), 'completed', to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create system configuration table
CREATE TABLE IF NOT EXISTS system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key TEXT UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create versioned tables for critical data
CREATE TABLE batches_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    data JSONB NOT NULL,
    operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE quality_tests_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    data JSONB NOT NULL,
    operation TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ DEFAULT now()
);

-- Add geographic columns to existing tables
ALTER TABLE collection_events 
ADD COLUMN IF NOT EXISTS geom GEOMETRY(POINT, 4326);

ALTER TABLE facilities 
ADD COLUMN IF NOT EXISTS geom GEOMETRY(POINT, 4326);

ALTER TABLE processing_facilities 
ADD COLUMN IF NOT EXISTS geom GEOMETRY(POINT, 4326);

-- Update geometry columns from lat/lng
UPDATE collection_events 
SET geom = ST_SetSRID(ST_MakePoint(longitude::double precision, latitude::double precision), 4326)
WHERE longitude IS NOT NULL AND latitude IS NOT NULL AND geom IS NULL;

UPDATE facilities 
SET geom = ST_SetSRID(ST_MakePoint(longitude::double precision, latitude::double precision), 4326)
WHERE longitude IS NOT NULL AND latitude IS NOT NULL AND geom IS NULL;

-- Create full-text search columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;
ALTER TABLE batches ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;
ALTER TABLE collection_events ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

-- Create search index update function
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'products' THEN
        NEW.search_vector := to_tsvector('english', 
            COALESCE(NEW.name, '') || ' ' || 
            COALESCE(NEW.product_code, '') || ' ' ||
            COALESCE(NEW.formulation::text, ''));
    ELSIF TG_TABLE_NAME = 'batches' THEN
        NEW.search_vector := to_tsvector('english',
            COALESCE(NEW.product_name, '') || ' ' ||
            COALESCE(NEW.species_id, '') || ' ' ||
            COALESCE(NEW.qr_code, ''));
    ELSIF TG_TABLE_NAME = 'collection_events' THEN
        NEW.search_vector := to_tsvector('english',
            COALESCE(NEW.species_id, '') || ' ' ||
            COALESCE(NEW.notes, ''));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Performance Indexes

-- Collection events indexes
CREATE INDEX IF NOT EXISTS idx_collection_events_collector_date 
ON collection_events (collector_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_collection_events_species_date 
ON collection_events (species_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_collection_events_geom 
ON collection_events USING GIST (geom);

CREATE INDEX IF NOT EXISTS idx_collection_events_search 
ON collection_events USING GIN (search_vector);

-- Batch tracking indexes
CREATE INDEX IF NOT EXISTS idx_batches_producer_status 
ON batches (producer_id, status);

CREATE INDEX IF NOT EXISTS idx_batches_manufacturer_date 
ON batches (manufacturer_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_batches_search 
ON batches USING GIN (search_vector);

CREATE INDEX IF NOT EXISTS idx_batch_tracking_owner 
ON batch_tracking (current_owner_id, status);

-- Quality tests indexes
CREATE INDEX IF NOT EXISTS idx_quality_tests_batch_lab 
ON quality_tests (batch_id, lab_id);

CREATE INDEX IF NOT EXISTS idx_quality_tests_rejected 
ON quality_tests (rejected, created_at DESC);

-- QR codes indexes
CREATE INDEX IF NOT EXISTS idx_qr_codes_batch_active 
ON qr_codes (batch_id, is_active);

CREATE INDEX IF NOT EXISTS idx_qr_codes_created_by 
ON qr_codes (created_by, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_qr_scan_events_code_time 
ON qr_scan_events (qr_code_id, scanned_at DESC);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_manufacturer_active 
ON products (manufacturer_id, is_active);

CREATE INDEX IF NOT EXISTS idx_products_search 
ON products USING GIN (search_vector);

-- Processing steps indexes
CREATE INDEX IF NOT EXISTS idx_processing_steps_processor 
ON processing_steps (processor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_processing_steps_batch 
ON processing_steps (batch_id, created_at);

-- Audit logs indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_table 
ON audit_logs (user_id, table_name, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_record 
ON audit_logs (record_id, timestamp DESC);

-- Consumer scans indexes
CREATE INDEX IF NOT EXISTS idx_consumer_scans_qr_time 
ON consumer_scans (qr_code_id, scan_timestamp DESC);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_status 
ON notifications (user_id, status, created_at DESC);

-- Geographic indexes
CREATE INDEX IF NOT EXISTS idx_facilities_geom 
ON facilities USING GIST (geom);

CREATE INDEX IF NOT EXISTS idx_geo_fences_polygon 
ON geo_fences USING GIST (((polygon::text)::geometry));

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_collection_events_composite 
ON collection_events (species_id, collector_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_batches_composite 
ON batches (producer_id, status, species_id, created_at DESC);

-- Partitioning for large tables (audit_logs by month)
-- Create partitioned audit_logs table
CREATE TABLE audit_logs_partitioned (
    LIKE audit_logs INCLUDING ALL
) PARTITION BY RANGE (timestamp);

-- Create monthly partitions for current and future months
CREATE TABLE audit_logs_y2025m01 PARTITION OF audit_logs_partitioned
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
    
CREATE TABLE audit_logs_y2025m02 PARTITION OF audit_logs_partitioned
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Add foreign key constraints for data integrity
ALTER TABLE batch_qr_codes 
ADD CONSTRAINT fk_batch_qr_codes_batch 
FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE;

ALTER TABLE batch_recalls 
ADD CONSTRAINT fk_batch_recalls_batch 
FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE;

ALTER TABLE quality_tests 
ADD CONSTRAINT fk_quality_tests_batch 
FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE SET NULL;

ALTER TABLE processing_steps 
ADD CONSTRAINT fk_processing_steps_batch 
FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE SET NULL;

ALTER TABLE qr_codes 
ADD CONSTRAINT fk_qr_codes_batch 
FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE SET NULL;

-- Create triggers for audit trails
CREATE TRIGGER batches_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON batches
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER quality_tests_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON quality_tests
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER products_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Create triggers for search vector updates
CREATE TRIGGER products_search_update_trigger
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_search_vector();

CREATE TRIGGER batches_search_update_trigger
    BEFORE INSERT OR UPDATE ON batches
    FOR EACH ROW EXECUTE FUNCTION update_search_vector();

CREATE TRIGGER collection_events_search_update_trigger
    BEFORE INSERT OR UPDATE ON collection_events
    FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- Create materialized views for analytics
CREATE MATERIALIZED VIEW collection_analytics AS
SELECT 
    species_id,
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as collection_count,
    SUM(quantity_kg) as total_quantity,
    AVG(quantity_kg) as avg_quantity,
    COUNT(DISTINCT collector_id) as unique_collectors
FROM collection_events
GROUP BY species_id, DATE_TRUNC('month', created_at);

CREATE INDEX idx_collection_analytics_species_month 
ON collection_analytics (species_id, month DESC);

CREATE MATERIALIZED VIEW batch_status_summary AS
SELECT 
    status,
    species_id,
    COUNT(*) as batch_count,
    SUM(total_quantity_kg) as total_quantity,
    DATE_TRUNC('day', created_at) as day
FROM batches
GROUP BY status, species_id, DATE_TRUNC('day', created_at);

-- Update existing search vectors
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

-- Enable RLS on new tables
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_tests_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Admins can manage system config" ON system_config
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Public can read public config" ON system_config
FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view audit history" ON batches_history
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM batches b 
        WHERE b.batch_id = batches_history.batch_id 
        AND (b.producer_id = auth.uid() OR b.manufacturer_id = auth.uid())
    ) OR
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW collection_analytics;
    REFRESH MATERIALIZED VIEW batch_status_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create search function
CREATE OR REPLACE FUNCTION search_content(search_query TEXT)
RETURNS TABLE (
    table_name TEXT,
    id UUID,
    title TEXT,
    content TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 'products'::TEXT, p.id, p.name, p.formulation::TEXT, ts_rank(p.search_vector, plainto_tsquery(search_query))
    FROM products p
    WHERE p.search_vector @@ plainto_tsquery(search_query) AND p.is_active = true
    
    UNION ALL
    
    SELECT 'batches'::TEXT, b.batch_id, b.product_name, b.species_id, ts_rank(b.search_vector, plainto_tsquery(search_query))
    FROM batches b
    WHERE b.search_vector @@ plainto_tsquery(search_query)
    
    UNION ALL
    
    SELECT 'collection_events'::TEXT, c.id, c.species_id, c.notes, ts_rank(c.search_vector, plainto_tsquery(search_query))
    FROM collection_events c
    WHERE c.search_vector @@ plainto_tsquery(search_query)
    
    ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;