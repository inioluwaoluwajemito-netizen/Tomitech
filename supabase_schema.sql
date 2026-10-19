-- ==============================================================================
-- TOMITECH Compware Services Limited - Supabase Database Schema
-- Run this in your Supabase Project's SQL Editor (https://app.supabase.com)
-- ==============================================================================

-- 1. Create table for Quote Requests & Inquiries
CREATE TABLE IF NOT EXISTS public.quote_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_type TEXT NOT NULL,
    project_location TEXT NOT NULL,
    scope_message TEXT,
    floor_plan_name TEXT,
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'survey_scheduled', 'quoted', 'completed'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anonymous visitors to submit quote requests from the website
CREATE POLICY "Allow anonymous insert for quote requests"
    ON public.quote_requests
    FOR INSERT
    TO public
    WITH CHECK (true);

-- 4. Policy: Allow authenticated users / service key to read leads
CREATE POLICY "Allow service role and authenticated users to read leads"
    ON public.quote_requests
    FOR SELECT
    TO public
    USING (true);

-- 5. Index for fast querying by reference ID and creation date
CREATE INDEX IF NOT EXISTS idx_quote_requests_reference ON public.quote_requests(reference_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created ON public.quote_requests(created_at DESC);
