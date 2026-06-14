-- Pixels table has RLS enabled but no policies, which the linter flags.
-- Intent: block all direct client access; reads/writes go through server functions
-- using the service role. Add explicit deny-style policies to make intent clear
-- and satisfy the linter.

CREATE POLICY "No direct select on pixels"
ON public.pixels FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "No direct insert on pixels"
ON public.pixels FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "No direct update on pixels"
ON public.pixels FOR UPDATE
TO anon, authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "No direct delete on pixels"
ON public.pixels FOR DELETE
TO anon, authenticated
USING (false);