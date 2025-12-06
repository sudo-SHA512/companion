-- Update RLS policy to allow all authenticated users to delete any audit
DROP POLICY IF EXISTS "Users can delete their own audits" ON public.audits;

CREATE POLICY "Authenticated users can delete any audit"
ON public.audits
FOR DELETE
TO authenticated
USING (true);