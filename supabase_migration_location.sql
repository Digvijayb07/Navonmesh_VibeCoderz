-- =====================================================================
-- Migration: Add location columns to produce_listings
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- =====================================================================

-- Add latitude column
ALTER TABLE produce_listings
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION DEFAULT NULL;

-- Add longitude column
ALTER TABLE produce_listings
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION DEFAULT NULL;

-- Add address column (full text address)
ALTER TABLE produce_listings
  ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL;

-- Optional: Create index for faster geo queries in the future
-- CREATE INDEX IF NOT EXISTS idx_produce_listings_coords
--   ON produce_listings (latitude, longitude)
--   WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
