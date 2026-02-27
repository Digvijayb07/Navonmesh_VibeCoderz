-- =====================================================================
-- Migration: Add Tools/Equipment Support
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- =====================================================================

-- 1. Add listing_type column to produce_listings
ALTER TABLE produce_listings
  ADD COLUMN IF NOT EXISTS listing_type TEXT NOT NULL DEFAULT 'crop';

-- 2. Add condition column (for tools: New, Good, Fair, Needs Repair)
ALTER TABLE produce_listings
  ADD COLUMN IF NOT EXISTS condition TEXT DEFAULT NULL;

-- 3. Add rental price column (NULL = not for rent)
ALTER TABLE produce_listings
  ADD COLUMN IF NOT EXISTS rental_price_per_day NUMERIC DEFAULT NULL;

-- 4. Add offer_type column to exchange_requests
ALTER TABLE exchange_requests
  ADD COLUMN IF NOT EXISTS offer_type TEXT NOT NULL DEFAULT 'crop';
