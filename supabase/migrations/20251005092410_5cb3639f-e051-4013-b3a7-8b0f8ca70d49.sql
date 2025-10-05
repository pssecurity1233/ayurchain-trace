-- ============================================
-- PRIORITY 1: FIX CRITICAL ROLE MIGRATION
-- Part 1: Add missing enum values
-- ============================================

-- Add missing role values to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'collector';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'lab';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'processor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manufacturer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'consumer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'regulator';