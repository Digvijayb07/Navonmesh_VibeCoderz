-- =====================================================================
-- Migration: OTP Verification System
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- =====================================================================

-- 1. Add phone_verified column to profiles (if not exists)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;

-- 2. Create otp_verifications table
CREATE TABLE IF NOT EXISTS otp_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS on otp_verifications
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

-- 4. RLS policies: users can only see/modify their own OTPs
CREATE POLICY "Users can insert their own OTPs"
  ON otp_verifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own OTPs"
  ON otp_verifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own OTPs"
  ON otp_verifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 5. Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_otp_verifications_user_id
  ON otp_verifications (user_id);

-- 6. Auto-cleanup expired OTPs (optional — run periodically or use pg_cron)
-- DELETE FROM otp_verifications WHERE expires_at < NOW();
