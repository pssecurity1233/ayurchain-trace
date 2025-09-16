-- Comprehensive Database Schema Enhancements for Traceability System
-- Fixed partitioning and optimized for performance

-- Enable extensions for geographic data and search
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS btree_gin; -- For composite indexes

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

-- Create versioned history tables for critical data
CREATE TABLE IF NOT EXISTS batches_history (
    id UUID DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    data JSONB NOT NULL,
    operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (id, changed_at)
);

CREATE TABLE IF NOT EXISTS quality_tests_history (
    id UUID DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    data JSONB NOT NULL,
    operation TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (id, changed_at)
);

-- Add geographic columns to existing tables if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='collection_events' AND column_name='geom') THEN
        ALTER TABLE collection_events ADD COLUMN geom GEOMETRY(POINT, 4326);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='facilities' AND column_name='geom') THEN
        ALTER TABLE facilities ADD COLUMN geom GEOMETRY(POINT, 4326);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='processing_facilities' AND column_name='geom') THEN
        ALTER TABLE processing_facilities ADD COLUMN geom GEOMETRY(POINT, 4326);
    END IF;
END $$;

-- Update geometry columns from lat/lng where missing
UPDATE collection_events 
SET geom = ST_SetSRID(ST_MakePoint(longitude::double precision, latitude::double precision), 4326)
WHERE longitude IS NOT NULL AND latitude IS NOT NULL AND geom IS NULL;

UPDATE facilities 
SET geom = ST_SetSRID(ST_MakePoint(longitude::double precision, latitude::double precision), 4326)
WHERE longitude IS NOT NULL AND latitude IS NOT NULL AND geom IS NULL;

-- Add full-text search columns
DO $$ 
BEGIN 
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

-- Create session management table for caching layer simulation
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    session_data JSONB DEFAULT '{}',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_activity TIMESTAMPTZ DEFAULT now()
);

-- Create cache simulation table for frequently accessed data
CREATE TABLE IF NOT EXISTS cache_entries (
    cache_key TEXT PRIMARY KEY,
    cache_value JSONB NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create notification pub/sub simulation table
CREATE TABLE IF NOT EXISTS notification_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_name TEXT UNIQUE NOT NULL,
    subscribers JSONB DEFAULT '[]',
    last_message JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Performance Indexes for all critical queries

-- Collection events indexes
CREATE INDEX IF NOT EXISTS idx_collection_events_collector_date 
ON collection_events (collector_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_collection_events_species_date 
ON collection_events (species_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_collection_events_geom 
ON collection_events USING GIST (geom) WHERE geom IS NOT NULL;

-- Batch tracking indexes
CREATE INDEX IF NOT EXISTS idx_batches_producer_status 
ON batches (producer_id, status);

CREATE INDEX IF NOT EXISTS idx_batches_manufacturer_date 
ON batches (manufacturer_id, created_at DESC) WHERE manufacturer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_batches_species_created 
ON batches (species_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_batch_tracking_owner 
ON batch_tracking (current_owner_id, status) WHERE current_owner_id IS NOT NULL;

-- Quality tests indexes
CREATE INDEX IF NOT EXISTS idx_quality_tests_batch_lab 
ON quality_tests (batch_id, lab_id) WHERE batch_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_quality_tests_rejected 
ON quality_tests (rejected, created_at DESC);

-- QR codes indexes
CREATE INDEX IF NOT EXISTS idx_qr_codes_batch_active 
ON qr_codes (batch_id, is_active) WHERE batch_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_qr_codes_created_by 
ON qr_codes (created_by, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_qr_scan_events_code_time 
ON qr_scan_events (qr_code_id, scanned_at DESC);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_manufacturer_active 
ON products (manufacturer_id, is_active);

-- Processing steps indexes
CREATE INDEX IF NOT EXISTS idx_processing_steps_processor 
ON processing_steps (processor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_processing_steps_batch 
ON processing_steps (batch_id, created_at) WHERE batch_id IS NOT NULL;

-- Audit logs indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_table 
ON audit_logs (user_id, table_name, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_record 
ON audit_logs (record_id, timestamp DESC) WHERE record_id IS NOT NULL;

-- Consumer scans indexes
CREATE INDEX IF NOT EXISTS idx_consumer_scans_qr_time 
ON consumer_scans (qr_code_id, scan_timestamp DESC);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_status 
ON notifications (user_id, status, created_at DESC);

-- Geographic indexes
CREATE INDEX IF NOT EXISTS idx_facilities_geom 
ON facilities USING GIST (geom) WHERE geom IS NOT NULL;

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_collection_events_composite 
ON collection_events (species_id, collector_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_batches_composite 
ON batches (producer_id, status, species_id, created_at DESC);

-- Session management indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user 
ON user_sessions (user_id, expires_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_sessions_token 
ON user_sessions (session_token) WHERE expires_at > now();

-- Cache indexes
CREATE INDEX IF NOT EXISTS idx_cache_entries_expires 
ON cache_entries (expires_at);

-- Add foreign key constraints for data integrity where missing
DO $$
BEGIN
    -- Check and add foreign key for batch_qr_codes if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_batch_qr_codes_batch' 
        AND table_name = 'batch_qr_codes'
    ) THEN
        ALTER TABLE batch_qr_codes 
        ADD CONSTRAINT fk_batch_qr_codes_batch 
        FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE;
    END IF;

    -- Check and add foreign key for batch_recalls if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_batch_recalls_batch' 
        AND table_name = 'batch_recalls'
    ) THEN
        ALTER TABLE batch_recalls 
        ADD CONSTRAINT fk_batch_recalls_batch 
        FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE;
    END IF;
EXCEPTION
    WHEN others THEN
        -- If foreign key constraints fail due to existing data issues, log and continue
        RAISE NOTICE 'Foreign key constraint creation failed: %', SQLERRM;
END $$;