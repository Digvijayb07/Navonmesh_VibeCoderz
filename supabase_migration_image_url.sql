-- Add image_url column to produce_listings table
-- Run this in Supabase SQL Editor

ALTER TABLE produce_listings
ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL;
