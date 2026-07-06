-- =========================================================================
-- OUTDOORCORE AI - SUPABASE STORAGE BUCKETS SETUP
-- =========================================================================
-- This script creates the required storage buckets and defines Row Level
-- Security (RLS) policies for each bucket. Run this script in the Supabase
-- SQL Editor.
-- =========================================================================

-- Enable storage extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('logos', 'logos', true, 2097152, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']), -- 2MB Limit
  ('media', 'media', false, 209715200, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/pdf', 'video/mp4']), -- 200MB Limit
  ('contracts', 'contracts', false, 20971520, ARRAY['application/pdf']), -- 20MB Limit
  ('invoices', 'invoices', false, 20971520, ARRAY['application/pdf']), -- 20MB Limit
  ('maintenance', 'maintenance', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp']), -- 10MB Limit
  ('avatars', 'avatars', true, 2097152, ARRAY['image/png', 'image/jpeg', 'image/webp']) -- 2MB Limit
ON CONFLICT (id) DO UPDATE 
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =========================================================================
-- STORAGE SECURITY POLICIES (RLS)
-- =========================================================================

-- Note: In Supabase, files inside buckets are queried under storage.objects table.

-- Clear existing policies if any
DROP POLICY IF EXISTS "Logos are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Managers can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Managers can delete logos" ON storage.objects;

DROP POLICY IF EXISTS "Media is viewable by authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Media can be uploaded by authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Media can be deleted by authenticated users" ON storage.objects;

DROP POLICY IF EXISTS "Contracts are viewable by authorized users" ON storage.objects;
DROP POLICY IF EXISTS "Contracts can be uploaded by authorized users" ON storage.objects;

DROP POLICY IF EXISTS "Invoices are viewable by authorized users" ON storage.objects;
DROP POLICY IF EXISTS "Invoices can be uploaded by authorized users" ON storage.objects;

DROP POLICY IF EXISTS "Maintenance photos are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Technicians can upload maintenance photos" ON storage.objects;

DROP POLICY IF EXISTS "Avatars are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;

-- -------------------------------------------------------------------------
-- 1. LOGOS POLICIES
-- -------------------------------------------------------------------------
-- Public Read
CREATE POLICY "Logos are publicly viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

-- Authenticated Write/Insert
CREATE POLICY "Managers can upload logos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'logos');

-- Authenticated Delete
CREATE POLICY "Managers can delete logos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'logos');


-- -------------------------------------------------------------------------
-- 2. MEDIA POLICIES
-- -------------------------------------------------------------------------
-- Authenticated Read
CREATE POLICY "Media is viewable by authenticated users" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'media');

-- Authenticated Write/Insert
CREATE POLICY "Media can be uploaded by authenticated users" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');

-- Authenticated Delete
CREATE POLICY "Media can be deleted by authenticated users" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media');


-- -------------------------------------------------------------------------
-- 3. CONTRACTS POLICIES
-- -------------------------------------------------------------------------
-- High Security: Authenticated Read
CREATE POLICY "Contracts are viewable by authorized users" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'contracts');

-- Authenticated Write/Insert
CREATE POLICY "Contracts can be uploaded by authorized users" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'contracts');


-- -------------------------------------------------------------------------
-- 4. INVOICES POLICIES
-- -------------------------------------------------------------------------
-- Authenticated Read
CREATE POLICY "Invoices are viewable by authorized users" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'invoices');

-- Authenticated Write/Insert
CREATE POLICY "Invoices can be uploaded by authorized users" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'invoices');


-- -------------------------------------------------------------------------
-- 5. MAINTENANCE POLICIES
-- -------------------------------------------------------------------------
-- Public Read (for checking arıza states externally)
CREATE POLICY "Maintenance photos are publicly viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'maintenance');

-- Authenticated Write/Insert (restricted to technicians/auth users)
CREATE POLICY "Technicians can upload maintenance photos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'maintenance');


-- -------------------------------------------------------------------------
-- 6. AVATARS POLICIES
-- -------------------------------------------------------------------------
-- Public Read
CREATE POLICY "Avatars are publicly viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Authenticated Write/Insert (Owner-only check based on metadata)
CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );
