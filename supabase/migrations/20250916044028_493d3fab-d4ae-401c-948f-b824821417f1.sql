-- Comprehensive Database Schema for Traceability System
-- Core enhancements without problematic index predicates

-- Enable essential extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;

-- System configuration table
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

-- History tables for audit trails
CREATE TABLE IF NOT EXISTS batches_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    data JSONB NOT NULL,
    operation TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quality_tests_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    data JSONB NOT NULL,
    operation TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ DEFAULT now()
);

-- Caching simulation tables
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    session_data JSONB DEFAULT '{}',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_activity TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cache_entries (
    cache_key TEXT PRIMARY KEY,
    cache_value JSONB NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Notification pub/sub simulation
CREATE TABLE IF NOT EXISTS notification_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_name TEXT UNIQUE NOT NULL,
    subscribers JSONB DEFAULT '[]',
    last_message JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add geographic and search columns safely
DO $$ 
BEGIN 
    -- Geographic columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='collection_events' AND column_name='geom') THEN
        ALTER TABLE collection_events ADD COLUMN geom GEOMETRY(POINT, 4326);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='facilities' AND column_name='geom') THEN
        ALTER TABLE facilities ADD COLUMN geom GEOMETRY(POINT, 4326);
    END IF;
    
    -- Search vector columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='search_vector') THEN
        ALTER TABLE products ADD COLUMN search_vector TSVECTOR;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='batches' AND column_name='search_vector') THEN
        ALTER TABLE batches ADD COLUMN search_vector TSVECTOR;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='collection_events' AND column_name='search_vector') THEN
        ALTER TABLE collection_events ADD COLUMN search_vector TSVECTOR;
    END IF;
END $$;

-- Core performance indexes
CREATE INDEX IF NOT EXISTS idx_collection_events_collector_date ON collection_events (collector_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collection_events_species_date ON collection_events (species_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collection_events_geom ON collection_events USING GIST (geom);

CREATE INDEX IF NOT EXISTS idx_batches_producer_status ON batches (producer_id, status);
CREATE INDEX IF NOT EXISTS idx_batches_manufacturer_date ON batches (manufacturer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_batches_species_created ON batches (species_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_quality_tests_batch_lab ON quality_tests (batch_id, lab_id);
CREATE INDEX IF NOT EXISTS idx_quality_tests_rejected ON quality_tests (rejected, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_qr_codes_batch_active ON qr_codes (batch_id, is_active);
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_by ON qr_codes (created_by, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qr_scan_events_code_time ON qr_scan_events (qr_code_id, scanned_at DESC);

CREATE INDEX IF NOT EXISTS idx_products_manufacturer_active ON products (manufacturer_id, is_active);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN (search_vector);

CREATE INDEX IF NOT EXISTS idx_processing_steps_processor ON processing_steps (processor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_processing_steps_batch ON processing_steps (batch_id, created_at);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_table ON audit_logs (user_id, table_name, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record ON audit_logs (record_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_consumer_scans_qr_time ON consumer_scans (qr_code_id, scan_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_status ON notifications (user_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_facilities_geom ON facilities USING GIST (geom);

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_collection_events_composite ON collection_events (species_id, collector_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_batches_composite ON batches (producer_id, status, species_id, created_at DESC);

-- Session and cache indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions (user_id, expires_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions (session_token);
CREATE INDEX IF NOT EXISTS idx_cache_entries_expires ON cache_entries (expires_at);

-- Search functions and triggers
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

-- Create search triggers
DROP TRIGGER IF EXISTS products_search_update_trigger ON products;
CREATE TRIGGER products_search_update_trigger
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_search_vector();

DROP TRIGGER IF EXISTS batches_search_update_trigger ON batches;
CREATE TRIGGER batches_search_update_trigger
    BEFORE INSERT OR UPDATE ON batches
    FOR EACH ROW EXECUTE FUNCTION update_search_vector();

DROP TRIGGER IF EXISTS collection_events_search_update_trigger ON collection_events;
CREATE TRIGGER collection_events_search_update_trigger
    BEFORE INSERT OR UPDATE ON collection_events
    FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- Enhanced audit function
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

-- Comprehensive search function
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

-- Materialized views for analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS collection_analytics AS
SELECT 
    species_id,
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as collection_count,
    SUM(quantity_kg) as total_quantity,
    AVG(quantity_kg) as avg_quantity,
    COUNT(DISTINCT collector_id) as unique_collectors
FROM collection_events
GROUP BY species_id, DATE_TRUNC('month', created_at);

CREATE INDEX IF NOT EXISTS idx_collection_analytics_species_month ON collection_analytics (species_id, month DESC);

CREATE MATERIALIZED VIEW IF NOT EXISTS batch_status_summary AS
SELECT 
    status,
    species_id,
    COUNT(*) as batch_count,
    SUM(total_quantity_kg) as total_quantity,
    DATE_TRUNC('day', created_at) as day
FROM batches
GROUP BY status, species_id, DATE_TRUNC('day', created_at);

-- Function to refresh analytics
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW collection_analytics;
    REFRESH MATERIALIZED VIEW batch_status_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on new tables
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_tests_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cache_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_channels ENABLE ROW LEVEL SECURITY;

-- RLS policies for new tables
CREATE POLICY "Admins can manage system config" ON system_config FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public can read public config" ON system_config FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their sessions" ON user_sessions FOR ALL USING (user_id = auth.uid());

CREATE POLICY "System can manage cache" ON cache_entries FOR ALL USING (true);

CREATE POLICY "Users can access notification channels" ON notification_channels FOR SELECT USING (true);

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