-- Enable RLS on public.early_access_signups
ALTER TABLE public.early_access_signups ENABLE ROW LEVEL SECURITY;

-- Drop public SELECT policy if it exists (e.g., allow_public_count)
DROP POLICY IF EXISTS "allow_public_count" ON public.early_access_signups;
DROP POLICY IF EXISTS "allow_public_select" ON public.early_access_signups;
DROP POLICY IF EXISTS "Allow public read" ON public.early_access_signups;

-- Drop direct anon insert policy if it exists
DROP POLICY IF EXISTS "Allow anon insert" ON public.early_access_signups;
DROP POLICY IF EXISTS "allow_anon_insert" ON public.early_access_signups;
DROP POLICY IF EXISTS "Anyone can insert" ON public.early_access_signups;

-- Add unique index on email (if not already exists)
CREATE UNIQUE INDEX IF NOT EXISTS early_access_signups_email_idx ON public.early_access_signups(email);

-- Add RLS policy for Edge Function service role (insert only)
-- Note: The Edge Function uses service_role key which bypasses RLS, so this policy is for additional safety
-- If you want to explicitly allow the service role, you can create a policy like:
-- CREATE POLICY "Allow service role to insert" ON public.early_access_signups
--   FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Deny all public access by default
CREATE POLICY "Deny public select" ON public.early_access_signups
  FOR SELECT USING (false);

CREATE POLICY "Deny public insert" ON public.early_access_signups
  FOR INSERT WITH CHECK (false);

CREATE POLICY "Deny public update" ON public.early_access_signups
  FOR UPDATE USING (false);

CREATE POLICY "Deny public delete" ON public.early_access_signups
  FOR DELETE USING (false);
