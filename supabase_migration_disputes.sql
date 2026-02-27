-- Drop the disputes table if it exists (to start fresh with new schema)
-- WARNING: This will delete all existing dispute data
DROP TABLE IF EXISTS public.disputes;

-- Create the disputes table
CREATE TABLE public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filed_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  against_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  issue TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'raised' CHECK (status IN ('raised', 'in-mediation', 'resolved')),
  resolution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_disputes_filed_by ON public.disputes(filed_by);
CREATE INDEX idx_disputes_against_user ON public.disputes(against_user_id);
CREATE INDEX idx_disputes_status ON public.disputes(status);
CREATE INDEX idx_disputes_created_at ON public.disputes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view disputes they filed or that are filed against them
CREATE POLICY "Users can view their own disputes" ON public.disputes
  FOR SELECT
  USING (
    auth.uid() = filed_by 
    OR auth.uid() = against_user_id
  );

-- Policy: Any authenticated user can file a dispute
CREATE POLICY "Authenticated users can file disputes" ON public.disputes
  FOR INSERT
  WITH CHECK (
    auth.uid() = filed_by
  );

-- Policy: Users can update disputes they filed (to add resolution or change status)
CREATE POLICY "Users can update disputes they filed" ON public.disputes
  FOR UPDATE
  USING (auth.uid() = filed_by);

-- Admins can view, update, and delete all disputes (optional - add admin role later)
-- CREATE POLICY "Admins can manage all disputes" ON public.disputes
--   FOR ALL
--   USING (auth.jwt()->>'role' = 'admin');

-- Add a trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_disputes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER disputes_updated_at
  BEFORE UPDATE ON public.disputes
  FOR EACH ROW
  EXECUTE FUNCTION update_disputes_updated_at();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.disputes TO authenticated;
GRANT SELECT ON public.disputes TO anon;
